from fastapi import FastAPI
from app.routers import stats
from app.models import Base
from app.db import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Include router
app.include_router(stats.router)

# Allow requests from localhost:5173 (your frontend dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create tables (only once, ideally during setup)
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
