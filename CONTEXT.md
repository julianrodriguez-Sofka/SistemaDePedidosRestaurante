1. IDEA DE NEGOCIO
Explicación simple:
Digitalizar y automatizar la gestión de pedidos en restaurantes, permitiendo a clientes y personal realizar, monitorear y administrar pedidos en tiempo real desde web.

Explicación técnica:
Plataforma basada en microservicios (Node.js y Python), con frontend React, API Gateway, mensajería RabbitMQ y persistencia MongoDB, para gestionar pedidos y cocina de forma desacoplada y escalable.

Problema que resuelve:
Reduce errores y tiempos en la gestión manual de pedidos, mejora la comunicación entre salón y cocina, y optimiza la experiencia del cliente.

Público objetivo:
Restaurantes, franquicias, personal de cocina y salón, clientes finales.

Variables de valor:

Diferenciadores: Arquitectura escalable, integración en tiempo real, despliegue por Docker, APIs abiertas.
Necesidades: Trazabilidad, reducción de tiempos, integración futura con pagos y reportes.
Oportunidades: Analítica, integración con delivery, personalización.
2. CONTEXTO GENERAL DEL PROYECTO
Contexto actual:
El software está en desarrollo activo, con los siguientes módulos implementados:

API Gateway (Node.js/TypeScript): Orquesta y enruta peticiones.
Microservicio de Pedidos (Node.js): Lógica de pedidos, integración con RabbitMQ y MongoDB.
Microservicio de Cocina (Python): Procesa eventos de pedidos, gestiona estados de cocina.
Frontend (React): Visualización y gestión de pedidos en tiempo real.
Qué pretende solucionar:
Centralizar la gestión de pedidos, mejorar la comunicación y trazabilidad, y permitir monitoreo en tiempo real.

Módulos existentes:

API Gateway
Orders Producer Node (Pedidos)
Orders Producer Python (Cocina)
Frontend de seguimiento
Riesgos y oportunidades:

Riesgos: Latencia en mensajería, caídas de servicios, seguridad.
Oportunidades: Escalado horizontal, integración futura con pagos, reportes y delivery.
Modelo de operación:
Web (principal), con posibilidad de PWA o móvil en el futuro.

Tipos de usuarios y actores:
Cliente, mesero, cocinero, administrador.

3. ARQUITECTURA PROPUESTA (AJUSTADA A LO EXISTENTE)
Patrón arquitectónico:

Microservicios + Event-driven (RabbitMQ)
Hexagonal/Clean Architecture en Node y Python
Conexión entre servicios:

API Gateway expone endpoints REST y enruta a microservicios.
Microservicios se comunican por eventos (RabbitMQ) y REST.
Frontend consume API Gateway.
Orquestación vs coreografía:

Orquestación en API Gateway.
Coreografía por eventos en RabbitMQ.
Canal de comunicación:

REST (API Gateway ↔ Microservicios)
Eventos (RabbitMQ para pedidos y cocina)
Infraestructura:

Docker y Docker Compose para desarrollo y despliegue.
MongoDB como base de datos principal.
RabbitMQ como bus de eventos.
Diagrama textual:


