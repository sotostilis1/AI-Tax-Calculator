import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager
from app.config.db import client
from app.routes.user_routes import router as user_router
from app.routes.chat_routes import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    try:
        client.admin.command("ping")
        print("MongoDB connection successful!")
    except Exception as e:
        print("Error connecting to MongoDB:", e)
        raise e  # Stop app startup if the connection fails
    
    yield  # Allow the application to run

    # Shutdown logic (if needed)
    print("Shutting down application...")

app = FastAPI(lifespan=lifespan)

app.include_router(user_router, prefix="/auth", tags=["User"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])




origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)