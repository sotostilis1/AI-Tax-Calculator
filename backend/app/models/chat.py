from pydantic import BaseModel, Field
from uuid import uuid4

class Chat(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    user_id: str  # Reference to the user
    income: float  # income
    residency: str  # Residency information
    tax_class: str  # Tax classification
    response: str  # ChatGPT's response

    