[Frontend React]      | [API Gateway]   /        \[Pedidos]  [Cocina]   \        /   [RabbitMQ]      |   [MongoDB]
4. MICROSERVICIOS NECESARIOS (EXISTENTES)
1. API Gateway
Responsabilidad: Entrada única, autenticación, routing.
Base de datos: No propia.
Endpoints: /api/orders, /api/kitchen
Lógica: Valida, enruta, agrega trazabilidad.
Casos de uso: Login, registro, gestión de pedidos.
Validaciones: JWT, input.
Métricas: Latencia, errores.
Integraciones: Pedidos, cocina.
Pruebas: Unitarias, integración.
2. Orders Producer Node (Pedidos)
Responsabilidad: CRUD de pedidos, gestión de estados.
Base de datos: MongoDB.
Endpoints: /orders, /orders/{id}
Eventos: order.created, order.updated
Lógica: Validación, creación y actualización de pedidos.
Casos de uso: Crear, actualizar, cancelar pedido.
Validaciones: Formato, estado.
Métricas: Pedidos por hora, errores.
Integraciones: Cocina, API Gateway.
Pruebas: Unitarias, integración.
3. Orders Producer Python (Cocina)
Responsabilidad: Gestión de preparación, actualización de estado.
Base de datos: MongoDB.
Endpoints: /kitchen/orders, /kitchen/status
Eventos: order.prepared, order.delivered
Lógica: Asignación de pedidos, actualización de estado.
Casos de uso: Marcar pedido como preparado, entregado.
Validaciones: Estado, tiempos.
Métricas: Tiempos de preparación, pedidos activos.
Integraciones: Pedidos, API Gateway.
Pruebas: Unitarias, integración.
4. Frontend (React)
Responsabilidad: Visualización y gestión de pedidos.
Integraciones: API Gateway.
5. HERRAMIENTAS Y TECNOLOGÍAS
Lenguajes: TypeScript (Node.js), Python, TypeScript/JS (React)
Frameworks: Express.js, FastAPI, React
Servicios cloud: Docker, Docker Compose (actual), Kubernetes (futuro)
Librerías: Mongoose, SQLAlchemy, JWT, Axios, React Query
APIs: RESTful, OpenAPI/Swagger
Mensajería: RabbitMQ
Bases de datos: MongoDB
Auth: JWT (implementado en Gateway)
Monitoreo: (Pendiente, sugerido: Prometheus, Grafana)
Buenas prácticas:
Clean Code, SOLID
Pruebas unitarias e integración
Linter, formateo
CI/CD (sugerido)
Documentación OpenAPI
Logging estructurado
6. MODELO DE DATOS (AJUSTADO)
Entidades principales:
Order: id, userId, items[], status, total, createdAt, updatedAt
OrderItem: id, orderId, productId, quantity, price
Product: id, name, description, price, stock, categoryId
KitchenTask: id, orderId, status, startedAt, finishedAt
Relaciones:
Order 1:N OrderItem
Product 1:N OrderItem
Order 1:1 KitchenTask
Diccionario de datos (Order):
Campo	Tipo	Descripción
id	ObjectId	Identificador único
userId	ObjectId	Usuario que crea el pedido
items	Array	Productos y cantidades
status	String	Estado (pending, ready, etc)
total	Decimal	Total del pedido
createdAt	Date	Fecha de creación
updatedAt	Date	Fecha de actualización
Normalización:

3FN, desnormalización controlada en items.
Optimización:

Índices en campos de búsqueda (userId, status, createdAt).
7. FLUJOS DE FUNCIONAMIENTO
Registro/Login
(Pendiente de implementación completa, sugerido en API Gateway)
Proceso principal de pedido
Cliente crea pedido vía frontend → API Gateway → Orders Producer Node
Orders Producer Node valida, guarda y emite evento order.created (RabbitMQ)
Orders Producer Python (Cocina) recibe evento, asigna tarea, actualiza estado
Orders Producer Python emite evento order.prepared
Orders Producer Node actualiza estado, notifica al cliente vía API Gateway
Eventos internos
order.created, order.updated, order.prepared
Flujos entre microservicios
REST para comandos
Eventos para cambios de estado
Manejo de errores
API Gateway centraliza errores
Microservicios usan middlewares de error
Estrategias de resiliencia
Retry y timeout en llamadas externas (implementado en utils/retryLogic)
Dead-letter queues en RabbitMQ (sugerido)
8. ROADMAP DE DESARROLLO
Fases:

MVP: Pedidos, cocina, API Gateway, frontend básico (ya implementado)
Mejoras en autenticación y seguridad
Integración de pagos y notificaciones (futuro)
Analítica y reportes (futuro)
Mobile app/PWA (futuro)
Prioridades:

Seguridad y autenticación
Resiliencia y monitoreo
Experiencia de usuario
Riesgos:

Complejidad en integración de eventos
Escalabilidad de la mensajería
Seguridad de datos
Estimación de esfuerzo:

MVP: Ya implementado
Mejoras y nuevas features: 2-4 meses
Recomendación final de arquitectura:

Mantener microservicios desacoplados, event-driven, con API Gateway, mensajería robusta, monitoreo y CI/CD.
Escalabilidad horizontal y portabilidad cloud-native.