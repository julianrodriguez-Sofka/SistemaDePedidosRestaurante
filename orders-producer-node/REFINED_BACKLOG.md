# 📋 HISTORIAS DE USUARIO COMPLETAS - SISTEMA DE PEDIDOS DE RESTAURANTE
## Ordenadas Secuencialmente (1-35) con Principios INVEST

---

## 🔐 FASE 1: AUTENTICACIÓN Y CONTROL DE ACCESO (Historias 1-5)

### Historia de Usuario 01: Seleccionar Rol de Usuario
**Identificador único (ID):** US-001

**Descripción:**  
Como usuario del sistema,  
Quiero seleccionar mi rol (Mesero, Cocinero o Administrador) desde una pantalla inicial,  
Para ser dirigido a la interfaz de login específica de mi rol y acceder a las funcionalidades correspondientes.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la URL raíz del sistema,  
Cuando la página se carga,  
Entonces veo tres opciones claramente diferenciadas: "Mesero", "Cocinero" y "Administrador" en menos de 800 milisegundos.

**CA-2:**  
Dado que selecciono el rol "Mesero",  
Cuando hago clic,  
Entonces soy redirigido a la página de login de mesero (/waiter/login) en menos de 300 milisegundos.

**CA-3:**  
Dado que selecciono el rol "Cocinero",  
Cuando hago clic,  
Entonces soy redirigido a la página de login de cocinero (/chef/login) en menos de 300 milisegundos.

**CA-4:**  
Dado que selecciono el rol "Administrador",  
Cuando hago clic,  
Entonces soy redirigido a la página de login de administrador (/admin/login) en menos de 300 milisegundos.

**Resumen:**  
Pantalla de selección de rol con redirección rápida a interfaces de login diferenciadas, mejorando la experiencia de usuario y separación de permisos.

---

### Historia de Usuario 02: Login de Mesero
**Identificador único (ID):** US-002

**Descripción:**  
Como mesero del restaurante,  
Quiero autenticarme en el sistema con mis credenciales,  
Para acceder a la interfaz de toma de pedidos de forma segura y que el sistema registre quién realizó cada acción.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la pantalla de login de mesero,  
Cuando ingreso un nombre de usuario válido (mínimo 3 caracteres alfanuméricos) y una contraseña válida (mínimo 6 caracteres),  
Entonces el sistema me autentica exitosamente en menos de 800 milisegundos y me redirige a la interfaz de pedidos.

**CA-2:**  
Dado que intento autenticarme con credenciales incorrectas,  
Cuando envío el formulario,  
Entonces el sistema muestra un mensaje de error claro ("Usuario o contraseña incorrectos") en menos de 500 milisegundos y no me permite acceder.

**CA-3:**  
Dado que me he autenticado exitosamente,  
Cuando navego por la aplicación,  
Entonces mi nombre de usuario aparece visible en el encabezado y todos los pedidos que creo quedan registrados con mi identificador.

**CA-4:**  
Dado que intento acceder directamente a una ruta protegida sin autenticarme,  
Cuando el sistema valida mi sesión,  
Entonces me redirige automáticamente a la pantalla de login en menos de 300 milisegundos.

**Resumen:**  
Autenticación segura con JWT, validación de credenciales, redirección automática y registro de auditoría con tiempos de respuesta menores a 800ms.

---

### Historia de Usuario 03: Login de Cocinero
**Identificador único (ID):** US-003

**Descripción:**  
Como cocinero del restaurante,  
Quiero autenticarme en el sistema con mis credenciales,  
Para acceder a la interfaz de cocina y gestionar los pedidos asignados a mi estación.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la pantalla de login de cocinero,  
Cuando ingreso credenciales válidas,  
Entonces el sistema me autentica en menos de 800 milisegundos y me redirige a la interfaz de cocina.

**CA-2:**  
Dado que me he autenticado como cocinero,  
Cuando accedo al sistema,  
Entonces solo veo los pedidos en estado "pending" y "preparing", y no tengo acceso a funciones administrativas.

**CA-3:**  
Dado que intento acceder a rutas de administrador o mesero,  
Cuando el sistema valida mi rol,  
Entonces me muestra un mensaje de "Acceso denegado" y me redirige a mi interfaz de cocina.

**Resumen:**  
Autenticación basada en roles (RBAC) con control de acceso estricto, validación de permisos y restricción de funcionalidades.

---

### Historia de Usuario 04: Login de Administrador
**Identificador único (ID):** US-004

**Descripción:**  
Como administrador del restaurante,  
Quiero autenticarme en el sistema con mis credenciales de alto privilegio,  
Para acceder al panel de administración y gestionar usuarios, productos, mesas y configuraciones.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la pantalla de login de administrador,  
Cuando ingreso credenciales de administrador válidas,  
Entonces el sistema me autentica en menos de 800 milisegundos y me redirige al dashboard administrativo.

**CA-2:**  
Dado que me he autenticado como administrador,  
Cuando accedo al sistema,  
Entonces tengo acceso completo a todas las funcionalidades: usuarios, productos, mesas, pedidos y configuración.

**CA-3:**  
Dado que intento realizar una acción administrativa crítica (eliminar usuario, modificar roles),  
Cuando ejecuto la acción,  
Entonces el sistema registra un log de auditoría con mi identificador, la acción realizada, timestamp y resultado.

**CA-4:**  
Dado que mi sesión ha expirado (más de 8 horas de inactividad),  
Cuando intento realizar una acción,  
Entonces el sistema me redirige al login mostrando "Sesión expirada, por favor inicie sesión nuevamente".

**Resumen:**  
Autenticación con máximo privilegio, auditoría completa de acciones críticas, gestión de sesiones con timeout de 8 horas.

---

### Historia de Usuario 05: Cerrar Sesión (Logout)
**Identificador único (ID):** US-005

**Descripción:**  
Como usuario autenticado (mesero, cocinero o administrador),  
Quiero cerrar sesión de forma segura,  
Para proteger mi cuenta y asegurar que nadie más pueda realizar acciones en mi nombre.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy autenticado y presiono el botón "Cerrar Sesión",  
Cuando confirmo la acción,  
Entonces el sistema elimina mi token del localStorage, invalida mi sesión en menos de 300 milisegundos y me redirige a la pantalla de selección de rol.

**CA-2:**  
Dado que he cerrado sesión,  
Cuando intento acceder a una ruta protegida usando el navegador (historial o URL directa),  
Entonces el sistema me redirige automáticamente al login sin mostrar contenido protegido.

