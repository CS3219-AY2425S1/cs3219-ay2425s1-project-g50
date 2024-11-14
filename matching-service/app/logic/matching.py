from fastapi.responses import JSONResponse, Response
from typing import Union

from logger import logger
from models.match import MatchModel
from utils.redis import acquire_lock, redis_client, release_lock
from utils.socketmanager import manager
import os
import httpx

QUESTION_SVC_PORT = os.getenv("QUESTION_SERVICE_SERVICE_PORT")
QUESTION_SVC_URL = f"http://{os.getenv("QUESTION_SERVICE_SERVICE_HOST")}:{QUESTION_SVC_PORT}"

COLLAB_SVC_PORT = os.getenv("COLLAB_SERVICE_SERVICE_PORT")
COLLAB_SVC_URL = f"http://{os.getenv("COLLAB_SERVICE_SERVICE_HOST")}:{COLLAB_SVC_PORT}"

async def find_match_else_enqueue(
    user_id: str,
    topic: str,
    difficulty: str
) -> Union[Response, JSONResponse]:
    # Try to fetch a random question with specified criteria from question service
    try:
        question_id = await fetch_random_question(topic, difficulty)
    except Exception as e:
        return JSONResponse(
            status_code=404,
            content={"detail": "No question with specified topic and difficulty exists"}
        )
        
    queue_key = _build_queue_key(topic, difficulty)
    islocked = await acquire_lock(redis_client, queue_key)

    if not islocked:
        raise Exception("Could not acquire lock")

    queue = await redis_client.lrange(queue_key, 0, -1)
    logger.debug(_get_queue_state_message(topic, difficulty, queue, True))

    # Check if the user is already in the queue
    if user_id in queue:
        await release_lock(redis_client, queue_key)
        return Response(status_code=304)

    # Check if there are no other users in the queue
    if await redis_client.llen(queue_key) == 0:
        await redis_client.lpush(queue_key, user_id)
        logger.debug(f"Added {user_id} to Queue {(topic, difficulty)}")
        queue = await redis_client.lrange(queue_key, 0, -1)
        logger.debug(_get_queue_state_message(topic, difficulty, queue, False))
        await release_lock(redis_client, queue_key)
        return Response(status_code=202)
    
    # There is a user in the queue
    matched_user = await redis_client.rpop(queue_key)
    logger.debug(f"Match found for {user_id} and {matched_user}")
    queue = await redis_client.lrange(queue_key, 0, -1)
    logger.debug(_get_queue_state_message(topic, difficulty, queue, False))
    await release_lock(redis_client, queue_key)
    
    # Try to create a common room for the matched users
    try:
        room_id = await create_room(user_id, matched_user, question_id)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Failed to create room"}
        )
    
    response = MatchModel(
        user1=matched_user,
        user2=user_id,
        topic=topic,
        difficulty=difficulty,
        question_id=question_id,
        room_id = room_id
    )
    await manager.broadcast(matched_user, topic, difficulty, response.json())
    await manager.disconnect_all(matched_user, topic, difficulty)
    return JSONResponse(status_code=201, content=response.json())

async def remove_user_from_queue(
    user_id: str,
    topic: str,
    difficulty: str
) -> Response:
    queue_key = _build_queue_key(topic, difficulty)
    islocked = await acquire_lock(redis_client, queue_key)

    if not islocked:
        raise Exception("Could not acquire lock")

    queue = await redis_client.lrange(queue_key, 0, -1)
    logger.debug(_get_queue_state_message(topic, difficulty, queue, True))

    if user_id in queue:
        await redis_client.lrem(queue_key, 0, user_id)
        logger.debug(f"Removed {user_id} from queue {(topic, difficulty)}")

    queue = await redis_client.lrange(queue_key, 0, -1)
    logger.debug(_get_queue_state_message(topic, difficulty, queue, False))

    await release_lock(redis_client, queue_key)
    await manager.disconnect_all(user_id, topic, difficulty)
    return Response(status_code=200)

'''
Helper functions for matching.
'''
# Builds a queue key based on topic and difficulty
def _build_queue_key(topic: str, difficulty: str):
    return f"{topic}:{difficulty}"

def _get_queue_state_message(topic, difficulty, queue, before: bool):
    postfix = f"Queue for {(topic, difficulty)}: {queue}"
    if before:
        return "Before - " + postfix
    return "After - " + postfix

async def fetch_random_question(topic: str, difficulty: str) -> str:
    """Fetch a random question from the question service based on topic and difficulty."""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{QUESTION_SVC_URL}/questions/random",
            params={
                "category": topic,
                "complexity": difficulty
            }
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch question: {response.text}")
            
        question_data = response.json()
        return question_data["id"]

async def create_room(user1: str, user2: str, question_id: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{COLLAB_SVC_URL}/collab/create-room",
            json={
                "user1": user1,
                "user2": user2,
                "question_id": question_id
            }
        )
        
        if response.status_code != 201:
                raise Exception(f"Failed to create room")
        
    room_data = response.json()
    return room_data["roomId"]