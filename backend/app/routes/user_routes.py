from fastapi import APIRouter
from app.controllers.auth_controller import register_user , login_user, logout_user
from pydantic import BaseModel

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    password: str

#register a new account with role: user
@router.post("/register", response_model=dict)
async def register(request: RegisterRequest):
    return register_user(username=request.username, password=request.password)


class LoginRequest(BaseModel):
    username: str
    password: str

#login to an existing account
@router.post("/login", response_model=dict)
async def login(request: LoginRequest):
    return login_user(request.username, request.password)

#logout (delete cookie)
@router.post("/logout", response_model=dict)
async def logout():
    return logout_user()