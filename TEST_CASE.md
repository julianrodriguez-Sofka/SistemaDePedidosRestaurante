# 🧪 CASOS DE PRUEBA ACTUALIZADOS - SISTEMA DE PEDIDOS DE RESTAURANTE
## Ajustado a la Implementación Real (25 HU Implementadas)

**Fecha de actualización:** 2024-12-17  
 
**Casos de Prueba Totales:** 87 
**Formato:** Gherkin (Given / When / Then)  
**Tipos:** Positivos, Negativos y Casos al Borde

## MÓDULO 1: 🔐 AUTENTICACIÓN Y ACCESO (US-001 a US-004)

### 🧪 HU US-001 – Login Unificado

#### 🧪 TC-US-001-01 (Positivo)
**Descripción:** Validar login exitoso con credenciales válidas de mesero.

**Datos de Entrada:**
- Username: `mesero1`
- Password: `password123`
- Endpoint: `POST /api/auth/login`

**Pasos:**
```gherkin
Scenario: Login correcto de usuario mesero
  Given que el usuario tiene credenciales válidas de mesero
  When envía POST a /api/auth/login con username y password
  Then el sistema responde con código 200
  And retorna un token JWT válido con rol "waiter"
  And el frontend redirige a la interfaz de mesero (puerto 5173)
```

**Resultado Esperado:** Autenticación exitosa, JWT con rol correcto, redirección automática.

---

#### 🧪 TC-US-001-02 (Negativo)
**Descripción:** Login con contraseña incorrecta.

**Datos de Entrada:**
- Username: `mesero1`
- Password: `wrongpassword`

**Pasos:**
```gherkin
Scenario: Login con contraseña incorrecta
  Given que el usuario ingresa username válido
  When envía password incorrecta a /api/auth/login
  Then el sistema responde con código 401 Unauthorized
  And muestra mensaje "Credenciales inválidas"
  And no genera token JWT
```

**Resultado Esperado:** Rechazo de autenticación, mensaje de error claro.

---

#### 🧪 TC-US-001-03 (Borde)
**Descripción:** Login con usuario inexistente.

**Datos de Entrada:**
- Username: `usuario_no_existe`
- Password: `cualquiera`

**Pasos:**
```gherkin
Scenario: Login con usuario no registrado
  Given que el username no existe en la base de datos
  When intenta autenticarse
  Then el sistema responde con código 401
  And retorna mensaje "Usuario no encontrado"
```

**Resultado Esperado:** Sistema protege información (no revela que usuario no existe).

---

#### 🧪 TC-US-001-04 (Seguridad)
**Descripción:** Validar expiración de token JWT.

**Datos de Entrada:**
- Token JWT expirado (older than 7 days)

**Pasos:**
```gherkin
Scenario: Acceso con token expirado
  Given que el usuario tiene un token JWT expirado
  When intenta acceder a un endpoint protegido
  Then el sistema responde con código 401
  And redirige al login
```

**Resultado Esperado:** Token expirado rechazado, sesión invalidada.

---

#### 🧪 TC-US-001-05 (RBAC)
**Descripción:** Validar control de acceso basado en roles (RBAC).

**Datos de Entrada:**
- Token JWT con rol `waiter`
- Intento de acceso a `POST /api/admin/users` (solo admin)

**Pasos:**
```gherkin
Scenario: Mesero intenta crear usuario (acción de admin)
  Given que el mesero está autenticado con token válido
  When intenta acceder a POST /api/admin/users
  Then el sistema responde con código 403 Forbidden
  And muestra mensaje "Acceso denegado: permisos insuficientes"
```

**Resultado Esperado:** Sistema bloquea acceso, RBAC funcional.

---

## MÓDULO 2: 👥 GESTIÓN DE USUARIOS (US-005 a US-009)

### 🧪 HU US-005 – Crear Usuario

#### 🧪 TC-US-005-01 (Positivo)
**Descripción:** Crear usuario con datos válidos.

**Datos de Entrada:**
- Username: `nuevo_mesero`
- Password: `securepass123`
- Email: `nuevo@restaurante.com`
- Roles: `["waiter"]`

**Pasos:**
```gherkin
Scenario: Creación exitosa de usuario mesero
  Given que el administrador está autenticado
  When envía POST /api/admin/users con datos válidos
  Then el sistema responde con código 201 Created
  And retorna el usuario creado con ID único
  And el password se hashea con bcrypt
  And el usuario puede autenticarse inmediatamente
```