**CA-3:**  
Dado que cierro sesión,  
Cuando el proceso se completa,  
Entonces no quedan datos sensibles en el almacenamiento local del navegador (tokens, información de usuario).

**Resumen:**  
Cierre de sesión seguro con limpieza completa de tokens, invalidación de sesión y redirección automática en menos de 300ms.

---

## 👥 FASE 2: GESTIÓN DE USUARIOS (Historias 6-9)

### Historia de Usuario 06: Crear Usuario
**Identificador único (ID):** US-006

**Descripción:**  
Como administrador del restaurante,  
Quiero crear nuevos usuarios (meseros, cocineros, administradores) desde el panel de administración,  
Para gestionar el personal que tendrá acceso al sistema y asignarles roles específicos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de gestión de usuarios,  
Cuando ingreso un nombre de usuario único (3-30 caracteres alfanuméricos), una contraseña segura (mínimo 6 caracteres), un nombre completo (mínimo 3 caracteres) y selecciono un rol válido (waiter, chef, admin),  
Entonces el usuario se crea exitosamente en menos de 600 milisegundos y aparece en la lista.

**CA-2:**  
Dado que intento crear un usuario con un nombre de usuario ya existente,  
Cuando envío el formulario,  
Entonces el sistema muestra "El nombre de usuario ya existe" y no permite la creación.

**CA-3:**  
Dado que creo un usuario exitosamente,  
Cuando el proceso finaliza,  
Entonces el nuevo usuario puede autenticarse inmediatamente con las credenciales proporcionadas.

**CA-4:**  
Dado que intento crear un usuario sin completar campos obligatorios,  
Cuando envío el formulario,  
Entonces el sistema muestra mensajes de validación específicos para cada campo faltante.

**Resumen:**  
Creación de usuarios con validación de unicidad, encriptación de contraseñas (bcrypt), asignación de roles y disponibilidad inmediata, todo en menos de 600ms.

---

### Historia de Usuario 07: Editar Usuario
**Identificador único (ID):** US-007

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar la información de usuarios existentes,  
Para actualizar sus datos personales, cambiar sus roles o restablecer sus contraseñas.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un usuario existente,  
Cuando modifico su nombre completo, rol o estado (activo/inactivo) y guardo,  
Entonces los cambios se aplican en menos de 500 milisegundos y son visibles inmediatamente.

**CA-2:**  
Dado que cambio el rol de un usuario de "mesero" a "cocinero",  
Cuando el usuario inicia sesión nuevamente,  
Entonces ve la interfaz correspondiente a su nuevo rol y tiene los permisos actualizados.

**CA-3:**  
Dado que desactivo un usuario,  
Cuando el usuario intenta autenticarse,  
Entonces el sistema muestra "Usuario desactivado, contacte al administrador" y no permite el acceso.

**CA-4:**  
Dado que restablezco la contraseña de un usuario,  
Cuando guardo los cambios,  
Entonces la nueva contraseña se encripta y el usuario debe usarla en su próximo inicio de sesión.

**Resumen:**  
Edición de usuarios con propagación inmediata de cambios de rol, gestión de estado (activo/inactivo) y restablecimiento seguro de contraseñas.

---

### Historia de Usuario 08: Eliminar Usuario
**Identificador único (ID):** US-008

**Descripción:**  
Como administrador del restaurante,  
Quiero eliminar usuarios del sistema,  
Para remover personal que ya no trabaja en el restaurante y mantener la base de datos limpia.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un usuario sin pedidos activos asociados,  
Cuando confirmo la eliminación,  
Entonces el usuario se elimina lógicamente (soft delete) en menos de 400 milisegundos y ya no aparece en la lista de usuarios activos.

**CA-2:**  
Dado que intento eliminar un usuario con pedidos activos o recientes (últimas 24 horas),  
Cuando confirmo la eliminación,  
Entonces el sistema muestra "Este usuario tiene pedidos activos, no se puede eliminar" y previene la eliminación.

**CA-3:**  
Dado que elimino un usuario,  
Cuando el proceso finaliza,  
Entonces el usuario no puede autenticarse nuevamente y recibe "Usuario no encontrado o desactivado".

**CA-4:**  
Dado que intento eliminar mi propia cuenta de administrador,  
Cuando confirmo la eliminación,  
Entonces el sistema muestra "No puede eliminar su propia cuenta" y previene la acción.

**Resumen:**  
Eliminación lógica con validación de integridad referencial, prevención de auto-eliminación y bloqueo inmediato de acceso.

---

### Historia de Usuario 09: Listar y Buscar Usuarios
**Identificador único (ID):** US-009

**Descripción:**  
Como administrador del restaurante,  
Quiero ver la lista completa de usuarios y buscar por nombre o rol,  
Para gestionar eficientemente el personal y encontrar usuarios específicos rápidamente.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la página de gestión de usuarios,  
Cuando la vista se carga,  
Entonces veo todos los usuarios activos con su nombre, username, rol y estado en menos de 1 segundo.

**CA-2:**  
Dado que escribo en el campo de búsqueda,  
Cuando ingreso caracteres,  
Entonces el sistema filtra los resultados en tiempo real (mientras escribo) mostrando coincidencias por nombre o username en menos de 300 milisegundos.

**CA-3:**  
Dado que aplico un filtro por rol (waiter/chef/admin),  
Cuando selecciono el filtro,  
Entonces el sistema muestra solo los usuarios del rol seleccionado en menos de 400 milisegundos.

**CA-4:**  
Dado que aplico un filtro por estado (activo/inactivo),  
Cuando selecciono el filtro,  
Entonces el sistema muestra solo los usuarios del estado seleccionado en menos de 400 milisegundos.

**Resumen:**  
Lista de usuarios con búsqueda en tiempo real, filtros múltiples (rol, estado) y carga rápida (< 1s).

---

## 🍽️ FASE 3: GESTIÓN DE PRODUCTOS Y CATEGORÍAS (Historias 10-15)

### Historia de Usuario 10: Crear Categoría de Producto
**Identificador único (ID):** US-010

**Descripción:**  
Como administrador del restaurante,  
Quiero crear categorías de productos rápidamente,  
Para organizar el menú y asegurar que la interfaz de pedidos vea los cambios en menos de 2 segundos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de gestión de categorías,  
Cuando ingreso un nombre válido (entre 3 y 50 caracteres alfanuméricos) y guardo,  
Entonces la categoría se crea exitosamente en menos de 500 milisegundos y aparece en la lista.

