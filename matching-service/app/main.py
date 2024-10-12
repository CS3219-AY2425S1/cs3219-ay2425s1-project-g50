from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# from routers import questions
from routers import match

app = FastAPI(title="Matching Service API")

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(match.router, prefix="/match", tags=["match"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        reload=(os.environ.get("BUILD_ENV", "dev") == "dev")
    )