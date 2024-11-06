from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import questions

app = FastAPI(title="Question Service API")

origins = [
    "*",
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

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("QUESTION_SERVICE_SERVICE_PORT", 8000)),
        reload=(os.environ.get("BUILD_ENV", "prod") == "dev")
    )