**CA-2:**  
Dado que una nueva categoría ha sido creada,  
Cuando un mesero accede a la interfaz de pedidos,  
Entonces la nueva categoría es visible en el filtro en menos de 2 segundos.

**CA-3:**  
Dado que intento crear una categoría con un nombre ya existente,  
Cuando guardo,  
Entonces el sistema muestra "La categoría ya existe" y previene la creación duplicada.

**Resumen:**  
Creación de categorías con validación de unicidad, propagación en tiempo real (< 2s) vía WebSocket.

---

### Historia de Usuario 11: Editar Categoría de Producto
**Identificador único (ID):** US-011

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar el nombre de categorías existentes,  
Para mantener la organización del menú actualizada y coherente.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono una categoría y actualizo su nombre,  
Cuando guardo los cambios,  
Entonces el nuevo nombre se propaga y es visible en la interfaz de pedidos en un plazo no mayor a 2 segundos.

**CA-2:**  
Dado que modifico una categoría,  
Cuando guardo,  
Entonces todos los productos asociados mantienen su vinculación y se muestran bajo el nuevo nombre de categoría.

**CA-3:**  
Dado que intento cambiar el nombre a uno ya existente,  
Cuando guardo,  
Entonces el sistema muestra "El nombre de categoría ya existe" y previene el cambio.

**Resumen:**  
Edición de categorías con propagación en tiempo real (< 2s), preservación de vínculos con productos y validación de unicidad.

---

### Historia de Usuario 12: Eliminar Categoría de Producto
**Identificador único (ID):** US-012

**Descripción:**  
Como administrador del restaurante,  
Quiero eliminar categorías obsoletas del menú,  
Para mantener la organización limpia y evitar confusiones.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono una categoría sin productos asociados,  
Cuando confirmo la eliminación,  
Entonces el registro es eliminado lógicamente y deja de aparecer en la interfaz de pedidos inmediatamente.

**CA-2:**  
Dado que una categoría tiene al menos un producto asociado activo,  
Cuando intento eliminarla,  
Entonces el sistema muestra "No se puede eliminar, asocie los productos a otra categoría primero" y previene la eliminación.

**CA-3:**  
Dado que elimino una categoría sin productos,  
Cuando el proceso finaliza,  
Entonces la categoría desaparece de todos los filtros en menos de 2 segundos.

**Resumen:**  
Eliminación lógica con validación de integridad referencial y propagación inmediata (< 2s) vía WebSocket.

---

### Historia de Usuario 13: Crear Producto
**Identificador único (ID):** US-013

**Descripción:**  
Como administrador del restaurante,  
Quiero crear nuevos productos en el menú,  
Para mantener actualizado el catálogo de alimentos y bebidas disponibles.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de gestión de productos,  
Cuando ingreso nombre válido (3-100 caracteres), precio válido (> 0, máximo 2 decimales), descripción opcional (máximo 500 caracteres), categoría válida y guardo,  
Entonces el producto se crea exitosamente en menos de 600 milisegundos.

**CA-2:**  
Dado que un nuevo producto ha sido creado,  
Cuando un mesero accede a la interfaz de pedidos,  
Entonces el nuevo producto es visible y seleccionable en menos de 2 segundos desde su creación.

**CA-3:**  
Dado que intento crear un producto sin completar campos obligatorios (nombre, precio, categoría),  
Cuando envío el formulario,  
Entonces el sistema muestra mensajes de validación específicos.

**CA-4:**  
Dado que cargo una imagen para el producto (JPG, PNG, WebP, máximo 2MB),  
Cuando guardo,  
Entonces la imagen se almacena correctamente y se muestra en la interfaz de pedidos.

**Resumen:**  
Creación de productos con validación de datos, propagación en tiempo real (< 2s) vía WebSocket, soporte de imágenes.

---

### Historia de Usuario 14: Editar Producto
**Identificador único (ID):** US-014

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar la información de productos existentes,  
Para actualizar precios, descripciones, imágenes o disponibilidad según cambios en el menú.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un producto existente,  
Cuando modifico su nombre, precio, descripción, categoría o imagen y guardo,  
Entonces los cambios se aplican en menos de 500 milisegundos y se propagan a la interfaz de pedidos.

**CA-2:**  
Dado que actualizo el precio de un producto,  
Cuando un mesero visualiza el producto,  
Entonces ve el nuevo precio reflejado en menos de 2 segundos.

**CA-3:**  
Dado que marco un producto como "no disponible",  
Cuando un mesero accede a la lista de productos,  
Entonces el producto aparece deshabilitado o con etiqueta "No disponible" y no puede ser agregado a nuevos pedidos.

**CA-4:**  
Dado que edito un producto que está en pedidos activos,  
Cuando guardo los cambios,  
Entonces los pedidos existentes mantienen el precio y datos originales, solo los nuevos pedidos reflejan los cambios.

**Resumen:**  
Edición con propagación en tiempo real (< 2s), gestión de disponibilidad y preservación de integridad de pedidos existentes.

---

### Historia de Usuario 15: Eliminar Producto
**Identificador único (ID):** US-015

**Descripción:**  
Como administrador del restaurante,  
Quiero eliminar productos obsoletos del menú,  
Para mantener el catálogo actualizado y evitar pedidos con productos que ya no se ofrecen.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un producto sin pedidos activos o pendientes,  
Cuando confirmo la eliminación,  
Entonces el producto se elimina lógicamente en menos de 400 milisegundos y deja de aparecer en la interfaz de pedidos inmediatamente.

**CA-2:**  
Dado que intento eliminar un producto que está en pedidos activos (pending, preparing),  
Cuando confirmo la eliminación,  
Entonces el sistema muestra "Este producto tiene pedidos activos, no se puede eliminar" y previene la eliminación.

**CA-3:**  
Dado que elimino un producto exitosamente,  
Cuando un mesero recarga su interfaz,  
Entonces el producto eliminado no aparece en la lista de productos disponibles.

**CA-4:**  
Dado que un producto ha sido eliminado lógicamente,  
Cuando consulto el historial de pedidos,  
Entonces los pedidos anteriores aún muestran el producto eliminado con sus datos originales (para auditoría).

**Resumen:**  
Eliminación lógica con validación de integridad referencial, prevención de eliminación de productos en pedidos activos.

---

## 🪑 FASE 4: GESTIÓN DE MESAS (Historias 16-20)

