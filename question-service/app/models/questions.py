from enum import Enum
from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

from models.object_id import PyObjectId

class ComplexityEnum(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class CategoryEnum(str, Enum):
    algorithms      = "Algorithms"
    arrays          = "Arrays"
    bitmanipulation = "Bit Manipulation"
    brainteaser     = "Brainteaser"
    databases       = "Databases"
    datastructures  = "Data Structures"
    recursion       = "Recursion"
    strings         = "Strings"

class QuestionModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

    id: Optional[PyObjectId] = Field(validation_alias="_id", default=None)
    title: str
    description: str
    categories: List[CategoryEnum]
    complexity: ComplexityEnum

class QuestionCollection(BaseModel):
    questions: List[QuestionModel]

class CreateQuestionModel(BaseModel):
    title: str
    description: str
    categories: List[CategoryEnum]
    complexity: ComplexityEnum
    
class UpdateQuestionModel(BaseModel):
    title: str
    description: str
    categories: List[CategoryEnum]
    complexity: ComplexityEnum
    
class MessageModel(BaseModel):
    message: str
