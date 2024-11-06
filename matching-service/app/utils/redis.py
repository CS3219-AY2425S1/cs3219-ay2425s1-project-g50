import asyncio
import os
import redis.asyncio as redis

async def acquire_lock(redis_client, key, lock_timeout_ms=30000, retry_interval_ms=100, max_retries=100) -> bool:
    lock_key = f"{key}:lock"
    retries = 0

    while retries < max_retries:
        locked = await redis_client.set(lock_key, "locked", nx=True, px=lock_timeout_ms)
        if locked:
            return True
        else:
            retries += 1
            # Convert ms to seconds
            await asyncio.sleep(retry_interval_ms / 1000)

    return False

async def release_lock(redis_client, key) -> None:
    lock_key = f"{key}:lock"
    await redis_client.delete(lock_key)

redis_client = redis.Redis(
    host=os.environ.get("REDIS_SERVICE_HOST", "localhost"),
    port=int(os.environ.get("REDIS_SERVICE_PORT", "6379")),
    db=0,
    decode_responses=True
)
