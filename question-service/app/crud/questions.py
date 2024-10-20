from bson import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv
import motor.motor_asyncio
import os
from typing import List

from exceptions.questions_exceptions import (
    DuplicateQuestionError,
    QuestionNotFoundError,
    BatchUploadFailedError,
    InvalidQuestionIdError,
)
from models.questions import (
    CategoryEnum,
    ComplexityEnum,
    CreateQuestionModel,
    UpdateQuestionModel,
    QuestionCollection,
    QuestionModel,
    MessageModel,
)

# Load env variables
load_dotenv()

DB_URI = os.getenv("DB_URI")

# Setup MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(DB_URI)
db = client.get_database("question_service")
question_collection = db.get_collection("questions")

async def create_question(question: CreateQuestionModel) -> QuestionModel:
    existing_question = await question_collection.find_one({"title": question.title})
    if existing_question:
        raise DuplicateQuestionError(question.title)
    new_question = await question_collection.insert_one(question.model_dump())
    return await question_collection.find_one({"_id": new_question.inserted_id})

async def get_all_questions(
    categories: List[CategoryEnum],
    complexity: ComplexityEnum,
    search: str
) -> QuestionCollection:
    query = {}
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if categories:
        query["categories"] = {"$all": categories}
    if complexity:
        query["complexity"] = complexity
    questions = await question_collection.find(query).to_list(1000)
    return QuestionCollection(questions=questions)

async def get_question_by_id(question_id: str) -> QuestionModel:
    object_id: ObjectId = _parse_oid(question_id)
    existing_question = await question_collection.find_one({"_id": object_id})
    if existing_question is None:
        raise QuestionNotFoundError(question_id)
    return QuestionModel.parse_obj(existing_question)

async def delete_question(question_id: str) -> MessageModel:
    existing_question: QuestionModel = await get_question_by_id(question_id)
    await question_collection.delete_one({"_id": _parse_oid(question_id)})
    return MessageModel.parse_obj({
        "message": f"Question with id {existing_question.id} and title '{existing_question.title}' deleted."
    })

async def update_question_by_id(
    question_id: str,
    question_data: UpdateQuestionModel
) -> QuestionModel: 
    existing_question: QuestionModel = await get_question_by_id(question_id)

    # Check if the new title already exists and belongs to another question
    if question_data.title != existing_question.title:
        existing_title = await question_collection.find_one({"title": question_data.title})
        if existing_title:
            raise DuplicateQuestionError(question_data.title)

    object_id: ObjectId = _parse_oid(question_id)
    await question_collection.update_one({"_id": object_id}, {"$set": question_data.model_dump()})
    return await get_question_by_id(question_id)

async def batch_create_questions(
    questions: List[CreateQuestionModel]
) -> MessageModel:
    new_questions = []
    for question in questions:
        existing_question = await question_collection.find_one({"title": question.title})
        if not existing_question:
            new_questions.append(question.model_dump())

    if not new_questions:
        raise BatchUploadFailedError()
    
    result = await question_collection.insert_many(new_questions)
    return MessageModel.parse_obj({
        "message": f"{len(result.inserted_ids)} questions added successfully."
    })

def get_question_categories() -> List[CategoryEnum]:
    return [category for category in CategoryEnum]

def get_question_complexities() -> List[ComplexityEnum]:
    return [complexity for complexity in ComplexityEnum]

'''
This section comprises of helper functions.
'''
def _parse_oid(oid: str) -> ObjectId:
    try:
        return ObjectId(oid)
    except InvalidId:
        raise InvalidQuestionIdError(oid)