### Historia de Usuario 16: Crear Mesa
**Identificador único (ID):** US-016

**Descripción:**  
Como administrador del restaurante,  
Quiero crear nuevas mesas desde la interfaz de gestión,  
Para ampliar la capacidad del restaurante y asegurar que las nuevas mesas estén disponibles inmediatamente.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de gestión de mesas,  
Cuando ingreso número de mesa válido (único, numérico, entre 1 y 999), capacidad válida (entre 1 y 20 personas) y guardo,  
Entonces la mesa se crea exitosamente en menos de 500 milisegundos y aparece en la lista.

**CA-2:**  
Dado que una nueva mesa ha sido creada,  
Cuando la operación finaliza,  
Entonces la mesa está disponible con estado "available" y es visible en la interfaz de pedidos en un plazo no mayor a 2 segundos.

**CA-3:**  
Dado que intento crear una mesa con un número ya existente,  
Cuando guardo la información,  
Entonces el sistema muestra "El número de mesa ya existe, ingrese uno diferente" y previene la creación duplicada.

**CA-4:**  
Dado que ingreso un número de mesa inválido (no numérico, fuera de rango, o vacío),  
Cuando intento guardar,  
Entonces el sistema muestra un mensaje de error específico y no permite continuar.

**Resumen:**  
Creación de mesas con validación de unicidad, estado inicial "available", propagación en tiempo real (< 2s).

---

### Historia de Usuario 17: Visualizar y Gestionar Estado de Mesas
**Identificador único (ID):** US-017

**Descripción:**  
Como administrador del restaurante,  
Quiero visualizar en tiempo real el estado de todas las mesas,  
Para tomar decisiones rápidas sobre asignación, limpieza y disponibilidad.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la interfaz de gestión de mesas,  
Cuando la vista se carga,  
Entonces se muestran todas las mesas con su estado actual (available, occupied, reserved, cleaning) en menos de 1 segundo.

**CA-2:**  
Dado que el estado de una mesa cambia,  
Cuando ocurre el cambio,  
Entonces la actualización se refleja en la interfaz del administrador y en la interfaz de pedidos en menos de 2 segundos.

**CA-3:**  
Dado que selecciono una mesa,  
Cuando visualizo los detalles,  
Entonces puedo ver: número, capacidad, estado actual, historial de cambios (últimos 5 eventos) y pedidos asociados activos.

**CA-4:**  
Dado que necesito cambiar el estado de una mesa,  
Cuando selecciono un nuevo estado válido y confirmo,  
Entonces el cambio se aplica en menos de 500 milisegundos y es visible para todo el personal.

**CA-5:**  
Dado que una mesa está asociada a un pedido activo,  
Cuando intento marcarla como "available" o "reserved",  
Entonces el sistema muestra "No se puede cambiar el estado mientras haya un pedido activo" y previene el cambio.

**Resumen:**  
Visualización en tiempo real (< 1s carga, < 2s propagación) con historial, validación de integridad y sincronización vía WebSocket.

---

### Historia de Usuario 18: Editar Mesa
**Identificador único (ID):** US-018

**Descripción:**  
Como administrador del restaurante,  
Quiero modificar la información de mesas existentes,  
Para actualizar su número, capacidad o configuración según cambios en la distribución.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono una mesa sin pedidos activos,  
Cuando modifico su número (manteniendo unicidad), capacidad o estado y guardo,  
Entonces los cambios se aplican en menos de 500 milisegundos y se propagan a todas las interfaces.

**CA-2:**  
Dado que intento cambiar el número a uno ya existente,  
Cuando guardo,  
Entonces el sistema muestra "El número de mesa ya existe" y previene la modificación.

**CA-3:**  
Dado que modifico la capacidad de una mesa,  
Cuando guardo los cambios,  
Entonces la nueva capacidad es visible inmediatamente en la interfaz de pedidos del mesero.

**CA-4:**  
Dado que una mesa tiene un pedido activo,  
Cuando intento modificar su número,  
Entonces el sistema muestra "No se puede cambiar el número mientras hay pedidos activos" y previene el cambio.

**Resumen:**  
Edición con validación de unicidad, propagación en tiempo real (< 500ms) y protección de integridad referencial.

---

### Historia de Usuario 19: Eliminar Mesa
**Identificador único (ID):** US-019

**Descripción:**  
Como administrador del restaurante,  
Quiero eliminar mesas del sistema,  
Para ajustar la capacidad según cambios en la distribución física y mantener la base de datos actualizada.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono una mesa sin pedidos activos o históricos recientes (últimas 24 horas),  
Cuando confirmo la eliminación,  
Entonces la mesa se elimina lógicamente en menos de 400 milisegundos y deja de aparecer en todas las interfaces.

**CA-2:**  
Dado que intento eliminar una mesa con pedidos activos (pending, preparing, ready),  
Cuando confirmo la eliminación,  
Entonces el sistema muestra "Esta mesa tiene pedidos activos, no se puede eliminar" y previene la eliminación.

**CA-3:**  
Dado que elimino una mesa exitosamente,  
Cuando un mesero intenta crear un pedido,  
Entonces la mesa eliminada no aparece en el selector de mesas.

**CA-4:**  
Dado que una mesa ha sido eliminada lógicamente,  
Cuando consulto el historial de pedidos,  
Entonces los pedidos anteriores aún muestran el número de mesa original (para auditoría).

**Resumen:**  
Eliminación lógica con validación de integridad referencial, prevención de eliminación con pedidos activos.

---

### Historia de Usuario 20: Visualizar Mapa de Mesas en Tiempo Real
**Identificador único (ID):** US-020

**Descripción:**  
Como administrador o mesero del restaurante,  
Quiero ver un mapa visual del estado de todas las mesas,  
Para identificar rápidamente mesas disponibles y ocupadas de forma intuitiva.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo al mapa de mesas,  
Cuando la vista se carga,  
Entonces veo una representación visual de todas las mesas con colores según su estado: verde (disponible), rojo (ocupada), amarillo (reservada), azul (en limpieza) en menos de 1.5 segundos.

**CA-2:**  
Dado que el estado de una mesa cambia,  
Cuando ocurre la actualización,  
Entonces el color de la mesa en el mapa se actualiza automáticamente en menos de 2 segundos sin recargar la página.

**CA-3:**  
Dado que hago clic en una mesa del mapa,  
Cuando selecciono la mesa,  
Entonces veo un tooltip o modal con información detallada: número, capacidad, estado, pedido activo (si existe) y tiempo en el estado actual.

