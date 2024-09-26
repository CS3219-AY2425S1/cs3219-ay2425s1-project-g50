from fastapi import APIRouter, HTTPException
from app.models.questions import CreateQuestionModel, UpdateQuestionModel, QuestionModel, QuestionCollection, MessageModel
from app.crud.questions import create_question, get_all_questions, get_question_by_id, delete_question, update_question_by_id

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
