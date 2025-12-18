# 📋 HISTORIAS DE USUARIO ACTUALIZADAS - SISTEMA DE PEDIDOS DE RESTAURANTE
## 25 HU 

**Fecha de actualización:** 2024-12-17  
**HU Totales :** 25 

---

## 🔐 FASE 1: AUTENTICACIÓN Y CONTROL DE ACCESO (Historias 1-4)

### Historia de Usuario 01: Login Unificado de Usuario
**Identificador único (ID):** US-001 

**Descripción:**  
Como usuario del sistema (mesero, cocinero o administrador),  
Quiero autenticarme en el sistema usando un login unificado,  
Para acceder a la interfaz correspondiente a mi rol de forma segura.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la URL del sistema,  
Cuando la página se carga,  
Entonces veo un formulario de login unificado con campos para username y password.

**CA-2:**  
Dado que ingreso credenciales válidas,  
Cuando envío el formulario,  
Entonces el sistema me autentica vía `/api/auth/login`, genera un JWT con mi rol, y me redirige a la interfaz correspondiente.

**CA-3:**  
Dado que intento autenticarme con credenciales incorrectas,  
Cuando envío el formulario,  
Entonces el sistema muestra un mensaje de error claro y no permite acceder.

**CA-4:**  
Dado que me he autenticado exitosamente,  
Cuando el sistema valida mi JWT,  
Entonces tengo acceso solo a las funcionalidades permitidas por mi rol (RBAC).


### Historia de Usuario 02: Login de Mesero
**Identificador único (ID):** US-002 

**Descripción:**  
Como mesero del restaurante,  
Quiero autenticarme en el sistema con mis credenciales,  
Para acceder a la interfaz de toma de pedidos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que ingreso usuario y contraseña válidos de mesero,  
Cuando envío el formulario de login,  
Entonces el sistema me autentica y me redirige al frontend de mesero (puerto 5173).

**CA-2:**  
Dado que mi token JWT contiene el rol `waiter`,  
Cuando intento acceder a funciones administrativas,  
Entonces el sistema me bloquea el acceso y muestra "Acceso denegado".

**CA-3:**  
Dado que me he autenticado exitosamente,  
Cuando navego por la aplicación,  
Entonces todos los pedidos que creo quedan registrados con mi identificador de usuario.


### Historia de Usuario 03: Login de Cocinero
**Identificador único (ID):** US-003

**Descripción:**  
Como cocinero del restaurante,  
Quiero autenticarme en el sistema con mis credenciales,  
Para acceder a la interfaz de cocina y gestionar pedidos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que ingreso credenciales válidas de cocinero,  
Cuando envío el formulario,  
Entonces el sistema me autentica y me redirige a la interfaz de cocina.

**CA-2:**  
Dado que mi token JWT contiene el rol `chef`,  
Cuando accedo al sistema,  
Entonces solo veo los pedidos en estado "pendiente" y "preparando", y no tengo acceso a funciones de creación de pedidos o administración.


### Historia de Usuario 04: Login de Administrador
**Identificador único (ID):** US-004

**Descripción:**  
Como administrador del restaurante,  
Quiero autenticarme en el sistema con credenciales de alto privilegio,  
Para acceder al panel de administración.

**Criterios de Aceptación:**

**CA-1:**  
Dado que ingreso credenciales de administrador válidas,  
Cuando envío el formulario,  
Entonces el sistema me autentica y me redirige al frontend de administración (puerto 5174).

**CA-2:**  
Dado que mi token JWT contiene el rol `admin`,  
Cuando accedo al sistema,  
Entonces tengo acceso completo a gestión de usuarios, productos y mesas.

**CA-3:**  
Dado que intento realizar acciones administrativas,  
Cuando el sistema valida mi token,  
Entonces valida que tengo el rol `admin` antes de permitir la operación.


## 👥 FASE 2: GESTIÓN DE USUARIOS (Historias 5-9)

### Historia de Usuario 05: Crear Usuario
**Identificador único (ID):** US-005 