**CA-4:**  
Dado que filtro por estado (disponibles/ocupadas/reservadas),  
Cuando aplico el filtro,  
Entonces el mapa resalta solo las mesas del estado seleccionado en menos de 400 milisegundos.

**Resumen:**  
Mapa visual interactivo con actualización en tiempo real (< 2s) vía WebSocket, código de colores por estado y tooltips informativos.

---

## 📝 FASE 5: GESTIÓN DE PEDIDOS POR MESERO (Historias 21-26)

### Historia de Usuario 21: Tomar un Nuevo Pedido
**Identificador único (ID):** US-021

**Descripción:**  
Como mesero,  
Quiero ingresar la mesa y los productos en la interfaz web y enviarlos,  
Para que el pedido sea inmediatamente visible para el personal de cocina y se minimice el tiempo de espera.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de toma de pedidos,  
Cuando ingreso productos y la mesa,  
Entonces puedo ver el resumen del pedido antes de enviarlo con: productos, cantidades, precios, subtotal, impuestos y total.

**CA-2:**  
Dado que he ingresado un pedido,  
Cuando intento enviarlo sin al menos un producto,  
Entonces el sistema me notifica "Debe agregar al menos un producto" y no permite el envío.

**CA-3:**  
Dado que he ingresado un pedido,  
Cuando intento enviarlo sin el nombre del cliente,  
Entonces el sistema me notifica "El nombre del cliente es obligatorio" y no permite el envío.

**CA-4:**  
Dado que el sistema procesa acciones críticas (cargar resumen/transmitir pedido),  
Cuando se mide la respuesta en condiciones normales,  
Entonces el tiempo de respuesta debe ser < 1.5 segundos en el 90% de las transacciones.

**CA-5:**  
Dado que un mesero captura un pedido,  
Cuando el pedido contiene 5 ítems,  
Entonces el tiempo total de captura y envío debe ser < 45 segundos.

**Resumen:**  
Interfaz de toma de pedidos con validación de datos obligatorios, resumen visual completo y tiempos de respuesta auditables (< 1.5s, 90% SLO).

---

### Historia de Usuario 22: Enviar y Confirmar Pedido de Cliente
**Identificador único (ID):** US-022

**Descripción:**  
Como mesero,  
Quiero enviar un pedido completamente cargado al sistema de procesamiento,  
Para recibir una confirmación inmediata y asegurar que la cocina comience la preparación sin demoras.

**Criterios de Aceptación:**

**CA-1:**  
Dado que he completado un pedido con productos (mínimo 1), nombre de cliente, número de mesa y comentarios opcionales,  
Cuando hago clic en "Enviar Pedido",  
Entonces el pedido se envía exitosamente al backend.

**CA-2:**  
Dado que he enviado un pedido exitosamente,  
Cuando la interfaz recibe la confirmación del backend,  
Entonces el tiempo transcurrido desde el clic hasta la confirmación no debe exceder los 2 segundos (SLO).

**CA-3:**  
Dado que un pedido ha sido marcado como "Enviado",  
Cuando intento modificar los ítems o el cliente asociado,  
Entonces el sistema bloquea la edición y muestra "El pedido está siendo procesado y no puede ser modificado".

**CA-4:**  
Dado que envío un pedido exitosamente,  
Cuando recibo la confirmación,  
Entonces veo el ID del pedido generado y un mensaje de éxito claro.

**Resumen:**  
Envío de pedidos con confirmación en < 2 segundos (SLO), bloqueo de edición para pedidos en proceso y feedback visual inmediato.

---

### Historia de Usuario 23: Agregar Notas Especiales a Productos
**Identificador único (ID):** US-023

**Descripción:**  
Como mesero,  
Quiero agregar notas especiales a cada producto del pedido,  
Para comunicar preferencias del cliente a la cocina (ej: "sin cebolla", "término medio").

**Criterios de Aceptación:**

**CA-1:**  
Dado que he agregado un producto al pedido,  
Cuando hago clic en el campo de notas del producto,  
Entonces puedo escribir texto libre (máximo 200 caracteres) que se asocie específicamente a ese producto.

**CA-2:**  
Dado que he agregado notas a un producto,  
Cuando visualizo el resumen del pedido antes de enviar,  
Entonces las notas aparecen claramente asociadas a cada producto correspondiente.

**CA-3:**  
Dado que envío un pedido con notas especiales,  
Cuando la cocina visualiza el pedido,  
Entonces las notas de cada producto son visibles de forma prominente en la interfaz de cocina.

**CA-4:**  
Dado que escribo una nota que excede 200 caracteres,  
Cuando intento continuar escribiendo,  
Entonces el sistema me previene de exceder el límite y muestra un contador de caracteres.

**Resumen:**  
Campo de notas por producto con límite de 200 caracteres, visualización clara en resumen y propagación a la interfaz de cocina.

---

### Historia de Usuario 24: Ver Pedidos Activos del Mesero
**Identificador único (ID):** US-024

**Descripción:**  
Como mesero,  
Quiero ver todos mis pedidos activos en tiempo real,  
Para hacer seguimiento de su estado y responder preguntas de los clientes.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la interfaz de pedidos,  
Cuando visualizo la sección de pedidos activos,  
Entonces veo todos mis pedidos creados que están en estado "pending", "preparing" o "ready" agrupados por estado.

**CA-2:**  
Dado que un pedido cambia de estado (de "pending" a "preparing"),  
Cuando la cocina actualiza el estado,  
Entonces el cambio se refleja en mi interfaz en menos de 2 segundos sin recargar la página.

**CA-3:**  
Dado que visualizo un pedido activo,  
Cuando hago clic en "Ver Detalle",  
Entonces veo toda la información: cliente, mesa, productos, estado actual, tiempo transcurrido y tiempo estimado de preparación.

**CA-4:**  
Dado que aplico un filtro por estado (pending/preparing/ready),  
Cuando selecciono el filtro,  
Entonces el sistema muestra solo los pedidos del estado seleccionado en menos de 300 milisegundos.

**Resumen:**  
Vista de pedidos activos en tiempo real (< 2s actualización) con filtros por estado, detalle completo y tiempos de preparación estimados.

---

### Historia de Usuario 25: Editar Pedido Pendiente
**Identificador único (ID):** US-025

