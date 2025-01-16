from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Ensure the key is set
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is not set in the environment variables")
