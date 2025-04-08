from sqlalchemy import text
from sqlalchemy.future import select
from datetime import datetime, timedelta
from app.models import Solver
from app.pd_loaded import *
from app.utils import *

async def get_all_solvers(db):
    result = await db.execute(select(Solver))
    return result.scalars().all()


async def get_volumn_trend(db, interval: int, range_days: int, c = None):
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=range_days)

    # Truncate timestamp to custom intervals (like 2hr, 4hr)
    query = f"""
        SELECT 
            to_timestamp(
                FLOOR(EXTRACT(EPOCH FROM "timestamp") / ({interval} * 3600)) * ({interval} * 3600)
            ) AT TIME ZONE 'UTC' AS timestamp,
            SUM("totalVolume") AS volume
        FROM real_time_stats
        WHERE "timestamp" >= :start_time AND "timestamp" <= :end_time
        {f'AND "solverAddress" = :solver' if solver else ''}
        GROUP BY 1
        ORDER BY 1
    """

    params = {"start_time": start_time, "end_time": end_time}
    if solver:
        params["solver"] = solver

    result = await db.execute(text(query), params)
    rows = result.all()

    return [
        {"timestamp": row[0].strftime("%Y-%m-%d %H:%M"), "volume": float(row[1])}
        for row in rows
    ]


async def get_overview_stats(db, range_days: int, solver: str = None):
    query = f"""
        SELECT 
            SUM("ordersCount") AS total_orders,
            SUM("txnCount") AS total_txns,
            COUNT(DISTINCT "solverAddress") AS total_solvers,
            SUM("totalVolume") AS total_volume
            {', SUM(rankings) / NULLIF(SUM("ordersCount"), 0) AS avg_ranking' if solver else ''}
        FROM real_time_stats
        WHERE "timestamp" >= NOW() - INTERVAL '{range_days} days'
        {f'AND "solverAddress" = :solver' if solver else ''}
    """

    params = {"solver": solver} if solver else {}

    result = await db.execute(text(query), params)
    row = result.fetchone()

    return {
        "total_orders": int(row[0] or 0),
        "total_auctions": int(row[1] or 0),
        "total_solvers": int(row[2] or 0),
        "total_volume": float(row[3] or 0),
        "avg_ranking": float(row[4]) if solver and row[4] is not None else None,
    }


def get_token_data(token_address: str, others: bool = False):
    if others:
        return {
            "address": "others",
            "name": "Others",
            "symbol": "UKN",
            "image_url": "https://cdn-icons-png.flaticon.com/512/0/14.png",
        }
    else:
        return {
            "address": token_address.lower(),
            "name": token_map.get(token_address.lower(), {}).get("name", "Unknown"),
            "symbol": token_map.get(token_address.lower(), {}).get("symbol", "Unknown"),
            "image_url": token_map.get(token_address.lower(), {}).get(
                "image_url", "Unknown"
            ),
        }


async def get_token_pair_list(db, range_days: int, limit: int, solver: str = None):
    condition = 'AND sc."solverAddress" = :solver' if solver else ""

    query = f"""
        SELECT
            o."sellTokenAddress",
            o."buyTokenAddress",
            COUNT(*) as orders_count
        FROM solver_competitions sc
        JOIN "order" o ON o.id = sc."orderId"
        WHERE o."createdTimestamp" >= NOW() - INTERVAL '{range_days} days'
        {condition}
        GROUP BY o."sellTokenAddress", o."buyTokenAddress"
        ORDER BY orders_count DESC
        LIMIT {limit}
    """

    params = {"solver": solver} if solver else {}
    result = await db.execute(text(query), params)
    rows = result.fetchall()

    token_pairs = []
    for sell_token, buy_token, _ in rows:
        token_pairs.append(
            {
                "sellToken": get_token_data(sell_token),
                "buyToken": get_token_data(buy_token),
            }
        )
    return token_pairs


