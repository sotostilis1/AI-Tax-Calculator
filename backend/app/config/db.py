import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the environment variables")

# Initialize MongoDB client using the URI
client = MongoClient(MONGO_URI)

# database name
db_name = DATABASE_NAME
db = client[db_name]

# collections
user_collection = db["user"]
chat_collection = db["chat"]