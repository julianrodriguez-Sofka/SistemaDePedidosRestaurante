# Sistema de Pedidos de Restaurante – Arquitectura Distribuida

## 1. Descripción general
Este proyecto implementa un sistema distribuido de gestión de pedidos para un restaurante de comidas rápidas con arquitectura de microservicios.

La solución está pensada para un escenario real de operación en sala, donde:
- El **mesero** toma el pedido desde una tablet/navegador.
- El pedido viaja a través de un **API Gateway** que enruta las peticiones a los microservicios.
- Un **microservicio Python (FastAPI)** valida el pedido y lo publica en **RabbitMQ**.
- Un **microservicio Node.js** consume los mensajes de RabbitMQ, procesa los pedidos y notifica a cocina.
- La **cocina** visualiza los pedidos en tiempo real con **WebSocket**, con cambios de estado de **Pendiente → En preparación → Listo**.
- El **administrador** gestiona usuarios, productos y mesas desde un panel separado.

Gran parte de los criterios funcionales y de calidad están documentados en `QA_REQUERIMIENTOS.md`, `TEST_CASE.md` y `TEST_PLAN.md`.
## 2. Arquitectura del sistema
Componentes principales:

1. **API Gateway (Express + TypeScript)**
   - Puerto: `3000`
   - Enruta todas las peticiones a los microservicios correspondientes
   - Endpoints:
     - `POST /api/orders` → Python MS
     - `GET /api/kitchen/orders` → Node MS
     - `PUT /api/kitchen/orders/:id` → Node MS

2. **Frontend de Toma de Pedidos (Mesero)**
   - Tech: React + TypeScript + Vite + Tailwind CSS
   - Puerto: `5173`
   - Permite seleccionar productos, cantidades, notas, nombre del cliente y mesa
   - Envía pedidos al API Gateway

3. **Frontend de Administración**
   - Tech: React + TypeScript + Vite
   - Puerto: `5174`
   - Gestión de usuarios, productos, categorías y mesas
   - Autenticación por roles (admin)

4. **Microservicio de Pedidos (Python - FastAPI)**
   - Puerto: `8000`
   - Endpoint: `POST /api/v1/orders/`
   - Valida pedidos con Pydantic
   - Publica mensajes en RabbitMQ (cola `orders.new`)
   - Actualiza estado de mesas mediante HTTP al admin-service

5. **Microservicio de Cocina (Node.js + TypeScript)**
   - Puerto API: `3002`
   - Puerto WebSocket: `4000`
   - Consume mensajes de RabbitMQ
   - Gestiona estados de pedidos: pending → preparing → completed
   - Notifica cambios en tiempo real vía WebSocket

6. **Servicio de Administración (Node.js + TypeScript)**
   - Puerto: `4001`
   - API REST para:
     - Autenticación JWT
     - Gestión de usuarios
     - Gestión de productos y categorías
     - Gestión de mesas
   - Base de datos: MongoDB

7. **RabbitMQ (Message Broker)**
   - Puerto AMQP: `5672`
   - Puerto Management: `15672`
   - Cola: `orders.new` (durable)
   - Integración asíncrona entre Python MS y Node MS

8. **MongoDB**
   - Puerto: `27017`
   - Almacena: usuarios, productos, categorías, mesas, pedidos históricos
## 3. Flujo funcional end-to-end
1. El mesero abre el **frontend de pedidos** (`http://localhost:5173`).
2. Selecciona productos (hamburguesas, papas, perros, refrescos), define cantidades y añade notas (ej.: “Sebolla”).
3. Ingresa el **nombre del cliente** (opcional) y la **mesa**.
4. Presiona **“Enviar pedido”**.
5. El frontend realiza un `POST` a `http://localhost:3000/api/orders` (API Gateway) con un JSON similar a:
 ```json
 {
 "customerName": "Juan Pérez",
 "table": "Mesa 7",
 "items": [
 {
 "productName": "Hamburguesa",
 "quantity": 2,
 "unitPrice": 10500,
 "note": "Sin cebolla"
 }
 ]
 }
 ```
6. El backend **Python (FastAPI)**:
 - Valida los datos con Pydantic.
 - Genera un `id` (UUID) y `createdAt`.
 - Publica un mensaje en la cola `orders.new` de RabbitMQ.
7. El **worker de Node.js** (en `node-ms`):
 - Escucha la cola `orders.new` (prefetch = 1 para procesar un pedido a la vez).
 - Calcula el tiempo de preparación según productos y cantidades.
 - Cambia el estado interno del pedido a:
 - `preparing` cuando inicia la simulación.
 - `ready` cuando termina el tiempo de preparación.
 - Emite eventos WebSocket:
 - `ORDER_NEW` al recibir un nuevo pedido.
 - `ORDER_READY` al terminar.
 - `QUEUE_EMPTY` cuando no quedan pedidos en cola.
