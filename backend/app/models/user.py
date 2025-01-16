from pydantic import BaseModel, Field
from typing import Literal
from uuid import uuid4

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")
    username: str
    password: str
    role: Literal["admin", "user"] = "user"  # Default to "user"

