from fastapi import APIRouter, Depends ,HTTPException
from pydantic import BaseModel
from app.controllers.chat_controller import handle_chat, get_all_chats, get_chats_by_username
from app.middlewares.auth_middleware import role_required, get_current_user_id
from app.config.access import ALLOWED_ROLES
router = APIRouter()


class ChatRequest(BaseModel):
    income: float  # User's salary
    residency: str  # User's residency
    tax_class: str  # User's tax classification

#create a new chat and save request and response in db
#admins and users are allowed to use it
@router.post("/create", dependencies=[Depends(role_required(ALLOWED_ROLES["everyone"]))])
async def chat_with_gpt(request: ChatRequest,
                        user_id: str = Depends(get_current_user_id)):
    try:
        # Call the controller function with extracted data
        response = handle_chat(
            user_id=user_id,
            income=request.income,
            residency=request.residency,
            tax_class=request.tax_class
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

#get all chats for the user that is currently logged in
@router.get("/")
async def fetch_all_chats(user_id: str = Depends(get_current_user_id)):
    try:
        return get_all_chats(user_id)
    except HTTPException as e:
        raise e
    

#get all chats of a specific user (by username)
#only admins allowed to use it
@router.get("/usr/{username}", dependencies=[Depends(role_required(ALLOWED_ROLES["admin"]))])
async def fetch_chats_by_username(username: str):
    try:
        return get_chats_by_username(username)
    except HTTPException as e:
        raise e






