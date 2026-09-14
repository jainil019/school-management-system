import os
from urllib.parse import quote_plus

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_HOST = os.getenv("MONGO_HOST")

if not MONGO_USER or not MONGO_PASSWORD or not MONGO_HOST:
    raise ValueError("MongoDB environment variables are missing.")

encoded_user = quote_plus(MONGO_USER)
encoded_password = quote_plus(MONGO_PASSWORD)

MONGO_URI = (
    f"mongodb+srv://{encoded_user}:{encoded_password}"
    f"@{MONGO_HOST}/school_management"
    f"?retryWrites=true&w=majority&appName=Cluster0"
)

client = MongoClient(
    MONGO_URI,
    tls=True,
    serverSelectionTimeoutMS=30000,
)

db = client["school_management"]

students_collection = db["students"]