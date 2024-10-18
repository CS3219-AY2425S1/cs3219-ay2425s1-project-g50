from fastapi import APIRouter, HTTPException
from models.questions import CreateQuestionModel, UpdateQuestionModel, QuestionModel, QuestionCollection, MessageModel
from crud.questions import create_question, get_all_questions, get_question_by_id, delete_question, update_question_by_id, batch_create_questions
from exceptions.questions_exceptions import DuplicateQuestionError, QuestionNotFoundError, BatchUploadFailedError, InvalidQuestionIdError
from typing import List
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
    try:
        return await create_question(question)
    except DuplicateQuestionError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/", response_description="Get all questions", response_model=QuestionCollection)
async def get_all(category: str = None, complexity: str = None, search: str = None):
    return await get_all_questions(category, complexity, search)

@router.get("/{question_id}", response_description="Get question with specified id", response_model=QuestionModel)
async def get_question(question_id: str):
    try:
        return await get_question_by_id(question_id)
    except InvalidQuestionIdError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except QuestionNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/{question_id}", response_description="Delete question with specified id", response_model=MessageModel)
async def delete(question_id: str):
    try:
        response = await delete_question(question_id)
        return response
    except InvalidQuestionIdError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except QuestionNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.put("/{question_id}", response_description="Update question with specified id", response_model=QuestionModel)
async def update_question(question_id: str, question_data: UpdateQuestionModel):
    try:
        updated_question = await update_question_by_id(question_id, question_data)
        return updated_question
    except InvalidQuestionIdError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except QuestionNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except DuplicateQuestionError as e:
        raise HTTPException(status_code=409, detail=str(e))
    
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
    try:
        result = await batch_create_questions(questions)
        return result
    except BatchUploadFailedError as e:
        raise HTTPException(status_code=400, detail=str(e))