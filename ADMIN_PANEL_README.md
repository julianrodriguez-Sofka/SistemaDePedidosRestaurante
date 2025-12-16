# Panel Administrativo - Sistema de Pedidos

## 📋 Nuevas Funcionalidades Implementadas

### 1. **Panel Administrativo (HU-004 y HU-005)**

Se ha implementado un sistema completo de administración con las siguientes características:

#### **Admin Service (Backend)**
- **Puerto:** 8001
- **Tecnología:** FastAPI + MongoDB
- **Características:**
  - ✅ Autenticación JWT
  - ✅ CRUD de usuarios (meseros y cocineros)
  - ✅ CRUD de productos con validaciones
  - ✅ Publicación de eventos a RabbitMQ
  - ✅ Gestión de categorías

#### **Admin Frontend**
- **Puerto:** 5174
- **Tecnología:** React 19 + TypeScript + TailwindCSS v4
- **Características:**
  - ✅ Login administrativo
  - ✅ Gestión de usuarios
  - ✅ Gestión de productos
  - ✅ Dashboard centralizado

### 2. **Sistema de Autenticación Integrado**

#### **Login Mejorado**
El frontend principal ahora incluye:
- Selección de rol (Chef / Waiter)
- Autenticación con email y contraseña
- Validación de permisos por rol
- Sesión persistente con JWT

#### **Flujo de Autenticación:**
```
1. Usuario selecciona rol (Chef/Waiter)
2. Ingresa email y contraseña
3. Sistema valida contra admin-service
4. Se verifica que el rol coincida
5. Se almacena token JWT
6. Redirección a la interfaz correspondiente
```

## 🚀 Cómo Iniciar el Proyecto

### **Prerrequisitos**
- Docker y Docker Compose instalados
- Puertos disponibles: 5672, 15672, 27017, 3000, 3002, 4000, 5173, 5174, 8000, 8001

### **Paso 1: Levantar los servicios**
```bash
cd SistemaDePedidosRestaurante
docker-compose up --build
```

### **Paso 2: Acceder a las aplicaciones**

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Panel Admin** | http://localhost:5174 | Gestión de usuarios y productos |
| **App Meseros/Cocina** | http://localhost:5173 | Toma de pedidos y cocina |
| **Admin API** | http://localhost:8001 | Backend administrativo |
| **Python MS** | http://localhost:8000 | Microservicio de pedidos |
| **Node MS** | http://localhost:3002 | Microservicio de cocina |
| **RabbitMQ** | http://localhost:15672 | Gestión de colas |
| **MongoDB** | mongodb://localhost:27017 | Base de datos |

## 👤 Usuarios de Prueba

### **Administrador**
- **Email:** admin@restaurant.com
- **Contraseña:** admin123
- **Acceso:** Panel Administrativo (puerto 5174)

### **Crear Usuarios**
Una vez dentro del panel administrativo, puedes crear usuarios con roles:
- **Mesero:** Para tomar pedidos
- **Cocinero:** Para gestionar la cocina

## 📦 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATIONS                      │
├──────────────────────────┬────────────────────────────────────┤
│  Admin Frontend (5174)   │  Orders Frontend (5173)            │
│  - Gestión Usuarios      │  - Login Chef/Waiter               │
│  - Gestión Productos     │  - Toma de Pedidos                 │
│  - Dashboard             │  - Vista Cocina                    │
└──────────┬───────────────┴──────────────┬─────────────────────┘
           │                              │
           │                              │
┌──────────▼───────────────┐   ┌──────────▼─────────────────────┐
│  Admin Service (8001)    │   │  API Gateway (3000)             │
│  - FastAPI + MongoDB     │   │  - Express                      │
│  - JWT Authentication    │   │  - Proxy & Load Balancing       │
│  - CRUD APIs             │   └──────────┬─────────────────────┘
└──────────┬───────────────┘              │
           │                    ┌─────────┴──────────┐
           │                    │                    │
           │         ┌──────────▼─────────┐  ┌──────▼──────────┐
           │         │ Python MS (8000)   │  │ Node MS (3002)  │
           │         │ - FastAPI          │  │ - Express       │
           │         │ - Order Creation   │  │ - Kitchen Mgmt  │
           │         └──────────┬─────────┘  └──────┬──────────┘
           │                    │                    │
           │         ┌──────────▼────────────────────▼──────────┐
           └────────►│        RabbitMQ (5672)                   │
                     │        - Message Broker                  │
                     │        - Event Distribution              │
                     └──────────────────────────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │  MongoDB (27017)    │
                     │  - restaurant_admin │
                     │  - orders_db        │
                     └─────────────────────┘
```

## 🔐 Seguridad Implementada

### **JWT Authentication**
- Tokens con expiración de 8 horas
- Validación de roles en cada request
- Almacenamiento seguro en localStorage

### **Validaciones de Negocio**
- ✅ Precio > 0 (HU-004 Criterio 2)
- ✅ Campos requeridos validados
- ✅ Email único por usuario
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de roles en login

## 📝 APIs Principales

### **Admin Service**

#### **Autenticación**
```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=secret123
```

#### **Usuarios**
```http
# Crear usuario
POST /api/users/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@restaurant.com",
  "password": "secret123",
  "role": "mesero"
}