**Resultado Esperado:** Usuario creado exitosamente, password hasheado, autenticación inmediata posible.

---

#### 🧪 TC-US-005-02 (Negativo)
**Descripción:** Intentar crear usuario con username duplicado.

**Datos de Entrada:**
- Username: `mesero1` (ya existe)

**Pasos:**
```gherkin
Scenario: Creación con username duplicado
  Given que ya existe un usuario con username "mesero1"
  When el admin intenta crear otro con el mismo username
  Then el sistema responde con código 409 Conflict
  And muestra mensaje "Username ya está en uso"
```

**Resultado Esperado:** Sistema rechaza duplicados, unicidad garantizada.

---

#### 🧪 TC-US-005-03 (Validación)
**Descripción:** Validar campos obligatorios.

**Datos de Entrada:**
- Request sin campo `password`

**Pasos:**
```gherkin
Scenario: Creación sin password
  Given que el admin envía datos sin password
  When intenta crear usuario
  Then el sistema responde con código 400 Bad Request
  And lista los campos faltantes: "password es requerido"
```

**Resultado Esperado:** Validación de campos obligatorios funciona.

---

### 🧪 HU US-006 – Editar Usuario

#### 🧪 TC-US-006-01 (Positivo)
**Descripción:** Actualizar email de usuario existente.

**Datos de Entrada:**
- User ID: `64abc123...`
- Nuevo email: `actualizado@restaurante.com`

**Pasos:**
```gherkin
Scenario: Actualización exitosa de email
  Given que el admin selecciona un usuario existente
  When envía PUT /api/admin/users/:id con nuevo email
  Then el sistema responde con código 200
  And retorna el usuario con email actualizado
```

**Resultado Esperado:** Email actualizado correctamente.

---

#### 🧪 TC-US-006-02 (RBAC)
**Descripción:** Cambiar roles de usuario.

**Datos de Entrada:**
- User ID: `64abc123...`
- Nuevos roles: `["waiter", "chef"]`

**Pasos:**
```gherkin
Scenario: Actualización de roles de usuario
  Given que el admin modifica roles de un usuario
  When guarda los cambios
  Then el usuario recibe JWT con nuevos roles en siguiente login
  And tiene acceso a funcionalidades de ambos roles
```

**Resultado Esperado:** Roles actualizados, permisos reflejados en JWT.

---

#### 🧪 TC-US-006-03 (Validación)
**Descripción:** Intentar editar usuario inexistente.

**Datos de Entrada:**
- User ID: `id_no_existe`

**Pasos:**
```gherkin
Scenario: Edición de usuario inexistente
  Given que el ID no existe en la base de datos
  When intenta actualizar
  Then el sistema responde con código 404 Not Found
```

**Resultado Esperado:** Error 404 para recursos inexistentes.

---

### 🧪 HU US-007 – Eliminar Usuario

#### 🧪 TC-US-007-01 (Positivo)
**Descripción:** Eliminar usuario existente.

**Datos de Entrada:**
- User ID: `64abc123...`

**Pasos:**
```gherkin
Scenario: Eliminación física de usuario
  Given que el admin selecciona un usuario
  When envía DELETE /api/admin/users/:id
  Then el sistema responde con código 204 No Content
  And el usuario se elimina completamente de MongoDB
  And el usuario no puede autenticarse nuevamente
```

**Resultado Esperado:** Usuario eliminado permanentemente de la BD.

---

#### 🧪 TC-US-007-02 (Validación)
**Descripción:** Intentar eliminar usuario ya eliminado.

**Pasos:**
```gherkin
Scenario: Eliminación de usuario inexistente
  Given que el usuario ya fue eliminado
  When intenta eliminarlo nuevamente
  Then el sistema responde con código 404
```

**Resultado Esperado:** Error 404 para recurso ya inexistente.

---

### 🧪 HU US-008 – Listar y Buscar Usuarios

#### 🧪 TC-US-008-01 (Positivo)
**Descripción:** Obtener lista completa de usuarios.

**Pasos:**
```gherkin
Scenario: Listar todos los usuarios
  Given que el admin accede a la página de usuarios
  When envía GET /api/admin/users
  Then el sistema responde con código 200
  And retorna array de todos los usuarios con campos: _id, username, email, roles, isActive
```

