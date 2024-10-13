from utils.redis_utils import get_redis, build_queue_key, listen_for_matches, find_match, match_channel
from models.match import MatchData
from fastapi import APIRouter
import asyncio

router = APIRouter()

# List to store matched pairs
matched_pairs = []

# Start the match listener in a background task
@router.on_event("startup")
async def startup_event():
    redis_client = await get_redis()
    asyncio.create_task(listen_for_matches(redis_client))

# Add a user to the queue
@router.post("/queue/{user_id}")
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
        match_data = MatchData(
            user1=user_id, 
            user2=matched_user, 
            topic=topic, 
            difficulty=difficulty
        )
        await redis_client.publish(match_channel, match_data.json())
        matched_pairs.append(match_data.dict())
        return {"message": "Match found", "match": match_data}

    return {"message": f"User {user_id} enqueued, waiting for a match"}

# Get all matched pairs
@router.get("/matches")
async def get_matched_pairs():
    return {"matched_pairs": matched_pairs}
