from sqlalchemy import Column, Integer, String, TIMESTAMP, Numeric
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class RealTimeStats(Base):
    __tablename__ = "real_time_stats"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(TIMESTAMP(timezone=True), nullable=False)
    solverAddress = Column(String, nullable=False)
    txnCount = Column(Integer, default=0)
    totalVolume = Column(Numeric(30, 18), default=0)
    ordersCount = Column(Integer, default=0)
    rankings = Column(Integer, default=0)
    participationCount = Column(Integer, default=0)
    updatedAt = Column(TIMESTAMP(timezone=False), nullable=False)

class Solver(Base):
    __tablename__ = "solver"

    address = Column(String, primary_key=True, index=True)
    labelName = Column(String, nullable=False)
    updatedAt = Column(TIMESTAMP, nullable=False)
