from pymongo import MongoClient
from dotenv import load_dotenv
import os
# Load environment variables
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = None
db = None

def check_connection():
    global client
    """Check if MongoDB client is still connected."""
    try:
        # Try to execute a simple command (ping the database)
        client.admin.command('ping')
        return True
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        return False

def get_prayer_and_provider_data():
    global db
    prayer_data = db.prayers.find_one()
    provider_data = list(db.providers.find({}))
    
    if not prayer_data or not provider_data:
        return None, None
    
    prayers = {
        "fajr": prayer_data.get("fajr"),
        "sunrise": prayer_data.get("sunrise"),
        "dhuhr": prayer_data.get("duhr"),
        "jummah": prayer_data.get("jummah"),
        "asr": prayer_data.get("asr"),
        "magrib": prayer_data.get("magrib"),
        "isha": prayer_data.get("isha"),
        "tarawih": prayer_data.get("tarawih")
    }

    notice = {
        "head_line": prayer_data.get("notice_head_line", ""),
        "first_line": prayer_data.get("notice_first_line", "Eid Prayer"),
        "second_line": prayer_data.get("notice_second_line", "Please arrive 10 minutes early")
    }

    notice_default = {
        "head_line": "Dua for entering the masjid",
        "first_line": "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        "second_line": "O Allah! open for me the doors of your mercy"
    }

    hadis = {
        "hadis1": prayer_data.get("hadis1"),
        "hadis2": prayer_data.get("hadis2"),
        "hadis3": prayer_data.get("hadis3"),
        "hadis4": prayer_data.get("hadis4"),
        "hadis5": prayer_data.get("hadis5")
    }

    wifi_providers = [
        # {"name": provider.get("name"), "password": provider.get("password_encrypted", "")}
        {"name": provider.get("name"), "password": provider.get("password", "")}
        for provider in provider_data
    ]
    
    response_data = {
        "prayers": prayers,
        "notice": notice,
        "notice_default": notice_default,
        "hadis": hadis,
        "wifi_providers": wifi_providers
    }
    return response_data


def get_prayer_time_data():
    global client, db
    data = None
    try:
        if db is None or client is None:
            client = MongoClient(MONGODB_URI)
            db = client.get_database()
        if not check_connection():
            print("Reconnecting to MongoDB...")
            client = MongoClient(MONGODB_URI)  # Reconnect if disconnected
            db = client.get_database()  # Reinitiali"jummah": prayer_data.get("jummah")ze the database object
        data = get_prayer_and_provider_data()
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
    return data


if __name__ == "__main__":
    data = get_prayer_time_data()
    print(data)
