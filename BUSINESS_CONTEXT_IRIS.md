1. Descripción del Proyecto:
 Nombre del Proyecto: Sistema de Pedidos de Restaurante – Arquitectura
Distribuida
 Objetivo del Proyecto:
Digitalizar y optimizar la gestión operativa de pedidos en un restaurante de
comidas rápidas, permitiendo la toma de pedidos por meseros desde una tablet,
su procesamiento automático, integración con cocina y visualización en tiempo
real del estado de los pedidos, mediante una arquitectura de microservicios y
mensajería asíncrona. Incluye un panel administrativo completo para la gestión
de usuarios, roles, productos, mesas y configuración del restaurante, con
autenticación basada en JWT y control de acceso por roles.

2. Flujos Críticos del Negocio:
 Principales Flujos de Trabajo:
o Autenticación: El usuario accede al sistema según su rol (admin, waiter,
chef) mediante login con credenciales validadas por JWT.
o Selección de rol (puerto 5173): Chef o Mesero seleccionan su rol y acceden
a su interfaz específica con diseño diferenciado por colores.
o El mesero toma el pedido en una tablet, selecciona mesa y productos, y lo
envía desde el frontend web.
o El backend Python (FastAPI) valida el pedido y lo publica en RabbitMQ.
o El backend Node.js (worker de cocina) consume el pedido, simula la
preparación y actualiza el estado.
o El sistema notifica a la cocina en tiempo real mediante WebSocket.
o El personal de cocina visualiza y gestiona los pedidos en una interfaz web.
o El mesero puede cancelar pedidos, lo que libera automáticamente la mesa
asociada (estado: ocupada → disponible).
o El administrador gestiona usuarios, productos, mesas y configuración desde
el panel administrativo (puerto 5174).
 Módulos o Funcionalidades Críticas:
o Sistema de autenticación y autorización (JWT + roles: admin, waiter, chef).
o API Gateway para enrutamiento y proxy de peticiones entre servicios.
o Admin Service para gestión de usuarios, productos, mesas y configuración.
o Panel administrativo (admin-frontend) con acceso exclusivo para
administradores.
o Toma y validación de pedidos (frontend y backend Python).
o Gestión de mesas con estados (disponible/ocupada) y actualización
automática.
o Publicación y consumo de mensajes en RabbitMQ.
o Simulación de preparación y gestión de estados de pedidos en cocina
(Node.js).
o Cancelación de pedidos con liberación automática de mesas.
o API HTTP para consulta de pedidos en cocina.
o Servidor WebSocket para notificaciones en tiempo real.
o Frontend para selección de roles, login diferenciado, toma de pedidos y
visualización en cocina.
o Diálogos de confirmación personalizados con diseño adaptado (shadcn/ui +
Radix UI).

3. Reglas de Negocio y Restricciones:
 Reglas de Negocio Relevantes:
o Solo usuarios autenticados con roles válidos pueden acceder al sistema.
o Cada rol tiene acceso exclusivo a su interfaz: admin (puerto 5174), chef y
waiter (puerto 5173).
o Solo los pedidos válidos (estructura y datos correctos) son procesados.
o Los pedidos se procesan en secuencia (prefetch = 1 en el worker de
Node.js).
o El estado de los pedidos debe actualizarse correctamente: Pendiente → En
preparación → Listo.
o Los pedidos pueden ser cancelados por el mesero, lo que libera
automáticamente la mesa asociada.
o Cuando un pedido es cancelado, la mesa pasa de estado "ocupada" a
"disponible" mediante comunicación entre node-ms y admin-service.
o El frontend de cocina debe reflejar en tiempo real los cambios de estado.
o Las mesas cambian de estado automáticamente: disponible → ocupada
(crear pedido), ocupada → disponible (cancelar pedido).
o El sistema debe manejar correctamente la reconexión y recuperación ante
fallos.
o Solo administradores pueden gestionar usuarios, productos, mesas y
configuración del restaurante.
o Las contraseñas se almacenan encriptadas con bcrypt.

 Regulaciones o Normativas:
o Administrador (admin): Gestiona todo el sistema desde el panel
administrativo (puerto 5174).
o Mesero (waiter): Toma pedidos, gestiona mesas y atiende clientes desde el
frontend principal (puerto 5173).
o Personal de Cocina (chef): Visualiza y gestiona el estado de los pedidos en
la interfaz de cocina (puerto 5173).

 Permisos y Limitaciones de Cada Perfil:
