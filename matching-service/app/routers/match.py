from fastapi import APIRouter, HTTPException
import redis.asyncio as redis
import asyncio
import json
import os

router = APIRouter()

redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", "6379")

# Initialize Redis client
async def get_redis():
    return redis.Redis(host=redis_host, port=int(redis_port), db=0, decode_responses=True)

# Shared list to store matched pairs
matched_pairs = []

# Pub/Sub topic for notifications
match_channel = 'match_channel'

# A helper function to build a unique queue key based on topic and difficulty
def build_queue_key(topic, difficulty):
    return f"queue:{topic}:{difficulty}"

# Asynchronous task to listen for matches
async def listen_for_matches(redis_client):
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(match_channel)
    async for message in pubsub.listen():
        if message["type"] == "message":
            print(f"Match notification: {message['data']}")

# Add a user to the queue based on topic and difficulty
@router.post("/queue")
async def enqueue_user(user_id: str, topic: str, difficulty: str):
    redis_client = await get_redis()
    queue_key = build_queue_key(topic, difficulty)

    # Asynchronously add the user to the Redis list (queue)
    await redis_client.lpush(queue_key, user_id)
    print(f"User {user_id} enqueued for topic {topic}, difficulty {difficulty}")

    # Try to find a match for the user asynchronously
    matched_user = await find_match(user_id, topic, difficulty)

    if matched_user:
        # If a match is found, notify both users via Redis Pub/Sub asynchronously
        match_data = json.dumps({"user1": user_id, "user2": matched_user, "topic": topic, "difficulty": difficulty})
        await redis_client.publish(match_channel, match_data)
        matched_pairs.append({"user1": user_id, "user2": matched_user, "topic": topic, "difficulty": difficulty})
        return {"message": "Match found", "match": match_data}

    return {"message": f"User {user_id} enqueued, waiting for a match"}

# Asynchronous matching logic
async def find_match(user_id, topic, difficulty):
    """
    This function attempts to find a matching user based on topic and difficulty.
    Priority is given to topic, with secondary preference for difficulty.
    """
    redis_client = await get_redis()
    queue_key = build_queue_key(topic, difficulty)

    # Check for users in the queue with the same topic and difficulty
    queue_length = await redis_client.llen(queue_key)
    if queue_length > 1:  # There's at least one other user waiting
        for _ in range(queue_length):
            matched_user = await redis_client.rpop(queue_key)  # Pop the first user in queue
            if matched_user != user_id:
                return matched_user

    # No match found
    return None

# Get matched pairs for demonstration purposes
@router.get("/matches")
async def get_matched_pairs():
    return {"matched_pairs": matched_pairs}

# Startup event: Start the match listener in a background task
@router.on_event("startup")
async def startup_event():
    redis_client = await get_redis()
    asyncio.create_task(listen_for_matches(redis_client))
