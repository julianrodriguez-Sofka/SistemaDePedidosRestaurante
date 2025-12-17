Sistema de Pedidos de Restaurante – Arquitectura Distribuida

Alcance: Casos de prueba funcionales basados en TEST_PLAN.md, REFINED_BACKLOG.md y el contexto de negocio.
Cobertura priorizada: Flujos P0 críticos (Autenticación, Toma de Pedidos, Cocina, Cancelación y Sincronización de Mesas).
Formato: Gherkin (Given / When / Then).
Tipos: Positivos, Negativos y Casos al Borde.

CASOS DE PRUEBA DERIVADOS – MÓDULO 1
🔐 AUTENTICACIÓN Y ACCESO (US-001 a US-005)
🧪 HU US-001 – Selección de Rol
🧪 TC-US-001-01 (Positivo)

Descripción: Validar que el usuario pueda seleccionar un rol válido.

Datos de Entrada: Usuario sin sesión activa.

Pasos:

Scenario: Selección correcta de rol
  Given que el usuario accede al sistema
  When visualiza la pantalla inicial
  And selecciona el rol Mesero
  Then el sistema redirige al login correspondiente


Resultado Esperado: El sistema permite seleccionar el rol y redirige correctamente.

🧪 TC-US-001-02 (Negativo)

Descripción: Intentar continuar sin seleccionar rol.

Datos de Entrada: Usuario sin rol seleccionado.

Pasos:

Scenario: Acceso sin selección de rol
  Given que el usuario accede a la pantalla inicial
  When intenta continuar sin seleccionar un rol
  Then el sistema bloquea la acción


Resultado Esperado: El sistema muestra mensaje de error y no permite avanzar.

🧪 TC-US-001-03 (Borde)

Descripción: Validar tiempo máximo de carga de selección de rol.

Datos de Entrada: Usuario accediendo en red lenta.

Pasos:

Scenario: Carga de roles en tiempo límite
  Given que el usuario accede al sistema
  When se cargan las opciones de rol
  Then la carga ocurre en menos de 800 ms


Resultado Esperado: La pantalla carga dentro del SLO definido.

🧪 HU US-002 – Login Mesero
🧪 TC-US-002-01 (Positivo)

Descripción: Login exitoso con credenciales válidas.

Datos de Entrada: Usuario y contraseña válidos.

Pasos:

Scenario: Login correcto de mesero
  Given que el mesero tiene credenciales válidas
  When inicia sesión
  Then accede a la vista de pedidos


Resultado Esperado: Acceso exitoso y sesión iniciada.

🧪 TC-US-002-02 (Negativo)

Descripción: Login con contraseña incorrecta.

Datos de Entrada: Usuario válido, contraseña inválida.

Pasos:

Scenario: Login con contraseña incorrecta
  Given que el mesero ingresa una contraseña incorrecta
  When intenta iniciar sesión
  Then el sistema rechaza el acceso


Resultado Esperado: Mensaje de error, sesión no iniciada.

🧪 TC-US-002-03 (Borde)

Descripción: Login justo en expiración de sesión anterior.

Datos de Entrada: Token expirando.

Pasos:

Scenario: Login con token expirado
  Given que el token anterior está expirado
  When el mesero inicia sesión nuevamente
  Then el sistema genera un nuevo JWT válido


Resultado Esperado: Se renueva sesión correctamente.

HU US-003 – Login Cocinero
🧪 TC-US-003-01 (Positivo)

ID: TC-US-003-01

Descripción: Autenticación exitosa de un usuario con rol Cocinero.

Datos de Entrada:

Usuario con rol Cocinero activo

Credenciales válidas

Pasos:

Scenario: Login correcto de cocinero
  Given que el cocinero tiene credenciales válidas
  When inicia sesión en el sistema
  Then accede al dashboard de cocina


Resultado Esperado:
El cocinero accede correctamente a la vista de cocina y recibe un token JWT válido.

🧪 TC-US-003-02 (Negativo)

ID: TC-US-003-02

Descripción: Intento de autenticación con credenciales inválidas para el rol Cocinero.

Datos de Entrada:

Usuario cocinero existente

Contraseña incorrecta

Pasos:

Scenario: Login fallido de cocinero
  Given que el cocinero ingresa credenciales incorrectas
  When intenta iniciar sesión
  Then el sistema rechaza el acceso


Resultado Esperado:
El sistema responde con error de autenticación y no genera token de sesión.

🧪 TC-US-003-03 (Borde)

ID: TC-US-003-03

Descripción: Autenticación del cocinero bajo alta latencia de red.

Datos de Entrada:

Credenciales válidas

Red con latencia elevada

Pasos:

Scenario: Login de cocinero bajo latencia
  Given que el cocinero intenta autenticarse
  When la red presenta alta latencia
  Then el sistema responde en menos de 800 ms


Resultado Esperado:
El login se completa correctamente cumpliendo el SLO de rendimiento.

🧪 HU US-004 – Login Administrador
🧪 TC-US-004-01 (Positivo)

ID: TC-US-004-01

Descripción: Autenticación exitosa de un usuario con rol Administrador.

Datos de Entrada:

Usuario administrador activo

Credenciales válidas

Pasos:

Scenario: Login correcto de administrador
  Given que el administrador tiene credenciales válidas
  When inicia sesión
  Then accede al panel administrativo


Resultado Esperado:
El administrador accede correctamente al panel administrativo.

🧪 TC-US-004-02 (Negativo)

ID: TC-US-004-02

Descripción: Intento de login con usuario administrador desactivado.

Datos de Entrada:

Usuario administrador desactivado