**Descripción:**  
Como administrador del restaurante,  
Quiero crear nuevos usuarios desde el panel de administración,  
Para gestionar el personal que tendrá acceso al sistema.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de gestión de usuarios,  
Cuando ingreso username único, password, email y selecciono roles válidos,  
Entonces el usuario se crea exitosamente en la base de datos MongoDB vía POST `/api/admin/users`.

**CA-2:**  
Dado que intento crear un usuario con username duplicado,  
Cuando envío el formulario,  
Entonces el sistema muestra error de unicidad y no permite la creación.

**CA-3:**  
Dado que creo un usuario exitosamente,  
Cuando el proceso finaliza,  
Entonces el nuevo usuario puede autenticarse inmediatamente.


### Historia de Usuario 06: Editar Usuario
**Identificador único (ID):** US-006 

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar la información de usuarios existentes,  
Para actualizar sus datos, cambiar roles o restablecer contraseñas.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un usuario existente,  
Cuando modifico su email, roles o estado (isActive) y guardo,  
Entonces los cambios se aplican vía PUT `/api/admin/users/:id`.

**CA-2:**  
Dado que cambio el rol de un usuario,  
Cuando el usuario inicia sesión nuevamente,  
Entonces recibe un JWT con los roles actualizados.

**CA-3:**  
Dado que desactivo un usuario (isActive = false),  
Cuando el usuario intenta autenticarse,  
Entonces el sistema bloquea el acceso.


### Historia de Usuario 07: Eliminar Usuario
**Identificador único (ID):** US-007 

**Descripción:**  
Como administrador del restaurante,  
Quiero eliminar usuarios del sistema,  
Para remover personal que ya no trabaja en el restaurante.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un usuario,  
Cuando confirmo la eliminación,  
Entonces el usuario se elimina vía DELETE `/api/admin/users/:id`.

**CA-2:**  
Dado que elimino un usuario,  
Cuando el proceso finaliza,  
Entonces el usuario no puede autenticarse nuevamente.


### Historia de Usuario 08: Listar y Buscar Usuarios
**Identificador único (ID):** US-008 

**Descripción:**  
Como administrador del restaurante,  
Quiero ver la lista completa de usuarios y buscar por nombre o rol,  
Para gestionar eficientemente el personal.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la página de gestión de usuarios,  
Cuando la vista se carga,  
Entonces veo todos los usuarios vía GET `/api/admin/users`.

**CA-2:**  
Dado que uso filtros de búsqueda,  
Cuando aplico criterios,  
Entonces el sistema filtra los resultados.


### Historia de Usuario 09: Seguridad de Acceso y Sesiones
**Identificador único (ID):** US-009 

**Descripción:**  
Como usuario del sistema,  
Quiero que mi sesión esté protegida y se valide en cada petición,  
Para garantizar la seguridad de mis datos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy autenticado,  
Cuando hago peticiones al backend,  
Entonces el sistema valida mi JWT en cada request mediante middleware.

**CA-2:**  
Dado que mi token ha expirado,  
Cuando intento realizar una acción,  
Entonces el sistema me redirige al login.

**CA-3:**  
Dado que intento acceder a recursos sin el rol adecuado,  
Cuando el sistema valida mis permisos,  
Entonces me bloquea con error 403 Forbidden.


## 📦 FASE 3: GESTIÓN DE PRODUCTOS (Historias 10-12)

### Historia de Usuario 10: Crear Producto
**Identificador único (ID):** US-010 

**Descripción:**  
Como administrador del restaurante,  
Quiero crear productos en el sistema,  
Para que estén disponibles en el menú del restaurante.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de productos,  
Cuando ingreso name, price, desc e image y envío,  
Entonces el producto se crea vía POST `/api/admin/products`.

**CA-2:**  
Dado que intento crear un producto con precio negativo,  
Cuando envío el formulario,  
Entonces el sistema rechaza la creación (validación: price >= 0).

**CA-3:**  
Dado que creo un producto exitosamente,  
Cuando el proceso finaliza,  
Entonces el producto aparece inmediatamente en la lista y está disponible para pedidos.

### Historia de Usuario 11: Editar Producto
**Identificador único (ID):** US-011 (Antes US-014)

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar la información de productos existentes,  
Para actualizar precios, descripciones o imágenes.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un producto,  
Cuando modifico campos y guardo,  
Entonces los cambios se aplican vía PUT `/api/admin/products/:id`.

