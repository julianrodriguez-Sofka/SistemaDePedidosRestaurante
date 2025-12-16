from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import uuid4
from datetime import datetime
from src.models.user import UserCreate, UserUpdate, UserResponse, UserInDB
from src.repositories.user_repository import UserRepository
from src.services.auth_service import auth_service
from src.controllers.auth_controller import require_admin, get_user_repository

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    current_admin: UserInDB = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """
    Crear nuevo usuario (solo admin)
    HU-005: Criterio 1
    """
    # Validar email único
    existing_user = user_repo.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email ya registrado"
        )
    
    # Crear usuario
    now = datetime.utcnow()
    user = UserInDB(
        id=str(uuid4()),
        name=user_data.name,
        email=user_data.email,
        password_hash=auth_service.hash_password(user_data.password),
        role=user_data.role,
        is_active=True,
        created_at=now,
        updated_at=now
    )
    
    user_repo.create(user)
    
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_admin: UserInDB = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """
    Obtener lista de usuarios (solo admin)
    """
    users = user_repo.get_all(skip=skip, limit=limit)
    return [
        UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
        for user in users
    ]

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_admin: UserInDB = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """
    Obtener usuario por ID (solo admin)
    """
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_admin: UserInDB = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """
    Actualizar usuario (solo admin)
    HU-005: Modificación de usuarios
    """
    # Verificar que el usuario existe
    existing_user = user_repo.get_by_id(user_id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Preparar datos de actualización (solo campos no None)
    update_data = user_data.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se proporcionaron datos para actualizar"
        )
    
    # Actualizar
    updated_user = user_repo.update(user_id, update_data)
    
    return UserResponse(
        id=updated_user.id,
        name=updated_user.name,
        email=updated_user.email,
        role=updated_user.role,
        is_active=updated_user.is_active,
        created_at=updated_user.created_at,
        updated_at=updated_user.updated_at
    )

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_user(
    user_id: str,
    current_admin: UserInDB = Depends(require_admin),
    user_repo: UserRepository = Depends(get_user_repository)
):
    """
    Desactivar usuario (soft delete) (solo admin)
    HU-005: Desactivación de usuarios
    """
    # Verificar que el usuario existe
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # No permitir desactivar al mismo admin
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivar tu propia cuenta"
        )
    
    # Desactivar
    user_repo.delete(user_id)
    return None
