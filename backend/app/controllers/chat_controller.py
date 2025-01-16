import openai
from app.config.db import chat_collection
from app.models.chat import Chat
from app.config.openai import OPENAI_API_KEY
from app.config.db import db

# Set the OpenAI API key
openai.api_key = OPENAI_API_KEY

user_collection = db["user"]
chat_collection = db["chat"]

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
    

def handle_chat(user_id: str, income: float, residency: str, tax_class: str) -> dict:
    # Construct messages for ChatGPT
    messages = [
        {"role": "system", "content": "You are a Tax Calculator based on 3 criteria: Annual income, Residency, Tax classification. Answer only with the owed amount."},
        {"role": "user", "content": f"My annual income is: {income}€"},
        {"role": "user", "content": f"My residency is in: {residency}"},
        {"role": "user", "content": f"I am: {tax_class}"}
    ]

    # Get response from ChatGPT
    response = get_chatgpt_response(messages)

    # Save the chat to the database
    chat = save_chat(
        user_id=user_id,
        income=income,
        residency=residency,
        tax_class=tax_class,
        response=response
    )

    return {
        "message": "Chat saved successfully",
        "chat": chat
    }

def save_chat(user_id: str, income: float, residency: str, tax_class: str, response: str) -> Chat:
    # Create a new chat record
    new_chat = Chat(
        user_id=user_id,
        income=income,
        residency=residency,
        tax_class=tax_class,
        response=response
    )

    # Insert the chat into the database
    chat_data = new_chat.model_dump(by_alias=True)
    chat_collection.insert_one(chat_data)

    return new_chat


from app.config.db import db
from fastapi import HTTPException
from typing import List



def get_all_chats(user_id: str) -> List[dict]:
    try:
        # Query MongoDB for chats belonging to the user
        chats = list(chat_collection.find({"user_id": user_id}))
        # Optionally remove sensitive fields like `_id`
        for chat in chats:
            chat["_id"] = str(chat["_id"])  # Convert ObjectId to string if necessary
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chats: {str(e)}")



def get_chats_by_username(username: str) -> List[dict]:
    try:
        # Find the user by username
        user = user_collection.find_one({"username": username})
        if not user:
            raise HTTPException(
                status_code=404, detail=f"User with username '{username}' not found"
            )

        # Fetch chats using the user's ID
        user_id = user["_id"]
        chats = list(chat_collection.find({"user_id": user_id}))

        # Convert ObjectId to string for JSON serialization
        for chat in chats:
            chat["_id"] = str(chat["_id"])

        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chats: {str(e)}")
