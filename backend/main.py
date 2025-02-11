import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config.db import client
from app.routes.user_routes import router as user_router
from app.routes.chat_routes import router as chat_router
from app.config.db import db
from app.services.auth_services import createAdmin

user_collection = db["user"]



@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    try:
        client.admin.command("ping")
        print("MongoDB connection successful!")

        createAdmin()

    except Exception as e:
        print("Error connecting to MongoDB:", e)
        raise e 
    
    yield 


app = FastAPI(lifespan=lifespan)

app.include_router(user_router, prefix="/api/auth", tags=["User"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
def welcome():
    return 'hi'
    
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
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