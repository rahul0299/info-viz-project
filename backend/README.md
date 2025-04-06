# 🧠 InfoViz Project Backend (FastAPI)

This is the backend service powering the InfoViz project — a blockchain analytics dashboard focused on CowSwap protocol.

It provides a set of high-performance FastAPI endpoints to query, aggregate, and visualize real-time data about solvers, transactions, token pairs, surplus trends, and order execution behavior.

---

## 🚀 Tech Stack

- **Python 3.11+**
- **FastAPI**
- **SQLAlchemy (async)**
- **PostgreSQL**
- **asyncpg**
- **pandas** (for processing in some endpoints)
- **Uvicorn** for ASGI serving

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py                   # Entry point
│   ├── db.py                     # DB engine & session
│   ├── models.py                 # SQLAlchemy ORM models
│   ├── crud.py                   # DB access layer
│   ├── schemas.py                # Response Model Schemas
│   ├── pd_loaded.py              # Pre loaded dataframes ON START
│   ├── routers/                  # FastAPI routes
│   │   ├── stats.py              # Endpoints
│   ├── mappers/
│   │   ├── pools_map.csv         # Pool address to platform map
│   │   ├── tokens_mapping.csv    # Token info map
│   └── utils.py                  # Helper functions (timestamp, binning, etc.)
├── .env                          # Optional env vars
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/rahul0299/info-viz-project
cd info-viz-project/backend
```

### 2. Create & activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Add token & pool metadata (if mappers not avaiable)

Place your `tokens_mapping.csv` and `pools_map.csv` inside `app/mappers/`.

### 5. Run the FastAPI server

```bash
uvicorn app.main:app --reload
```

App will be available at: [http://localhost:8000](http://localhost:8000)

Swagger docs at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🔌 Environment Variables

Set your DB connection URL:

```env
DATABASE_URL=postgresql+asyncpg://user:password@host:port/dbname
```

---

## 🔌 API Endpoints

| Method | Endpoint                       | Description                                                                                                                                 |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/solvers`                     | Get list of all solver addresses and their labels. `response_model=List[SolverLabel]`                                                       |
| `GET`  | `/volumn_trend`                | Get volume trend aggregated by time interval (e.g., 2hr, 4hr). Filters: `range_days`, `solver`. `response_model=List[StatsResponse]`        |
| `GET`  | `/overview_stats`              | Get overview stats (total orders, total volume, etc.). Optional filter by `solver`. `response_model=OverviewStats`                          |
| `GET`  | `/token-pair-list`             | List token pairs sorted by order count. Optional filter: `solver`. `response_model=List[TokenPair]`                                         |
| `GET`  | `/token-pair-stats`            | Get detailed stats per token pair (either `volume` or `count`). Optional filter: `solver`. `response_model=List[TokenPairStat]`             |
| `GET`  | `/solver-participation`        | Get participation % of each solver based on unique auctions. `response_model=List[SolverParticipation]`                                     |
| `GET`  | `/leaderboard`                 | Leaderboard of solvers ranked by total volume, orders, etc. `response_model=List[LeaderboardEntry]`                                         |
| `GET`  | `/order-distribution-by`       | Get distribution of orders by `partiallyFillable` or `kind`. Filters: `range_days`, `type`.                                                 |
| `GET`  | `/latest-txns`                 | Get latest 50 transactions for a solver. Optional filters: `sellTokenAddress`, `buyTokenAddress`. `response_model=List[TransactionInfo]`    |
| `GET`  | `/surplus-trend`               | Get per-order surplus trend (no time bucketing). Filters: `solver`, `sellToken`, `buyToken`. `response_model=List[SurplusTrendPoint]`       |
| `GET`  | `/order-solved-time-diff-bins` | Get time difference (in seconds) between order creation and first solving (ranking=1) binned into categories. `response_model=TimeDiffBins` |

---

## 📥 Future Improvements

- Redis caching for expensive endpoints
- GraphQL support
- Unit tests with `pytest`
- OAuth2 security for dashboard controls

---

## 🧑‍💻 Author

Built with 💙 by [@bharathraj](https://github.com/bharathraj)

---