Credenciales válidas

Pasos:

Scenario: Login administrador desactivado
  Given que el administrador está desactivado
  When intenta iniciar sesión
  Then el sistema bloquea el acceso


Resultado Esperado:
Acceso denegado y mensaje de cuenta inactiva.

🧪 TC-US-004-03 (Borde)

ID: TC-US-004-03

Descripción: Autenticación del administrador con múltiples intentos simultáneos.

Datos de Entrada:

Credenciales válidas

Múltiples solicitudes concurrentes

Pasos:

Scenario: Login administrador concurrente
  Given que el administrador intenta iniciar sesión desde múltiples dispositivos
  When se procesan las solicitudes
  Then solo una sesión queda activa


Resultado Esperado:
Control correcto de sesiones sin inconsistencias.

🧪 HU US-005 – Acceso Denegado por Rol (RBAC)
🧪 TC-US-005-01 (Positivo)

ID: TC-US-005-01

Descripción: Bloqueo correcto de acceso a recursos no permitidos por rol.

Datos de Entrada:

Usuario Mesero autenticado

Pasos:

Scenario: Bloqueo por RBAC
  Given que el mesero está autenticado
  When intenta acceder a una ruta de administrador
  Then el sistema responde 403 Forbidden


Resultado Esperado:
Acceso bloqueado correctamente por políticas RBAC.

🧪 TC-US-005-02 (Negativo)

ID: TC-US-005-02

Descripción: Intento de acceso a un endpoint no permitido mediante manipulación de URL.

Datos de Entrada:

Usuario autenticado

Endpoint restringido

Pasos:

Scenario: Acceso no autorizado por endpoint
  Given que el usuario está autenticado
  When intenta acceder manualmente a un endpoint restringido
  Then el sistema bloquea el acceso


Resultado Esperado:
El sistema mantiene la seguridad y responde con error 403.

🧪 TC-US-005-03 (Borde)

ID: TC-US-005-03

Descripción: Intento de acceso concurrente mientras el rol del usuario cambia.

Datos de Entrada:

Usuario con cambio de rol en proceso

Pasos:

Scenario: Acceso durante cambio de rol
  Given que el rol del usuario está siendo actualizado
  When intenta acceder a un recurso restringido
  Then el sistema valida el rol efectivo


Resultado Esperado:
No se concede acceso indebido y se mantiene la integridad del RBAC.

MÓDULO 2 – GESTIÓN DE USUARIOS
Historias de Usuario: US-006 a US-010
🧪 HU US-006 – Crear Usuario
🧪 TC-US-006-01 (Positivo)

Descripción: Crear un usuario con datos válidos y rol permitido.

Datos de Entrada:
Username único, contraseña válida, rol = Mesero.

Pasos:

Scenario: Creación exitosa de usuario
  Given que el administrador está autenticado
  When crea un usuario con datos válidos
  Then el sistema guarda el usuario correctamente


Resultado Esperado: El usuario queda registrado y disponible en el sistema.

🧪 TC-US-006-02 (Negativo)

Descripción: Intentar crear un usuario con username duplicado.

Datos de Entrada:
Username existente.

Pasos:

Scenario: Creación de usuario duplicado
  Given que ya existe un usuario con el mismo username
  When el administrador intenta crear el usuario
  Then el sistema rechaza la operación


Resultado Esperado: Se muestra mensaje de error por duplicidad.

🧪 TC-US-006-03 (Borde)

Descripción: Crear usuario con username en el límite máximo permitido.

Datos de Entrada:
Username con longitud máxima válida.

Pasos:

Scenario: Creación de usuario con username límite
  Given que el administrador ingresa un username con longitud máxima
  When crea el usuario
  Then el sistema acepta la operación


Resultado Esperado: El usuario se crea sin errores.

🧪 HU US-007 – Editar Usuario
🧪 TC-US-007-01 (Positivo)

Descripción: Editar correctamente los datos de un usuario activo.

Datos de Entrada:
Usuario activo existente.

Pasos:

Scenario: Edición correcta de usuario
  Given que existe un usuario activo
  When el administrador modifica sus datos
  Then los cambios se guardan correctamente


Resultado Esperado: Los datos actualizados se reflejan en el sistema.

🧪 TC-US-007-02 (Negativo)

Descripción: Intentar editar un usuario inexistente.

Datos de Entrada:
ID de usuario inválido.

Pasos:

Scenario: Edición de usuario inexistente
  Given que el usuario no existe
  When el administrador intenta editarlo
  Then el sistema rechaza la operación


Resultado Esperado: Mensaje de error indicando usuario no encontrado.

🧪 TC-US-007-03 (Borde)

Descripción: Editar usuario mientras está siendo consultado por otro proceso.

Datos de Entrada:
Usuario activo con sesión concurrente.

Pasos:

Scenario: Edición concurrente de usuario
  Given que el usuario está siendo consultado
  When el administrador edita sus datos
  Then el sistema mantiene la integridad de la información


Resultado Esperado: No hay corrupción de datos.

🧪 HU US-008 – Desactivar Usuario
🧪 TC-US-008-01 (Positivo)

Descripción: Desactivar correctamente un usuario activo.

Datos de Entrada:
Usuario activo.

Pasos:

Scenario: Desactivación de usuario
  Given que el usuario está activo
  When el administrador lo desactiva
  Then el usuario queda inhabilitado


Resultado Esperado: El usuario no puede iniciar sesión.

🧪 TC-US-008-02 (Negativo)

Descripción: Intentar desactivar un usuario ya desactivado.

Datos de Entrada:
Usuario inactivo.

Pasos:

