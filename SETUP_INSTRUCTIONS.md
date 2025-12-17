# 🚀 Guía de Instalación para Desarrolladores

## 📋 Prerrequisitos

- Docker Desktop instalado
- Git
- Node.js 18+ (opcional, solo si quieres desarrollo local sin Docker)
- Python 3.11+ (opcional, solo para desarrollo local sin Docker)

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd SistemaDePedidosRestaurante
```

### 2. Crear archivos .env

Copia los archivos `.env.example` como `.env` en cada servicio:

```bash
# En PowerShell (Windows)
Copy-Item orders-producer-python\.env.example orders-producer-python\.env
Copy-Item orders-producer-node\.env.example orders-producer-node\.env
Copy-Item api-gateway\.env.example api-gateway\.env
Copy-Item admin-service\.env.example admin-service\.env

# En Linux/Mac
cp orders-producer-python/.env.example orders-producer-python/.env
cp orders-producer-node/.env.example orders-producer-node/.env
cp api-gateway/.env.example api-gateway/.env
cp admin-service/.env.example admin-service/.env
```

**IMPORTANTE:** Los valores por defecto en los `.env.example` funcionan correctamente con Docker. No necesitas cambiar nada para empezar.

### 3. Iniciar el proyecto con Docker

```bash
docker-compose up -d
```

Esto levantará todos los servicios:
- RabbitMQ (puerto 5672, panel web: 15672)
- MongoDB (puerto 27017)
- Microservicio Python (puerto 8000)
- Microservicio Node (puerto 3002)
- API Gateway (puerto 3000)
- Admin Service (puerto 4001)
- Frontend Mesero/Cocinero (puerto 5173)
- Frontend Admin (puerto 5174)

### 4. Inicializar datos

Ejecuta el script para crear usuarios y datos iniciales:

```bash
docker exec -it admin-service node dist/scripts/seed-docker.js
```

Esto creará:
- **Usuarios:** admin/admin123, waiter1/waiter123, chef1/chef123
- **Productos:** 6 productos de ejemplo
- **Mesas:** 10 mesas
- **Configuración:** Tiempos de preparación y horarios

## 🌐 Acceder a las Interfaces

- **Mesero:** http://localhost:5173 → Login con mesero (waiter1/waiter123)
- **Cocinero:** http://localhost:5173 → Login con cocinero (chef1/chef123)
- **Admin:** http://localhost:5174 → Login con admin (admin/admin123)
- **RabbitMQ Panel:** http://localhost:15672 (guest/guest)

## 🛠️ Comandos Útiles

### Ver logs de un servicio
```bash
docker logs -f <nombre-servicio>
# Ejemplo:
docker logs -f python-ms
docker logs -f admin-service
```

### Reiniciar un servicio
```bash
docker-compose restart <nombre-servicio>
# Ejemplo:
docker-compose restart front
```

### Reconstruir un servicio
```bash
docker-compose up -d --build <nombre-servicio>
```

### Detener todo
```bash
docker-compose down
```

### Detener y eliminar datos (CUIDADO: borra la base de datos)
```bash
docker-compose down -v
```

## 📁 Estructura del Proyecto

```
SistemaDePedidosRestaurante/
├── orders-producer-python/     # Microservicio de pedidos (FastAPI)
├── orders-producer-node/        # Microservicio de cocina (Node.js)
├── api-gateway/                 # API Gateway (Express)
├── admin-service/               # Servicio de administración (Express)
├── orders-producer-frontend/    # Frontend mesero/cocinero (React + Vite)
├── admin-frontend/              # Frontend admin (React + Vite)
└── docker-compose.yml           # Configuración de Docker
```

## 🔧 Desarrollo Local (sin Docker)

Si prefieres trabajar sin Docker:

1. Instala dependencias en cada proyecto:
```bash
cd orders-producer-frontend && npm install
cd ../admin-frontend && npm install
cd ../orders-producer-node && npm install
cd ../admin-service && npm install
cd ../api-gateway && npm install
cd ../orders-producer-python && pip install -r requirements.txt
```

2. Ajusta los archivos `.env` para apuntar a `localhost` en lugar de nombres de contenedores

3. Inicia cada servicio manualmente en terminales separadas

## ❓ Problemas Comunes

### Los contenedores no inician
```bash
docker-compose down
docker-compose up -d
```

### Puerto ya en uso
Verifica qué está usando el puerto:
```bash
# Windows
netstat -ano | findstr :5173

# Linux/Mac
lsof -i :5173
```

### No puedo hacer login
Verifica que la base de datos tenga usuarios:
```bash
docker exec -it admin-service node dist/scripts/seed-docker.js
```

### Los pedidos no llegan a cocina
1. Verifica que RabbitMQ esté corriendo
2. Revisa los logs de python-ms y node-ms
3. Reinicia los servicios:
```bash
docker-compose restart python-ms node-ms
```

## 📝 Notas Importantes

- **sessionStorage vs localStorage:** El proyecto usa `sessionStorage` para permitir múltiples sesiones (mesero + cocinero) en diferentes pestañas
- **Cancelación de pedidos:** Tanto meseros como cocineros pueden cancelar pedidos
- **Limpieza automática:** Las mesas se limpian automáticamente 30 segundos después de completar un pedido

## 🤝 Contribuir

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Haz tus cambios
3. Commit: `git commit -m "Descripción del cambio"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Crea un Pull Request

## 📞 Soporte

Si tienes problemas, revisa:
1. Los logs de Docker: `docker-compose logs`
2. La documentación en los archivos `.md` del proyecto
3. Los issues del repositorio
