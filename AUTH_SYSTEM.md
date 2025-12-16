# Sistema de Autenticación por Roles - Documentación

## 📋 Resumen de Cambios

Se ha implementado un sistema de autenticación separado por roles, manteniendo la arquitectura distribuida del proyecto.

## 🏗️ Arquitectura de Autenticación

### Puertos y Servicios

| Puerto | Servicio | Descripción |
|--------|----------|-------------|
| **5173** | orders-producer-frontend | Web principal - Selección y login de trabajadores |
| **5174** | admin-frontend | Panel de administración - Login exclusivo para admins |
| **4001** | admin-service | API de autenticación y gestión |

## 🔐 Flujo de Autenticación

### 1. Puerto 5173 - Web Principal (Trabajadores)

**Pantalla inicial:** Selección de rol
```
┌─────────────────────────────────────┐
│  I'm a Chef  │  I'm a Waiter       │
│    (Orange)  │     (Blue)           │
└─────────────────────────────────────┘
```

**Flujos:**
- **Chef:** Clic → `/login/chef` → Login naranja → `/cocina` (área de cocina)
- **Waiter:** Clic → `/login/waiter` → Login azul → `/mesero` (área de pedidos)

### 2. Puerto 5174 - Panel Admin

**Acceso directo:** `http://localhost:5174`
- Login verde exclusivo para administradores
- Valida que el usuario tenga rol `admin`
- Redirige a `/admin/dashboard`

## 📁 Archivos Creados/Modificados

### Orders-Producer-Frontend (Puerto 5173)

**Nuevos archivos:**
- `src/pages/RoleSelectionPage.tsx` - Pantalla de selección Chef/Waiter
- `src/pages/ChefLoginPage.tsx` - Login específico para chefs
- `src/pages/WaiterLoginPage.tsx` - Login específico para meseros

**Modificados:**
- `src/App.tsx` - Nuevas rutas de autenticación
- `.env` - Configuración de URL de admin API
- **Eliminado:** `src/pages/HomePage.tsx` (reemplazado por RoleSelectionPage)

### Admin-Frontend (Puerto 5174)

**Modificados:**
- `src/pages/LoginPage.tsx` - Simplificado solo para admins, eliminadas redirecciones a chef/waiter

### Configuración

**admin-service/.env:**
```env
PORT=4000
MONGO_URI=mongodb://mongo:27017/restaurant_admin
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_MS_URL=http://node-ms:3002
PYTHON_MS_URL=http://python-ms:8000
```

**orders-producer-frontend/.env:**
```env
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_ADMIN_API_URL=http://localhost:4001/api
```

## 🎨 Diseño por Rol

### Chef (Naranja)
- Color: `from-orange-500 to-orange-600`
- Icono: 👨‍🍳
- Login: `/login/chef`
- Área de trabajo: `/cocina`

### Waiter (Azul)
- Color: `from-blue-400 to-blue-500`
- Icono: 🍽️
- Login: `/login/waiter`
- Área de trabajo: `/mesero`

### Admin (Verde)
- Color: `from-emerald-500 to-emerald-600`
- Icono: 👔
- Login: Puerto 5174 directo
- Panel: `/admin/dashboard`

## 🔒 Validaciones de Seguridad

### ChefLoginPage
```typescript
if (!user.roles.includes('chef')) {
  setError('Access denied. This login is only for chefs.');
  return;
}
```

### WaiterLoginPage
```typescript
if (!user.roles.includes('waiter')) {
  setError('Access denied. This login is only for waiters.');
  return;
}
```

### Admin LoginPage
```typescript
if (!user.roles.includes('admin')) {
  setError('Access denied. This login is only for administrators.');
  return;
}
```

## 🚀 Cómo Usar

### Para Desarrolladores

1. **Levantar el proyecto:**
   ```bash
   docker-compose up -d
   ```

2. **Acceder a las interfaces:**
   - Trabajadores (Chef/Waiter): http://localhost:5173
   - Administrador: http://localhost:5174

3. **Credenciales de prueba** (deben ser creadas por el admin):
   - Admin crea usuarios desde el panel
   - Cada usuario tiene roles asignados: `chef`, `waiter`, o `admin`

### Para Usuarios Finales

**Trabajadores (Chef/Mesero):**
1. Ir a http://localhost:5173
2. Seleccionar tu rol (Chef o Waiter)
3. Ingresar usuario y contraseña
4. Acceder a tu área de trabajo

**Administrador:**
1. Ir a http://localhost:5174
2. Ingresar usuario y contraseña de administrador
3. Acceder al panel de administración

## 🔄 API de Autenticación

**Endpoint:** `POST http://localhost:4001/api/auth/login`

**Request:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "username": "usuario",
      "name": "Nombre Usuario",
      "email": "email@example.com",
      "roles": ["chef"]
    }
  }
}
```

## 📦 Dependencias

- **React Router DOM** - Navegación entre páginas
- **Axios** - Peticiones HTTP a la API
- **Tailwind CSS** - Estilos responsive
- **TypeScript** - Tipado estático

## 🧪 Testing

Para probar el sistema completo:

1. Crear un usuario admin desde MongoDB
2. Acceder al panel admin (puerto 5174)
3. Crear usuarios con roles `chef` y `waiter`
4. Probar login desde puerto 5173

## 🐛 Troubleshooting

### Error: "Access denied"
- Verificar que el usuario tenga el rol correcto asignado
- El chef debe usar `/login/chef`, el waiter `/login/waiter`, el admin puerto 5174

### Error de conexión con API
- Verificar que admin-service esté corriendo en puerto 4001
- Revisar logs: `docker logs admin-service`

### Página no carga
- Limpiar caché del navegador (Ctrl + Shift + R)
- Reconstruir contenedores: `docker-compose build --no-cache`

## 🎯 Próximas Mejoras

- [ ] Recuperación de contraseña
- [ ] Registro de actividad por usuario
- [ ] Sesiones con tiempo de expiración
- [ ] Autenticación de dos factores
- [ ] Permisos granulares por módulo

---

**Fecha de implementación:** Diciembre 2025  
**Desarrollado por:** Equipo de Desarrollo - Sistema de Pedidos de Restaurante
