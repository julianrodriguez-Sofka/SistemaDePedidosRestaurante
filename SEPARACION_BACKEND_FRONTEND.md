# Guía de Separación Backend/Frontend

## 📁 Nueva Estructura

El proyecto ha sido reorganizado para separar claramente backend y frontend:

### Backend (`/backend`)
Contiene todos los microservicios, APIs y la infraestructura:
- **api-gateway**: Gateway principal de APIs
- **admin-service**: Servicio de administración y autenticación
- **orders-producer-python**: Microservicio Python (FastAPI) para pedidos
- **orders-producer-node**: Microservicio Node.js (Worker de cocina + WebSocket)
- **Infraestructura**: RabbitMQ y MongoDB

### Frontend (`/frontend`)
Contiene las aplicaciones de usuario:
- **orders-producer-frontend**: Interfaz para meseros (toma de pedidos)
- **admin-frontend**: Panel de administración

## 🐳 Docker Compose

Ahora hay **3 archivos docker-compose.yml**:

1. **`/docker-compose.yml`** (raíz): Orquestador completo - levanta todo
2. **`/backend/docker-compose.yml`**: Solo servicios backend + infraestructura
3. **`/frontend/docker-compose.yml`**: Solo aplicaciones frontend

## 🔗 Networking

Todos los servicios se comunican a través de la red Docker `restaurant-network`:
- El backend crea la red
- El frontend se conecta a la red existente (external: true)

Esto permite:
- Levantar backend y frontend independientemente
- Comunicación entre servicios usando nombres de contenedor
- Aislamiento de la red del sistema

## 🚀 Formas de Levantar el Sistema

### 1. Sistema Completo (desde la raíz)
```bash
docker-compose up -d
```

### 2. Usando Scripts de Inicio
```bash
# Linux/Mac
./start-system.sh

# Windows PowerShell
.\start-system.ps1
```

### 3. Backend y Frontend por Separado

**Terminal 1 - Backend:**
```bash
cd backend
docker-compose up -d
```

**Terminal 2 - Frontend:**
```bash
cd frontend
docker-compose up -d
```

### 4. Solo Backend (para desarrollo de frontend local)
```bash
cd backend
docker-compose up -d
```

Luego puedes desarrollar el frontend localmente:
```bash
cd frontend/orders-producer-frontend
npm install
npm run dev
```

## 🔧 Variables de Entorno

Cada servicio mantiene su archivo `.env` en su respectiva carpeta:
- `/backend/api-gateway/.env`
- `/backend/admin-service/.env`
- `/backend/orders-producer-python/.env`
- `/backend/orders-producer-node/.env`
- `/frontend/orders-producer-frontend/.env`
- `/frontend/admin-frontend/.env`

## 📦 Ventajas de esta Estructura

1. **Despliegue Independiente**: Backend y frontend pueden desplegarse por separado
2. **Escalabilidad**: Escala backend y frontend de forma independiente
3. **Desarrollo en Equipo**: Equipos separados pueden trabajar en repos distintos
4. **CI/CD Específico**: Pipelines diferentes para backend y frontend
5. **Claridad**: Estructura más clara y mantenible

## 🔄 Migración a Repositorios Separados

Si quieres separar en dos repositorios Git:

### Repositorio Backend
```bash
# Incluir
backend/
docker-compose.yml (solo backend)
.env archivos relacionados
Scripts de utilidad (seed-*.js, create-admin.js, etc.)
Documentación técnica (*.md)
```

### Repositorio Frontend
```bash
# Incluir
frontend/
docker-compose.yml (solo frontend)
.env archivos relacionados
```

### Consideraciones
- Actualiza las URLs en los `.env` del frontend para apuntar al backend desplegado
- Configura CORS en los servicios backend
- Mantén sincronizadas las versiones de APIs entre backend y frontend

## 🧪 Testing

**Backend:**
```bash
cd backend/api-gateway
npm test

cd backend/orders-producer-node
npm test
```

**Frontend:**
```bash
cd frontend/orders-producer-frontend
npm test
```

## 📊 Monitoreo

**Ver logs de todos los servicios:**
```bash
# Desde raíz
docker-compose logs -f

# Solo backend
cd backend && docker-compose logs -f

# Solo frontend
cd frontend && docker-compose logs -f
```

**Ver estado de servicios:**
```bash
docker-compose ps
```

## 🛑 Detener Servicios

**Todo el sistema:**
```bash
docker-compose down
```

**Solo backend:**
```bash
cd backend && docker-compose down
```

**Solo frontend:**
```bash
cd frontend && docker-compose down
```

**Limpiar volúmenes (⚠️ elimina datos de MongoDB):**
```bash
docker-compose down -v
```
