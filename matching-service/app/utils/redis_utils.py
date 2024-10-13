import os
import redis.asyncio as redis
from models.match import MatchData
import asyncio
match_channel = 'match_channel'

# Initialize Redis client


async def get_redis():
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = os.getenv("REDIS_PORT", "6379")
    return redis.Redis(host=redis_host, port=int(redis_port), db=0, decode_responses=True)


async def acquire_lock(redis_client, queue_key, lock_timeout_ms=30000, retry_interval_ms=100, max_retries=100) -> bool:
    lock_key = f"{queue_key}:lock"
    retries = 0

    while retries < max_retries:
        locked = await redis_client.set(lock_key, "locked", nx=True, px=lock_timeout_ms)
        if locked:
            print(f"Lock acquired for {queue_key}: {locked}")
            return True
        else:
            print(f"Failed {retries} times to acquire lock for {queue_key}, retrying...")
            retries += 1
            # Convert ms to seconds
            await asyncio.sleep(retry_interval_ms / 1000)

    return False


async def release_lock(redis_client, queue_key) -> None:
    lock_key = f"{queue_key}:lock"
    await redis_client.delete(lock_key)
    print(f"Lock released for {queue_key}")


# async def release_lock(redis_client, queue_key) -> None:
#     lock_key = f"{queue_key}:lock"
#     await redis_client.delete(lock_key)


# Helper function to build a unique queue key based on topic and difficulty
def build_queue_key(topic, difficulty):
    return f"{topic}:{difficulty}"

# Asynchronous task to listen for matches


async def listen_for_matches(redis_client):
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(match_channel)
    async for message in pubsub.listen():
        if message["type"] == "message":
            print(f"Match notification: {message['data']}")

# Asynchronous matching logic


async def find_match_else_enqueue(user_id, topic, difficulty):
    redis_client = await get_redis()
    queue_key = build_queue_key(topic, difficulty)

    result = None

    # ACQUIRE LOCK
    islocked = await acquire_lock(redis_client, queue_key)

    if not islocked:
        raise Exception("Could not acquire lock")

    # Check if the user is already in the queue
    user_in_queue = await redis_client.lrange(queue_key, 0, -1)
    print("checking if user is in queue")
    if user_id in user_in_queue:
        result = {"message": f"User {
            user_id} is already in the queue, waiting for a match"}
    else:
        queue_length = await redis_client.llen(queue_key)
        if queue_length > 0:
            matched_user = await redis_client.rpop(queue_key)
            match_data = MatchData(
                user1=user_id, user2=matched_user, topic=topic, difficulty=difficulty)
            await redis_client.publish(match_channel, match_data.json())
            result = {"message": "Match found", "match": match_data}
        else:
            await redis_client.lpush(queue_key, user_id)
            result = {"message": f"User {
                user_id} enqueued, waiting for a match"}

    # RELEASE LOCK
    await release_lock(redis_client, queue_key)
    print(result)
    return result

    # # Check for users in the queue with the same topic and difficulty
    # queue_length = await redis_client.llen(queue_key)
    # if queue_length > 1:  # There's at least one other user waiting
    #     for _ in range(queue_length):
    #         matched_user = await redis_client.rpop(queue_key)  # Pop the first user in queue
    #         if matched_user != user_id:
    #             # Remove the current user from the queue
    #             await redis_client.lrem(queue_key, count=1, value=user_id)
    #             return matched_user

    # # No match found
    # return None
