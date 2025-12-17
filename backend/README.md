# Backend - Sistema de Pedidos Restaurante

Este directorio contiene todos los microservicios del backend del sistema.

## Servicios

- **api-gateway** (Puerto 3000): Gateway principal de APIs
- **admin-service** (Puerto 4001): Servicio de administración (usuarios, roles, autenticación)
- **orders-producer-python** (Puerto 8000): FastAPI - Gestión de pedidos
- **orders-producer-node** (Puerto 3002/4000): Node.js - Worker de cocina + WebSocket

## Infraestructura

- **RabbitMQ** (Puertos 5672/15672): Message broker
- **MongoDB** (Puerto 27017): Base de datos

## Levantar solo el Backend

```bash
cd backend
docker-compose up -d
```

## Levantar backend desde la raíz

```bash
docker-compose up -d rabbitmq mongo python-ms node-ms api-gateway admin-service
```

## Verificar servicios

```bash
# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps

# RabbitMQ Management
http://localhost:15672 (guest/guest)
```

## Variables de entorno

Cada servicio tiene su archivo `.env` con las configuraciones necesarias.

## Red

Todos los servicios están en la red `restaurant-network` para comunicarse entre sí y con el frontend.
