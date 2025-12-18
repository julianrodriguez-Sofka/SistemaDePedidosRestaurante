# 🧪 Tests E2E - Sistema de Pedidos de Restaurante

Implementación de casos de prueba del TEST_CASE.md con captura automática de evidencias (screenshots, logs y videos).

## 📋 Cobertura de Tests

### ✅ Implementado

- **MÓDULO 1 - Autenticación (US-001 a US-005)**: 8 casos de prueba
- **MÓDULO 2 - Gestión de Usuarios (US-006 a US-010)**: 8 casos de prueba
- **MÓDULO 3 - Productos y Categorías (US-011 a US-015)**: 10 casos de prueba

**Total: 26 casos de prueba automatizados**

## 🚀 Instalación

```bash
cd e2e-tests
npm install
npm run install-browsers
```

## ▶️ Ejecutar Tests

### Todos los tests (modo headless)
```bash
npm test
```

### Con interfaz visual
```bash
npm run test:ui
```

### Con navegador visible
```bash
npm run test:headed
```

### Por módulo específico
```bash
npm run test:auth      # Tests de autenticación
npm run test:users     # Tests de gestión de usuarios
npm run test:products  # Tests de productos y categorías
```

### Modo debug (paso a paso)
```bash
npm run test:debug
```

## 📊 Ver Resultados

### Ver reporte HTML interactivo
```bash
npm run report
```

**Nota:** El reporte se genera en `../test-results/html-report/` y se abre automáticamente en el navegador con:
- ✅ Tests pasados/fallidos
- 📸 Screenshots de cada paso
- 🎥 Videos de ejecución completa
- 📝 Logs de red y API
- ⏱️ Tiempos de ejecución

## 📁 Estructura de Evidencias

Después de ejecutar los tests, encontrarás:

```
test-results/
├── logs/                          # Logs JSON de cada test
│   ├── TC-US-001-01_timestamp.json
│   ├── TC-US-002-01_timestamp.json
│   └── ...
├── html-report/                   # Reporte HTML interactivo
│   └── index.html
├── TC-US-001-01_01_pantalla_inicial.png
├── TC-US-001-01_02_seleccion_visible.png
├── TC-US-002-01_01_pantalla_login.png
└── videos/                        # Videos de cada test
    └── test-chromium-TIMESTAMP.webm
```

## 📝 Logs de Evidencia

Cada test genera un archivo JSON con:

```json
{
  "resultado": "PASSED",
  "descripcion": "Usuario seleccionó rol Mesero y fue redirigido correctamente",
  "url_final": "http://localhost:3000/login/mesero",
  "timestamp": "2025-12-17T10:30:45.123Z",
  "networkLogs": [
    {
      "url": "http://localhost:3000/api/auth",
      "status": 200,
      "timestamp": "2025-12-17T10:30:45.456Z"
    }
  ]
}
```

## 📸 Screenshots Automáticos

Los screenshots se capturan en:
1. **Estado inicial** del test
2. **Cada acción importante** (click, input, etc.)
3. **Resultado final** (éxito o error)
4. **En caso de fallo** (screenshot automático del error)

## 🎥 Videos

Cada test genera un video completo de la ejecución que puedes ver en el reporte HTML.

## ⚙️ Configuración

### Cambiar URL base
Edita `playwright.config.ts`:
```typescript
use: {
  baseURL: 'http://localhost:5173', // Frontend mesero
}
```

### Cambiar configuración de evidencias
```typescript
use: {
  trace: 'on',        // 'on' | 'off' | 'retain-on-failure'
  screenshot: 'on',   // 'on' | 'off' | 'only-on-failure'
  video: 'on',        // 'on' | 'off' | 'retain-on-failure'
}
```

## 🔧 Prerequisitos

