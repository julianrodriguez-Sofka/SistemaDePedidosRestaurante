# 🔀 Guía de Migración a 2 Repositorios Separados

Si deseas separar el proyecto en dos repositorios Git independientes (uno para backend y otro para frontend), sigue estos pasos:

## 📦 Repositorio 1: Backend

### Archivos a incluir:
```
backend/
├── api-gateway/
├── admin-service/
├── orders-producer-python/
├── orders-producer-node/
├── docker-compose.yml
├── README.md
├── create-admin.js
├── create-admin-user.js
├── fix-users.js
├── seed-tables.js
└── seed-test-users.js
```

### Archivos adicionales (raíz del repo backend):
```
.gitignore
README.md
.env.example
```

### Pasos:
```bash
# 1. Crear nuevo repositorio backend
mkdir restaurant-backend
cd restaurant-backend
git init

# 2. Copiar contenido de backend/
cp -r ../SistemaDePedidosRestaurante/backend/* .

# 3. Crear .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
__pycache__/
*.pyc
.DS_Store
*.log
mongo-data/
EOF

# 4. Commit inicial
git add .
git commit -m "Initial commit: Backend microservices"

# 5. Conectar con remoto
git remote add origin <tu-repo-backend-url>
git push -u origin main
```

## 🎨 Repositorio 2: Frontend

### Archivos a incluir:
```
frontend/
├── orders-producer-frontend/
├── admin-frontend/
├── docker-compose.yml
└── README.md
```

### Pasos:
```bash
# 1. Crear nuevo repositorio frontend
mkdir restaurant-frontend
cd restaurant-frontend
git init

# 2. Copiar contenido de frontend/
cp -r ../SistemaDePedidosRestaurante/frontend/* .

# 3. Crear .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
.DS_Store
*.log
EOF

# 4. Commit inicial
git add .
git commit -m "Initial commit: Frontend applications"

# 5. Conectar con remoto
git remote add origin <tu-repo-frontend-url>
git push -u origin main
```

## ⚙️ Configuración después de la separación

### Backend - Ajustes de CORS

Actualizar CORS en cada servicio para permitir el frontend desplegado:

**api-gateway/src/app.ts:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://tu-frontend-prod.com',  // Agregar dominio de producción
  ],
  credentials: true
}));
```

**admin-service/src/app.ts:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:5174',
    'https://admin.tu-frontend-prod.com',  // Agregar dominio de producción
  ],
  credentials: true
}));
```

### Frontend - Variables de Entorno

Actualizar archivos `.env` para apuntar al backend desplegado:

**orders-producer-frontend/.env:**
```env
# Desarrollo local
VITE_API_GATEWAY_URL=http://localhost:3000
VITE_ADMIN_API_URL=http://localhost:4001/api
VITE_WS_URL=ws://localhost:4000

# Producción (descomentar cuando despliegues)
# VITE_API_GATEWAY_URL=https://api.tu-backend-prod.com
# VITE_ADMIN_API_URL=https://admin-api.tu-backend-prod.com
# VITE_WS_URL=wss://ws.tu-backend-prod.com
```

**admin-frontend/.env:**
```env
# Desarrollo local
VITE_ADMIN_API_URL=http://localhost:4001/api

# Producción (descomentar cuando despliegues)
# VITE_ADMIN_API_URL=https://admin-api.tu-backend-prod.com
```

### Docker Compose - Networking

**Opción A: Desarrollo Local (ambos repos en la misma máquina)**

Backend crea la red:
```yaml
# backend/docker-compose.yml
networks:
  app-network:
    name: restaurant-network
    driver: bridge
```

Frontend se conecta a la red existente:
```yaml
# frontend/docker-compose.yml
networks:
  app-network:
    name: restaurant-network
    external: true
```

**Opción B: Despliegue Separado (servidores diferentes)**

Backend expone puertos públicamente:
```yaml
# backend/docker-compose.yml - Sin cambios, puertos ya expuestos
```