8. El **frontend de cocina** (o panel de cocina en Node) se conecta al WebSocket (`ws://localhost:4000`) y: - Escucha los eventos.
 - Actualiza el listado de pedidos y estados en tiempo real.
## 4. Estructura del proyecto
```bash
SistemaDePedidosRestaurante/
├── api-gateway/              # API Gateway (Express + TypeScript)
├── orders-producer-frontend/ # Frontend mesero (React + Vite)
├── admin-frontend/          # Frontend admin (React + Vite)
├── orders-producer-python/  # MS Pedidos (FastAPI + Python)
├── orders-producer-node/    # MS Cocina (Node.js + TypeScript)
├── admin-service/           # Servicio admin (Node.js + MongoDB)
├── e2e-tests/              # Tests E2E con Playwright
├── test-results/           # Resultados de tests y reportes HTML
├── docker-compose.yml      # Orquestación de contenedores
├── QA_REQUERIMIENTOS.md    # Requerimientos y QA
├── TEST_CASE.md            # Casos de prueba detallados
├── TEST_PLAN.md            # Plan de pruebas
├── GUIA_RAPIDA.md          # Guía rápida de uso
└── README.md               # Este archivo
```
## 5. Tecnologías utilizadas
- **Frontend**
 - React
 - TypeScript
 - Vite
 - WebSocket client (para vista de cocina)
- **Backends**
 - Python 3.9+ / FastAPI
 - Node.js 18+ / TypeScript
- **Mensajería**
 - RabbitMQ (cola durable `orders.new`)
- **Infraestructura**
 - Docker
 - Docker Compose
## 6. Puertos por defecto
- **API Gateway**: `3000` (punto de entrada principal)
- **Frontend Mesero**: `5173`
- **Frontend Admin**: `5174`
- **Python MS (Pedidos)**: `8000`
- **Node MS (Cocina - API)**: `3002`
- **Node MS (Cocina - WebSocket)**: `4000`
- **Admin Service**: `4001`
- **MongoDB**: `27017`
- **RabbitMQ AMQP**: `5672`
- **RabbitMQ Management**: `15672` (usuario: admin, contraseña: admin)

> Verifica el archivo `docker-compose.yml` para confirmar los puertos exactos.
## 7. Variables de entorno
### 7.1. Backend Python (`python-ms/.env`)
Ejemplo de variables:
```env
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
# Opcional:
# RABBITMQ_VHOST=/
```
En Docker, lo normal es que `RABBITMQ_HOST` apunte al nombre del servicio definido en `docker-composr ejemplo `rabbitmq`), no a `localhost`.
### 7.2. Backend Node (`node-ms/.env`)
```env
AMQP_URL=amqp://guest:guest@rabbitmq:5672/
API_PORT=3002
WS_PORT=4000
```
Si usas CloudAMQP u otro proveedor, la URL AMQP cambia al formato que te entregue el proveedor.
### 7.3. Frontend (`frontend/.env` o `.env.local`)
En local (sin Docker):
```env
VITE_API_URL=http://localhost:8000/api/v1/orders/
VITE_WS_URL=ws://localhost:4000
```
En Docker, la URL puede ser algo como:
```env
VITE_API_URL=http://python-ms:8000/api/v1/orders/
VITE_WS_URL=ws://node-ms:4000
```
(Dependiendo de cómo estén nombrados tus servicios en `docker-compose.yml`.)
## 8. Ejecución con Docker Compose
### 8.1. Requisitos previos
- Docker
- Docker Compose (o el comando `docker compose` integrado)
- Puertos disponibles: 5173, 8000, 3002, 4000, 5672 (y 15672 si usas el panel de RabbitMQ)
### 8.2. Levantar todo el entorno
Desde la carpeta raíz `sistemdepedidosrestaurante/`:
```bash
# Construir imágenes y levantar contenedores en segundo plano
docker compose up -d --build
```
Esto debería:
- Construir las imágenes de:
 - `frontend`
 - `python-ms`
 - `node-ms`
- Levantar un contenedor de RabbitMQ (y otros que tengas definidos en `docker-compose.yml`).
- Mapear los puertos al host (localhost).
### 8.3. Ver logs de los servicios
```bash
# Logs de todos los servicios
docker compose logs -f
# Logs de un servicio específico
docker compose logs -f python-ms
docker compose logs -f node-ms
docker compose logs -f frontend
docker compose logs -f rabbitmq
```
### 8.4. Parar y limpiar contenedores
```bash
# Detener pero conservar contenedores
docker compose stop
# Detener y eliminar contenedores, redes y volúmenes anónimos
docker compose down
# Si quieres eliminar también volúmenes:
docker compose down -v
```
### 8.5. Reconstruir solo un servicio
```bash
# Ejemplo para reconstruir solo el backend Python
docker compose up -d --build python-ms
```
## 9. Ejecución en local (sin Docker)
> Esta sección es opcional si siempre vas a usar Docker, pero es útil para desarrollo.
### 9.1. Levantar RabbitMQ localmente
Puedes usar un contenedor suelto:
```bash
docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-managem```
Usuario y contraseña por defecto del panel web: `guest / guest`.
### 9.2. Backend Python (`python-ms`)
```bash
cd python-ms
python -m venv venv
source venv/bin/activate # En Windows: venv\Scripts\activate
pip install -r requirements.txt
# Ejecutar en desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Asegúrate de que las variables de entorno de RabbitMQ estén definidas (o un archivo `.env`).
### 9.3. Backend Node (`node-ms`)
```bash
cd node-ms
npm install
# o pnpm/yarn según el gestor que uses
# Ejecutar modo desarrollo
npm run dev
# o npm run start si está configurado así
```
Esto levantará:
- La API HTTP (puerto 3002 por defecto).
- El servidor WebSocket (puerto 4000 por defecto).
### 9.4. Frontend (`frontend`)
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
Luego abre en el navegador:
```text
http://localhost:5173
```
## 10. Endpoints principales
### 10.1. API de pedidos (FastAPI – Python)
- **POST** `/api/v1/orders/`
 - Recibe un pedido completo.
 - Publica mensaje en RabbitMQ.
 - Respuesta esperada (ejemplo):
 ```json
 {
 "id": "52af8779-09ba-40fa-98a4-3e3b04d6cf25",
 "customerName": "Juan Pérez",
 "table": "Mesa 7",
 "items": [...],
 "createdAt": "2025-11-20T20:40:22.667468"
 }
 ```
