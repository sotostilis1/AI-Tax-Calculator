import bcrypt
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from app.models.user import User
from app.config.db import db
from app.config.jwt import create_access_token

# MongoDB collection
user_collection = db["user"]

def register_user(username: str, password: str, role: str = "user") -> dict:
    # Check if the username already exists
    if user_collection.find_one({"username": username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Create a new user with the specified or default role
    new_user = User(username=username, password=hashed_password, role=role)

    # Insert into MongoDB
    user_data = new_user.model_dump(by_alias=True)
    user_collection.insert_one(user_data)

    # Return the user without the password
    return {"id": new_user.id, "username": new_user.username, "role": new_user.role}


def authenticate_user(username: str, password: str):
    user = user_collection.find_one({"username": username})
    if not user:
        return None
    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return None
    return User(**user)

def login_user(username: str, password: str) -> JSONResponse:
    user = authenticate_user(username, password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Create JWT token
    access_token = create_access_token(data={"sub": user.username, "role": user.role, "user_id": user.id})

    response = JSONResponse(content={
        "message": 'Login successful',
        "id": user.id,
        "username": user.username,
        "role": user.role
    })

    # Set token as a cookie in the response
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=True,
        samesite="strict"
    )
    return response

def logout_user() -> JSONResponse:
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(
        key="access_token",  
        httponly=True,       
        secure=True,         
        samesite="strict"    
    )
    return response