**CA-2:**  
Dado que actualizo el precio de un producto,  
Cuando guardo,  
Entonces el nuevo precio se usa inmediatamente en nuevos pedidos.


### Historia de Usuario 12: Eliminar Producto
**Identificador único (ID):** US-012 

**Descripción:**  
Como administrador del restaurante,  
Quiero eliminar productos del sistema,  
Para remover items que ya no están disponibles.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un producto,  
Cuando confirmo la eliminación,  
Entonces el producto se elimina vía DELETE `/api/admin/products/:id`.


## 🪑 FASE 4: GESTIÓN DE MESAS (Historias 13-17)

### Historia de Usuario 13: Crear Mesa
**Identificador único (ID):** US-013 (Antes US-016)

**Descripción:**  
Como administrador del restaurante,  
Quiero crear mesas en el sistema,  
Para gestionar la distribución del restaurante.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de mesas,  
Cuando ingreso number, capacity y location,  
Entonces la mesa se crea vía POST `/api/admin/tables` con estado inicial `available`.

**CA-2:**  
Dado que intento crear una mesa con número duplicado,  
Cuando envío el formulario,  
Entonces el sistema muestra error de unicidad.

### Historia de Usuario 14: Visualizar Estados de Mesas
**Identificador único (ID):** US-014 (Antes US-017)

**Descripción:**  
Como mesero del restaurante,  
Quiero ver el estado actual de todas las mesas,  
Para saber cuáles están disponibles.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la vista de mesas,  
Cuando la página carga,  
Entonces veo todas las mesas con su estado vía GET `/api/admin/tables`.

**CA-2:**  
Dado que una mesa cambia de estado,  
Cuando consulto la lista,  
Entonces veo el estado actualizado.

### Historia de Usuario 15: Editar Mesa
**Identificador único (ID):** US-015 (Antes US-018)

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar la información de mesas existentes,  
Para actualizar capacidad, ubicación o número.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono una mesa,  
Cuando modifico campos y guardo,  
Entonces los cambios se aplican vía PUT `/api/admin/tables/:id`.

### Historia de Usuario 16: Cambiar Estado de Mesa
**Identificador único (ID):** US-016 (Antes US-019)

**Descripción:**  
Como mesero o administrador,  
Quiero cambiar el estado de una mesa,  
Para reflejar su disponibilidad actual.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono una mesa,  
Cuando cambio su estado a `available`, `occupied`, `reserved` o `cleaning`,  
Entonces el cambio se aplica vía PUT `/api/admin/tables/:id/status`.

### Historia de Usuario 17: Liberar Mesa Automáticamente
**Identificador único (ID):** US-017 

**Descripción:**  
Como sistema,  
Quiero liberar automáticamente las mesas cuando un pedido se completa,  
Para optimizar la rotación de mesas.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido asociado a una mesa se marca como `completado`,  
Cuando el sistema procesa el cierre,  
Entonces la mesa debe cambiar a estado `available` automáticamente.

## 🍽️ FASE 5: GESTIÓN DE PEDIDOS (Historias 18-23)

### Historia de Usuario 18: Crear Pedido
**Identificador único (ID):** US-018 (Antes US-021)

**Descripción:**  
Como mesero del restaurante,  
Quiero crear pedidos para las mesas,  
Para registrar lo que ordenan los clientes.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de pedidos,  
Cuando ingreso customerName, table number, e items[],  
Entonces el pedido se crea vía POST `/api/v1/orders/` (Python backend) con estado `pendiente`.

**CA-2:**  
Dado que intento crear un pedido sin especificar mesa,  
Cuando envío,  
Entonces el sistema rechaza la creación.

**CA-3:**  
Dado que creo un pedido exitosamente,  
Cuando el proceso finaliza,  
Entonces el pedido tiene un ID único y timestamp de creación.

### Historia de Usuario 19: Enviar Pedido a Cocina (RabbitMQ)
**Identificador único (ID):** US-019 

