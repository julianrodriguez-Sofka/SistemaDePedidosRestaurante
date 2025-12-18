# 🍽️ Guía Rápida - Sistema de Autenticación por Roles

## 🚀 Inicio Rápido

### 1. Levantar el Proyecto
```bash
cd SistemaDePedidosRestaurante
docker-compose up -d
```

**Verificar que todos los servicios estén corriendo:**
```bash
docker ps
```

### 2. Acceder a las Interfaces

#### 🔷 Para Trabajadores (Chef/Mesero)
**URL:** http://localhost:5173

**Pantalla inicial:**
```
┌─────────────┬─────────────┐
│  I'm a Chef │ I'm a Waiter│
│   (Naranja) │   (Azul)    │
└─────────────┴─────────────┘
```

**Pasos:**
1. Selecciona tu rol
2. Ingresa tu usuario y contraseña
3. Accede a tu área de trabajo

#### 🔷 Para Administradores
**URL:** http://localhost:5174

**Login directo:**
- Pantalla verde con icono 👔
- Solo para usuarios con rol `admin`

---

## 👥 Usuarios de Prueba

### Crear Usuarios Automáticamente

```bash
# Desde la carpeta del proyecto
node seed-test-users.js
```

### Usuarios Creados

| Usuario | Contraseña | Rol(es) | Acceso |
|---------|------------|---------|--------|
| chef1 | chef123 | Chef | http://localhost:5173 → Chef |
| chef2 | chef123 | Chef | http://localhost:5173 → Chef |
| waiter1 | waiter123 | Waiter | http://localhost:5173 → Waiter |
| waiter2 | waiter123 | Waiter | http://localhost:5173 → Waiter |
| multirole | multi123 | Chef + Waiter | http://localhost:5173 → Ambos |

**Nota:** Primero debe existir un usuario admin que pueda crear estos usuarios.

---

## 🎯 Flujos de Usuario

### 👨‍🍳 Flujo del Chef

```
1. http://localhost:5173 (Selección)
   ↓
2. Clic en "I'm a Chef" (Naranja)
   ↓
3. /login/chef (Login naranja)
   ↓
4. Ingresa: chef1 / chef123
   ↓
5. /cocina (Área de cocina)
```

### 🍽️ Flujo del Mesero

```
1. http://localhost:5173 (Selección)
   ↓
2. Clic en "I'm a Waiter" (Azul)
   ↓
3. /login/waiter (Login azul)
   ↓
4. Ingresa: waiter1 / waiter123
   ↓
5. /mesero (Área de pedidos)
```

### 👔 Flujo del Administrador

```
1. http://localhost:5174 (Login directo)
   ↓
2. Ingresa credenciales de admin
   ↓
3. /admin/dashboard (Panel de administración)
```

---

## 🔐 Seguridad

### Validaciones Implementadas

✅ **Separación de roles:**
- Chef solo puede acceder a `/cocina`
- Waiter solo puede acceder a `/mesero`
- Admin solo puede acceder a `/admin/*`

✅ **Validación en login:**
- ChefLogin valida que el usuario tenga rol `chef`
- WaiterLogin valida que el usuario tenga rol `waiter`
- AdminLogin valida que el usuario tenga rol `admin`

✅ **Rutas protegidas:**
- Todas las áreas requieren autenticación
- Token JWT almacenado en localStorage
- Redirección automática si no hay token

---

## 🛠️ Comandos Útiles

### Ver logs de servicios
```bash
docker logs front              # Frontend mesero
docker logs admin-frontend     # Frontend admin
docker logs api-gateway        # Gateway de APIs
docker logs python-ms          # Servicio de pedidos (Python)
docker logs node-ms            # Servicio de cocina (Node)
docker logs admin-service      # Servicio de administración
docker logs rabbitmq           # Cola de mensajes
docker logs mongo              # Base de datos
```

### Reiniciar un servicio específico
```bash
docker-compose restart front
docker-compose restart admin-frontend
docker-compose restart api-gateway
docker-compose restart python-ms
docker-compose restart node-ms
```