**Resultado Esperado:** Lista completa de usuarios con campos correctos.

---

#### 🧪 TC-US-008-02 (Filtrado)
**Descripción:** Buscar usuarios por filtros.

**Datos de Entrada:**
- Query: `?role=waiter`

**Pasos:**
```gherkin
Scenario: Filtrado por rol
  Given que se aplica filtro de rol "waiter"
  When envía GET /api/admin/users?role=waiter
  Then retorna solo usuarios con rol waiter
```

**Resultado Esperado:** Filtrado funcional por roles.

---

## MÓDULO 3: 📦 GESTIÓN DE PRODUCTOS (US-010 a US-012)

### 🧪 HU US-010 – Crear Producto

#### 🧪 TC-US-010-01 (Positivo)
**Descripción:** Crear producto con datos válidos.

**Datos de Entrada:**
- Name: `Hamburguesa Clásica`
- Price: `12.99`
- Desc: `Hamburguesa con queso y tomate`
- Image: `https://example.com/burger.jpg`

**Pasos:**
```gherkin
Scenario: Creación exitosa de producto
  Given que el admin está autenticado
  When envía POST /api/admin/products con datos válidos
  Then el sistema responde con código 201
  And retorna el producto con ID único
  And el producto aparece en GET /api/admin/products inmediatamente
```

**Resultado Esperado:** Producto creado y disponible inmediatamente.

---

#### 🧪 TC-US-010-02 (Validación)
**Descripción:** Validar precio no negativo.

**Datos de Entrada:**
- Price: `-5.00`

**Pasos:**
```gherkin
Scenario: Rechazo de precio negativo
  Given que el admin ingresa precio negativo
  When intenta crear producto
  Then el sistema responde con código 400
  And muestra "El precio debe ser mayor o igual a 0"
```

**Resultado Esperado:** Validación de precio funcional.

---

#### 🧪 TC-US-010-03 (Validación)
**Descripción:** Validar campos obligatorios.

**Datos de Entrada:**
- Request sin campo `name`

**Pasos:**
```gherkin
Scenario: Creación sin nombre
  Given que se omite el campo "name"
  When intenta crear producto
  Then el sistema responde con código 400
  And lista "name es requerido"
```

**Resultado Esperado:** Campos obligatorios validados.

---

### 🧪 HU US-011 – Editar Producto

#### 🧪 TC-US-011-01 (Positivo)
**Descripción:** Actualizar precio de producto existente.

**Datos de Entrada:**
- Product ID: `64abc...`
- Nuevo precio: `14.99`

**Pasos:**
```gherkin
Scenario: Actualización exitosa de precio
  Given que el producto existe
  When envía PUT /api/admin/products/:id con nuevo precio
  Then el sistema responde con código 200
  And el nuevo precio se usa en pedidos subsiguientes
```

**Resultado Esperado:** Precio actualizado inmediatamente.

---

#### 🧪 TC-US-011-02 (Validación)
**Descripción:** Intentar editar producto inexistente.

**Pasos:**
```gherkin
Scenario: Edición de producto inexistente
  Given que el product ID no existe
  When intenta actualizar
  Then el sistema responde con código 404
```

**Resultado Esperado:** Error 404 para recursos inexistentes.

---

### 🧪 HU US-012 – Eliminar Producto

#### 🧪 TC-US-012-01 (Positivo)
**Descripción:** Eliminar producto existente.

**⚠️ AJUSTE:** El sistema hace **eliminación física** (hard delete), no lógica.

**Pasos:**
```gherkin
Scenario: Eliminación física de producto
  Given que el producto existe
  When envía DELETE /api/admin/products/:id
  Then el sistema responde con código 204
  And el producto se elimina completamente de MongoDB
  And no aparece más en GET /api/admin/products
```

**Resultado Esperado:** Producto eliminado permanentemente.

---

## MÓDULO 4: 🪑 GESTIÓN DE MESAS (US-013 a US-017)

### 🧪 HU US-013 – Crear Mesa

#### 🧪 TC-US-013-01 (Positivo)
**Descripción:** Crear mesa con datos válidos.

**Datos de Entrada:**
- Number: `10`
- Capacity: `4`
- Location: `Terraza`
- Status: `available` (por defecto)