Scenario: Desactivar usuario ya inactivo
  Given que el usuario ya está desactivado
  When el administrador intenta desactivarlo
  Then el sistema rechaza la acción


Resultado Esperado: Se informa que el usuario ya está inactivo.

🧪 TC-US-008-03 (Borde)

Descripción: Desactivar usuario con sesión activa.

Datos de Entrada:
Usuario activo con sesión abierta.

Pasos:

Scenario: Desactivación con sesión activa
  Given que el usuario tiene una sesión activa
  When el administrador lo desactiva
  Then la sesión se invalida automáticamente


Resultado Esperado: El usuario pierde acceso inmediato.

🧪 HU US-009 – Listar Usuarios
🧪 TC-US-009-01 (Positivo)

Descripción: Listar todos los usuarios correctamente.

Datos de Entrada:
Administrador autenticado.

Pasos:

Scenario: Listado de usuarios
  Given que el administrador accede al módulo de usuarios
  When solicita el listado
  Then el sistema muestra todos los usuarios


Resultado Esperado: Lista completa visible.

🧪 TC-US-009-02 (Negativo)

Descripción: Acceso al listado sin permisos.

Datos de Entrada:
Usuario Mesero autenticado.

Pasos:

Scenario: Listado sin permisos
  Given que el mesero intenta acceder al listado
  When solicita los usuarios
  Then el sistema responde 403


Resultado Esperado: Acceso denegado.

🧪 TC-US-009-03 (Borde)

Descripción: Listar usuarios con gran volumen de registros.

Datos de Entrada:
Más de 100 usuarios registrados.

Pasos:

Scenario: Listado con alto volumen
  Given que existen muchos usuarios
  When el administrador consulta el listado
  Then la respuesta se entrega en tiempo aceptable


Resultado Esperado: Respuesta eficiente sin errores.

🧪 HU US-010 – Seguridad de Acceso de Usuarios
🧪 TC-US-010-01 (Positivo)

Descripción: Bloqueo de acceso a usuario desactivado.

Datos de Entrada:
Usuario desactivado.

Pasos:

Scenario: Bloqueo de usuario desactivado
  Given que el usuario está desactivado
  When intenta iniciar sesión
  Then el sistema bloquea el acceso


Resultado Esperado: Acceso denegado correctamente.

🧪 TC-US-010-02 (Negativo)

Descripción: Intentar usar token antiguo tras desactivación.

Datos de Entrada:
JWT previo a desactivación.

Pasos:

Scenario: Uso de token inválido
  Given que el usuario fue desactivado
  When intenta usar un token previo
  Then el sistema invalida el token


Resultado Esperado: Token rechazado.

🧪 TC-US-010-03 (Borde)

Descripción: Tiempo máximo de bloqueo de acceso.

Datos de Entrada:
Usuario desactivado intentando login.

Pasos:

Scenario: Bloqueo dentro del SLO
  Given que el usuario está desactivado
  When intenta autenticarse
  Then el bloqueo ocurre en menos de 500 ms


Resultado Esperado: Cumplimiento del SLO de seguridad.

MÓDULO 3 – PRODUCTOS Y CATEGORÍAS
Historias de Usuario: US-011 a US-015
🧪 HU US-011 – Crear Categoría
🧪 TC-US-011-01 (Positivo)

Descripción: Crear una categoría con nombre válido.

Datos de Entrada:
Nombre de categoría único.

Pasos:

Scenario: Creación exitosa de categoría
  Given que el administrador está autenticado
  When crea una categoría con nombre válido
  Then la categoría se guarda correctamente


Resultado Esperado: La categoría queda disponible en el sistema.

🧪 TC-US-011-02 (Negativo)

Descripción: Intentar crear una categoría duplicada.

Datos de Entrada:
Nombre de categoría existente.

Pasos:

Scenario: Creación de categoría duplicada
  Given que ya existe una categoría con el mismo nombre
  When el administrador intenta crearla
  Then el sistema rechaza la operación


Resultado Esperado: Mensaje de error por duplicidad.

🧪 TC-US-011-03 (Borde)

Descripción: Crear categoría con nombre en longitud máxima.

Datos de Entrada:
Nombre con longitud máxima permitida.

Pasos:

Scenario: Creación de categoría con longitud límite
  Given que el nombre cumple el máximo permitido
  When el administrador crea la categoría
  Then el sistema la registra sin errores


Resultado Esperado: Categoría creada correctamente.

🧪 HU US-012 – Crear Producto
🧪 TC-US-012-01 (Positivo)

Descripción: Crear producto con datos válidos y categoría existente.

Datos de Entrada:
Nombre, precio > 0, categoría válida.

Pasos:

Scenario: Creación correcta de producto
  Given que existe una categoría
  When el administrador crea un producto válido
  Then el producto queda disponible para pedidos


Resultado Esperado: Producto visible para el mesero.

🧪 TC-US-012-02 (Negativo)

Descripción: Crear producto con precio inválido.

Datos de Entrada:
Precio igual o menor a 0.

Pasos:

Scenario: Creación de producto con precio inválido
  Given que el administrador ingresa un precio inválido
  When intenta crear el producto
  Then el sistema rechaza la creación


Resultado Esperado: Mensaje de validación de precio.

🧪 TC-US-012-03 (Borde)

Descripción: Crear producto con precio mínimo permitido.

Datos de Entrada:
Precio mínimo válido.

Pasos:

Scenario: Creación de producto con precio mínimo
  Given que el precio está en el límite mínimo
  When el producto es creado
  Then el sistema lo acepta


Resultado Esperado: Producto creado correctamente.

