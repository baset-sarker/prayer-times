from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# MongoDB connection URI from .env
MONGO_URI = os.getenv("MONGODB_URI")

try:
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    print("Connected to MongoDB successfully!")
    
    # Select database
    db = client["prayerDb"]
    
    # Select collection
    collection = db["providers"]
    
    # Retrieve data (fetch all documents)
    data = collection.find()
    
    # Check if data exists
    if collection.count_documents({}) == 0:
        print("No documents found in the collection.")
    else:
        for document in data:
            print(document)
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
finally:
    # Close the connection
    client.close()
    print("Connection closed.")
