from fastapi import HTTPException, status, Request
from app.config.jwt import verify_access_token
from app.config.db import db
from fastapi import HTTPException, status



user_collection = db["user"]

def role_required(allowed_roles: list):
    def _role_required(request: Request):
        # Extract token from cookies
        token = request.cookies.get("access_token")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token not found"
            )

        # Handle Bearer prefix
        if token.startswith("Bearer "):
            token = token.split("Bearer ")[1]

        # Verify token
        payload = verify_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        # Extract and validate role
        user_role = payload.get("role")
        if not user_role or user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have access to this resource"
            )

        # Check if the user exists in the database
        user = user_collection.find_one({"_id": payload.get("user_id")})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return {"user_id": payload.get("user_id"), "role": user_role}
    return _role_required



#extract the user_id from the jwt token
def get_current_user_id(request: Request) -> str:
    token = request.cookies.get("access_token")
    print(f"Extracted Token: {token}")  # Debug
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token not found")

    if token.startswith("Bearer "):
        token = token.split("Bearer ")[1]
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token")
    
    # Extract user_id
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing user_id in token"
        )
    return user_id


