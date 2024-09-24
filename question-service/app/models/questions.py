from enum import Enum
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from .object_id import PyObjectId

class ComplexityEnum(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuestionModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

    id: Optional[PyObjectId] = Field(validation_alias="_id", default=None)
    title: str
    description: str
    category: str
    complexity: ComplexityEnum

class QuestionCollection(BaseModel):
    questions: List[QuestionModel]
    
class UpdateQuestionModel(BaseModel):
    title: str
    description: str
    category: str
    complexity: ComplexityEnum
    
class MessageModel(BaseModel):
    message: str