### Reconstruir contenedores
```bash
docker-compose down
docker-compose build --no-cache front admin-frontend
docker-compose up -d
```

### Ver servicios corriendo
```bash
docker ps
```

### Verificar conectividad de servicios
```bash
# Probar creación de pedido
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test","table":"1","items":[{"productName":"Pizza","quantity":1,"unitPrice":20000}]}'

# Ver pedidos en cocina
curl http://localhost:3000/api/kitchen/orders?status=pending

# Verificar RabbitMQ
docker exec rabbitmq rabbitmqctl list_queues
```

### Ejecutar tests E2E
```bash
cd e2e-tests
npm test              # Ejecutar todos los tests
npm run report        # Ver reporte HTML
npm run test:headed   # Ver tests en navegador
```

---

## 🐛 Solución de Problemas

### ❌ Error: "Access denied"
**Causa:** Usuario no tiene el rol correcto  
**Solución:** 
1. Verificar roles del usuario en MongoDB o panel admin
2. Usar el login correcto según tu rol

### ❌ Error: "Login failed"
**Causa:** Credenciales incorrectas o servicio no disponible  
**Solución:**
1. Verificar usuario/contraseña
2. Comprobar que admin-service esté corriendo:
   ```bash
   docker logs admin-service
   ```

### ❌ Página en blanco
**Causa:** Caché del navegador  
**Solución:**
1. Presionar `Ctrl + Shift + R` (recarga forzada)
2. O limpiar caché manualmente

### ❌ No puedo crear usuarios
**Causa:** No hay usuario admin inicial  
**Solución:**
1. Crear usuario admin manualmente en MongoDB
2. O ejecutar script de inicialización desde admin-service

---

## 📊 Arquitectura

```
```
┌────────────────────────────────────────────────────────┐
│           http://localhost:5173                        │
│      orders-producer-frontend (Trabajadores)           │
│  ┌────────────┐              ┌────────────┐            │
│  │ ChefLogin  │              │WaiterLogin │            │
│  │ (Naranja)  │              │  (Azul)    │            │
│  └─────┬──────┘              └─────┬──────┘            │
│        ↓                           ↓                   │
│   /cocina                      /mesero                 │
└────────────────────────────────────────────────────────┘
                         │
                         ↓ POST /api/orders
┌────────────────────────────────────────────────────────┐
│           http://localhost:3000                        │
│              API Gateway (Express)                     │
│  • POST /api/orders → python-ms                        │
│  • GET  /api/kitchen/orders → node-ms                  │
└───────────────┬────────────────────┬───────────────────┘
                │                    │
      ↓ Python MS                    ↓ Node MS
┌─────────────────┐           ┌────────────────┐
│ :8000           │           │ :3002          │
│ FastAPI         │─RabbitMQ→ │ Express        │
│ Create Orders   │           │ Kitchen Orders │
└─────────────────┘           └────────────────┘

┌────────────────────────────────────────────────────────┐
│           http://localhost:5174                        │
│          admin-frontend (Administrador)                │
│         ┌──────────────┐                               │
│         │  AdminLogin  │                               │
│         │   (Verde)    │                               │
│         └──────┬───────┘                               │
│                ↓                                       │
│         /admin/dashboard                               │
└────────────────────────────────────────────────────────┘
                         │
                         ↓ API
┌────────────────────────────────────────────────────────┐
│           http://localhost:4001                        │
│            admin-service (Backend)                     │
│  • POST /api/auth/login                                │
│  • POST /api/users                                     │
│  • GET  /api/users                                     │
│  • Gestión de productos, mesas, config                │
└────────────────────────────────────────────────────────┘
```
```

---

## ✨ Características Principales

✅ **Separación clara de interfaces por rol**
✅ **Autenticación JWT con validación de roles**
✅ **Diseño visual distintivo por rol**
✅ **Rutas protegidas con ProtectedRoute**
✅ **API centralizada en admin-service**
✅ **Compatible con Docker Compose**
✅ **Responsive y moderno con Tailwind CSS**

---

**Última actualización:** Diciembre 2025  
**Versión:** 2.0.0  
**Equipo:** Sistema de Pedidos de Restaurante