o Administrador (admin):
▪ Acceso completo al panel administrativo (puerto 5174).
▪ Gestión de usuarios: crear, modificar, eliminar y asignar roles.
▪ Gestión de productos: crear, editar, eliminar y administrar
categorías.
▪ Gestión de mesas: configurar capacidad y estados.
▪ Configuración del restaurante: nombre, horarios, información de
contacto.
▪ Puede tener acceso a todas las funcionalidades si tiene múltiples
roles asignados.
o Mesero (waiter):
▪ Acceso mediante selección de rol en puerto 5173 (diseño azul).
▪ Crear pedidos asociando mesa y productos.
▪ Cancelar pedidos activos (libera automáticamente la mesa).
▪ Gestionar estado de mesas.
▪ Ver menú y productos disponibles.
▪ No puede acceder a la interfaz de cocina.
▪ No puede administrar usuarios, productos ni configuración.
o Aplicación web para administración (puerto 5174) con panel completo.
o Aplicación web para toma de pedidos (mesero) y visualización en cocina
(puerto 5173).
o Backend Python (FastAPI) y Node.js (Express/TypeScript) desplegados en
contenedores Docker.
o Comunicación en tiempo real mediante WebSocket.
o Base de datos MongoDB para persistencia de datos.

 Arquitectura de Microservicios:
o API Gateway (puerto 3000): Enrutamiento y proxy de peticiones.
o Admin Service (puerto 4001): Gestión de usuarios, productos, mesas,
autenticación y autorización.
o Orders Producer Python (puerto 8000): Backend de pedidos con FastAPI.
o Orders Producer Node (puerto 3002): Worker de cocina y WebSocket (puerto
configuración de variables de entorno (.env) y el estado de los contenedores Docker.
 Si el worker de Node.js no se conecta a RabbitMQ, se debe revisar la configuración
AMQP (AMQP_CONNECTION_TYPE, AMQP_LOCAL_HOST) y el estado del broker.
 Si un usuario intenta acceder a una ruta sin autenticación, debe ser redirigido al
login correspondiente.
 Si un usuario intenta acceder a funcionalidades de un rol que no posee, debe
recibir un error 403 (Forbidden).
 Si un pedido excede la capacidad de la cocina, el sistema debe procesar los
pedidos en secuencia y notificar el estado real.
 Si el WebSocket no está disponible, la cocina no recibirá actualizaciones en tiempo
real y deberá consultar manualmente la API.
 Si se cancela un pedido, el sistema debe verificar y liberar la mesa asociada
automáticamente mediante comunicación HTTP entre orders-producer-node y
admin-service.
 Si la liberación de mesa falla durante la cancelación de pedido, se debe registrar
el error en logs pero permitir que la cancelación del pedido se complete.
 El sistema debe manejar la reconexión automática y la recuperación ante fallos de
red o servicios.
 Los tokens JWT deben validarse en cada petición protegida y renovarse según sea
necesario.
 Las contraseñas deben cumplir con requisitos mínimos de seguridad y almacenarse
siempre encriptadas con bcrypt. para estilos.
o shadcn/ui + Radix UI para componentes de interfaz.
o FastAPI (Python) para backend de pedidos.
o Node.js + TypeScript + Express para admin-service, api-gateway y
orders-producer-node.
o JWT (jsonwebtoken) para autenticación y autorización.
o bcrypt para encriptación de contraseñas.
o RabbitMQ (amqplib) como broker de mensajería asíncrona.
o MongoDB con Mongoose para persistencia de datos.
o Docker y Docker Compose para orquestación de 8 servicios.
o WebSocket (ws) para notificaciones en tiempo real.
o Axios para comunicación HTTP entre microservicios.
o Variables de entorno (.env) para configuración flexible.
o Personal de Cocina: Solo visualiza y actualiza el estado de los pedidos, no
puede crear nuevos pedidos ni modificar productos.
o Administrador/Técnico: Acceso completo a la configuración y monitoreo del
sistema a nivel de infraestructura, pero no desde una interfaz de usuario.

5. Condiciones del Entorno Técnico:

 Plataformas Soportadas:
o Aplicación web para toma de pedidos (mesero) y visualización en cocina.
o Backend Python (FastAPI) y Node.js (Express/TypeScript) desplegados en
contenedores Docker.
o Comunicación en tiempo real mediante WebSocket.
 Tecnologías o Integraciones Clave:
o React + TypeScript + Vite para frontend.
o FastAPI (Python) para backend de pedidos.
o Node.js + TypeScript para backend de cocina y WebSocket.
o RabbitMQ como broker de mensajería.
o Docker y Docker Compose para orquestación.
o Integración HTTP y WebSocket entre módulos.

6. Casos Especiales o Excepciones (Opcional):
 Si el frontend no puede comunicarse con el backend, se debe verificar la
configuración de variables de entorno y el estado de los contenedores.
 Si el worker de Node.js no se conecta a RabbitMQ, se debe revisar la URL y el
estado del broker.
 Si un pedido excede la capacidad de la cocina, el sistema debe procesar los
pedidos en secuencia y notificar el estado real.
 Si el WebSocket no está disponible, la cocina no recibirá actualizaciones en tiempo
real y deberá consultar manualmente la API.
 El sistema debe manejar la reconexión automática y la recuperación ante fallos de
red o servicios.