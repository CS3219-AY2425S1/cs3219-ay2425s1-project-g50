from fastapi.responses import JSONResponse, Response
from typing import Union

from models.match import MatchModel, MessageModel
from utils.redis import acquire_lock, redis_client, release_lock
from utils.socketmanager import manager

async def find_match_else_enqueue(
    user_id: str,
    topic: str,
    difficulty: str
) -> Union[Response, JSONResponse]:
    queue_key = _build_queue_key(topic, difficulty)
    islocked = await acquire_lock(redis_client, queue_key)

    if not islocked:
        raise Exception("Could not acquire lock")

    # Check if the user is already in the queue
    if user_id in await redis_client.lrange(queue_key, 0, -1):
        await release_lock(redis_client, queue_key)
        return Response(status_code=304)

    # Check if there are no other users in the queue
    if await redis_client.llen(queue_key) == 0:
        await redis_client.lpush(queue_key, user_id)
        await release_lock(redis_client, queue_key)
        return Response(status_code=202)
    
    # There is a user in the queue
    matched_user = await redis_client.rpop(queue_key)
    await release_lock(redis_client, queue_key)
    response = MatchModel(
        user1=matched_user,
        user2=user_id,
        topic=topic,
        difficulty=difficulty,
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

    if user_id in await redis_client.lrange(queue_key, 0, -1):
        await redis_client.lrem(queue_key, 0, user_id)

    await release_lock(redis_client, queue_key)
    await manager.disconnect_all(user_id, topic, difficulty)
    return Response(status_code=200)

'''
Helper functions for matching.
'''
# Builds a queue key based on topic and difficulty
def _build_queue_key(topic: str, difficulty: str):
    return f"{topic}:{difficulty}"