import asyncio
import asyncpg

async def test():
    conn = await asyncpg.connect("postgresql://princeraj:princeraj123@35.240.167.174:5434/cowswap-mainnet")
    result = await conn.fetch("SELECT NOW()")
    print(result)
    await conn.close()

asyncio.run(test())
