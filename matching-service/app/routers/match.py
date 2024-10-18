import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Union

from logic.matching import find_match_else_enqueue, remove_user_from_queue
from models.match import MatchModel, MessageModel
from utils.socketmanager import manager

router = APIRouter()

# Add a user to the queue
@router.post("/queue/{user_id}")
async def enqueue_user(
    user_id: str,
    topic: str,
    difficulty: str
):
    return await find_match_else_enqueue(user_id, topic, difficulty)

# Remove a user from the queue
@router.delete("/queue/{user_id}")
async def dequeue_user(
    user_id: str,
    topic: str,
    difficulty: str
):
    return await remove_user_from_queue(user_id, topic, difficulty)

@router.websocket("/subscribe/{user_id}")
async def subscribe(
    websocket: WebSocket,
    user_id: str,
    topic: str,
    difficulty: str,
):
    await manager.connect(user_id, topic, difficulty, websocket)
    try:
        # Keep the socket listening
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await remove_user_from_queue(user_id, topic, difficulty)
