from pymongo import MongoClient
from src.config.settings import settings

class Database:
    client: MongoClient = None
    
    @classmethod
    def connect(cls):
        cls.client = MongoClient(settings.mongodb_uri)
        print(f"✅ Connected to MongoDB: {settings.database_name}")
    
    @classmethod
    def get_database(cls):
        if cls.client is None:
            cls.connect()
        return cls.client[settings.database_name]
    
    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()
            print("✅ MongoDB connection closed")

def get_db():
    return Database.get_database()
