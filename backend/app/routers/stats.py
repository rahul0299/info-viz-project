from fastapi import APIRouter, Depends, Query
from app.db import get_db
from app.schemas import *
from app import crud
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Dict, Tuple
import time

router = APIRouter()

# caching 5mins
CACHE_TTL_SECONDS = 300


@router.get("/solvers", response_model=List[SolverLabel])
async def list_solvers(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_solvers(db)


@router.get("/volumn_trend", response_model=List[StatsResponse])
async def volumn_trend(
    interval: str = Query("4hr", regex="^\d+hr$"),
    range_days: int = Query(1, le=14),
    solver: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    hours = int(interval.replace("hr", ""))
    return await crud.get_volumn_trend(db, hours, range_days, solver)


@router.get("/overview_stats", response_model=OverviewStats)
async def overview_stats(
    range_days: int = Query(1, le=14),
    solver: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await crud.get_overview_stats(db, range_days, solver)


# Cache
_list_cache: Dict[Tuple[int, Optional[str]], Tuple[float, list]] = {}


@router.get("/token-pair-list", response_model=List[TokenPair])
async def token_pair_list(
    range_days: int = Query(1, le=14),
    solver: Optional[str] = None,
    limit: int = Query(50, le=100),
    db: AsyncSession = Depends(get_db),
):
    key = (range_days, solver)
    now = time.time()

    if key in _list_cache:
        cached_time, cached_result = _list_cache[key]
        if now - cached_time < CACHE_TTL_SECONDS:
            print("CACHED")
            return cached_result

    print("NON CACHED")
    token_pairs = await crud.get_token_pair_list(db, range_days, limit, solver)
    _list_cache[key] = (now, token_pairs)
    return token_pairs


# Cache
_cache_token_pair_stats: Dict[Tuple[int, Optional[str], str], Tuple[float, list]] = {}


@router.get("/token-pair-stats", response_model=List[TokenPairStat])
async def token_pair_stats(
    range_days: int = Query(1, le=14),
    type: str = Query("count", regex="^(count|volume)$"),
    solver: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    key = (range_days, solver, type)
    now = time.time()

    # Serve from cache if within TTL
    if key in _cache_token_pair_stats:
        cached_time, cached_result = _cache_token_pair_stats[key]
        if now - cached_time < CACHE_TTL_SECONDS:
            print("CACHED")
            return cached_result

    print("NON CACHED")
    output = await crud.get_token_pair_stats(db, range_days, type, solver)
    _cache_token_pair_stats[key] = (now, output)
    return output


# Cache
_cache_solver_participation: Dict[
    Tuple[int, Optional[str], str], Tuple[float, list]
] = {}


@router.get("/solver-participation", response_model=List[SolverParticipation])
async def solver_participation(
    range_days: int = Query(1, le=14), db: AsyncSession = Depends(get_db)
):
    key = range_days
    now = time.time()

    # Serve from cache if within TTL
    if key in _cache_solver_participation:
        cached_time, cached_result = _cache_solver_participation[key]
        if now - cached_time < CACHE_TTL_SECONDS:
            print("CACHED")
            return cached_result

    print("NON CACHED")
    output = await crud.get_solver_participation(db, range_days)
    _cache_solver_participation[key] = (now, output)
    return output


@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def leaderboard(
    range_days: int = Query(1, le=14), db: AsyncSession = Depends(get_db)
):
    return await crud.get_leaderboard(db, range_days)


# Cache
_cache_order_distribution_by: Dict[
    Tuple[int, Optional[str], str], Tuple[float, list]
] = {}


@router.get("/order-distribution-by")
async def order_distribution_by(
    range_days: int = Query(1, le=14),
    type: str = Query("kind", regex="^(partiallyFillable|kind)$"),
    solver: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    key = (range_days, type, solver)
    now = time.time()

    # Serve from cache if within TTL
    if key in _cache_order_distribution_by:
        cached_time, cached_result = _cache_order_distribution_by[key]
        if now - cached_time < CACHE_TTL_SECONDS:
            print("CACHED")
            return cached_result
        
    print("NON CACHED")
    output = await crud.get_order_distribution_by(db, range_days, type, solver)
    _cache_order_distribution_by[key] = (now, output)
    return output


@router.get("/latest-txns", response_model=List[TransactionInfo])
async def latest_txns(
    solverAddress: str = Query(...),
    range_days: int = Query(1, le=14),
    sellTokenAddress: Optional[str] = None,
    buyTokenAddress: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    return await crud.get_latest_txns(
        db, range_days, solverAddress, sellTokenAddress, buyTokenAddress
    )


# Cache
_cache_surplus_trend: Dict[Tuple[int, Optional[str], str], Tuple[float, list]] = {}


@router.get("/surplus-trend", response_model=List[SurplusTrendPoint])
async def surplus_trend(
    range_days: int = Query(1, le=14),
    solver: str = Query(...),
    sellToken: str = Query(...),
    buyToken: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    key = (range_days, solver, sellToken, buyToken)
    now = time.time()

    # Serve from cache if within TTL
    if key in _cache_surplus_trend:
        cached_time, cached_result = _cache_surplus_trend[key]
        if now - cached_time < CACHE_TTL_SECONDS:
            print("CACHED")
            return cached_result

    print("NON CACHED")
    output = await crud.get_surplus_trend(db, range_days, solver, sellToken, buyToken)
    _cache_surplus_trend[key] = (now, output)
    return output


# Cache
_cache_order_solved_time_diff_bins: Dict[
    Tuple[int, Optional[str], str], Tuple[float, list]
] = {}


@router.get("/order-solved-time-diff-bins", response_model=TimeDiffBins)
async def order_solved_time_diff_bins(
    range_days: int = Query(1, le=14), db: AsyncSession = Depends(get_db)
):
    key = range_days
    now = time.time()

    # Serve from cache if within TTL
    if key in _cache_order_solved_time_diff_bins:
        cached_time, cached_result = _cache_order_solved_time_diff_bins[key]
        if now - cached_time < CACHE_TTL_SECONDS:
            print("CACHED")
            return cached_result

    print("NON CACHED")
    output = await crud.get_order_solved_time_diff_bins(db, range_days)
    _cache_order_solved_time_diff_bins[key] = (now, output)
    return output