**Descripción:**  
Como mesero,  
Quiero editar pedidos que aún no han sido iniciados en cocina,  
Para corregir errores o agregar cambios solicitados por el cliente antes de que inicie la preparación.

**Criterios de Aceptación:**

**CA-1:**  
Dado que tengo un pedido en estado "pending",  
Cuando hago clic en "Editar Pedido",  
Entonces puedo modificar: nombre del cliente, mesa, productos (agregar, eliminar, cambiar cantidades) y notas especiales.

**CA-2:**  
Dado que he editado un pedido pendiente y guardo los cambios,  
Cuando confirmo,  
Entonces los cambios se propagan al backend en menos de 800 milisegundos y la cocina ve la versión actualizada.

**CA-3:**  
Dado que intento editar un pedido en estado "preparing" o posterior,  
Cuando hago clic en "Editar",  
Entonces el sistema muestra "No se puede editar una orden que ya está en preparación" y deshabilita la edición.

**CA-4:**  
Dado que edito un pedido y el backend responde con error (409 Conflict),  
Cuando ocurre el error,  
Entonces veo un mensaje claro del motivo y el pedido mantiene su estado original.

**Resumen:**  
Edición de pedidos en estado "pending" con propagación rápida (< 800ms), bloqueo de edición para pedidos en preparación.

---

### Historia de Usuario 26: Cancelar Pedido
**Identificador único (ID):** US-026

**Descripción:**  
Como mesero o administrador,  
Quiero cancelar pedidos por solicitud del cliente o error operativo,  
Para mantener la integridad del sistema y liberar recursos de cocina.

**Criterios de Aceptación:**

**CA-1:**  
Dado que tengo un pedido en estado "pending",  
Cuando hago clic en "Cancelar Pedido" y confirmo,  
Entonces el pedido cambia a estado "cancelled" en menos de 500 milisegundos y deja de aparecer en la vista activa de cocina.

**CA-2:**  
Dado que intento cancelar un pedido en estado "preparing",  
Cuando hago clic en "Cancelar",  
Entonces el sistema solicita confirmación adicional mostrando "El pedido está en preparación, ¿está seguro de cancelar?" y requiere autorización de administrador.

**CA-3:**  
Dado que cancelo un pedido exitosamente,  
Cuando el proceso finaliza,  
Entonces el pedido aparece en el historial marcado como "cancelled" con timestamp y el usuario que lo canceló.

**CA-4:**  
Dado que intento cancelar un pedido en estado "ready" o "completed",  
Cuando hago clic en "Cancelar",  
Entonces el sistema muestra "No se puede cancelar un pedido listo o completado" y previene la acción.

**Resumen:**  
Cancelación de pedidos con validación según estado, confirmación adicional para pedidos en preparación y registro de auditoría completo.

---

## 👨‍🍳 FASE 6: GESTIÓN DE PEDIDOS EN COCINA (Historias 27-30)

### Historia de Usuario 27: Visualizar Pedidos en Cocina
**Identificador único (ID):** US-027

**Descripción:**  
Como cocinero,  
Quiero ver todos los pedidos activos organizados por estado en tiempo real,  
Para priorizar mi trabajo y preparar los platos de manera eficiente.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la interfaz de cocina,  
Cuando la vista se carga,  
Entonces veo todos los pedidos activos separados en columnas: "Pendiente" (pending), "En Preparación" (preparing) y "Listos" (ready) en menos de 3 segundos.

**CA-2:**  
Dado que un nuevo pedido llega a la cola,  
Cuando el mesero lo envía,  
Entonces el pedido aparece automáticamente en la columna "Pendiente" en menos de 2 segundos sin recargar la página.

**CA-3:**  
Dado que visualizo un pedido,  
Cuando lo veo en la interfaz,  
Entonces cada pedido muestra: ID, mesa, cliente, lista de productos con cantidades y notas especiales, y tiempo transcurrido desde su creación.

**CA-4:**  
Dado que hay más de 20 pedidos activos,  
Cuando la vista se carga,  
Entonces el sistema implementa scroll o paginación sin degradar el rendimiento (< 3s carga).

**Resumen:**  
Interfaz de cocina con vista de columnas (Kanban), actualización en tiempo real (< 2s) vía WebSocket, información completa de cada pedido.

---

### Historia de Usuario 28: Iniciar Preparación de Pedido
**Identificador único (ID):** US-028

**Descripción:**  
Como cocinero,  
Quiero marcar un pedido como "En Preparación" con un clic,  
Para indicar que he iniciado su preparación y que otros cocineros no lo tomen.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido está en estado "pending",  
Cuando hago clic en "Iniciar Preparación",  
Entonces el pedido cambia a estado "preparing" en menos de 500 milisegundos y se mueve a la columna "En Preparación".

**CA-2:**  
Dado que marco un pedido como "preparing",  
Cuando el cambio se aplica,  
Entonces todos los cocineros ven el cambio en menos de 2 segundos y el pedido muestra mi nombre como cocinero asignado.

**CA-3:**  
Dado que intento iniciar un pedido que otro cocinero ya marcó,  
Cuando hago clic,  
Entonces el sistema muestra "Este pedido ya está siendo preparado por [Nombre]" y previene la acción duplicada.

**CA-4:**  
Dado que inicio la preparación de un pedido,  
Cuando el cambio se aplica,  
Entonces el sistema registra el timestamp de inicio y lo usa para calcular el tiempo de preparación real.

**Resumen:**  
Cambio de estado a "preparing" con prevención de conflictos, asignación de cocinero, actualización en tiempo real (< 2s).

---

### Historia de Usuario 29: Marcar Pedido como Listo
**Identificador único (ID):** US-029

**Descripción:**  
Como cocinero,  
Quiero marcar un pedido como "Listo" cuando termine su preparación,  
Para notificar al mesero que puede recogerlo y servirlo al cliente.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido está en estado "preparing",  
Cuando hago clic en "Marcar como Listo",  
Entonces el pedido cambia a estado "ready" en menos de 500 milisegundos y se mueve a la columna "Listos".

**CA-2:**  
Dado que marco un pedido como "ready",  
Cuando el cambio se aplica,  
Entonces el mesero que creó el pedido ve una notificación en su interfaz en menos de 2 segundos indicando que su pedido está listo.

**CA-3:**  
Dado que un pedido ha sido marcado como "ready",  
Cuando transcurren 15 minutos,  
Entonces el pedido desaparece automáticamente de la vista activa de cocina (se asume completado/entregado).