**Pasos:**
```gherkin
Scenario: Creación exitosa de mesa
  Given que el admin está autenticado
  When envía POST /api/admin/tables con datos válidos
  Then el sistema responde con código 201
  And retorna la mesa con ID único y status "available"
```

**Resultado Esperado:** Mesa creada con estado inicial disponible.

---

#### 🧪 TC-US-013-02 (Validación)
**Descripción:** Intentar crear mesa con número duplicado.

**Datos de Entrada:**
- Number: `5` (ya existe)

**Pasos:**
```gherkin
Scenario: Rechazo de número duplicado
  Given que ya existe mesa con number 5
  When intenta crear otra con mismo number
  Then el sistema responde con código 409
  And muestra "El número de mesa ya existe"
```

**Resultado Esperado:** Unicidad de números de mesa garantizada.

---

### 🧪 HU US-014 – Visualizar Estados de Mesas

#### 🧪 TC-US-014-01 (Positivo)
**Descripción:** Obtener lista de todas las mesas con sus estados.

**Pasos:**
```gherkin
Scenario: Consulta de estados de mesas
  Given que el mesero accede a la vista de mesas
  When envía GET /api/admin/tables
  Then el sistema responde con código 200
  And retorna array de mesas con campos: _id, number, capacity, location, status
```

**Resultado Esperado:** Lista completa de mesas con estados actuales.

---

#### 🧪 TC-US-014-02 (Limitación)
**Descripción:** Validar que NO hay actualización automática en tiempo real.

**Pasos:**
```gherkin
Scenario: Actualización manual de estados
  Given que una mesa cambia de estado en el backend
  When el frontend consulta GET /api/admin/tables
  Then ve el estado actualizado
  But la actualización NO es automática (requiere refrescar)
```

**Resultado Esperado:** Sistema funciona con polling manual, no WebSocket.

---

### 🧪 HU US-015 – Editar Mesa

#### 🧪 TC-US-015-01 (Positivo)
**Descripción:** Actualizar capacidad de mesa.

**Datos de Entrada:**
- Table ID: `64abc...`
- Nueva capacity: `6`

**Pasos:**
```gherkin
Scenario: Actualización de capacidad
  Given que la mesa existe
  When envía PUT /api/admin/tables/:id con nueva capacity
  Then el sistema responde con código 200
  And la capacidad se actualiza correctamente
```

**Resultado Esperado:** Capacidad actualizada exitosamente.

---

### 🧪 HU US-016 – Cambiar Estado de Mesa

#### 🧪 TC-US-016-01 (Positivo)
**Descripción:** Cambiar mesa de disponible a ocupada.

**Datos de Entrada:**
- Table ID: `64abc...`
- Nuevo status: `occupied`

**Pasos:**
```gherkin
Scenario: Cambio de estado a ocupada
  Given que la mesa está en estado "available"
  When envía PUT /api/admin/tables/:id/status con status "occupied"
  Then el sistema responde con código 200
  And el status cambia a "occupied"
```

**Resultado Esperado:** Estado actualizado correctamente.

---

#### 🧪 TC-US-016-02 (Validación)
**Descripción:** Validar estados permitidos.

**Datos de Entrada:**
- Status: `invalid_status`

**Pasos:**
```gherkin
Scenario: Rechazo de estado inválido
  Given que se envía un status no permitido
  When intenta actualizar
  Then el sistema responde con código 400
  And muestra "Status debe ser: available, occupied, reserved, cleaning"
```

**Resultado Esperado:** Solo estados válidos aceptados.

---

### 🧪 HU US-017 – Liberar Mesa Automáticamente

#### 🧪 TC-US-017-01 (Integración)
**Descripción:** Validar liberación automática al completar pedido.

**Pasos:**
```gherkin
Scenario: Liberación automática post-pedido
  Given que una mesa tiene pedido activo
  When el pedido se marca como "completado"
  Then la mesa cambia automáticamente a status "available"
```

**Resultado Esperado:** Liberación automática funcional (si implementada).

---

## MÓDULO 5: 🍽️ GESTIÓN DE PEDIDOS (US-018 a US-023)

### 🧪 HU US-018 – Crear Pedido

#### 🧪 TC-US-018-01 (Positivo)
**Descripción:** Crear pedido con datos válidos.

