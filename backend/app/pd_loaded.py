import os
import pandas as pd

# Load token metadata once at startup
TOKEN_METADATA_PATH = os.path.join(
    os.path.dirname(__file__), "./mappers/tokens_mapping.csv"
)
token_df = pd.read_csv(TOKEN_METADATA_PATH)
token_map = {
    row["address"].lower(): {
        "name": row["name"], 
        "symbol": row["symbol"],
        "image_url": row["image_url"]
    } for _, row in token_df.iterrows()
}

# Load token metadata once at startup
POOLS_METADATA_PATH = os.path.join(
    os.path.dirname(__file__), "./mappers/pools_map.csv"
)
pools_df = pd.read_csv(POOLS_METADATA_PATH)
pools_map = {
    row["address"].lower(): {
        "platform": row["platform"], 
    } for _, row in pools_df.iterrows()
}

# Bins
bins = [
    0,
    100,
    500,
    1000,
    2500,
    5000,
    10000,
    25000,
    50000,
    75000,
    100000,
    250000,
    500000,
    1000000,
    5000000,
    float("inf"),
]
labels = [
    "0-100",
    "100-500",
    "500-1k",
    "1k-2.5k",
    "2.5k-5k",
    "5k-10k",
    "10k-25k",
    "25k-50k",
    "50k-75k",
    "75k-100k",
    "100k-250k",
    "250k-500k",
    "500k-1M",
    "1M-5M",
    "5M+",
]
