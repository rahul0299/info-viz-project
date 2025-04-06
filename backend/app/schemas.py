from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, List

class SolverLabel(BaseModel):
    address: str
    labelName: str

    class Config:
        orm_mode = True

class StatsResponse(BaseModel):
    timestamp: datetime
    volume: float

class OverviewStats(BaseModel):
    total_orders: int
    total_auctions: int
    total_solvers: int
    total_volume: float
    avg_ranking: Optional[float]

class TokenInfo(BaseModel):
    address: str
    name: str
    symbol: str
    image_url: str

class TokenPair(BaseModel):
    sellToken: TokenInfo
    buyToken: TokenInfo

class TokenPairStat(BaseModel):
    tokenPair: TokenPair
    value: float  # could represent count or volume depending on `type`
    binCounts: Dict[str, float]

class SolverParticipation(BaseModel):
    solver: str
    name: str
    participation_pct: float

class SolverInfo(BaseModel):
    address: str
    name: str

class LeaderboardEntry(BaseModel):
    solver: SolverInfo
    total_orders: int
    total_auctions: int
    total_volume: float
    avg_volume: float
    avg_ranking: Optional[float]

class SwapInfo(BaseModel):
    sellToken: TokenInfo
    buyToken: TokenInfo
    sellAmountInUsd: float
    buyAmountInUsd: float


class ProtocolInfo(BaseModel):
    name: str
    image_url: str
    link: str


class TransactionInfo(BaseModel):
    txnHash: str
    txnLink: str
    chain: str
    protocol: ProtocolInfo
    gas: float
    txnFeeInETH: float
    txnFeeInUSD: float
    timestamp: str
    swaps: List[SwapInfo]
    liquidity_platform: List[str]

class SurplusTrendPoint(BaseModel):
    timestamp: str  # e.g., "2025-04-06 14:00"
    surplusInUSD: float

class TimeDiffBins(BaseModel):
    binCounts: Dict[str, int]