**Datos de Entrada:**
- customerName: `Juan Pérez`
- table: `5`
- items: `[{ name: "Hamburguesa", quantity: 2, price: 12.99 }]`

**Pasos:**
```gherkin
Scenario: Creación exitosa de pedido
  Given que el mesero está autenticado
  When envía POST /api/v1/orders/ con datos válidos
  Then el sistema responde con código 201
  And retorna el pedido con ID único y status "pendiente"
  And el pedido tiene timestamp de creación
```

**Resultado Esperado:** Pedido creado con estado inicial pendiente.

---

#### 🧪 TC-US-018-02 (Validación)
**Descripción:** Intentar crear pedido sin especificar mesa.

**Datos de Entrada:**
- Request sin campo `table`

**Pasos:**
```gherkin
Scenario: Rechazo de pedido sin mesa
  Given que se omite el campo "table"
  When intenta crear pedido
  Then el sistema responde con código 400
  And muestra "El campo table es obligatorio"
```

**Resultado Esperado:** Validación de mesa obligatoria funcional.

---

#### 🧪 TC-US-018-03 (Validación)
**Descripción:** Validar items no vacío.

**Datos de Entrada:**
- items: `[]` (vacío)

**Pasos:**
```gherkin
Scenario: Rechazo de pedido sin items
  Given que el array items está vacío
  When intenta crear pedido
  Then el sistema responde con código 400
  And muestra "El pedido debe tener al menos un item"
```

**Resultado Esperado:** Validación de items funcional.

---

### 🧪 HU US-019 – Enviar Pedido a Cocina (RabbitMQ)

#### 🧪 TC-US-019-01 (Integración)
**Descripción:** Validar publicación a RabbitMQ.

**Pasos:**
```gherkin
Scenario: Publicación exitosa a cola
  Given que se crea un pedido exitosamente
  When el sistema procesa el pedido
  Then publica el pedido a la cola "orders_queue" de RabbitMQ
  And confirma la publicación exitosa
```

**Resultado Esperado:** Pedido publicado a RabbitMQ correctamente.

---

#### 🧪 TC-US-019-02 (Fallback)
**Descripción:** Validar comportamiento si RabbitMQ no disponible.

**Pasos:**
```gherkin
Scenario: Manejo de RabbitMQ indisponible
  Given que RabbitMQ está caído
  When intenta crear pedido
  Then el sistema intenta reconectar
  And/Or muestra error al usuario
```

**Resultado Esperado:** Sistema maneja gracefully error de cola.

---

### 🧪 HU US-020 – Ver Estado de Pedido

#### 🧪 TC-US-020-01 (Positivo)
**Descripción:** Consultar estado actual de pedido.

**Datos de Entrada:**
- Order ID: `64abc...`

**Pasos:**
```gherkin
Scenario: Consulta de estado de pedido
  Given que el pedido existe
  When envía GET /api/v1/orders/{order_id}
  Then el sistema responde con código 200
  And retorna el pedido con status actual: "pendiente", "preparando" o "listo"
```

**Resultado Esperado:** Estado actual del pedido consultado correctamente.

---

### 🧪 HU US-021 – Editar Pedido

#### 🧪 TC-US-021-01 (Positivo)
**Descripción:** Editar pedido en estado pendiente.

**Datos de Entrada:**
- Order ID: `64abc...` (status: `pendiente`)
- Nuevos items: `[{ name: "Pizza", quantity: 1, price: 15.99 }]`

**Pasos:**
```gherkin
Scenario: Edición exitosa de pedido pendiente
  Given que el pedido está en estado "pendiente"
  When envía PUT /api/v1/orders/{order_id} con nuevos items
  Then el sistema responde con código 200
  And los items se actualizan
```

**Resultado Esperado:** Pedido pendiente editado exitosamente.

---

#### 🧪 TC-US-021-02 (Validación)
**Descripción:** Intentar editar pedido en preparación.

**Datos de Entrada:**
- Order ID: `64abc...` (status: `preparando`)

**Pasos:**
```gherkin
Scenario: Rechazo de edición de pedido en preparación
  Given que el pedido está en "preparando"
  When intenta editar
  Then el sistema responde con código 400
  And muestra "No se puede editar pedido en preparación"
```

**Resultado Esperado:** Sistema bloquea edición de pedidos en cocina.

---

### 🧪 HU US-022 – Cancelar Pedido

