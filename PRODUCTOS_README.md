# 🍔 Sistema de Gestión de Productos - Panel Administrativo

## ✅ Funcionalidades Implementadas

### 1. Catálogo de Productos del Administrador
- **Gestión completa CRUD** de productos desde el panel administrativo
- **Productos iniciales** cargados automáticamente:
  - Hamburguesa ($10,500) - Plato Principal - 15 min prep
  - Papas fritas ($12,000) - Acompañamiento - 10 min prep  
  - Perro caliente ($8,000) - Plato Principal - 12 min prep
  - Refresco ($7,000) - Bebida - 2 min prep

### 2. Gestión de Imágenes
- **Campo URL de imagen** en el formulario de creación/edición
- **Preview en tiempo real** de la imagen al ingresar la URL
- **Fallback automático** a placeholder si la imagen no carga
- Las imágenes se almacenan como URLs en la base de datos

### 3. Integración con Interfaz del Mesero
- El frontend del mesero **obtiene productos dinámicamente** desde el backend
- **Sincronización automática** entre admin y mesero
- Productos actualizados en admin se reflejan inmediatamente en la vista del mesero
- Solo se muestran **productos activos** en la interfaz del mesero

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                 Admin Panel (5174)                  │
│  - Crear/Editar/Eliminar productos                  │
│  - Gestionar imágenes (URLs)                        │
│  - Activar/Desactivar productos                     │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│            Admin Service (8001)                     │
│  - API REST para productos                          │
│  - MongoDB (restaurant_admin)                       │
│  - Validación de datos                              │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│          Interfaz del Mesero (5173)                 │
│  - Carga productos desde /api/products/             │
│  - Muestra solo productos activos                   │
│  - Actualización automática                         │
└─────────────────────────────────────────────────────┘
```

## 📝 Uso del Sistema

### Desde el Panel Admin (http://localhost:5174)

1. **Login**: admin@restaurant.com / admin123
2. **Navegar a "Catálogo de Productos"**
3. **Crear Nuevo Producto**:
   - Nombre: Nombre del producto
   - Precio: Mayor a 0
   - Categoría: Plato Principal, Acompañamiento, Bebida, etc.
   - Descripción: Opcional
   - **URL de Imagen**: Ruta de la imagen (ej: `/images/producto.jpg`)
   - Tiempo de preparación: En minutos

4. **Editar Producto**: Click en "Editar" en la tabla
5. **Activar/Desactivar**: Toggle de estado sin eliminar
6. **Eliminar**: Borrado permanente del producto

### Desde la Interfaz del Mesero (http://localhost:5173)

1. Los productos aparecen automáticamente en el menú
2. Los cambios en el admin se reflejan al recargar
3. Solo se ven productos con `is_active: true`

## 🔧 Endpoints API

### Productos
- `GET /api/products/` - Listar todos los productos
- `GET /api/products/?active_only=true` - Solo productos activos
- `POST /api/products/` - Crear producto (requiere admin)
- `PATCH /api/products/{id}` - Actualizar producto (requiere admin)
- `DELETE /api/products/{id}` - Eliminar producto (requiere admin)

### Ejemplo de Producto
```json
{
  "id": "uuid",
  "name": "Hamburguesa",
  "price": 10500,
  "category": "Plato Principal",
  "description": "Deliciosa hamburguesa",
  "image_url": "/images/burguer_pic.jpg",
  "preparation_time": 15,
  "is_active": true,
  "created_at": "2025-12-16T14:41:08.513Z",
  "updated_at": "2025-12-16T14:41:08.513Z"
}
```

## 🖼️ Gestión de Imágenes

### Opciones para Imágenes

1. **Imágenes locales** (en `/public/images/` del frontend del mesero):
   ```
   /images/producto.jpg
   ```

2. **URLs externas**:
   ```
   https://ejemplo.com/imagen.jpg
   ```

3. **Sin imagen**: El sistema usa un placeholder automático

### Agregar Nuevas Imágenes Locales

1. Colocar imagen en: `orders-producer-frontend/public/images/`
2. Usar ruta en admin: `/images/nombre-imagen.jpg`
3. Rebuild del frontend del mesero si es necesario

## 🚀 Comandos Útiles

### Ver productos en MongoDB
```bash
docker exec mongo mongosh restaurant_admin --eval "db.products.find().pretty()"
```

### Agregar productos iniciales (si se borró la BD)
```bash
docker exec admin-service sh -c "cd /app && python -m src.scripts.seed_products"
```

### Rebuild servicios
```bash
docker-compose up -d --build admin-service
docker-compose up -d --build admin-frontend
docker-compose up -d --build front
```

## 🔐 Roles y Permisos

- **Admin**: Acceso total al panel administrativo
- **Mesero**: Solo lectura de productos activos
- **Cocinero**: Sin acceso a gestión de productos

## 📊 Base de Datos

### Colección: `products`
```javascript
{
  _id: "uuid",                    // ID único
  name: String,                   // Nombre del producto
  price: Number,                  // Precio (debe ser > 0)
  category: String,               // Categoría del producto
  description: String,            // Descripción opcional
  image_url: String,              // URL de la imagen
  preparation_time: Number,       // Tiempo en minutos
  is_active: Boolean,             // Estado activo/inactivo
  created_at: ISODate,           // Fecha de creación
  updated_at: ISODate            // Última actualización
}
```

## ✨ Características Técnicas

- **Validación de precios**: No permite precios <= 0
- **Preview de imágenes**: Muestra la imagen antes de guardar
- **Fallback de imágenes**: Usa placeholder si la URL falla
- **Sincronización en tiempo real**: Los cambios se ven al instante
- **Solo productos activos**: El mesero no ve productos desactivados
- **Proxy configurado**: Comunicación Docker entre servicios

## 🎯 Cumplimiento de Requerimientos

✅ **Productos mockeados agregados al catálogo admin**
✅ **Campo de imagen en formulario de productos**
✅ **Integración con interfaz del mesero**
✅ **Sin afectar funcionalidades existentes**
✅ **Gestión completa CRUD de productos**
✅ **Activar/Desactivar productos**
✅ **Categorización de productos**
