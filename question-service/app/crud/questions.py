from app.models.questions import CreateQuestionModel, UpdateQuestionModel, QuestionCollection, QuestionModel
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

async def create_question(question: CreateQuestionModel):
    existing_question = await question_collection.find_one({"title": question.title})
    if existing_question:
        return None
    new_question = await question_collection.insert_one(question.model_dump())
    return await question_collection.find_one({"_id": new_question.inserted_id})

async def get_all_questions(category: str, complexity: str, search: str) -> QuestionCollection:
    query = {}
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if category:
        query["category"] = {"$regex": category, "$options": "i"}
    if complexity:
        query["complexity"] = complexity
    questions = await question_collection.find(query).to_list(1000)

    return QuestionCollection(questions=questions)

async def get_question_by_id(question_id: str) -> QuestionModel:
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    return existing_question

async def delete_question(question_id: str):
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    if existing_question is None:
        return None
    await question_collection.delete_one({"_id": ObjectId(question_id)})
    return {"message": f"Question with id {existing_question['_id']} and title '{existing_question['title']}' deleted."}

async def update_question_by_id(question_id: str, question_data: UpdateQuestionModel):
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    
    if existing_question is None:
        return None

    update_data = question_data.model_dump(exclude_unset=True)

    # Check if the new title already exists and belongs to another question
    if "title" in update_data and update_data["title"] != existing_question["title"]:
        existing_title = await question_collection.find_one({"title": update_data["title"]})
        if existing_title and str(existing_title["_id"]) != question_id:
            return "duplicate_title"
    
    if not update_data:
        return existing_question

    await question_collection.update_one({"_id": ObjectId(question_id)}, {"$set": update_data})
    return await question_collection.find_one({"_id": ObjectId(question_id)})

async def batch_create_questions(questions: List[CreateQuestionModel]):
    new_questions = []
    for question in questions:
        existing_question = await question_collection.find_one({"title": question.title})
        if not existing_question:
            # Convert Pydantic model to dictionary
            new_questions.append(question.model_dump())

    if not new_questions:
        return {"error": "No new questions to add."}

    result = await question_collection.insert_many(new_questions)
    
    return {"message": f"{len(result.inserted_ids)} questions added successfully."}
