from app.models.questions import QuestionCollection, QuestionModel
from bson import ObjectId
from dotenv import load_dotenv
import motor.motor_asyncio
import os

# Load env variables
load_dotenv()

DB_CLOUD_URI = os.getenv("DB_CLOUD_URI")

# Setup MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(DB_CLOUD_URI)
db = client.get_database("question_service")
question_collection = db.get_collection("questions")

async def create_question(question: QuestionModel):
    existing_question = await question_collection.find_one({"title": question.title})
    if existing_question:
        return None
    new_question = await question_collection.insert_one(question.model_dump())
    return await question_collection.find_one({"_id": new_question.inserted_id})

async def get_all_questions() -> QuestionCollection:
    questions = await question_collection.find().to_list(1000)
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

async def update_question_by_id(question_id: str, question_data: QuestionModel):
    existing_question = await question_collection.find_one({"_id": ObjectId(question_id)})
    if existing_question is None:
        return None
    
    updated_data = {
        "$set": {
            "title": question_data.title,
            "description": question_data.description,
            "category": question_data.category,
            "complexity": question_data.complexity
        }
    }
    
    await question_collection.update_one({"_id": ObjectId(question_id)}, updated_data)
    
    return await question_collection.find_one({"_id": ObjectId(question_id)})
