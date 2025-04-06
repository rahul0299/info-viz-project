from fastapi import FastAPI
from app.routers import stats
from app.models import Base
from app.db import engine

app = FastAPI()

# Include router
app.include_router(stats.router)

# Create tables (only once, ideally during setup)
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