**Servicios necesarios corriendo:**
```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Verifica que estén corriendo:
- ✅ Frontend Mesero: http://localhost:5173
- ✅ Admin Frontend: http://localhost:5174
- ✅ API Gateway: http://localhost:3000
- ✅ Admin Service: http://localhost:4001
- ✅ Python Service: http://localhost:8000
- ✅ Node Service (Cocina): http://localhost:3002
- ✅ MongoDB: localhost:27017
- ✅ RabbitMQ: http://localhost:15672 (admin/admin)

## 🐛 Debug de Tests

### Ver logs en consola
```bash
npm test -- --reporter=list
```

### Ejecutar un solo test
```bash
npx playwright test tests/auth.spec.ts -g "TC-US-001-01"
```

### Ver trace del último test
```bash
npx playwright show-trace test-results/.../trace.zip
```

## 📊 Casos de Prueba Implementados

### 🔐 Autenticación (auth.spec.ts)
- ✅ TC-US-001-01: Selección correcta de rol
- ✅ TC-US-001-02: Acceso sin selección de rol
- ✅ TC-US-001-03: Carga en tiempo límite
- ✅ TC-US-002-01: Login mesero exitoso
- ✅ TC-US-002-02: Login con contraseña incorrecta
- ✅ TC-US-003-01: Login cocinero exitoso
- ✅ TC-US-004-01: Login administrador exitoso
- ✅ TC-US-005-01: Bloqueo RBAC

### 👥 Gestión de Usuarios (users.spec.ts)
- ✅ TC-US-006-01: Crear usuario válido
- ✅ TC-US-006-02: Usuario duplicado
- ✅ TC-US-007-01: Editar usuario
- ✅ TC-US-008-01: Desactivar usuario
- ✅ TC-US-009-01: Listar usuarios
- ✅ TC-US-009-02: Listado sin permisos
- ✅ TC-US-010-01: Bloqueo usuario desactivado

### 📦 Productos y Categorías (products.spec.ts)
- ✅ TC-US-011-01: Crear categoría
- ✅ TC-US-011-02: Categoría duplicada
- ✅ TC-US-011-03: Categoría longitud límite
- ✅ TC-US-012-01: Crear producto
- ✅ TC-US-012-02: Producto precio inválido
- ✅ TC-US-013-01: Editar producto
- ✅ TC-US-014-01: Desactivar producto
- ✅ TC-US-015-01: Listar productos
- ✅ TC-US-015-03: Listado alto volumen

## 🎯 Métricas de Calidad

Los tests validan:
- ✅ **Funcionalidad**: Comportamiento esperado
- ✅ **Seguridad**: RBAC y autenticación
- ✅ **Performance**: SLO < 800ms para carga, < 2000ms para APIs
- ✅ **UX**: Mensajes de error apropiados
- ✅ **Integridad**: Validaciones de datos

## 📧 Evidencias para Entrega

Para generar el paquete de evidencias completo:

```bash
# 1. Ejecutar todos los tests
npm test

# 2. Generar reporte
npm run report

# 3. Comprimir evidencias
# En PowerShell:
Compress-Archive -Path ../test-results/* -DestinationPath evidencias_tests.zip
```

El zip contendrá:
- 📸 Screenshots de cada paso
- 🎥 Videos de ejecución
- 📝 Logs JSON estructurados
- 📊 Reporte HTML interactivo
- ✅ Resultados JUnit XML

## 🔄 Integración Continua

Para ejecutar en CI/CD, agrega a `.github/workflows/tests.yml`:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd e2e-tests
          npm ci
          npx playwright install --with-deps
      
      - name: Run services
        run: docker-compose up -d
      
      - name: Wait for services
        run: sleep 10
      
      - name: Run tests
        run: cd e2e-tests && npm test
      
      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## 📞 Soporte

Para problemas con los tests:
1. Verifica que todos los servicios estén corriendo: `docker ps`
2. Revisa los logs: `docker-compose logs`
3. Ejecuta en modo debug: `npm run test:debug`
4. Revisa el reporte HTML: `npm run report`
