from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
from src.models.product import ProductCreate, ProductUpdate, ProductResponse, ProductInDB, CategoryResponse
from src.repositories.product_repository import ProductRepository
from src.controllers.auth_controller import require_admin, get_current_user
from src.config.database import get_db
from src.messaging.rabbit_publisher import rabbitmq_publisher

router = APIRouter(prefix="/api/products", tags=["Products"])

def get_product_repository(db = Depends(get_db)):
    return ProductRepository(db)

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    current_admin = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Crear nuevo producto (solo admin)
    HU-004: Criterio 1 - Agregar producto con datos válidos
    """
    # Crear producto
    now = datetime.utcnow()
    product = ProductInDB(
        id=str(uuid4()),
        name=product_data.name,
        price=product_data.price,
        category=product_data.category,
        description=product_data.description,
        image_url=product_data.image_url,
        preparation_time=product_data.preparation_time,
        is_active=True,
        created_at=now,
        updated_at=now
    )
    
    product_repo.create(product)
    
    # Publicar evento en RabbitMQ
    rabbitmq_publisher.publish_product_event(
        "product.created",
        product.dict()
    )
    
    return ProductResponse(
        id=product.id,
        name=product.name,
        price=product.price,
        category=product.category,
        description=product.description,
        image_url=product.image_url,
        preparation_time=product.preparation_time,
        is_active=product.is_active,
        created_at=product.created_at,
        updated_at=product.updated_at
    )

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = Query(None),
    active_only: bool = Query(False),
    current_user = Depends(get_current_user),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Obtener lista de productos
    """
    products = product_repo.get_all(
        skip=skip,
        limit=limit,
        category=category,
        active_only=active_only
    )
    
    return [
        ProductResponse(
            id=product.id,
            name=product.name,
            price=product.price,
            category=product.category,
            description=product.description,
            image_url=product.image_url,
            preparation_time=product.preparation_time,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at
        )
        for product in products
    ]

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(
    current_user = Depends(get_current_user),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Obtener todas las categorías con conteo de productos
    """
    categories = product_repo.get_categories()
    return [CategoryResponse(**cat) for cat in categories]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: str,
    current_user = Depends(get_current_user),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Obtener producto por ID
    """
    product = product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    return ProductResponse(
        id=product.id,
        name=product.name,
        price=product.price,
        category=product.category,
        description=product.description,
        image_url=product.image_url,
        preparation_time=product.preparation_time,
        is_active=product.is_active,
        created_at=product.created_at,
        updated_at=product.updated_at
    )

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_admin = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Actualizar producto (solo admin)
    HU-004: Criterio 3 - Modificar precio
    """
    # Verificar que el producto existe
    existing_product = product_repo.get_by_id(product_id)
    if not existing_product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    # Preparar datos de actualización
    update_data = product_data.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron datos para actualizar"
        )
    
    # Actualizar
    updated_product = product_repo.update(product_id, update_data)
    
    # Publicar evento en RabbitMQ
    rabbitmq_publisher.publish_product_event(
        "product.updated",
        updated_product.dict()
    )
    
    return ProductResponse(
        id=updated_product.id,
        name=updated_product.name,
        price=updated_product.price,
        category=updated_product.category,
        description=updated_product.description,
        image_url=updated_product.image_url,
        preparation_time=updated_product.preparation_time,
        is_active=updated_product.is_active,
        created_at=updated_product.created_at,
        updated_at=updated_product.updated_at
    )

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    current_admin = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Eliminar producto (solo admin)
    HU-004: Criterio 4 - Eliminar producto
    """
    # Verificar que el producto existe
    product = product_repo.get_by_id(product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    
    # Eliminar
    product_repo.delete(product_id)
    
    # Publicar evento en RabbitMQ
    rabbitmq_publisher.publish_product_event(
        "product.deleted",
        {"id": product_id}
    )
    
    return None

@router.delete("/categories/{category_name}", status_code=status.HTTP_400_BAD_REQUEST)
async def delete_category(
    category_name: str,
    current_admin = Depends(require_admin),
    product_repo: ProductRepository = Depends(get_product_repository)
):
    """
    Intentar eliminar categoría (bloqueado si tiene productos)
    HU-004: Criterio 5 - Bloquear eliminación de categoría con productos
    """
    # Contar productos en la categoría
    count = product_repo.count_by_category(category_name)
    
    if count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar la categoría. Primero mueva o elimine los {count} productos asociados."
        )
    
    return {"message": "Categoría eliminada exitosamente"}
