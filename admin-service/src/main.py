from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.config.database import Database
from src.messaging.rabbit_publisher import rabbitmq_publisher
from src.controllers import auth_controller, user_controller, product_controller

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Eventos de inicio y cierre de la aplicación"""
    # Startup
    print("🚀 Starting Admin Service...")
    
    try:
        print("Connecting to MongoDB...")
        Database.connect()
        print("MongoDB connected successfully")
        
        print("Connecting to RabbitMQ...")
        rabbitmq_publisher.connect()
        print("RabbitMQ connected successfully")
        
        # Crear usuario admin por defecto si no existe
        from src.repositories.user_repository import UserRepository
        from src.services.auth_service import auth_service
        from src.models.user import UserInDB, UserRole
        from datetime import datetime
        from uuid import uuid4
        
        print("Getting database instance...")
        db = Database.get_database()
        print("Creating user repository...")
        user_repo = UserRepository(db)
        
        admin_email = "admin@restaurant.com"
        print(f"Checking for admin user: {admin_email}")
        admin_user = user_repo.get_by_email(admin_email)
        
        if not admin_user:
            print("Creating default admin user...")
            admin = UserInDB(
                id=str(uuid4()),
                name="Administrador",
                email=admin_email,
                password_hash=auth_service.hash_password("admin123"),
                role=UserRole.ADMIN,
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            user_repo.create(admin)
            print(f"✅ Admin user created: {admin_email} / admin123")
        else:
            print(f"✅ Admin user already exists: {admin_email}")
        
        print("✅ Admin Service started successfully!")
    except Exception as e:
        print(f"❌ Error during startup: {str(e)}")
        import traceback
        traceback.print_exc()
        raise
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Admin Service...")
    Database.close()
    rabbitmq_publisher.close()

app = FastAPI(
    title="Restaurant Admin Service",
    description="Servicio de administración para gestión de usuarios y productos",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_controller.router)
app.include_router(user_controller.router)
app.include_router(product_controller.router)

@app.get("/")
async def root():
    return {
        "service": "Restaurant Admin Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