🧪 HU US-013 – Editar Producto
🧪 TC-US-013-01 (Positivo)

Descripción: Editar datos de un producto existente.

Datos de Entrada:
Producto activo, nuevo precio válido.

Pasos:

Scenario: Edición correcta de producto
  Given que el producto existe
  When el administrador edita su información
  Then los cambios se guardan correctamente


Resultado Esperado: Producto actualizado.

🧪 TC-US-013-02 (Negativo)

Descripción: Editar producto inexistente.

Datos de Entrada:
ID de producto inválido.

Pasos:

Scenario: Edición de producto inexistente
  Given que el producto no existe
  When el administrador intenta editarlo
  Then el sistema rechaza la operación


Resultado Esperado: Error de producto no encontrado.

🧪 TC-US-013-03 (Borde)

Descripción: Editar producto mientras está en un pedido activo.

Datos de Entrada:
Producto asociado a pedido pending.

Pasos:

Scenario: Edición de producto en uso
  Given que el producto está en un pedido activo
  When se edita el precio
  Then el cambio se refleja solo en pedidos futuros


Resultado Esperado: No se altera pedidos en curso.

🧪 HU US-014 – Eliminar Producto
🧪 TC-US-014-01 (Positivo)

Descripción: Eliminar producto sin pedidos activos.

Datos de Entrada:
Producto libre.

Pasos:

Scenario: Eliminación correcta de producto
  Given que el producto no está en pedidos activos
  When el administrador lo elimina
  Then el producto desaparece del catálogo


Resultado Esperado: Producto eliminado correctamente.

🧪 TC-US-014-02 (Negativo)

Descripción: Eliminar producto asociado a pedido activo.

Datos de Entrada:
Producto en pedido preparing.

Pasos:

Scenario: Eliminación de producto en uso
  Given que el producto está en un pedido activo
  When el administrador intenta eliminarlo
  Then el sistema bloquea la operación


Resultado Esperado: Mensaje de restricción.

🧪 TC-US-014-03 (Borde)

Descripción: Eliminar último producto de una categoría.

Datos de Entrada:
Categoría con un solo producto.

Pasos:

Scenario: Eliminación del último producto
  Given que es el último producto de la categoría
  When se elimina
  Then la categoría permanece sin productos


Resultado Esperado: Categoría no se elimina automáticamente.

🧪 HU US-015 – Visualizar Productos
🧪 TC-US-015-01 (Positivo)

Descripción: Visualizar productos disponibles.

Datos de Entrada:
Mesero autenticado.

Pasos:

Scenario: Visualización de productos
  Given que el mesero accede al catálogo
  When consulta los productos
  Then visualiza solo los productos activos


Resultado Esperado: Lista correcta visible.

🧪 TC-US-015-02 (Negativo)

Descripción: Acceso al catálogo sin autenticación.

Datos de Entrada:
Usuario no autenticado.

Pasos:

Scenario: Acceso no autorizado a productos
  Given que el usuario no está autenticado
  When intenta ver productos
  Then el sistema bloquea el acceso


Resultado Esperado: Respuesta 401.

🧪 TC-US-015-03 (Borde)

Descripción: Visualizar catálogo con alta carga.

Datos de Entrada:
Más de 200 productos registrados.

Pasos:

Scenario: Visualización con alto volumen
  Given que existen muchos productos
  When el mesero consulta el catálogo
  Then la respuesta se entrega en tiempo aceptable


Resultado Esperado: Rendimiento dentro del SLO.

🪑 MÓDULO 4 – GESTIÓN DE MESAS
Historias de Usuario: US-016 a US-020
🧪 HU US-016 – Crear Mesa
🧪 TC-US-016-01 (Positivo)

Descripción: Crear una mesa con número único.

Datos de Entrada:
Número de mesa único.

Pasos:

Scenario: Creación exitosa de mesa
  Given que el administrador está autenticado
  When crea una mesa con número único
  Then la mesa queda disponible en el sistema


Resultado Esperado: Mesa creada y visible para asignación.

🧪 TC-US-016-02 (Negativo)

Descripción: Crear una mesa con número duplicado.

Datos de Entrada:
Número de mesa existente.

Pasos:

Scenario: Creación de mesa duplicada
  Given que ya existe una mesa con el mismo número
  When el administrador intenta crearla
  Then el sistema rechaza la operación


Resultado Esperado: Mensaje de error por duplicidad.

🧪 TC-US-016-03 (Borde)

Descripción: Crear mesa con número máximo permitido.

Datos de Entrada:
Número de mesa en límite superior.

Pasos:

Scenario: Creación de mesa en límite máximo
  Given que el número está dentro del rango permitido
  When el administrador crea la mesa
  Then el sistema la registra correctamente


Resultado Esperado: Mesa creada sin errores.

🧪 HU US-017 – Editar Mesa
🧪 TC-US-017-01 (Positivo)

Descripción: Editar el número de una mesa existente.

Datos de Entrada:
Nuevo número único.

Pasos:

Scenario: Edición correcta de mesa
  Given que la mesa existe
  When el administrador edita su número
  Then los cambios se guardan correctamente


Resultado Esperado: Mesa actualizada.

🧪 TC-US-017-02 (Negativo)

Descripción: Editar mesa a un número ya existente.

Datos de Entrada:
Número duplicado.

Pasos:

Scenario: Edición con número duplicado
  Given que el número ya está asignado a otra mesa
  When el administrador intenta actualizarla
  Then el sistema rechaza la operación


Resultado Esperado: Error de validación.

🧪 TC-US-017-03 (Borde)

Descripción: Editar mesa mientras está reservada.

