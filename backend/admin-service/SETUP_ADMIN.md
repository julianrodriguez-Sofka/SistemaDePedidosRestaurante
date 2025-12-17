# Crear Usuario Administrador

Este documento explica cómo crear el usuario administrador por defecto en el sistema.

## 🚀 Método 1: Script de Seed (Recomendado)

### Pasos:

1. **Ir al directorio del admin-service:**
   ```bash
   cd admin-service
   ```

2. **Instalar dependencias (si aún no lo has hecho):**
   ```bash
   npm install
   ```

3. **Asegurarte que MongoDB esté corriendo:**
   ```bash
   # Si estás usando Docker Compose desde la raíz:
   cd ..
   docker-compose up -d mongodb
   
   # Esperar unos segundos a que MongoDB inicie
   ```

4. **Ejecutar el script de seed:**
   ```bash
   cd admin-service
   npm run seed
   ```

### 📋 Credenciales creadas:

El script creará automáticamente estos usuarios:

**ADMINISTRADOR:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@restaurant.com`
- Role: `admin`

**CHEF (para pruebas):**
- Username: `chef1`
- Password: `chef123`
- Email: `chef@restaurant.com`
- Role: `chef`

**MESERO (para pruebas):**
- Username: `waiter1`
- Password: `waiter123`
- Email: `waiter@restaurant.com`
- Role: `waiter`

---

## 🔧 Método 2: Usando el API directamente

Si prefieres crear el usuario manualmente a través de la API:

### 1. Asegúrate que el servicio esté corriendo:

```bash
cd admin-service
npm run dev
```

### 2. Hacer una petición POST a `/api/users`:

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@restaurant.com",
    "password": "admin123",
    "fullName": "System Administrator",
    "role": "admin"
  }'
```

O usando Postman/Thunder Client:

**Endpoint:** `POST http://localhost:4000/api/users`

**Body (JSON):**
```json
{
  "username": "admin",
  "email": "admin@restaurant.com",
  "password": "admin123",
  "fullName": "System Administrator",
  "role": "admin"
}
```

---

## 🔐 Iniciar sesión

Una vez creado el usuario, puedes iniciar sesión:

**Endpoint:** `POST http://localhost:4000/api/auth/login`

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "username": "admin",
      "email": "admin@restaurant.com",
      "role": "admin",
      "fullName": "System Administrator"
    }
  }
}
```

---

## 🌐 Usar en el Frontend

1. Abre el admin frontend: `http://localhost:5174`
2. Inicia sesión con:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`

---

## ⚠️ IMPORTANTE - Seguridad

**En producción:**
1. Cambia inmediatamente la contraseña por defecto
2. Usa contraseñas fuertes (mínimo 12 caracteres)
3. Habilita autenticación de dos factores (2FA) si es posible
4. Monitorea los logs de acceso administrativo

---

## 🔄 Resetear usuarios

Si necesitas limpiar y volver a crear los usuarios:

```bash
# Entrar a MongoDB
docker exec -it mongodb-container mongosh

# En la shell de MongoDB:
use admin_db
db.users.deleteMany({})
exit

# Volver a ejecutar el seed
cd admin-service
npm run seed
```

---

## 📝 Notas

- El script de seed es **idempotente**: si ya existe el usuario admin, no lo duplicará
- Las contraseñas se almacenan hasheadas con bcrypt (10 rounds)
- El token JWT tiene una expiración de 24 horas por defecto
- Puedes modificar el script [src/scripts/seed.ts](src/scripts/seed.ts) para crear usuarios adicionales
