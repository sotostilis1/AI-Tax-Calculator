from app.services.chat_services import (
    handle_chat as handle_chat_service,
    get_all_chats as get_all_chats_service,
    get_chats_by_username as get_chats_by_username_service,
)

def handle_chat(user_id: str, income: float, residency: str, tax_class: str) -> dict:
    return handle_chat_service(user_id, income, residency, tax_class)

def get_all_chats(user_id: str) -> list:
    return get_all_chats_service(user_id)

def get_chats_by_username(username: str) -> list:
    return get_chats_by_username_service(username)
