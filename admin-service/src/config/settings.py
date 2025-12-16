from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    mongodb_uri: str = "mongodb://localhost:27017/"
    database_name: str = "restaurant_admin"
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 8
    cloudamqp_url: str = "amqp://guest:guest@localhost:5672/"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