**Descripción:**  
Como sistema,  
Quiero enviar pedidos a la cola de RabbitMQ,  
Para que la cocina los procese de forma asíncrona.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido se crea exitosamente,  
Cuando el sistema procesa el pedido,  
Entonces publica el pedido a la cola RabbitMQ `orders_queue`.

**CA-2:**  
Dado que RabbitMQ está disponible,  
Cuando se publica un mensaje,  
Entonces el sistema confirma la publicación exitosa.

### Historia de Usuario 20: Ver Estado de Pedido
**Identificador único (ID):** US-020

**Descripción:**  
Como mesero o cliente,  
Quiero ver el estado actual de un pedido,  
Para saber si está pendiente, en preparación o listo.

**Criterios de Aceptación:**

**CA-1:**  
Dado que consulto un pedido,  
Cuando hago GET `/api/v1/orders/{order_id}`,  
Entonces recibo el estado actual: `pendiente`, `preparando` o `listo`.

### Historia de Usuario 21: Editar Pedido
**Identificador único (ID):** US-021

**Descripción:**  
Como mesero del restaurante,  
Quiero modificar pedidos en estado `pendiente`,  
Para corregir errores antes de que lleguen a cocina.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido está en estado `pendiente`,  
Cuando modifico items y guardo,  
Entonces los cambios se aplican vía PUT `/api/v1/orders/{order_id}`.

**CA-2:**  
Dado que un pedido ya está en `preparando`,  
Cuando intento editarlo,  
Entonces el sistema rechaza la modificación.


### Historia de Usuario 22: Cancelar Pedido
**Identificador único (ID):** US-022 

**Descripción:**  
Como mesero o administrador,  
Quiero cancelar pedidos,  
Para manejar solicitudes de clientes o errores.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido existe,  
Cuando solicito cancelación vía DELETE `/api/v1/orders/{order_id}`,  
Entonces el pedido cambia a estado `cancelado`.

### Historia de Usuario 23: Consultar Historial de Pedidos
**Identificador único (ID):** US-023

**Descripción:**  
Como administrador o mesero,  
Quiero consultar el historial de pedidos,  
Para análisis y reportes.

**Criterios de Aceptación:**

**CA-1:**  
Dado que solicito la lista de pedidos,  
Cuando hago GET `/api/v1/orders/`,  
Entonces recibo todos los pedidos con filtros opcionales por estado y fecha.

## 👨‍🍳 FASE 6: COCINA Y PROCESAMIENTO ASÍNCRONO (Historias 24-27)

### Historia de Usuario 24: Recepción de Pedido en Cocina
**Identificador único (ID):** US-024 (Antes US-027)

**Descripción:**  
Como sistema de cocina,  
Quiero recibir pedidos desde la cola RabbitMQ,  
Para procesarlos secuencialmente.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido se publica en RabbitMQ,  
Cuando el Worker Node.js lo consume,  
Entonces el pedido se procesa en orden FIFO con `prefetch=1`.

### Historia de Usuario 25: Iniciar Preparación
**Identificador único (ID):** US-025 

**Descripción:**  
Como cocinero,  
Quiero marcar pedidos como "en preparación",  
Para que el equipo sepa en qué estoy trabajando.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido está en `pendiente`,  
Cuando lo marco como "en preparación",  
Entonces el estado cambia a `preparando` vía PATCH al backend.


### Historia de Usuario 26: Marcar Pedido como Listo
**Identificador único (ID):** US-026 

**Descripción:**  
Como cocinero,  
Quiero marcar pedidos como `listo`,  
Para notificar que están listos para servir.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido está en `preparando`,  
Cuando lo marco como `listo`,  
Entonces el estado cambia y se notifica al mesero.


### Historia de Usuario 27: Notificaciones en Tiempo Real
**Identificador único (ID):** US-027 

**Descripción:**  
Como mesero,  
Quiero recibir notificaciones en tiempo real cuando un pedido está listo,  
Para servir rápidamente a los clientes.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido cambia a estado `listo`,  
Cuando el sistema procesa el cambio,  
Entonces se envía notificación vía WebSocket al frontend del mesero.

**CA-2:**  
Dado que WebSocket no está disponible,  
Cuando el sistema intenta notificar,  
Entonces usa polling HTTP como fallback.
s