async def get_token_pair_stats(db, range_days: int, type: str, solver: str = None):
    # Query DB
    condition = 'AND sc."solverAddress" = :solver' if solver else ""
    query = f"""
        SELECT
            sc."sellAmountInUSD",
            sc."buyAmountInUSD",
            o."sellTokenAddress",
            o."buyTokenAddress"
        FROM solver_competitions sc
        JOIN "order" o ON o.id = sc."orderId"
        WHERE o."createdTimestamp" >= NOW() - INTERVAL '{range_days} days'
        {condition}
    """

    params = {"solver": solver} if solver else {}
    result = await db.execute(text(query), params)
    rows = result.fetchall()

    df = pd.DataFrame(rows, columns=["sellUSD", "buyUSD", "sellToken", "buyToken"])

    token_pair_stats = {}

    for _, row in df.iterrows():
        sell_usd = row["sellUSD"]
        buy_usd = row["buyUSD"]
        sell_token = row["sellToken"].lower()
        buy_token = row["buyToken"].lower()

        bin_value = None
        if pd.notnull(sell_usd) and pd.notnull(buy_usd):
            if sell_usd > 0 and buy_usd > 0:
                bin_value = min(sell_usd, buy_usd)
            elif sell_usd > 0:
                bin_value = sell_usd
            elif buy_usd > 0:
                bin_value = buy_usd
        elif pd.notnull(sell_usd) and sell_usd > 0:
            bin_value = sell_usd
        elif pd.notnull(buy_usd) and buy_usd > 0:
            bin_value = buy_usd

        label = None
        if bin_value is not None:
            label = pd.cut([bin_value], bins=bins, labels=labels)[0]

        pair_key = (sell_token, buy_token)

        if pair_key not in token_pair_stats:
            token_pair_stats[pair_key] = {
                "value": 0,
                "binCounts": {label: 0 for label in labels},
            }

        if type == "count":
            token_pair_stats[pair_key]["value"] += 1
            if label:
                token_pair_stats[pair_key]["binCounts"][label] += 1
        else:  # volume
            if bin_value is not None:
                token_pair_stats[pair_key]["value"] += bin_value
                if label:
                    token_pair_stats[pair_key]["binCounts"][label] += bin_value

    # Format output
    output = []
    for (sell_token, buy_token), stats in token_pair_stats.items():
        output.append(
            {
                "tokenPair": {
                    "sellToken": get_token_data(sell_token),
                    "buyToken": get_token_data(buy_token),
                },
                "value": stats["value"],
                "binCounts": stats["binCounts"],
            }
        )

    # Sort and limit to top 50
    output.sort(key=lambda x: x["value"], reverse=True)
    top_50 = output[:50]
    others = output[50:]

    if others:
        # Combine all remaining into "Others"
        other_value = sum(item["value"] for item in others)
        other_bin_counts = {label: 0 for label in labels}
        for item in others:
            for label in labels:
                other_bin_counts[label] += item["binCounts"][label]

        top_50.append(
            {
                "tokenPair": {
                    "sellToken": get_token_data("", True),
                    "buyToken": get_token_data("", True),
                },
                "value": other_value,
                "binCounts": other_bin_counts,
            }
        )

    output = top_50
    return output


async def get_solver_participation(db, range_days: int):
    query = f"""
        SELECT "solverAddress", COUNT(DISTINCT "auctionId") as cnt
        FROM solver_competitions
        WHERE "updatedAt" >= NOW() - INTERVAL '{range_days} days'
        GROUP BY "solverAddress"
    """
    total_query = f"""
        SELECT COUNT(DISTINCT "auctionId")
        FROM solver_competitions
        WHERE "updatedAt" >= NOW() - INTERVAL '{range_days} days'
    """

    result = await db.execute(text(query))
    rows = result.fetchall()

    total_result = await db.execute(text(total_query))
    total = total_result.scalar()

    output = []
    solvers = await get_all_solvers(db)
    label_map = {s.address.lower(): s.labelName for s in solvers}
    for address, count in rows:
        output.append(
            {
                "solver": address,
                "name": label_map.get(address.lower(), "Unknown"),
                "participation_pct": round((count / total) * 100, 2) if total else 0.0,
            }
        )

    return output


async def get_leaderboard(db, range_days: int):
    query = f"""
        SELECT
            "solverAddress",
            SUM("ordersCount") AS total_orders,
            COUNT(DISTINCT "timestamp") AS total_auctions,
            SUM("totalVolume") AS total_volume,
            SUM("totalVolume") / NULLIF(SUM("ordersCount"), 0) AS avg_volume,
            SUM("rankings")::float / NULLIF(SUM("ordersCount"), 0) AS avg_ranking
        FROM real_time_stats
        WHERE "timestamp" >= NOW() - INTERVAL '{range_days} days'
        GROUP BY "solverAddress"
        ORDER BY total_volume DESC
    """

    result = await db.execute(text(query))
    rows = result.fetchall()

    output = []
    solvers = await get_all_solvers(db)
    label_map = {s.address.lower(): s.labelName for s in solvers}
    for (
        address,
        total_orders,
        total_auctions,
        total_volume,
        avg_volume,
        avg_ranking,
    ) in rows:
        output.append(
            {
                "solver": {
                    "address": address,
                    "name": label_map.get(address.lower(), "Unknown"),
                },
                "total_orders": int(total_orders or 0),
                "total_auctions": int(total_auctions or 0),
                "total_volume": float(total_volume or 0),
                "avg_volume": float(avg_volume or 0),
                "avg_ranking": (
                    round(float(avg_ranking), 2) if avg_ranking is not None else None
                ),
            }
        )

    return output