#### 🧪 TC-US-022-01 (Positivo)
**Descripción:** Cancelar pedido existente.

**Datos de Entrada:**
- Order ID: `64abc...`

**Pasos:**
```gherkin
Scenario: Cancelación exitosa de pedido
  Given que el pedido existe
  When envía DELETE /api/v1/orders/{order_id}
  Then el sistema responde con código 200
  And el status cambia a "cancelado"
```

**Resultado Esperado:** Pedido cancelado exitosamente.

---

### 🧪 HU US-023 – Consultar Historial de Pedidos

#### 🧪 TC-US-023-01 (Positivo)
**Descripción:** Obtener lista de todos los pedidos.

**Pasos:**
```gherkin
Scenario: Consulta de historial completo
  Given que el admin/mesero está autenticado
  When envía GET /api/v1/orders/
  Then el sistema responde con código 200
  And retorna array de pedidos con todos los estados
```

**Resultado Esperado:** Historial completo de pedidos consultado.

---

#### 🧪 TC-US-023-02 (Filtrado)
**Descripción:** Filtrar pedidos por estado.

**Datos de Entrada:**
- Query: `?status=listo`

**Pasos:**
```gherkin
Scenario: Filtrado por estado "listo"
  Given que se aplica filtro de estado
  When envía GET /api/v1/orders/?status=listo
  Then retorna solo pedidos con status "listo"
```

**Resultado Esperado:** Filtrado por estado funcional.

---

## MÓDULO 6: 👨‍🍳 COCINA Y PROCESAMIENTO ASÍNCRONO (US-024 a US-027)

### 🧪 HU US-024 – Recepción de Pedido en Cocina

#### 🧪 TC-US-024-01 (Integración)
**Descripción:** Validar que Worker Node.js consume pedidos de RabbitMQ.

**Pasos:**
```gherkin
Scenario: Consumo exitoso de pedido
  Given que un pedido se publica en RabbitMQ
  When el Worker Node.js lo consume
  Then el pedido se procesa en orden FIFO
  And se aplica prefetch=1 (un pedido a la vez)
```

**Resultado Esperado:** Worker procesa pedidos secuencialmente.

---

### 🧪 HU US-025 – Iniciar Preparación

#### 🧪 TC-US-025-01 (Positivo)
**Descripción:** Marcar pedido como "en preparación".

**Datos de Entrada:**
- Order ID: `64abc...` (status: `pendiente`)

**Pasos:**
```gherkin
Scenario: Cambio a estado "preparando"
  Given que el pedido está en "pendiente"
  When el cocinero lo marca como "preparando"
  Then el sistema actualiza status a "preparando"
  And el cambio se refleja en el backend Python
```

**Resultado Esperado:** Estado actualizado a preparando.

---

### 🧪 HU US-026 – Marcar Pedido como Listo

#### 🧪 TC-US-026-01 (Positivo)
**Descripción:** Marcar pedido como "listo".

**Datos de Entrada:**
- Order ID: `64abc...` (status: `preparando`)

**Pasos:**
```gherkin
Scenario: Cambio a estado "listo"
  Given que el pedido está en "preparando"
  When el cocinero lo marca como "listo"
  Then el sistema actualiza status a "listo"
  And se notifica al mesero (vía WebSocket)
```

**Resultado Esperado:** Estado actualizado y notificación enviada.

---

### 🧪 HU US-027 – Notificaciones en Tiempo Real

#### 🧪 TC-US-027-01 (WebSocket)
**Descripción:** Validar notificación vía WebSocket.

**Pasos:**
```gherkin
Scenario: Notificación en tiempo real al mesero
  Given que el pedido cambia a "listo"
  When el sistema procesa el cambio
  Then envía notificación vía WebSocket al frontend del mesero
  And el mesero ve alerta en tiempo real
```

**Resultado Esperado:** Notificación WebSocket funcional.

---

#### 🧪 TC-US-027-02 (Fallback)
**Descripción:** Validar fallback HTTP si WebSocket no disponible.

**Pasos:**
```gherkin
Scenario: Fallback a polling HTTP
  Given que WebSocket no está disponible
  When el pedido cambia de estado
  Then el frontend usa polling HTTP cada 5 segundos
  And eventualmente ve el cambio
```

**Resultado Esperado:** Sistema degradado pero funcional.
