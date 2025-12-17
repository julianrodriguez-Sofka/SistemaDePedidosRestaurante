# 🎉 Roles y Usuarios - Sistema de Pedidos Restaurante

## ✅ Estado: COMPLETADO

Se han creado exitosamente los roles y usuarios del sistema, junto con datos iniciales de productos, mesas y configuración.

---

## 👥 USUARIOS CREADOS

### 1. 👤 Administrador (Acceso Completo)
```
Username: admin
Password: admin123
Email:    admin@restaurant.com
Roles:    admin, waiter, chef
```
**Permisos:**
- ✅ Gestión completa del sistema
- ✅ Administración de usuarios
- ✅ Configuración del restaurante
- ✅ Gestión de productos y mesas
- ✅ Acceso a todos los módulos

---

### 2. 👨‍🍳 Chef (Cocina)
```
Username: chef1
Password: chef123
Email:    chef@restaurant.com
Roles:    chef
```
**Permisos:**
- ✅ Ver pedidos en cocina
- ✅ Actualizar estado de pedidos
- ✅ Gestionar tiempos de preparación
- ❌ No puede crear pedidos
- ❌ No puede administrar usuarios

---

### 3. 🧑‍💼 Mesero (Atención)
```
Username: waiter1
Password: waiter123
Email:    waiter@restaurant.com
Roles:    waiter
```
**Permisos:**
- ✅ Crear pedidos
- ✅ Gestionar mesas
- ✅ Ver menú y productos
- ❌ No accede a cocina
- ❌ No puede administrar usuarios

---

## 🎯 ROLES DEL SISTEMA

| Rol    | Descripción                           | Permisos                                    |
|--------|---------------------------------------|---------------------------------------------|
| admin  | Administrador del sistema             | Acceso completo a todas las funcionalidades |
| waiter | Mesero/Cajero                         | Gestión de pedidos y atención al cliente    |
| chef   | Chef/Cocinero                         | Visualización y preparación de pedidos      |

---

## 📊 DATOS INICIALIZADOS

### Productos (6)
- Hamburguesa Clásica ($25,000)
- Pizza Margarita ($30,000)
- Ensalada César ($18,000)
- Pasta Carbonara ($28,000)
- Limonada Natural ($8,000)
- Café Americano ($6,000)

### Mesas (10)
- Mesas 1-4: Capacidad 2 personas
- Mesas 5-8: Capacidad 4 personas
- Mesas 9-10: Capacidad 6 personas
- Todas en estado: **Disponible**

### Configuración
- Nombre: Restaurante El Buen Sabor
- Horario: Lunes a Domingo 11:00 AM - 10:00 PM
- Email: contacto@elbuensabor.com

---

## 🌐 ACCESO AL SISTEMA

### URLs Disponibles
- **Admin Panel:** http://localhost:5174
- **Frontend Cliente:** http://localhost:5173
- **API Gateway:** http://localhost:3000
- **Admin Service:** http://localhost:4001

### Endpoints de Autenticación
```bash
POST http://localhost:4001/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "...",
      "username": "admin",
      "email": "admin@restaurant.com",
      "roles": ["admin", "waiter", "chef"]
    }
  }
}
```

---

## 🔐 SEGURIDAD

### ⚠️ IMPORTANTE
- **Cambiar contraseñas en producción**
- Las contraseñas están hasheadas con bcrypt
- Los tokens JWT expiran en 8 horas
- Secret JWT configurado en variables de entorno

### Recomendaciones
1. ✅ Cambiar contraseñas por defecto
2. ✅ Usar contraseñas seguras (mínimo 8 caracteres)
3. ✅ Rotar el JWT_SECRET en producción
4. ✅ Implementar rate limiting en endpoints de autenticación
5. ✅ Usar HTTPS en producción

---

## 🛠️ SCRIPTS EJECUTADOS

1. **seed-docker.ts** - Creación de usuarios con roles
2. **init-data.ts** - Inicialización de productos, mesas y configuración

### Volver a ejecutar
```bash
# Dentro del contenedor
docker exec admin-service npx ts-node src/scripts/seed-docker.ts
docker exec admin-service npx ts-node src/scripts/init-data.ts
```

---

## 📝 VERIFICACIÓN

### Verificar Usuarios en MongoDB
```bash
docker exec mongo mongosh restaurant_admin --eval "db.users.find().forEach(u => print('Usuario:', u.username, '| Roles:', u.roles.join(', ')))"
```

### Verificar Conteo de Datos
```bash
docker exec mongo mongosh restaurant_admin --eval "print('Usuarios:', db.users.countDocuments(), '| Productos:', db.products.countDocuments(), '| Mesas:', db.tables.countDocuments())"
```

---

## ✨ SIGUIENTES PASOS

1. ✅ **Sistema listo para usar**
2. 🔐 Cambiar contraseñas por defecto
3. 👥 Crear usuarios adicionales según necesidad
4. 📦 Ajustar productos y precios
5. 🪑 Configurar mesas según layout del restaurante
6. ⚙️ Personalizar configuración del restaurante

---

**Fecha de creación:** 16 de Diciembre, 2025
**Estado:** ✅ Completado y funcional
