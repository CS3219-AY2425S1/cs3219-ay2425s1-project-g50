import asyncio
from fastapi import WebSocket
from typing import Dict, List, Tuple

from exceptions.socket_exceptions import NoExistingConnectionException

'''
Web socket connection manager which manages connections by users.
'''
class ConnectionManager:
    def __init__(self):
        self.connection_map: Dict[
            Tuple[
                Annotated[str, "user_id"],
                Annotated[str, "topic"],
                Annotated[str, "complexity"]
            ], List[WebSocket]
        ] = {}

    '''
    Associates a (user_id, topic, complexity) with a websocket and accepts
    the websocket connection.
    '''
    async def connect(
        self,
        user_id: str,
        topic: str,
        complexity: str,
        websocket: WebSocket,
    ) -> None:
        await websocket.accept()
        key: Tuple[str, str, str] = (user_id, topic, complexity)
        if key not in self.connection_map:
            self.connection_map[key] = []
        self.connection_map[key].append(websocket)

    '''
    Disconnects all connections associated with (user_id, topic, complexity)
    '''
    async def disconnect_all(
        self,
        user_id: str,
        topic: str,
        complexity: str,
    ) -> None:
        key: Tuple[str, str, str] = (user_id, topic, complexity)
        if key not in self.connection_map:
            return

        await asyncio.gather(
            *[self._close_and_ignore(websocket) for websocket in self.connection_map[key]]
        )
        self.connection_map.pop(key, None)

    '''
    Disconnects the single connection.
    '''
    async def disconnect(
        self,
        user_id: str,
        topic: str,
        complexity: str,
        websocket: WebSocket,
    ):
        key: Tuple[str, str, str] = (user_id, topic, complexity)
        if key not in self.connection_map:
            return

        self.connection_map[key].remove(websocket)
        if len(self.connection_map[key]) == 0:
            self.connection_map.pop(key, None)
        self._close_and_ignore(websocket)
    
    async def _close_and_ignore(self, websocket: WebSocket):
        try:
            await websocket.close()
        except Exception:
            pass

    '''
    Data is sent to through all connections associated with
    (user_id, topic, complexity)
    '''
    async def broadcast(
        self,
        user_id: str,
        topic: str,
        complexity: str,
        data: str,
    ):
        key: Tuple[str, str, str] = (user_id, topic, complexity)
        if key not in self.connection_map:
            return

        await asyncio.gather(
            *[websocket.send_json(data) for websocket in
                self.connection_map[(user_id, topic, complexity)]]
        )

manager = ConnectionManager()