async def get_order_distribution_by(db, range_days: int, type: str, solver: str = None):
    # Prepare optional solver filter clause
    solver_filter = 'AND t."solverAddress" = :solver' if solver else ""

    # SQL query with necessary joins
    query = f"""
        SELECT o."{type}", COUNT(*)
        FROM "order" o
        JOIN transaction_orders_map tom ON o.id = tom."orderId"
        JOIN transaction t ON tom."txnHash" = t."txnHash"
        WHERE o."createdTimestamp" >= NOW() - INTERVAL '{range_days} days'
        {solver_filter}
        GROUP BY o."{type}"
    """

    params = {"solver": solver} if solver else {}
    result = await db.execute(text(query), params)
    rows = result.fetchall()

    bin_counts = {str(row[0]): row[1] for row in rows}
    return {"binCounts": bin_counts}

async def get_latest_txns(
    db,
    range_days: int,
    solverAddress: str,
    sellTokenAddress: str = None,
    buyTokenAddress: str = None,
):
    # 1. Get latest 50 txnHashes for this solver
    txn_query = f"""
        SELECT DISTINCT t."txnHash", t."timestamp", t."txnFeeInETH", t."txnFeeInUSD"
        FROM transaction t
        WHERE t."solverAddress" = :solver
        AND t."timestamp" >= NOW() - INTERVAL '{range_days} days'
        ORDER BY t."timestamp" DESC
        LIMIT 50
    """
    txn_rows = await db.execute(text(txn_query), {"solver": solverAddress})
    txns = txn_rows.fetchall()
    if not txns:
        return []

    txn_map = {
        row[0]: {
            "txnHash": row[0],
            "timestamp": humanize_time_ago(row[1]),
            "txnFeeInETH": float(row[2] or 0),
            "txnFeeInUSD": float(row[3] or 0),
            "swaps": [],
        }
        for row in txns
    }
    txn_hashes = list(txn_map.keys())

    # 2. Get (txnHash, orderId) mappings
    result = await db.execute(
        text(
            """
        SELECT "txnHash", "orderId"
        FROM transaction_orders_map
        WHERE "txnHash" = ANY(:txns)
    """
        ),
        {"txns": txn_hashes},
    )
    txn_order_map = result.fetchall()
    txn_to_orders = {}
    order_ids = set()
    for txnHash, orderId in txn_order_map:
        txn_to_orders.setdefault(txnHash, []).append(orderId)
        order_ids.add(orderId)

    # 3. Join solver_competitions + order to fetch token + USD data
    filters = []
    params = {"solver": solverAddress, "order_ids": list(order_ids)}
    if sellTokenAddress:
        filters.append('o."sellTokenAddress" = :sell')
        params["sell"] = sellTokenAddress.lower()
    if buyTokenAddress:
        filters.append('o."buyTokenAddress" = :buy')
        params["buy"] = buyTokenAddress.lower()

    where_clause = f"AND {' AND '.join(filters)}" if filters else ""

    query = f"""
        SELECT sc."orderId", o."sellTokenAddress", o."buyTokenAddress",
               sc."sellAmountInUSD", sc."buyAmountInUSD"
        FROM solver_competitions sc
        JOIN "order" o ON o.id = sc."orderId"
        WHERE sc."solverAddress" = :solver
        AND sc."orderId" = ANY(:order_ids)
        {where_clause}
    """

    result = await db.execute(text(query), params)
    order_rows = result.fetchall()

    order_lookup = {
        row[0]: {
            "sellToken": get_token_data(row[1]),
            "buyToken": get_token_data(row[2]),
            "sellAmountInUsd": round(float(row[3] or 0), 2),
            "buyAmountInUsd": round(float(row[4] or 0), 2),
        }
        for row in order_rows
    }

    # 4. Populate swaps for each txnHash
    for txnHash, order_ids in txn_to_orders.items():
        for oid in order_ids:
            if oid in order_lookup:
                txn_map[txnHash]["swaps"].append(order_lookup[oid])

    result = await db.execute(
        text(
            """
        SELECT "txnHash", "poolAddress"
        FROM transaction_pool_map
        WHERE "txnHash" = ANY(:txns)
    """
        ),
        {"txns": txn_hashes},
    )

    txn_pool_map = result.fetchall()

    # Map: txnHash -> list of pools
    txn_to_pools = {}
    for txnHash, poolAddress in txn_pool_map:
        pool_platform = pools_map.get(poolAddress.lower(), {}).get(
            "platform", "Unknown"
        )
        txn_to_pools.setdefault(txnHash, []).append(pool_platform)

    # 7. Add pools to txn response
    for txnHash, pool_list in txn_to_pools.items():
        if txnHash in txn_map:
            txn_map[txnHash]["pools"] = list(set(pool_list))

    # 5. Format and return response
    GAS_PRICE = 0.738805624
    return [
        {
            "txnHash": v["txnHash"],
            "txnLink": f"https://etherscan.io/tx/{v['txnHash']}",
            "chain": "Ethereum",
            "protocol": {
                "name": "CowSwap",
                "image_url": "https://holder.io/wp-content/uploads/coins/1/cow-42921.png",
                "link": "https://swap.cow.fi/#/",
            },
            "gas": int(float(v["txnFeeInETH"] or 0) / (GAS_PRICE) * (10**9)),
            "txnFeeInETH": round(v["txnFeeInETH"], 6),
            "txnFeeInUSD": round(v["txnFeeInUSD"], 2),
            "timestamp": v["timestamp"],
            "swaps": v["swaps"],
            "liquidity_platform": v["pools"],
        }
        for v in txn_map.values()
        if v["swaps"]
    ]