### 10.2. API de cocina (Node.js)
- **GET** `/kitchen/orders`
 - Retorna la lista de pedidos actualmente en memoria.
 - Cada pedido incluye: `id`, `customerName`, `table`, `items`, `createdAt`, `status`.
### 10.3. Eventos WebSocket
- `ORDER_NEW`
 - Enviado cuando llega un pedido nuevo al worker.
- `ORDER_READY`
 - Enviado cuando termina la preparación de un pedido.
- `QUEUE_EMPTY`
 - Enviado cuando no quedan pedidos pendientes.
La vista de cocina debe suscribirse a estos eventos para actualizar la UI en tiempo real.
## 11. Flujo en la interfaz de usuario
### 11.1. Frontend de pedidos (mesero)
- Selección de productos en un grid responsive.
- Carrito con:
 - Nombre del producto.
 - Cantidad (controles `+` y `-`).
 - Especificaciones (notas).
 - Total del pedido calculado automáticamente.
- Campos:
 - Nombre de cliente.
 - Mesa.
- Botón **“Enviar pedido”**:
 - Deshabilitado si no hay productos.
 - Muestra mensajes de éxito o error.
 - Limpia el carrito tras un envío exitoso.
### 11.2. Frontend de cocina
- Cards por pedido:
 - Número de pedido.
 - Mesa.
 - Lista de productos.
 - Notas/especificaciones.
 - Estado visual: `Pendiente`, `En preparación`, `Listo`.
- Actualización en tiempo real conectada al WebSocket.
- El trabajador de cocina ve claramente el flujo de la cola.
## 12. QA, pruebas y calidad

### Documentación de QA
- `QA_REQUERIMIENTOS.md`: Requerimientos funcionales y no funcionales
- `TEST_CASE.md`: 26 casos de prueba detallados (autenticación, usuarios, productos)
- `TEST_PLAN.md`: Plan de ejecución de pruebas
- `e2e-tests/README.md`: Guía de tests automatizados

### Tests E2E Automatizados (Playwright)
El proyecto incluye 26 tests E2E automatizados que cubren:
- ✅ Autenticación y selección de roles
- ✅ Gestión de usuarios (CRUD completo)
- ✅ Gestión de productos y categorías
- ✅ Flujo completo de pedidos
- ✅ Validaciones de seguridad (RBAC)
- ✅ Performance (< 800ms carga, < 2000ms APIs)

**Ejecutar tests:**
```bash
cd e2e-tests
npm test              # Ejecutar todos los tests
npm run test:headed   # Ver tests en navegador
npm run report        # Ver reporte HTML interactivo
```