Frontend usa URLs externas (sin red compartida):
```yaml
# frontend/docker-compose.yml
services:
  orders-producer-frontend:
    build:
      context: ./orders-producer-frontend
      dockerfile: Dockerfile
      args:
        - VITE_API_GATEWAY_URL=https://api.tu-backend-prod.com
        - VITE_ADMIN_API_URL=https://admin-api.tu-backend-prod.com
        - VITE_WS_URL=wss://ws.tu-backend-prod.com
    ports:
      - "80:5173"  # Exponer en puerto 80
```

## 🚀 CI/CD - Pipelines Separados

### Backend Pipeline (.github/workflows/backend.yml)
```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          cd api-gateway && npm test
          cd ../orders-producer-node && npm test
      
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Build Docker images
        run: docker-compose build
      
  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to production
        run: |
          # Tu lógica de despliegue
```

### Frontend Pipeline (.github/workflows/frontend.yml)
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          cd orders-producer-frontend && npm test
          cd ../admin-frontend && npm test
      
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Build Docker images
        run: docker-compose build
      
  deploy:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to production
        run: |
          # Tu lógica de despliegue
```

## 📋 Checklist de Migración

### Backend
- [ ] Repositorio creado y código pusheado
- [ ] .gitignore configurado
- [ ] Variables de entorno documentadas (.env.example)
- [ ] CORS configurado para permitir frontend
- [ ] Puertos expuestos correctamente
- [ ] README actualizado con instrucciones
- [ ] CI/CD configurado
- [ ] Tests funcionando

### Frontend
- [ ] Repositorio creado y código pusheado
- [ ] .gitignore configurado
- [ ] Variables de entorno configuradas (.env)
- [ ] URLs del backend actualizadas
- [ ] Docker Compose ajustado para networking
- [ ] README actualizado con instrucciones
- [ ] CI/CD configurado
- [ ] Tests funcionando

### Sincronización
- [ ] Versionado de APIs documentado
- [ ] Contrato de APIs compartido
- [ ] Comunicación entre equipos establecida
- [ ] Estrategia de releases coordinada

## 🔗 Comunicación entre Repositorios

### Opción 1: Submodules de Git
```bash
# En el repo principal
git submodule add <backend-repo-url> backend
git submodule add <frontend-repo-url> frontend
```

### Opción 2: Mono-repo con Workspaces
Usa herramientas como:
- **Nx** (nx.dev)
- **Turborepo** (turbo.build)
- **Lerna** (lerna.js.org)

### Opción 3: Repositorios Independientes
- Documentar contrato de APIs en repo compartido
- Usar versionado semántico
- CI/CD notifica a otros equipos en cambios breaking

## 🌐 Estrategias de Despliegue

### Desarrollo Local
```bash
# Backend
cd restaurant-backend
docker-compose up -d

# Frontend (otra terminal)
cd restaurant-frontend
docker-compose up -d
```

### Staging/Producción

**Backend:**
- Deploy en servidor/contenedor
- Dominio: `api.tuapp.com`, `admin-api.tuapp.com`, `ws.tuapp.com`

**Frontend:**
- Build estático y deploy en CDN/servidor
- Dominio: `app.tuapp.com`, `admin.tuapp.com`
- Variables de entorno apuntan a backend de producción

## 📞 Soporte

Si tienes problemas durante la migración:
1. Verifica que CORS esté configurado correctamente
2. Confirma que las URLs en `.env` del frontend sean correctas
3. Revisa los logs de Docker: `docker-compose logs -f`
4. Verifica que los puertos no estén en uso

## ✅ Resultado Final

Dos repositorios independientes:
- **restaurant-backend**: API Gateway, microservicios, infraestructura
- **restaurant-frontend**: UI de meseros y panel de administración

Cada equipo puede trabajar, hacer deploy y escalar independientemente manteniendo la funcionalidad completa del sistema. 🎉