Datos de Entrada:
Mesa en estado reservada.

Pasos:

Scenario: Edición de mesa reservada
  Given que la mesa está reservada
  When el administrador edita información no crítica
  Then el sistema permite el cambio


Resultado Esperado: Cambios aplicados sin alterar estado.

🧪 HU US-018 – Cambiar Estado de Mesa
🧪 TC-US-018-01 (Positivo)

Descripción: Cambiar estado de disponible a reservada.

Datos de Entrada:
Mesa disponible.

Pasos:

Scenario: Cambio de estado de mesa
  Given que la mesa está disponible
  When se marca como reservada
  Then el estado se actualiza correctamente


Resultado Esperado: Mesa marcada como reservada.

🧪 TC-US-018-02 (Negativo)

Descripción: Reservar una mesa ya ocupada.

Datos de Entrada:
Mesa ocupada.

Pasos:

Scenario: Reserva de mesa ocupada
  Given que la mesa está ocupada
  When se intenta reservar
  Then el sistema rechaza la acción


Resultado Esperado: Mensaje de estado inválido.

🧪 TC-US-018-03 (Borde)

Descripción: Cambio rápido de estado consecutivo.

Datos de Entrada:
Cambios de estado seguidos.

Pasos:

Scenario: Cambio consecutivo de estado
  Given que la mesa cambia de estado rápidamente
  When el sistema procesa las solicitudes
  Then mantiene consistencia del estado final


Resultado Esperado: Estado final correcto.

🧪 HU US-019 – Visualizar Mapa de Mesas
🧪 TC-US-019-01 (Positivo)

Descripción: Visualizar estados en tiempo real.

Datos de Entrada:
Mesero autenticado.

Pasos:

Scenario: Visualización en tiempo real
  Given que el mesero accede al mapa de mesas
  When cambia el estado de una mesa
  Then la vista se actualiza en tiempo real


Resultado Esperado: Estados sincronizados vía WebSocket.

🧪 TC-US-019-02 (Negativo)

Descripción: Acceso al mapa sin permisos.

Datos de Entrada:
Usuario no autorizado.

Pasos:

Scenario: Acceso no autorizado al mapa
  Given que el usuario no tiene rol permitido
  When intenta acceder al mapa
  Then el sistema bloquea el acceso


Resultado Esperado: Respuesta 403 Forbidden.

🧪 TC-US-019-03 (Borde)

Descripción: Visualización con alta concurrencia.

Datos de Entrada:
Múltiples usuarios conectados.

Pasos:

Scenario: Mapa con múltiples usuarios
  Given que varios usuarios observan el mapa
  When cambia el estado de una mesa
  Then todos reciben la actualización


Resultado Esperado: Sincronización correcta.

🧪 HU US-020 – Liberar Mesa Automáticamente
🧪 TC-US-020-01 (Positivo)

Descripción: Liberar mesa al cancelar pedido.

Datos de Entrada:
Pedido cancelado.

Pasos:

Scenario: Liberación automática de mesa
  Given que un pedido es cancelado
  When el flujo finaliza
  Then la mesa asociada queda disponible


Resultado Esperado: Mesa liberada.

🧪 TC-US-020-02 (Negativo)

Descripción: Intentar liberar mesa sin pedido.

Datos de Entrada:
Mesa sin pedido activo.

Pasos:

Scenario: Liberación inválida de mesa
  Given que la mesa no tiene pedido activo
  When se intenta liberar
  Then el sistema no realiza cambios


Resultado Esperado: Estado permanece igual.

🧪 TC-US-020-03 (Borde)

Descripción: Liberación simultánea por eventos duplicados.

Datos de Entrada:
Eventos duplicados desde backend.

Pasos:

Scenario: Eventos duplicados de liberación
  Given que llegan eventos duplicados
  When el sistema los procesa
  Then la mesa queda disponible una sola vez


Resultado Esperado: Idempotencia garantizada.

📝 MÓDULO 5 – PEDIDOS
Historias de Usuario: US-021 a US-026
🧪 HU US-021 – Crear Pedido
🧪 TC-US-021-01 (Positivo)

Descripción: Crear un pedido con productos válidos y mesa asignada.

Datos de Entrada:
Mesa disponible, lista de productos válida.

Pasos:

Scenario: Creación exitosa de pedido
  Given que el mesero está autenticado
  And la mesa está disponible
  When crea un pedido con productos válidos
  Then el pedido se guarda en estado pending


Resultado Esperado: Pedido creado correctamente.

🧪 TC-US-021-02 (Negativo)

Descripción: Crear pedido sin seleccionar mesa.

Datos de Entrada:
Lista de productos sin mesa.

Pasos:

Scenario: Creación de pedido sin mesa
  Given que el mesero está autenticado
  When intenta crear un pedido sin mesa
  Then el sistema rechaza la operación


Resultado Esperado: Error de validación.

🧪 TC-US-021-03 (Borde)

Descripción: Crear pedido con cantidad máxima de productos.

Datos de Entrada:
Pedido con límite máximo permitido de ítems.

Pasos:

Scenario: Pedido con cantidad máxima
  Given que el pedido tiene el máximo de productos permitidos
  When se envía
  Then el sistema lo procesa correctamente


Resultado Esperado: Pedido creado sin degradar rendimiento.

🧪 HU US-022 – Enviar Pedido a Cocina
🧪 TC-US-022-01 (Positivo)

Descripción: Enviar pedido correctamente a cocina.

Datos de Entrada:
Pedido en estado pending.

Pasos:

Scenario: Envío exitoso de pedido
  Given que el pedido está en estado pending
  When el mesero lo envía
  Then el backend lo confirma en menos de 2 segundos


