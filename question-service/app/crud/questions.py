from app.models.questions import CreateQuestionModel, UpdateQuestionModel, QuestionCollection, QuestionModel, MessageModel
from app.exceptions.questions_exceptions import DuplicateQuestionError, QuestionNotFoundError, BatchUploadFailedError
from bson import ObjectId
from dotenv import load_dotenv
import motor.motor_asyncio
from typing import List
import os

# Load env variables
load_dotenv()

DB_CLOUD_URI = os.getenv("DB_CLOUD_URI")

# Setup MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(DB_CLOUD_URI)
db = client.get_database("question_service")
question_collection = db.get_collection("questions")

async def create_question(question: CreateQuestionModel) -> QuestionModel:
    existing_question = await question_collection.find_one({"title": question.title})
    if existing_question:
        raise DuplicateQuestionError(f"Question with title '{question.title}' already exists.")
    new_question = await question_collection.insert_one(question.model_dump())
    return await question_collection.find_one({"_id": new_question.inserted_id})

async def get_all_questions() -> QuestionCollection:
    questions = await question_collection.find().to_list(1000)
    return QuestionCollection(questions=questions)

async def get_question_by_id(question_id: str) -> QuestionModel:
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    if existing_question is None:
        raise QuestionNotFoundError(f"Question with id '{question_id}' cannot be found.")
    return existing_question

async def delete_question(question_id: str) -> MessageModel:
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    if existing_question is None:
        raise QuestionNotFoundError(f"Question with id '{question_id}' cannot be found.")
    await question_collection.delete_one({"_id": ObjectId(question_id)})
    return {"message": f"Question with id {existing_question['_id']} and title '{existing_question['title']}' deleted."}

async def update_question_by_id(question_id: str, question_data: UpdateQuestionModel) -> QuestionModel:
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    
    if existing_question is None:
        raise QuestionNotFoundError(f"Question with id '{question_id}' cannot be found.")

    update_data = question_data.model_dump(exclude_unset=True)

    # Check if the new title already exists and belongs to another question
    if "title" in update_data and update_data["title"] != existing_question["title"]:
        existing_title = await question_collection.find_one({"title": update_data["title"]})
        if existing_title and str(existing_title["_id"]) != question_id:
            raise DuplicateQuestionError(f"Question with title '{existing_title["title"]}' already exists.")
    
    if not update_data:
        return existing_question

    await question_collection.update_one({"_id": ObjectId(question_id)}, {"$set": update_data})
    return await question_collection.find_one({"_id": ObjectId(question_id)})

async def batch_create_questions(questions: List[CreateQuestionModel]) -> MessageModel:
    new_questions = []
    for question in questions:
        existing_question = await question_collection.find_one({"title": question.title})
        if not existing_question:
            new_questions.append(question.model_dump())

    if not new_questions:
        raise BatchUploadFailedError("No questions were added successfully.")
    
    result = await question_collection.insert_many(new_questions)
    return {"message": f"{len(result.inserted_ids)} questions added successfully."}
