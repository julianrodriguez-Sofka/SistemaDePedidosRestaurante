# 🧪 Guía de Pruebas - Backend/Frontend Separados

## ✅ Estado de la Separación

El proyecto ha sido exitosamente reorganizado:

### 📁 Estructura Actual
```
SistemaDePedidosRestaurante/
├── backend/                         ✅ Creado
│   ├── api-gateway/                 ✅ Movido
│   ├── admin-service/               ✅ Movido
│   ├── orders-producer-node/        ✅ Movido
│   ├── orders-producer-python/      ✅ Movido
│   ├── docker-compose.yml           ✅ Creado
│   └── README.md                    ✅ Creado
│
├── frontend/                        ✅ Creado
│   ├── admin-frontend/              ✅ Movido
│   ├── orders-producer-frontend/    ✅ Movido
│   ├── docker-compose.yml           ✅ Creado
│   └── README.md                    ✅ Creado
│
├── docker-compose.yml               ✅ Actualizado (orquestador)
├── start-system.ps1                 ✅ Creado
├── start-system.sh                  ✅ Creado
├── SEPARACION_BACKEND_FRONTEND.md   ✅ Creado
├── RESUMEN_SEPARACION.md            ✅ Creado
└── GUIA_MIGRACION_2_REPOS.md        ✅ Creado
```

## 🚀 Formas de Levantar el Sistema

### Opción 1: Todo junto (Recomendado para prueba rápida)

```powershell
# Desde la raíz
cd "f:\Proyecto Juanes\SistemaDePedidosRestaurante"
docker-compose up -d
```

### Opción 2: Con script automatizado

```powershell
# Windows PowerShell
cd "f:\Proyecto Juanes\SistemaDePedidosRestaurante"
.\start-system.ps1
```

### Opción 3: Backend y Frontend separados

```powershell
# Terminal 1 - Backend
cd "f:\Proyecto Juanes\SistemaDePedidosRestaurante\backend"
docker-compose up -d

# Terminal 2 - Frontend
cd "f:\Proyecto Juanes\SistemaDePedidosRestaurante\frontend"
docker-compose up -d
```

### Opción 4: Solo Backend (para desarrollo frontend local)

```powershell
cd "f:\Proyecto Juanes\SistemaDePedidosRestaurante\backend"
docker-compose up -d
```

## 🔍 Verificación de Servicios

### 1. Ver estado de contenedores

```powershell
docker ps
```

**Contenedores esperados:**
- rabbitmq
- mongo
- python-ms
- node-ms
- api-gateway
- admin-service
- admin-frontend
- orders-producer-frontend

### 2. Verificar logs

```powershell
# Todos los logs
docker-compose logs -f

# Servicio específico
docker-compose logs -f python-ms
docker-compose logs -f node-ms
```

### 3. Probar endpoints

```powershell
# API Gateway
curl http://localhost:3000

# Admin Service
curl http://localhost:4001/api

# Python MS
curl http://localhost:8000
```

## 📱 Acceso a las Aplicaciones

Una vez que todos los servicios estén corriendo, accede a:

| Aplicación | URL | Puerto |
|-----------|-----|--------|
| 🍔 Toma de Pedidos (Meseros) | http://localhost:5173 | 5173 |
| 👨‍💼 Panel de Administración | http://localhost:5174 | 5174 |
| 🌐 API Gateway | http://localhost:3000 | 3000 |
| 👤 Admin Service API | http://localhost:4001/api | 4001 |
| 🐍 Python Orders API | http://localhost:8000 | 8000 |
| 🔌 WebSocket (Cocina) | ws://localhost:4000 | 4000 |
| 🐰 RabbitMQ Management | http://localhost:15672 | 15672 |

## ✅ Prueba de Funcionalidad Completa

### Paso 1: Verificar que todo está corriendo

```powershell
docker ps
```

Deberías ver 8 contenedores corriendo.

### Paso 2: Probar interfaz de meseros

1. Abrir http://localhost:5173
2. Hacer login como mesero
3. Crear un pedido
4. Verificar que el pedido se envía correctamente

### Paso 3: Verificar procesamiento en backend

