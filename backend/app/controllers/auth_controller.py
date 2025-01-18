from app.services.auth_services import (
    register_user as register_user_service,
    login_user as login_user_service,
    logout_user as logout_user_service
)

def register_user(username: str, password: str) -> dict:
    return register_user_service(username, password)

def login_user(username: str, password: str) -> dict:
    return login_user_service(username, password)

def logout_user() -> dict:
    return logout_user_service()
