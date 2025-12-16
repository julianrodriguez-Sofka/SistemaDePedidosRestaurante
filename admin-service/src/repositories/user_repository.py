from pymongo.database import Database
from pymongo.collection import Collection
from typing import Optional, List
from src.models.user import UserInDB
from datetime import datetime
from bson import ObjectId

class UserRepository:
    def __init__(self, db: Database):
        self.collection: Collection = db["users"]
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Crear índices únicos"""
        self.collection.create_index("email", unique=True)
    
    def create(self, user: UserInDB) -> UserInDB:
        """Crear nuevo usuario"""
        user_dict = user.dict()
        user_dict["_id"] = user_dict.pop("id")
        result = self.collection.insert_one(user_dict)
        return user
    
    def get_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Obtener usuario por ID"""
        doc = self.collection.find_one({"_id": user_id})
        if doc:
            doc["id"] = doc.pop("_id")
            return UserInDB(**doc)
        return None
    
    def get_by_email(self, email: str) -> Optional[UserInDB]:
        """Obtener usuario por email"""
        doc = self.collection.find_one({"email": email})
        if doc:
            doc["id"] = doc.pop("_id")
            return UserInDB(**doc)
        return None
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[UserInDB]:
        """Obtener todos los usuarios"""
        cursor = self.collection.find().skip(skip).limit(limit)
        users = []
        for doc in cursor:
            doc["id"] = doc.pop("_id")
            users.append(UserInDB(**doc))
        return users
    
    def update(self, user_id: str, update_data: dict) -> Optional[UserInDB]:
        """Actualizar usuario"""
        update_data["updated_at"] = datetime.utcnow()
        result = self.collection.find_one_and_update(
            {"_id": user_id},
            {"$set": update_data},
            return_document=True
        )
        if result:
            result["id"] = result.pop("_id")
            return UserInDB(**result)
        return None
    
    def delete(self, user_id: str) -> bool:
        """Eliminar usuario (soft delete)"""
        result = self.collection.update_one(
            {"_id": user_id},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0