```powershell
# Ver logs del microservicio Python
docker-compose logs -f python-ms

# Ver logs del microservicio Node
docker-compose logs -f node-ms
```

Deberías ver mensajes de procesamiento del pedido.

### Paso 4: Verificar RabbitMQ

1. Abrir http://localhost:15672
2. Login: `guest` / `guest`
3. Ir a "Queues"
4. Verificar que hay actividad en la cola `orders.new`

### Paso 5: Probar panel de administración

1. Abrir http://localhost:5174
2. Hacer login como administrador
3. Navegar por las opciones de administración

## 🛑 Detener el Sistema

### Detener todo desde la raíz

```powershell
cd "f:\Proyecto Juanes\SistemaDePedidosRestaurante"
docker-compose down
```

### Detener backend y frontend por separado

```powershell
# Backend
cd backend
docker-compose down

# Frontend
cd ../frontend
docker-compose down
```

### Detener y limpiar volúmenes (⚠️ elimina datos de MongoDB)

```powershell
docker-compose down -v
```

## 🔄 Reiniciar Servicios

### Reiniciar todo

```powershell
docker-compose restart
```

### Reiniciar un servicio específico

```powershell
docker-compose restart python-ms
docker-compose restart node-ms
```

### Reconstruir imágenes

```powershell
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Monitoreo

### Ver uso de recursos

```powershell
docker stats
```

### Ver logs en tiempo real

```powershell
# Todos
docker-compose logs -f

# Solo errores
docker-compose logs -f | Select-String "error", "ERROR", "Error"
```

## 🐛 Solución de Problemas

### Problema: Puerto en uso

```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :3000

# Matar proceso
taskkill /PID <PID> /F
```

### Problema: Contenedor no inicia

```powershell
# Ver logs del contenedor
docker logs <container-name>

# Ejemplo
docker logs python-ms
docker logs node-ms
```

### Problema: Frontend no conecta con backend

1. Verificar que backend esté corriendo:
   ```powershell
   docker ps | Select-String "backend"
   ```

2. Verificar red Docker:
   ```powershell
   docker network inspect restaurant-network
   ```

3. Verificar variables de entorno del frontend:
   ```powershell
   cat frontend/orders-producer-frontend/.env
   ```

### Problema: RabbitMQ no está listo

```powershell
# Ver logs de RabbitMQ
docker logs rabbitmq

# Esperar a que esté ready (puede tomar 10-30 segundos)
docker-compose logs -f rabbitmq
```

## 📚 Documentación Adicional

- **[SEPARACION_BACKEND_FRONTEND.md](SEPARACION_BACKEND_FRONTEND.md)** - Explicación detallada de la separación
- **[RESUMEN_SEPARACION.md](RESUMEN_SEPARACION.md)** - Resumen visual de los cambios
- **[GUIA_MIGRACION_2_REPOS.md](GUIA_MIGRACION_2_REPOS.md)** - Cómo migrar a 2 repositorios Git
- **[backend/README.md](backend/README.md)** - Documentación específica del backend
- **[frontend/README.md](frontend/README.md)** - Documentación específica del frontend

## ✅ Checklist Final

Después de realizar las pruebas, verifica:

- [x] Estructura de carpetas creada correctamente
- [x] Docker Compose files creados (raíz, backend, frontend)
- [x] Servicios backend se levantan correctamente
- [x] Servicios frontend se levantan correctamente
- [x] Red Docker `restaurant-network` funciona
- [x] Frontend puede comunicarse con backend
- [x] RabbitMQ procesa mensajes
- [x] MongoDB almacena datos
- [x] WebSocket actualiza en tiempo real
- [x] Documentación completa y actualizada

## 🎉 Resultado

**El proyecto está completamente funcional con backend y frontend separados.**

Puedes:
- ✅ Levantar todo junto desde la raíz
- ✅ Levantar backend y frontend independientemente
- ✅ Desarrollar frontend localmente con backend en Docker
- ✅ Migrar a 2 repositorios Git cuando sea necesario
- ✅ Escalar y desplegar independientemente

**¡Todo listo para continuar el desarrollo!** 🚀
