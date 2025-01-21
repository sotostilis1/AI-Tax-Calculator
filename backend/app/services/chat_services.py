import openai
from app.config.db import chat_collection, user_collection
from app.models.chat import Chat
from app.config.openai import OPENAI_API_KEY
from fastapi import HTTPException
from typing import List

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY


def get_chatgpt_response(messages: list) -> str:
    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=150,  

        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        raise RuntimeError(f"Error communicating with OpenAI API: {e}")


def save_chat(user_id: str, income: float, residency: str, tax_class: str, response: str) -> Chat:
    
    #Saves a chat record to the database.
    
    new_chat = Chat(
        user_id=user_id,
        income=income,
        residency=residency,
        tax_class=tax_class,
        response=response,
    )

    chat_collection.insert_one(new_chat.model_dump(by_alias=True))
    return new_chat


def handle_chat(user_id: str, income: float, residency: str, tax_class: str) -> dict:
    
    #Handles a new chat session, saves the request/response to the database.
    
    messages = [
        {"role": "system", "content": "You are a Tax Advisor based on 3 criteria: Annual income, Residency, Tax classification. Give the owed tax and give advice."},
        {"role": "user", "content": f"My annual income is: {income}€"},
        {"role": "user", "content": f"My residency is in: {residency}"},
        {"role": "user", "content": f"I am: {tax_class}"},
    ]

    response = get_chatgpt_response(messages)
    chat = save_chat(user_id, income, residency, tax_class, response)

    return {
        response
    }


def get_all_chats(user_id: str) -> List[dict]:
    
    #Fetches all chats for a specific user.
    
    chats = list(chat_collection.find({"user_id": user_id}))
    for chat in chats:
        chat["_id"] = str(chat["_id"])  # Convert ObjectId to string for JSON serialization
    return chats


def get_chats_by_username(username: str) -> List[dict]:
    
    #Fetches all chats for the current logged in user
    
    user = user_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail=f"User with username '{username}' not found")

    chats = list(chat_collection.find({"user_id": user["_id"]}))
    for chat in chats:
        chat["_id"] = str(chat["_id"])  # Convert ObjectId to string
    return chats
