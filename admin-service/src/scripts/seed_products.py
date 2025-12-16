"""
Script para insertar productos iniciales en la base de datos
"""
from datetime import datetime
from uuid import uuid4
from src.config.database import Database
from src.repositories.product_repository import ProductRepository
from src.models.product import ProductInDB

def seed_products():
    """Insertar productos iniciales si no existen"""
    Database.connect()
    db = Database.get_database()
    product_repo = ProductRepository(db)
    
    # Productos iniciales del menú
    initial_products = [
        {
            "name": "Hamburguesa",
            "price": 10500,
            "category": "Plato Principal",
            "description": "Deliciosa hamburguesa con carne jugosa y vegetales frescos",
            "image_url": "/images/burguer_pic.jpg",
            "preparation_time": 15
        },
        {
            "name": "Papas fritas",
            "price": 12000,
            "category": "Acompañamiento",
            "description": "Papas fritas crujientes y doradas",
            "image_url": "/images/fries_pic.jpg",
            "preparation_time": 10
        },
        {
            "name": "Perro caliente",
            "price": 8000,
            "category": "Plato Principal",
            "description": "Perro caliente con salsas al gusto",
            "image_url": "/images/hotdog_pic.jpg",
            "preparation_time": 12
        },
        {
            "name": "Refresco",
            "price": 7000,
            "category": "Bebida",
            "description": "Refresco frío de tu sabor favorito",
            "image_url": "/images/drink_pic.jpg",
            "preparation_time": 2
        }
    ]
    
    created_count = 0
    
    for prod_data in initial_products:
        # Verificar si el producto ya existe
        existing = db.products.find_one({"name": prod_data["name"]})
        
        if not existing:
            now = datetime.utcnow()
            product = ProductInDB(
                id=str(uuid4()),
                name=prod_data["name"],
                price=prod_data["price"],
                category=prod_data["category"],
                description=prod_data["description"],
                image_url=prod_data["image_url"],
                preparation_time=prod_data["preparation_time"],
                is_active=True,
                created_at=now,
                updated_at=now
            )
            product_repo.create(product)
            print(f"✅ Producto creado: {prod_data['name']}")
            created_count += 1
        else:
            print(f"ℹ️  Producto ya existe: {prod_data['name']}")
    
    print(f"\n✨ {created_count} productos creados exitosamente")
    Database.close()

if __name__ == "__main__":
    seed_products()