**CA-4:**  
Dado que intento marcar como "ready" un pedido en estado "pending",  
Cuando hago clic,  
Entonces el sistema muestra "Debe iniciar la preparación antes de marcarlo como listo" y previene el salto de estado.

**Resumen:**  
Cambio de estado a "ready" con notificación al mesero (< 2s), auto-limpieza después de 15 minutos, validación de transiciones de estado.

---

### Historia de Usuario 30: Ver Tiempo de Preparación y Métricas
**Identificador único (ID):** US-030

**Descripción:**  
Como cocinero o administrador,  
Quiero ver el tiempo transcurrido de cada pedido en preparación,  
Para identificar pedidos con demora y optimizar los tiempos de cocina.

**Criterios de Aceptación:**

**CA-1:**  
Dado que un pedido está en estado "preparing",  
Cuando lo visualizo en la interfaz de cocina,  
Entonces veo un contador en tiempo real que muestra el tiempo transcurrido desde que se inició la preparación.

**CA-2:**  
Dado que un pedido lleva más de 20 minutos en preparación,  
Cuando visualizo la interfaz,  
Entonces el pedido se resalta visualmente (color rojo o icono de advertencia) para indicar que excede el tiempo esperado.

**CA-3:**  
Dado que marco un pedido como "ready",  
Cuando el cambio se aplica,  
Entonces el sistema calcula y registra el tiempo total de preparación real para métricas futuras.

**CA-4:**  
Dado que accedo a la sección de métricas (administrador),  
Cuando visualizo los reportes,  
Entonces veo el tiempo promedio de preparación por tipo de producto o categoría.

**Resumen:**  
Contador en tiempo real de preparación, alertas visuales para pedidos demorados, registro de métricas de tiempo real para análisis.

---

## 📊 FASE 7: MONITOREO Y REPORTES (Historias 31-33)

### Historia de Usuario 31: Dashboard de Pedidos Activos para Administrador
**Identificador único (ID):** US-031

**Descripción:**  
Como administrador del restaurante,  
Quiero visualizar en tiempo real todos los pedidos activos del restaurante,  
Para monitorear el flujo de trabajo, identificar cuellos de botella y tomar decisiones operativas.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo al dashboard de pedidos,  
Cuando la vista se carga,  
Entonces veo todos los pedidos activos (pending, preparing, ready) agrupados por estado en menos de 1.5 segundos.

**CA-2:**  
Dado que un nuevo pedido es creado por un mesero,  
Cuando el pedido entra al sistema,  
Entonces aparece automáticamente en el dashboard en menos de 2 segundos sin recargar la página.

**CA-3:**  
Dado que un pedido cambia de estado,  
Cuando la cocina actualiza el estado,  
Entonces el cambio se refleja en el dashboard en tiempo real (< 2 segundos) y el pedido se mueve a la columna correspondiente.

**CA-4:**  
Dado que visualizo el dashboard,  
Cuando observo las tarjetas de pedidos,  
Entonces cada tarjeta muestra: ID, cliente, mesa, mesero, items (cantidad), estado, tiempo transcurrido y tiempo estimado de preparación.

**CA-5:**  
Dado que aplico un filtro por estado o mesero,  
Cuando selecciono el filtro,  
Entonces el dashboard actualiza la vista en menos de 300 milisegundos.

**Resumen:**  
Dashboard en tiempo real con actualización automática vía WebSocket (< 2s), filtros, métricas de tiempo y visualización agrupada.

---

### Historia de Usuario 32: Ver Detalle Completo de un Pedido
**Identificador único (ID):** US-032

**Descripción:**  
Como administrador, mesero o cocinero,  
Quiero ver el detalle completo de un pedido específico,  
Para verificar toda la información relacionada incluyendo cliente, mesa, productos, precios, notas y estado.

**Criterios de Aceptación:**

**CA-1:**  
Dado que selecciono un pedido desde cualquier interfaz,  
Cuando hago clic en "Ver Detalle",  
Entonces se abre un modal o vista detallada en menos de 400 milisegundos mostrando toda la información.

**CA-2:**  
Dado que visualizo el detalle de un pedido,  
Cuando la vista se carga,  
Entonces veo: ID, cliente, mesa, mesero, fecha y hora de creación, lista de productos (nombre, cantidad, precio unitario, subtotal, notas especiales), subtotal, impuestos, total, estado actual e historial de cambios de estado con timestamps.

**CA-3:**  
Dado que el pedido cambia de estado mientras visualizo el detalle,  
Cuando ocurre la actualización,  
Entonces el estado mostrado se actualiza automáticamente en tiempo real (< 2 segundos) sin cerrar el modal.

**CA-4:**  
Dado que visualizo el detalle,  
Cuando reviso las notas especiales de cada producto,  
Entonces las notas se muestran claramente asociadas a cada item.

**Resumen:**  
Vista detallada con toda la información relevante, actualización en tiempo real del estado vía WebSocket.

---

### Historia de Usuario 33: Filtrar y Buscar Pedidos
**Identificador único (ID):** US-033

**Descripción:**  
Como administrador,  
Quiero filtrar y buscar pedidos por diferentes criterios,  
Para encontrar rápidamente pedidos específicos y analizar patrones operativos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la vista de pedidos,  
Cuando aplico un filtro por estado (all/pending/preparing/ready/completed/cancelled),  
Entonces el sistema muestra solo los pedidos del estado seleccionado en menos de 500 milisegundos.

**CA-2:**  
Dado que necesito buscar un pedido específico,  
Cuando ingreso el ID del pedido, nombre del cliente o número de mesa en el campo de búsqueda,  
Entonces el sistema filtra los resultados en tiempo real (mientras escribo) mostrando coincidencias en menos de 300 milisegundos.

**CA-3:**  
Dado que aplico múltiples filtros simultáneamente (estado + mesero + rango de fechas),  
Cuando los filtros se activan,  
Entonces el sistema muestra solo los pedidos que cumplen todas las condiciones en menos de 800 milisegundos.

**CA-4:**  
Dado que he aplicado filtros y quiero limpiarlos,  
Cuando hago clic en "Limpiar Filtros",  
Entonces todos los filtros se reinician y se muestra la vista completa en menos de 400 milisegundos.

**Resumen:**  
Sistema de filtrado y búsqueda en tiempo real con múltiples criterios, respuesta inmediata (< 300-800ms).

---

## ⚙️ FASE 8: CONFIGURACIÓN DEL SISTEMA (Historias 34-35)