Resultado Esperado: Pedido confirmado.

🧪 TC-US-022-02 (Negativo)

Descripción: Enviar pedido ya confirmado.

Datos de Entrada:
Pedido en estado confirmed.

Pasos:

Scenario: Envío duplicado de pedido
  Given que el pedido ya fue confirmado
  When se intenta reenviar
  Then el sistema bloquea la acción


Resultado Esperado: Respuesta 409 Conflict.

🧪 TC-US-022-03 (Borde)

Descripción: Enviar pedido bajo alta latencia.

Datos de Entrada:
Backend con latencia elevada.

Pasos:

Scenario: Envío de pedido con latencia
  Given que existe latencia en la red
  When se envía el pedido
  Then el sistema garantiza la entrega


Resultado Esperado: Pedido entregado sin pérdida.

🧪 HU US-023 – Validar Pedido Vacío
🧪 TC-US-023-01 (Negativo)

Descripción: Intentar enviar un pedido sin productos.

Datos de Entrada:
Pedido vacío.

Pasos:

Scenario: Pedido vacío
  Given que el mesero no agrega productos
  When intenta enviar el pedido
  Then el sistema bloquea la operación


Resultado Esperado: Mensaje de validación.

🧪 TC-US-023-02 (Borde)

Descripción: Pedido con un solo producto.

Datos de Entrada:
Pedido con un producto.

Pasos:

Scenario: Pedido con un solo producto
  Given que el pedido tiene un producto
  When se envía
  Then el sistema lo acepta


Resultado Esperado: Pedido creado correctamente.

🧪 HU US-024 – Editar Pedido en Estado Pending
🧪 TC-US-024-01 (Positivo)

Descripción: Editar productos en pedido pending.

Datos de Entrada:
Pedido pending.

Pasos:

Scenario: Edición de pedido pendiente
  Given que el pedido está en estado pending
  When el mesero modifica los productos
  Then los cambios se guardan


Resultado Esperado: Pedido actualizado.

🧪 TC-US-024-02 (Negativo)

Descripción: Editar pedido en estado preparing.

Datos de Entrada:
Pedido preparing.

Pasos:

Scenario: Edición no permitida
  Given que el pedido está en estado preparing
  When el mesero intenta editarlo
  Then el sistema rechaza la acción


Resultado Esperado: Respuesta 409 Conflict.

🧪 TC-US-024-03 (Borde)

Descripción: Ediciones consecutivas rápidas.

Datos de Entrada:
Múltiples ediciones seguidas.

Pasos:

Scenario: Ediciones consecutivas
  Given que el pedido recibe ediciones rápidas
  When el sistema procesa los cambios
  Then mantiene consistencia final


Resultado Esperado: Pedido consistente.

🧪 HU US-025 – Cancelar Pedido
🧪 TC-US-025-01 (Positivo)

Descripción: Cancelar pedido en estado pending.

Datos de Entrada:
Pedido pending.

Pasos:

Scenario: Cancelación de pedido
  Given que el pedido está pending
  When el mesero lo cancela
  Then el pedido pasa a estado cancelled


Resultado Esperado: Pedido cancelado.

🧪 TC-US-025-02 (Negativo)

Descripción: Cancelar pedido en preparing.

Datos de Entrada:
Pedido preparing.

Pasos:

Scenario: Cancelación no permitida
  Given que el pedido está en estado preparing
  When se intenta cancelar
  Then el sistema bloquea la acción


Resultado Esperado: Error de estado inválido.

🧪 TC-US-025-03 (Borde)

Descripción: Cancelación simultánea.

Datos de Entrada:
Dos solicitudes de cancelación.

Pasos:

Scenario: Cancelación concurrente
  Given que se envían dos solicitudes
  When el sistema las procesa
  Then el pedido se cancela una sola vez


Resultado Esperado: Operación idempotente.

🧪 HU US-026 – Visualizar Estado del Pedido
🧪 TC-US-026-01 (Positivo)

Descripción: Ver estado actualizado del pedido.

Datos de Entrada:
Pedido existente.

Pasos:

Scenario: Visualización de estado
  Given que el pedido cambia de estado
  When el mesero lo consulta
  Then visualiza el estado actualizado


Resultado Esperado: Estado correcto.

🧪 TC-US-026-02 (Negativo)

Descripción: Consultar pedido inexistente.

Datos de Entrada:
ID inválido.

Pasos:

Scenario: Consulta inválida
  Given que el pedido no existe
  When se consulta
  Then el sistema devuelve error


Resultado Esperado: Respuesta 404.

🧪 TC-US-026-03 (Borde)

Descripción: Consulta masiva de estados.

Datos de Entrada:
Muchos pedidos simultáneos.

Pasos:

Scenario: Consulta bajo carga
  Given que hay múltiples consultas concurrentes
  When se solicitan estados
  Then el sistema responde dentro del SLA


Resultado Esperado: Rendimiento aceptable.

# 👨‍🍳 MÓDULO 6 – COCINA Y PROCESAMIENTO ASÍNCRONO
## Historias de Usuario: US-027 a US-030
🧪 HU US-027 – Recepción de Pedido en Cocina (RabbitMQ)
🧪 TC-US-027-01 (Positivo)
Descripción: El pedido enviado es recibido correctamente por la cocina mediante RabbitMQ.

Datos de Entrada:
Pedido en estado confirmed, cola RabbitMQ activa.

Pasos:

Scenario: Recepción correcta de pedido en cocina
  Given que el pedido fue confirmado
  And RabbitMQ está operativo
  When el mensaje es publicado
  Then el worker de cocina consume el pedido secuencialmente