async def get_surplus_trend(
    db, range_days: int, solver: str, sellToken: str, buyToken: str
):
    query = f"""
        SELECT 
            t."timestamp",
            t."surplusInUSD"
        FROM transaction t
        JOIN transaction_orders_map tom ON tom."txnHash" = t."txnHash"
        JOIN "order" o ON o.id = tom."orderId"
        WHERE t."solverAddress" = :solver
        AND t."timestamp" >= NOW() - INTERVAL '{range_days} days'
        AND o."sellTokenAddress" = :sellToken
        AND o."buyTokenAddress" = :buyToken
        ORDER BY t."timestamp"
    """

    result = await db.execute(
        text(query),
        {
            "solver": solver,
            "sellToken": sellToken.lower(),
            "buyToken": buyToken.lower(),
        },
    )
    rows = result.fetchall()

    return [
        {
            "timestamp": row[0].strftime("%Y-%m-%d %H:%M"),
            "surplusInUSD": float(row[1] or 0),
        }
        for row in rows
    ]


async def get_order_solved_time_diff_bins(
    db,
    range_days: int,
):
    query = f"""
        SELECT DISTINCT ON (sc."orderId")
            o."id",
            o."createdTimestamp",
            sc."updatedAt"
        FROM "order" o
        JOIN solver_competitions sc ON sc."orderId" = o."id"
        WHERE o."createdTimestamp" >= NOW() - INTERVAL '{range_days} days'
        AND sc."ranking" = 1
        ORDER BY sc."orderId", sc."updatedAt"
    """

    result = await db.execute(text(query))
    rows = result.fetchall()

    from collections import defaultdict

    bins = {
        "0-1s": (0, 1),
        "1-3s": (1, 3),
        "3-6s": (3, 6),
        "6-10s": (6, 10),
        "10-12s": (10, 12),
        "12-15s": (12, 15),
        "15-18s": (15, 18),
        "18-21s": (18, 21),
        "21-25s": (21, 25),
        "25-30s": (25, 30),
        "30-45s": (30, 45),
        "45-60s": (45, 60),
        "60-90s": (60, 90),
        "90-120s": (90, 120),
        "120-180s": (120, 180),
        "180s+": (180, float("inf")),
    }

    bin_counts = defaultdict(int)

    BLOCK_TIME = 15
    for _, created_ts, solved_ts in rows:
        diff = (solved_ts - created_ts).total_seconds() - BLOCK_TIME

        for label, (low, high) in bins.items():
            if low < diff <= high:
                bin_counts[label] += 1
                break

    # Ensure all bins are present
    for label in bins:
        bin_counts[label] += 0

    return {"binCounts": dict(sorted(bin_counts.items(), key=lambda x: bins[x[0]][0]))}
