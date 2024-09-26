from fastapi import APIRouter, HTTPException
from app.models.questions import CreateQuestionModel, UpdateQuestionModel, QuestionModel, QuestionCollection, MessageModel
from app.crud.questions import create_question, get_all_questions, get_question_by_id, delete_question, update_question_by_id
from typing import List
from app.crud.questions import batch_create_questions
router = APIRouter()

@router.post("/",
            response_description="Create new question",
            response_model=QuestionModel,
            responses={
                409: {
                    "content": {
                        "application/json": {
                            "example": {
                                "detail": "A question with this title already exists."
                            }
                        }
                    },
                }
                ,
            })
async def create(question: CreateQuestionModel):
    existing_question = await create_question(question)
    if existing_question is None:
        raise HTTPException(status_code=409, detail="Question with this title already exists.")
    return existing_question

@router.get("/", response_description="Get all questions", response_model=QuestionCollection)
async def get_all():
    return await get_all_questions()

@router.get("/{question_id}", response_description="Get question with specified id", response_model=QuestionModel)
async def get_question(question_id: str):
    existing_question: QuestionModel = await get_question_by_id(question_id)
    if existing_question is None:
        raise HTTPException(status_code=404, detail="Question with this id does not exist.")
    return existing_question

@router.delete("/{question_id}", response_description="Delete question with specified id", response_model=MessageModel)
async def delete(question_id: str):
    response = await delete_question(question_id)
    if response is None:
        raise HTTPException(status_code=404, detail="Question with this id does not exist.")
    return response

@router.put("/{question_id}", response_description="Update question with specified id", response_model=QuestionModel)
async def update_question(question_id: str, question_data: UpdateQuestionModel):
    updated_question = await update_question_by_id(question_id, question_data)
    if updated_question is None:
        raise HTTPException(status_code=404, detail="Question with this id does not exist.")
    
    return updated_question


@router.post("/batch-upload",
             response_description="Batch upload questions",
             response_model=MessageModel,
             responses={
                 400: {
                     "content": {
                         "application/json": {
                             "example": {
                                 "detail": "Invalid data format."
                             }
                         }
                     },
                 },
             })
async def batch_upload(questions: List[CreateQuestionModel]):
    result = await batch_create_questions(questions)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result