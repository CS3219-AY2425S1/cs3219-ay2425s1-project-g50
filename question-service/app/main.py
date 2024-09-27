from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import questions

app = FastAPI(title="Question Service API")

origins = [
    "http://34.124.183.106:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(questions.router, prefix="/questions", tags=["questions"])
