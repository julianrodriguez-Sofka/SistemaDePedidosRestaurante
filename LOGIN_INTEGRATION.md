# Integración del Sistema de Login Multi-Rol

## ✅ Configuración Completada

Se ha integrado el sistema de autenticación para que un único punto de login redirija a los usuarios según su rol.

## 🔐 Acceso al Sistema

### URLs de Login

Puedes ingresar desde **cualquiera** de estos dos puntos:

1. **Admin Frontend:** http://localhost:5174
2. **Orders Frontend:** http://localhost:5173

Ambos comparten el mismo sistema de autenticación y redirigen automáticamente según el rol del usuario.

## 👥 Usuarios y Credenciales

### 1. Administrador
- **URL Login:** http://localhost:5174 o http://localhost:5173
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Roles:** admin, waiter, chef
- **Redirección:** → http://localhost:5174/admin/dashboard
- **Acceso a:**
  - Panel de administración completo
  - Gestión de usuarios
  - Gestión de productos
  - Gestión de mesas
  - Configuración del restaurante
  - Órdenes activas

### 2. Chef (Cocinero)
- **URL Login:** http://localhost:5174 o http://localhost:5173
- **Usuario:** `chef1`
- **Contraseña:** `chef123`
- **Rol:** chef
- **Redirección:** → http://localhost:5173/cocina
- **Acceso a:**
  - Vista de cocina
  - Órdenes pendientes
  - Órdenes en preparación
  - Órdenes listas

### 3. Waiter (Mesero)
- **URL Login:** http://localhost:5174 o http://localhost:5173
- **Usuario:** `waiter1`
- **Contraseña:** `waiter123`
- **Rol:** waiter
- **Redirección:** → http://localhost:5173/mesero
- **Acceso a:**
  - Interfaz de toma de pedidos
  - Selección de mesa
  - Carrito de compras
  - Envío de órdenes

## 🔄 Flujo de Autenticación

```
Usuario ingresa credenciales
         ↓
Backend valida (admin-service:4001)
         ↓
Retorna token JWT + datos de usuario
         ↓
Frontend detecta rol del usuario
         ↓
    ┌────┴────┬─────────┐
    ↓         ↓         ↓
  admin     chef    waiter
    ↓         ↓         ↓
:5174/   :5173/   :5173/
admin/   cocina   mesero
dashboard
```

## 🔑 Tokens y LocalStorage

Ambos frontends comparten las mismas claves de localStorage para permitir navegación entre interfaces:

- `adminToken` / `authToken` → Token JWT
- `adminUser` / `user` → Datos del usuario

Esto permite que un usuario pueda moverse entre interfaces si tiene múltiples roles.

## 🌐 Arquitectura

```
┌─────────────────────────────────────────────┐
│         USUARIOS DEL SISTEMA                │
├─────────────────────────────────────────────┤
│  Admin (5174)   Chef (5173)   Waiter (5173)│
└────────┬────────────┬───────────────┬────────┘
         │            │               │
         └────────────┼───────────────┘
                      │
              ┌───────▼────────┐
              │  admin-service │
              │   (port 4001)  │
              │   Auth + CRUD  │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │    MongoDB     │
              │   (port 27017) │
              │  restaurant_   │
              │    admin       │
              └────────────────┘
```

## 📝 Cambios Implementados

### 1. admin-frontend/src/pages/LoginPage.tsx
- Redirección según rol del usuario
- Guarda tokens en ambas claves (adminToken y authToken)
- Admin → /admin/dashboard
- Chef → http://localhost:5173/cocina
- Waiter → http://localhost:5173/mesero

### 2. orders-producer-frontend/src/pages/HomePage.tsx
- Actualizado para usar response.data.data (estructura correcta)
- Guarda tokens en ambas claves
- Redirección según rol del usuario
- Admin → http://localhost:5174/admin/dashboard
- Chef → /cocina
- Waiter → /mesero

### 3. orders-producer-frontend/.env
- VITE_ADMIN_API_URL=http://localhost:4001/api
- Configurado para apuntar al admin-service correcto

### 4. docker-compose.yml
- Agregado build args al frontend de orders-producer
- Configurado para inyectar variables de entorno en build time

### 5. orders-producer-frontend/Dockerfile
- Agregado ARG y ENV para variables de entorno de Vite
- Asegura que las URLs sean correctas en el build de producción

## 🧪 Pruebas

### Probar Login de Admin
1. Abrir http://localhost:5174
2. Usuario: `admin`, Password: `admin123`
3. Deberías ser redirigido a http://localhost:5174/admin/dashboard
4. Verás el panel completo de administración

### Probar Login de Chef
1. Abrir http://localhost:5173
2. Usuario: `chef1`, Password: `chef123`
3. Deberías ser redirigido a http://localhost:5173/cocina
4. Verás la interfaz de cocina

### Probar Login de Waiter
1. Abrir http://localhost:5173
2. Usuario: `waiter1`, Password: `waiter123`
3. Deberías ser redirigido a http://localhost:5173/mesero
4. Verás la interfaz de mesero

## 🔒 Seguridad

- Autenticación JWT con tokens de 8 horas
- Tokens almacenados en localStorage
- Rutas protegidas con ProtectedRoute
- Validación de roles en backend y frontend
- Password hasheado con bcrypt (10 salt rounds)

## 🚀 Servicios en Ejecución

```bash
# Ver todos los contenedores
docker ps

# Logs del admin-service
docker logs admin-service --tail=50

# Logs del admin-frontend
docker logs admin-frontend --tail=50

# Logs del orders-frontend
docker logs front --tail=50

# Reiniciar todos los servicios
docker-compose restart

# Reconstruir un frontend específico
docker-compose up -d --build admin-frontend
docker-compose up -d --build front
```

## 📌 Notas Importantes

1. **Ctrl+Shift+R:** Usa hard refresh en el navegador después de reconstruir para limpiar cache

2. **Múltiples Roles:** El usuario `admin` tiene todos los roles, por lo que puede acceder a cualquier interfaz

3. **Tokens Compartidos:** Los tokens se comparten entre ambos frontends usando las mismas claves de localStorage

4. **CORS:** El admin-service tiene CORS habilitado para permitir peticiones desde ambos frontends

5. **Puertos:**
   - Admin Frontend: 5174
   - Orders Frontend: 5173
   - Admin Service: 4001
   - API Gateway: 3000
   - Node MS: 3002, 4000
   - Python MS: 8000
   - MongoDB: 27017
   - RabbitMQ: 5672, 15672

## 🎯 Próximos Pasos

- [ ] Agregar renovación automática de tokens
- [ ] Implementar logout global (limpiar tokens de ambos frontends)
- [ ] Agregar refresh tokens para sesiones más largas
- [ ] Implementar sistema de permisos granulares por módulo
- [ ] Agregar logs de auditoría de acciones administrativas
