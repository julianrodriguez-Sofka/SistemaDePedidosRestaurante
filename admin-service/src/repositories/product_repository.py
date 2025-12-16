from pymongo.database import Database
from pymongo.collection import Collection
from typing import Optional, List
from src.models.product import ProductInDB
from datetime import datetime

class ProductRepository:
    def __init__(self, db: Database):
        self.collection: Collection = db["products"]
        self._ensure_indexes()
    
    def _ensure_indexes(self):
        """Crear índices"""
        self.collection.create_index("category")
        self.collection.create_index("is_active")
    
    def create(self, product: ProductInDB) -> ProductInDB:
        """Crear nuevo producto"""
        product_dict = product.dict()
        product_dict["_id"] = product_dict.pop("id")
        self.collection.insert_one(product_dict)
        return product
    
    def get_by_id(self, product_id: str) -> Optional[ProductInDB]:
        """Obtener producto por ID"""
        doc = self.collection.find_one({"_id": product_id})
        if doc:
            doc["id"] = doc.pop("_id")
            return ProductInDB(**doc)
        return None
    
    def get_all(self, skip: int = 0, limit: int = 100, category: Optional[str] = None, active_only: bool = False) -> List[ProductInDB]:
        """Obtener todos los productos"""
        query = {}
        if category:
            query["category"] = category
        if active_only:
            query["is_active"] = True
        
        cursor = self.collection.find(query).skip(skip).limit(limit)
        products = []
        for doc in cursor:
            doc["id"] = doc.pop("_id")
            products.append(ProductInDB(**doc))
        return products
    
    def update(self, product_id: str, update_data: dict) -> Optional[ProductInDB]:
        """Actualizar producto"""
        update_data["updated_at"] = datetime.utcnow()
        result = self.collection.find_one_and_update(
            {"_id": product_id},
            {"$set": update_data},
            return_document=True
        )
        if result:
            result["id"] = result.pop("_id")
            return ProductInDB(**result)
        return None
    
    def delete(self, product_id: str) -> bool:
        """Eliminar producto (hard delete)"""
        result = self.collection.delete_one({"_id": product_id})
        return result.deleted_count > 0
    
    def count_by_category(self, category: str) -> int:
        """Contar productos por categoría"""
        return self.collection.count_documents({"category": category})
    
    def get_categories(self) -> List[dict]:
        """Obtener todas las categorías con conteo"""
        pipeline = [
            {"$group": {
                "_id": "$category",
                "count": {"$sum": 1}
            }},
            {"$project": {
                "name": "$_id",
                "product_count": "$count",
                "_id": 0
            }}
        ]
        return list(self.collection.aggregate(pipeline))
