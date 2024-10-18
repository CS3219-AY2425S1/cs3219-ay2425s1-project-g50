from pydantic import BaseModel

class MatchModel(BaseModel):
    user1: str
    user2: str
    topic: str
    difficulty: str

class MessageModel(BaseModel):
    message: str