Resultado Esperado: Pedido visible en la vista de cocina.

🧪 TC-US-027-02 (Negativo)
Descripción: Falla en la publicación del mensaje en RabbitMQ.

Datos de Entrada:
RabbitMQ detenido.

Pasos:

Scenario: Falla de publicación en RabbitMQ
  Given que RabbitMQ no está disponible
  When el backend intenta publicar el pedido
  Then el sistema registra el error
  And el pedido no se pierde

Resultado Esperado: Pedido queda pendiente de reintento y auditado.

🧪 TC-US-027-03 (Borde)
Descripción: Recepción de múltiples pedidos simultáneos.

Datos de Entrada:
Ráfaga de 200 pedidos.

Pasos:

Scenario: Procesamiento secuencial bajo carga
  Given que se publican múltiples pedidos simultáneamente
  When el worker los consume
  Then se procesan uno a uno respetando prefetch=1

Resultado Esperado: No hay desorden ni pérdida de mensajes.

🧪 HU US-028 – Iniciar Preparación del Pedido
🧪 TC-US-028-01 (Positivo)
Descripción: El cocinero inicia la preparación de un pedido pendiente.

Datos de Entrada:
Pedido en estado pending.

Pasos:

Scenario: Inicio de preparación
  Given que el pedido está en estado pending
  When el cocinero lo toma
  Then el estado cambia a preparing

Resultado Esperado: Pedido marcado como preparing.

🧪 TC-US-028-02 (Negativo)
Descripción: Intentar iniciar preparación de un pedido ya tomado.

Datos de Entrada:
Pedido en estado preparing.

Pasos:

Scenario: Pedido ya en preparación
  Given que el pedido ya está en estado preparing
  When otro cocinero intenta tomarlo
  Then el sistema bloquea la acción

Resultado Esperado: Error de concurrencia.

🧪 TC-US-028-03 (Borde)
Descripción: Dos cocineros intentan tomar el mismo pedido al mismo tiempo.

Datos de Entrada:
Acciones concurrentes.

Pasos:

Scenario: Toma concurrente de pedido
  Given que dos cocineros seleccionan el mismo pedido
  When el sistema procesa las solicitudes
  Then solo uno obtiene el pedido

Resultado Esperado: Control de concurrencia exitoso.

🧪 HU US-029 – Marcar Pedido como Listo
🧪 TC-US-029-01 (Positivo)
Descripción: El cocinero finaliza la preparación del pedido.

Datos de Entrada:
Pedido en estado preparing.

Pasos:

Scenario: Pedido listo
  Given que el pedido está preparing
  When el cocinero lo finaliza
  Then el estado cambia a ready

Resultado Esperado: Pedido listo para entregar.

🧪 TC-US-029-02 (Negativo)
Descripción: Intentar marcar pedido como listo sin estar en preparación.

Datos de Entrada:
Pedido en estado pending.

Pasos:

Scenario: Cambio de estado inválido
  Given que el pedido está pending
  When el cocinero intenta marcarlo como ready
  Then el sistema rechaza la acción

Resultado Esperado: Error de validación de estado.

🧪 TC-US-029-03 (Borde)
Descripción: Finalización justo antes de desconexión del worker.

Datos de Entrada:
Pedido preparing, desconexión inminente.

Pasos:

Scenario: Finalización durante inestabilidad
  Given que el pedido está a punto de finalizarse
  When ocurre una desconexión temporal
  Then el sistema conserva el estado correcto

Resultado Esperado: No hay inconsistencia de estado.

🧪 HU US-030 – Notificaciones en Tiempo Real (WebSocket)
🧪 TC-US-030-01 (Positivo)
Descripción: El mesero recibe notificación de cambio de estado.

Datos de Entrada:
Pedido cambia a ready.

Pasos:

Scenario: Notificación en tiempo real
  Given que el pedido cambia de estado
  When el evento se emite por WebSocket
  Then el mesero recibe la actualización en tiempo real

Resultado Esperado: Vista del mesero actualizada.

🧪 TC-US-030-02 (Negativo)
Descripción: WebSocket desconectado.

Datos de Entrada:
Conexión WebSocket caída.

Pasos:

Scenario: Falla de WebSocket
  Given que el WebSocket no está disponible
  When el pedido cambia de estado
  Then el sistema permite consultar el estado vía API

Resultado Esperado: Continuidad operativa garantizada.

🧪 TC-US-030-03 (Borde)
Descripción: Reconexión automática del WebSocket.

Datos de Entrada:
Reconexión tras caída breve.

Pasos:

Scenario: Reconexión WebSocket
  Given que la conexión se restablece
  When el cliente se reconecta
  Then recibe el último estado del pedido

Resultado Esperado: Sincronización correcta.



# 📊 MÓDULO 7 – AUDITORÍA Y REPORTES
## Historias de Usuario: US-031 a US-035
🧪 HU US-031 – Cierre de Pedido
🧪 TC-US-031-01 (Positivo)
Descripción: Cerrar correctamente un pedido que está listo.

Datos de Entrada:
Pedido en estado ready.

Pasos:

gherkin
Copiar código
Scenario: Cierre correcto de pedido
  Given que el pedido está en estado ready
  When el mesero confirma el cierre
  Then el pedido cambia a estado closed
Resultado Esperado: Pedido cerrado correctamente y no editable.

🧪 TC-US-031-02 (Negativo)
Descripción: Intentar cerrar un pedido que no está listo.

Datos de Entrada:
Pedido en estado preparing.

Pasos:

