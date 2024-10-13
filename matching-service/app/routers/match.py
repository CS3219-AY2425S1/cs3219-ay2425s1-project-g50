from utils.redis_utils import get_redis, build_queue_key, listen_for_matches, find_match_else_enqueue, match_channel
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
    # redis_client = await get_redis()
    return await find_match_else_enqueue(user_id, topic, difficulty)

# Get all matched pairs


@router.get("/matches")
async def get_matched_pairs():
    return {"matched_pairs": matched_pairs}