### Pruebas de integración
- Validación de entrada (Pydantic en Python MS)
- CORS configurado correctamente
- Autenticación JWT
- Manejo de errores y timeouts
- Reconexión a RabbitMQ tras fallo
## 13. Problemas comunes y soluciones
- **El frontend no puede llamar al backend Python**
 - Verifica que `VITE_API_URL` apunte al host correcto (en Docker, al nombre del servicio; en local, a `locahost:8000`).
 - Revisa que el contenedor de `python-ms` esté levantado (`docker compose ps`).
- **Node-ms no se conecta a RabbitMQ**
 - Confirma que el contenedor de RabbitMQ está en ejecución.
 - Verifica que `AMQP_URL` en `node-ms` use el host correcto (nombre del servicio, no `localhost` dentro dcontenedor).
- **No llegan mensajes al WebSocket en cocina**
 - Asegúrate de que el WebSocket server esté corriendo (puerto 4000).
 - Revisa que el frontend de cocina use la URL correcta (`ws://node-ms:4000` en Docker o `ws://localhost:4` en local).
- **Ordenes no se procesan en secuencia**
 - Revisa que el worker de Node.js esté configurado con `prefetch = 1` en el consumidor de RabbitMQ.
## 14. Contribución
1. Crea una rama a partir de `main`:
 ```bash
 git checkout -b feature/nueva-funcionalidad
 ```
2. Implementa tus cambios en el módulo correspondiente (`frontend`, `python-ms`, `node-ms`).
3. Asegúrate de:
 - Mantener el formato de código y estándares del proyecto.
 - Añadir o actualizar pruebas si aplica.
 - Actualizar este `README` y/o `QA_REQUERIMIENTOS.md` si cambia algún flujo.
4. Crea un Pull Request describiendo:
 - Qué problema resuelves.
 - Qué cambios hiciste.
 - Cómo se prueba.
## 15. Licencia
> Este proyecto se utiliza con fines académicos y de demostración interna.
> No está autorizado su uso en producción sin la aprobación del autor/equipo responsable.
---
**Autor / Mantenimiento:**
Equipo de desarrollo del Sistema de Pedidos de Restaurante (microservicios Python + Node + React).
Para dudas técnicas sobre despliegue y ejecución, revisa este README y el archivo de requerimientos QA.


<div align="center">

  <a href="https://github.com/LeonardoPerezSoft" target="_blank">
    <img src="https://github.com/LeonardoPerezSoft.png" width="96" alt="Avatar de LeonardoPerezSoft" />
  </a>

  <p>
    <strong>Leonardo Pérez</strong><br />
    <a href="https://github.com/LeonardoPerezSoft" target="_blank">@LeonardoPerezSoft</a>
  </p>

  <img
    src="https://github-readme-stats.vercel.app/api?username=LeonardoPerezSoft&show_icons=true&commits_year=2025"
    alt="Estadísticas GitHub de LeonardoPerezSoft"
  />
</div>

<div align="center">

  <a href="https://github.com/dayhaaCode-25" target="_blank">
    <img src="https://github.com/dayhaaCode-25.png" width="96" alt="Avatar de dayhaaCode-25" />
  </a>

  <p>
    <strong>Dayhana Acevedo</strong><br />
    <a href="https://github.com/dayhaaCode-25" target="_blank">@dayhaaCode-25</a>
  </p>

  <img
    src="https://github-readme-stats.vercel.app/api?username=dayhaaCode-25&show_icons=true&commits_year=2025"
    alt="Estadísticas GitHub de dayhaaCode-25"
  />
</div>

<div align="center">

  <a href="https://github.com/jessicasalgado-lgtm" target="_blank">
    <img src="https://github.com/jessicasalgado-lgtm.png" width="96" alt="Avatar de jessicasalgado-lgtm" />
  </a>

  <p>
    <strong>Jessica Salgado</strong><br />
    <a href="https://github.com/jessicasalgado-lgtm" target="_blank">@jessicasalgado-lgtm</a>
  </p>

  <img
    src="https://github-readme-stats.vercel.app/api?username=jessicasalgado-lgtm&show_icons=true&commits_year=2025"
    alt="Estadísticas GitHub de jessicasalgado-lgtm"
  />
</div>

<div align="center">

  <a href="https://github.com/RM92023" target="_blank">
    <img src="https://github.com/RM92023.png" width="96" alt="Avatar de RM92023" />
  </a>

  <p>
    <strong>Robinson Muñetón Jaramillo</strong><br />
    <a href="https://github.com/RM92023" target="_blank">@RM92023</a>
  </p>

  <img
    src="https://github-readme-stats.vercel.app/api?username=RM92023&show_icons=true&commits_year=2025"
    alt="Estadísticas GitHub de RM92023"
  />
</div>