# Listar usuarios
GET /api/users/
Authorization: Bearer {token}

# Actualizar usuario
PATCH /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Juan Pérez Updated",
  "is_active": false
}
```

#### **Productos**
```http
# Crear producto
POST /api/products/
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Hamburguesa Clásica",
  "price": 12.50,
  "category": "Platos Fuertes",
  "description": "Deliciosa hamburguesa",
  "preparation_time": 10
}

# Listar productos
GET /api/products/
Authorization: Bearer {token}

# Actualizar producto (HU-004 Criterio 3)
PATCH /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 15.00
}

# Eliminar producto
DELETE /api/products/{id}
Authorization: Bearer {token}
```

## 🔄 Eventos RabbitMQ

El admin-service publica eventos cuando se modifican productos:

- `product.created` - Nuevo producto creado
- `product.updated` - Producto actualizado (ej. cambio de precio)
- `product.deleted` - Producto eliminado

Estos eventos permiten que otros servicios se sincronicen automáticamente.

## 🧪 Criterios de Aceptación Cumplidos

### **HU-004: Gestión de Catálogo de Productos**
- ✅ **Criterio 1:** Agregar producto con datos válidos (HTTP 201)
- ✅ **Criterio 2:** Validación de precio positivo (HTTP 400)
- ✅ **Criterio 3:** Modificar precio y propagar cambios (HTTP 200)

### **HU-005: Gestión de Usuarios**
- ✅ Crear usuarios con roles (mesero/cocinero)
- ✅ Modificar información de usuarios
- ✅ Desactivar/activar usuarios
- ✅ Validación de email único
- ✅ Autenticación segura con JWT

## 🛠️ Tecnologías Utilizadas

### **Backend**
- FastAPI 0.104.1
- PyMongo 4.6.0
- Python Jose (JWT)
- Passlib (Bcrypt)
- Pika (RabbitMQ)

### **Frontend**
- React 19.2.0
- TypeScript 5.9.3
- TailwindCSS 4.1.17
- React Router 7.9.6
- Vite 7.2.4

### **Infraestructura**
- MongoDB 6
- RabbitMQ 3
- Docker & Docker Compose

## 📚 Estructura del Proyecto

```
SistemaDePedidosRestaurante/
├── admin-service/           # Backend administrativo
│   ├── src/
│   │   ├── main.py
│   │   ├── config/          # Configuración y DB
│   │   ├── models/          # Modelos Pydantic
│   │   ├── controllers/     # Endpoints API
│   │   ├── services/        # Lógica de negocio
│   │   ├── repositories/    # Acceso a datos
│   │   └── messaging/       # RabbitMQ
│   ├── Dockerfile
│   └── requirements.txt
│
├── admin-frontend/          # Frontend administrativo
│   ├── src/
│   │   ├── pages/           # Login, Dashboard, Users, Products
│   │   ├── components/      # Componentes UI
│   │   ├── services/        # API calls
│   │   ├── types/           # TypeScript types
│   │   └── lib/             # Utilidades
│   ├── Dockerfile
│   └── package.json
│
├── orders-producer-frontend/  # Frontend principal (MODIFICADO)
│   └── src/
│       ├── contexts/
│       │   └── AuthContext.tsx  # ✨ Actualizado con JWT
│       └── pages/
│           └── LoginPage.tsx    # ✨ Login con autenticación
│
└── docker-compose.yml       # ✨ Actualizado con nuevos servicios
```

## 🎯 Próximos Pasos

1. **Sincronización de Productos:** Consumir eventos de RabbitMQ en el frontend de meseros
2. **Reportes:** Dashboard con estadísticas de pedidos
3. **Imágenes de Productos:** Upload de imágenes a S3/local storage
4. **Roles Avanzados:** Permisos granulares por funcionalidad
5. **Auditoría:** Logs de todas las operaciones administrativas

## 🐛 Troubleshooting

### **Error: Cannot connect to MongoDB**
```bash
# Verificar que MongoDB esté corriendo
docker ps | grep mongo

# Ver logs de MongoDB
docker logs mongo
```

### **Error: RabbitMQ connection refused**
```bash
# Verificar RabbitMQ
docker ps | grep rabbitmq

# Acceder a la UI de gestión
http://localhost:15672
# user: guest, pass: guest
```

### **Error: Port already in use**
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :5174  # Windows
lsof -i :5174                 # Linux/Mac

# Detener contenedores anteriores
docker-compose down
```

## 📞 Soporte

Para cualquier duda o problema:
1. Revisar los logs: `docker-compose logs -f [service-name]`
2. Verificar que todos los servicios estén corriendo: `docker ps`
3. Revisar la documentación de cada microservicio en sus respectivos README

---

**Desarrollado con ❤️ usando arquitectura de microservicios**
