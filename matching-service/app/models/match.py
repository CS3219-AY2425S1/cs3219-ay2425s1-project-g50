from pydantic import BaseModel

# Define the MatchData model
class MatchData(BaseModel):
    user1: str
    user2: str
    topic: str
    difficulty: str