# Frontend - Sistema de Pedidos Restaurante

Este directorio contiene las aplicaciones frontend del sistema.

## Aplicaciones

- **orders-producer-frontend** (Puerto 5173): Interfaz de meseros - Toma de pedidos
- **admin-frontend** (Puerto 5174): Panel de administración - Gestión de usuarios y permisos

## Levantar solo el Frontend

**Requisito:** El backend debe estar corriendo (rabbitmq, mongo, python-ms, node-ms, api-gateway, admin-service)

```bash
cd frontend
docker-compose up -d
```

## Levantar frontend desde la raíz

```bash
docker-compose up -d admin-frontend orders-producer-frontend
```

## Acceder a las aplicaciones

- **Toma de Pedidos (Meseros):** http://localhost:5173
- **Panel de Administración:** http://localhost:5174

## Configuración

Las URLs del backend se configuran en los `build args` del docker-compose:

- `VITE_API_GATEWAY_URL`: http://localhost:3000
- `VITE_ADMIN_API_URL`: http://localhost:4001/api
- `VITE_WS_URL`: ws://localhost:4000

## Red

El frontend se conecta a la red `restaurant-network` (externa) para comunicarse con los servicios del backend.

## Desarrollo local (sin Docker)

```bash
cd orders-producer-frontend
npm install
npm run dev

# En otra terminal
cd admin-frontend
npm install
npm run dev
```

**Nota:** Asegúrate de tener los archivos `.env` con las URLs del backend.
