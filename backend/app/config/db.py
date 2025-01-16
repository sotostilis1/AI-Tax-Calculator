import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the environment variables")

# Initialize MongoDB client using the URI
client = MongoClient(MONGO_URI)

# database name
db_name = os.getenv("DATABASE_NAME", "mydatabase")
db = client[db_name]

# collections
user_collection = db["user"]
chat_collection = db["chat"]