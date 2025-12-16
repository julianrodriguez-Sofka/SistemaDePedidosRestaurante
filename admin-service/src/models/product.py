from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    price: float = Field(..., gt=0, description="Precio debe ser mayor a 0")
    category: str = Field(..., min_length=2, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = None
    preparation_time: int = Field(5, ge=1, le=120, description="Tiempo en minutos")

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=2, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    image_url: Optional[str] = None
    preparation_time: Optional[int] = Field(None, ge=1, le=120)
    is_active: Optional[bool] = None

class ProductInDB(ProductBase):
    id: str
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class ProductResponse(ProductBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

class CategoryResponse(BaseModel):
    name: str
    product_count: int