### Historia de Usuario 34: Configurar Información del Restaurante
**Identificador único (ID):** US-034

**Descripción:**  
Como administrador del restaurante,  
Quiero configurar la información general del restaurante,  
Para que esté disponible en el sistema y pueda ser utilizada en reportes y la interfaz de usuario.

**Criterios de Aceptación:**

**CA-1:**  
Dado que accedo a la sección de configuración del restaurante,  
Cuando ingreso o modifico el nombre del restaurante (3-100 caracteres), dirección, teléfono (formato válido), horarios de apertura y cierre, y guardo,  
Entonces la configuración se guarda exitosamente en menos de 600 milisegundos.

**CA-2:**  
Dado que he guardado la configuración,  
Cuando accedo nuevamente a la sección,  
Entonces veo todos los datos guardados previamente precargados en el formulario.

**CA-3:**  
Dado que actualizo el nombre del restaurante,  
Cuando guardo los cambios,  
Entonces el nuevo nombre aparece en el encabezado de todas las interfaces en menos de 2 segundos.

**CA-4:**  
Dado que intento guardar configuración con campos obligatorios vacíos (nombre del restaurante),  
Cuando envío el formulario,  
Entonces el sistema muestra mensajes de validación específicos.

**Resumen:**  
Configuración centralizada con validación de datos, persistencia y propagación automática a todas las interfaces.

---

### Historia de Usuario 35: Configurar Impuestos y Cargos Adicionales
**Identificador único (ID):** US-035

**Descripción:**  
Como administrador del restaurante,  
Quiero configurar el porcentaje de impuestos (IVA) y cargos adicionales,  
Para que estos valores se apliquen automáticamente en el cálculo total de todos los pedidos.

**Criterios de Aceptación:**

**CA-1:**  
Dado que estoy en la sección de configuración de impuestos,  
Cuando ingreso un porcentaje de IVA válido (entre 0% y 30%, máximo 2 decimales), un porcentaje de propina sugerida (entre 0% y 25%) y guardo,  
Entonces la configuración se aplica exitosamente en menos de 500 milisegundos.

**CA-2:**  
Dado que he configurado un IVA del 10%,  
Cuando un mesero crea un nuevo pedido,  
Entonces el sistema calcula automáticamente el impuesto aplicando el 10% al subtotal y lo muestra en el resumen.

**CA-3:**  
Dado que actualizo el porcentaje de IVA de 10% a 12%,  
Cuando guardo el cambio,  
Entonces los nuevos pedidos usan el 12%, y los pedidos existentes mantienen el porcentaje original (10%) para preservar integridad.

**CA-4:**  
Dado que ingreso un valor inválido (negativo, mayor a 30%, o no numérico),  
Cuando intento guardar,  
Entonces el sistema muestra un mensaje de error claro y no permite continuar.

**Resumen:**  
Configuración dinámica de impuestos con aplicación automática, validación estricta de rangos y preservación de valores históricos.

---

## 📈 RESUMEN EJECUTIVO

### ✅ Cobertura Completa del Sistema

| Fase | Historias | Módulo | Prioridad |
|------|-----------|--------|-----------|
| 1 | US-001 a US-005 | Autenticación y Control de Acceso | P0 - Crítica |
| 2 | US-006 a US-009 | Gestión de Usuarios | P0 - Crítica |
| 3 | US-010 a US-015 | Gestión de Productos y Categorías | P1 - Alta |
| 4 | US-016 a US-020 | Gestión de Mesas | P1 - Alta |
| 5 | US-021 a US-026 | Gestión de Pedidos (Mesero) | P0 - Crítica |
| 6 | US-027 a US-030 | Gestión de Pedidos (Cocina) | P0 - Crítica |
| 7 | US-031 a US-033 | Monitoreo y Reportes | P2 - Media |
| 8 | US-034 a US-035 | Configuración del Sistema | P3 - Baja |

---

### 🎯 Principios INVEST Cumplidos

| Principio | Cumplimiento |
|-----------|-------------|
| ✅ **I** - Independent (Independiente) | Cada historia puede implementarse y desplegarse independientemente |
| ✅ **N** - Negotiable (Negociable) | Los criterios permiten ajustes en implementación técnica |
| ✅ **V** - Valuable (Valiosa) | Cada historia aporta valor directo al negocio |
| ✅ **E** - Estimable (Estimable) | Alcance claro, estimación posible (2-12h cada una) |
| ✅ **S** - Small (Pequeña) | Completables en 1-2 días de trabajo |
| ✅ **T** - Testable (Testable) | Todos los criterios incluyen métricas cuantificables |

---

### 📊 Estimación Total de Esfuerzo

| Fase | Historias | Estimación | Sprint |
|------|-----------|------------|--------|
| Fase 1 | 5 historias | 20h | Sprint 1 |
| Fase 2 | 4 historias | 16h | Sprint 1 |
| Fase 3 | 6 historias | 24h | Sprint 2 |
| Fase 4 | 5 historias | 22h | Sprint 2 |
| Fase 5 | 6 historias | 28h | Sprint 3 |
| Fase 6 | 4 historias | 18h | Sprint 3 |
| Fase 7 | 3 historias | 14h | Sprint 4 |
| Fase 8 | 2 historias | 10h | Sprint 4 |
| **TOTAL** | **35 historias** | **152h** | **4 Sprints** |

---

### 📋 Notas Finales

Este backlog refinado cubre todas las funcionalidades del sistema de pedidos de restaurante, desde autenticación hasta configuración avanzada. Cada historia de usuario:

- ✅ Sigue el formato estándar: **Como** [rol], **Quiero** [acción], **Para** [beneficio]
- ✅ Incluye criterios de aceptación en formato **Gherkin** (Dado/Cuando/Entonces)
- ✅ Especifica métricas cuantificables (tiempos de respuesta, SLOs)
- ✅ Define claramente el **Definition of Done** implícito en cada resumen
- ✅ Se puede implementar de forma incremental por sprints
- ✅ Permite validación automatizada con pruebas de integración y E2E

**Recomendaciones:**
- Priorizar Fase 1, 2, 5 y 6 (módulos críticos P0) en primeros 2 sprints
- Implementar Fase 3 y 4 (productos y mesas) en segundo par de sprints
- Fase 7 y 8 pueden implementarse en iteraciones posteriores
- Considerar pruebas de carga para validar métricas de tiempo de respuesta
- Implementar observabilidad (logs, métricas, trazas) desde Sprint 1