gherkin
Copiar código
Scenario: Cierre inválido de pedido
  Given que el pedido está en estado preparing
  When el mesero intenta cerrarlo
  Then el sistema rechaza la operación
Resultado Esperado: Error de validación de estado.

🧪 TC-US-031-03 (Borde)
Descripción: Cierre del pedido justo después de cambiar a ready.

Datos de Entrada:
Pedido cambia a ready.

Pasos:

Scenario: Cierre inmediato post-ready
  Given que el pedido acaba de cambiar a ready
  When el mesero lo cierra inmediatamente
  Then el sistema permite el cierre sin errores

Resultado Esperado: Pedido cerrado sin inconsistencias.

🧪 HU US-032 – Auditoría de Cambios de Estado
🧪 TC-US-032-01 (Positivo)
Descripción: Registrar correctamente los cambios de estado de un pedido.

Datos de Entrada:
Pedido cambia de estado.

Pasos:

Scenario: Registro de auditoría
  Given que un pedido cambia de estado
  When el cambio se procesa
  Then se registra fecha, usuario y estado nuevo

Resultado Esperado: Auditoría completa y persistida.

🧪 TC-US-032-02 (Negativo)
Descripción: Falla en el registro de auditoría.

Datos de Entrada:
Error en base de datos.

Pasos:

Scenario: Falla en auditoría
  Given que ocurre un error al guardar auditoría
  When el pedido cambia de estado
  Then el sistema notifica el error

Resultado Esperado: Error controlado y log registrado.

🧪 TC-US-032-03 (Borde)
Descripción: Auditoría con múltiples cambios consecutivos.

Datos de Entrada:
Pedido con varios cambios en corto tiempo.

Pasos:

gherkin
Copiar código
Scenario: Auditoría intensiva
  Given que el pedido cambia varias veces de estado
  When los eventos se registran
  Then cada cambio queda auditado correctamente
Resultado Esperado: Auditoría consistente sin pérdida de datos.

🧪 HU US-033 – Recuperación ante Fallos del Worker
🧪 TC-US-033-01 (Positivo)
Descripción: Recuperación automática tras caída del worker.

Datos de Entrada:
Worker desconectado con pedidos en cola.

Pasos:

Scenario: Recuperación del worker
  Given que el worker se desconecta
  When se reconecta
  Then procesa los pedidos pendientes

Resultado Esperado: Ningún pedido se pierde.

🧪 TC-US-033-02 (Negativo)
Descripción: Worker no se reconecta automáticamente.

Datos de Entrada:
Falla persistente del worker.

Pasos:

Scenario: Falla prolongada del worker
  Given que el worker no logra reconectarse
  When pasan los reintentos configurados
  Then el sistema alerta la falla

Resultado Esperado: Alerta generada y pedidos conservados.

🧪 TC-US-033-03 (Borde)
Descripción: Reconexión durante alta carga.

Datos de Entrada:
200 pedidos en cola.

Pasos:

Scenario: Reconexión bajo carga
  Given que el worker se reconecta con alta carga
  When inicia el consumo
  Then procesa los pedidos secuencialmente

Resultado Esperado: Consumo ordenado sin corrupción.

🧪 HU US-034 – Detección de Pedido Perdido
🧪 TC-US-034-01 (Positivo)
Descripción: Detectar pedido que no llegó al worker.

Datos de Entrada:
Pedido publicado no consumido.

Pasos:

Scenario: Detección de pedido no consumido
  Given que un pedido no fue consumido
  When el sistema valida consistencia
  Then el pedido se marca como inconsistente

Resultado Esperado: Pedido auditado y marcado para revisión.

🧪 TC-US-034-02 (Negativo)
Descripción: Falso positivo de pedido perdido.

Datos de Entrada:
Pedido en proceso normal.

Pasos:

gherkin
Copiar código
Scenario: Validación incorrecta
  Given que el pedido está en procesamiento
  When se ejecuta la verificación
  Then el sistema no lo marca como perdido
Resultado Esperado: Sin alertas incorrectas.

🧪 TC-US-034-03 (Borde)
Descripción: Pedido retrasado pero válido.

Datos de Entrada:
Pedido con consumo lento.

Pasos:

Scenario: Pedido con latencia elevada
  Given que el pedido tarda en consumirse
  When el tiempo límite no se excede
  Then no se marca como perdido

Resultado Esperado: Pedido válido sin auditoría errónea.

🧪 HU US-035 – Generación de Reportes
🧪 TC-US-035-01 (Positivo)
Descripción: Generar reporte por rango de fechas.

Datos de Entrada:
Rango válido de fechas.

Pasos:

gherkin
Copiar código
Scenario: Generación correcta de reporte
  Given que el administrador selecciona un rango de fechas
  When solicita el reporte
  Then el sistema genera el reporte correctamente
Resultado Esperado: Reporte disponible con datos correctos.

🧪 TC-US-035-02 (Negativo)
Descripción: Generar reporte sin permisos.

Datos de Entrada:
Usuario no administrador.

Pasos:

Scenario: Acceso no autorizado a reportes
  Given que el usuario no es administrador
  When intenta generar un reporte
  Then el sistema bloquea la acción

Resultado Esperado: Error 403 Forbidden.

🧪 TC-US-035-03 (Borde)
Descripción: Reporte con rango de fechas extremo.

Datos de Entrada:
Rango amplio (1 año).

Pasos:

Scenario: Reporte de gran volumen
  Given que el rango de fechas es amplio
  When el sistema genera el reporte
  Then lo hace sin degradar el rendimiento

Resultado Esperado: Reporte generado dentro del tiempo aceptable.

