# 📋 PLAN DE PRUEBAS ACTUALIZADO - SISTEMA DE PEDIDOS DE RESTAURANTE


## 🎯 OBJETIVOS DEL PLAN DE PRUEBAS

### Objetivos Generales
1. **Validar funcionalidad completa** de las 25 HU implementadas
2. **Garantizar integración** entre microservicios (API Gateway, Admin Service, Orders Python, Kitchen Worker)
3. **Verificar comunicación asíncrona** vía RabbitMQ
4. **Comprobar seguridad** del sistema (JWT, RBAC)
5. **Validar experiencia de usuario** en interfaces web (mesero, cocinero, admin)

### Objetivos Específicos
- Alcanzar **≥80% de cobertura de pruebas** en todos los módulos
- **100% de casos críticos P0** (autenticación, pedidos, cocina) pasando
- **≤5% de defectos críticos** en producción
- **Tiempo de respuesta promedio <500ms** en operaciones CRUD
- **Disponibilidad del sistema ≥99%** durante período de pruebas

---

## 🏗️ ALCANCE DE PRUEBAS

### Módulos Incluidos (6 Módulos)

#### ✅ Módulo 1: Autenticación y Acceso
- **HU Implementadas:** US-001 a US-004 (4 HU)
- **Casos de Prueba:** 15 casos
- **Prioridad:** P0 (Crítico)
- **Endpoints:**
  - `POST /api/auth/login`
  - Middleware de autenticación JWT
  - Control RBAC en todos los endpoints protegidos

#### ✅ Módulo 2: Gestión de Usuarios
- **HU Implementadas:** US-005 a US-009 (5 HU)
- **Casos de Prueba:** 12 casos
- **Prioridad:** P1 (Alta)
- **Endpoints:**
  - `POST /api/admin/users` (Crear)
  - `GET /api/admin/users` (Listar)
  - `GET /api/admin/users/:id` (Obtener)
  - `PUT /api/admin/users/:id` (Editar)
  - `DELETE /api/admin/users/:id` (Eliminar)

#### ✅ Módulo 3: Gestión de Productos
- **HU Implementadas:** US-010 a US-012 (3 HU)
- **Casos de Prueba:** 9 casos
- **Prioridad:** P1 (Alta)
- **Notas:** **SIN modelo de categorías**
- **Endpoints:**
  - `POST /api/admin/products` (Crear)
  - `GET /api/admin/products` (Listar)
  - `PUT /api/admin/products/:id` (Editar)
  - `DELETE /api/admin/products/:id` (Eliminar)

#### ✅ Módulo 4: Gestión de Mesas
- **HU Implementadas:** US-013 a US-017 (5 HU)
- **Casos de Prueba:** 11 casos
- **Prioridad:** P1 (Alta)
- **Notas:** **SIN WebSocket en admin** (solo HTTP polling)
- **Endpoints:**
  - `POST /api/admin/tables` (Crear)
  - `GET /api/admin/tables` (Listar)
  - `PUT /api/admin/tables/:id` (Editar)
  - `PUT /api/admin/tables/:id/status` (Cambiar estado)
  - `DELETE /api/admin/tables/:id` (Eliminar)

#### ✅ Módulo 5: Gestión de Pedidos
- **HU Implementadas:** US-018 a US-023 (6 HU)
- **Casos de Prueba:** 15 casos
- **Prioridad:** P0 (Crítico)
- **Backend:** Python FastAPI (puerto 8000)
- **Endpoints:**
  - `POST /api/v1/orders/` (Crear)
  - `GET /api/v1/orders/` (Listar)
  - `GET /api/v1/orders/{id}` (Obtener)
  - `PUT /api/v1/orders/{id}` (Editar)
  - `DELETE /api/v1/orders/{id}` (Cancelar)

#### ✅ Módulo 6: Cocina y Procesamiento Asíncrono
- **HU Implementadas:** US-024 a US-027 (4 HU)
- **Casos de Prueba:** 8 casos
- **Prioridad:** P0 (Crítico)
- **Tecnologías:** RabbitMQ, Worker Node.js, WebSocket
- **Componentes:**
  - Worker Node.js (consume cola `orders_queue`)
  - RabbitMQ (puerto 5672)
  - WebSocket (en orders-producer-node para notificaciones)

---

#### ❌ Funcionalidades Parciales No Soportadas
1. **Selección de Rol Previa:** No existe pantalla de selección (US-001 original)
2. **Categorías de Productos:** No hay modelo `Category` en MongoDB
3. **Soft Delete:** Sistema hace eliminación física (hard delete)
4. **WebSocket en Admin:** Solo disponible en orders-producer-node (cocina)

---

## 🧪 ESTRATEGIA DE PRUEBAS

### Tipos de Pruebas

#### 1. Pruebas Unitarias
- **Responsables:** Desarrolladores
- **Herramientas:** Jest (TypeScript), pytest (Python)
- **Cobertura Objetivo:** ≥70%
- **Alcance:**
  - Lógica de negocio en servicios
  - Validaciones de modelos
  - Utilidades y helpers

#### 2. Pruebas de Integración
- **Responsables:** QA + Desarrolladores
- **Herramientas:** Jest (admin-service), pytest (orders-python)
- **Cobertura Objetivo:** ≥60%
- **Alcance:**
  - Comunicación con MongoDB
  - Publicación/consumo de RabbitMQ
  - Llamadas entre microservicios

#### 3. Pruebas E2E (End-to-End)
- **Responsables:** QA Team
- **Herramientas:** Playwright 1.40.1
- **Cobertura Objetivo:** ≥80% de flujos críticos
- **Alcance:**
  - **88/88 tests pasando (100%)** 
- **Ubicación:** `/e2e-tests/tests/*.spec.ts`

#### 4. Pruebas de Rendimiento
- **Responsables:** QA + DevOps
- **Herramientas:** k6, Artillery
- **Métricas Objetivo:**
  - Tiempo de respuesta promedio: <500ms
  - Throughput: ≥100 req/s
  - Disponibilidad: ≥99%

#### 5. Pruebas de Seguridad
- **Responsables:** Security Team + QA
- **Herramientas:** OWASP ZAP, npm audit
- **Alcance:**
  - Validación JWT
  - Protección RBAC
  - Inyección SQL (N/A - MongoDB NoSQL)
  - XSS en formularios

---

## 📅 CRONOGRAMA DE EJECUCIÓN

### Fase 1: Pruebas de Humo (Smoke Tests) - 1 día
**Objetivo:** Validar que el sistema arranca y funciona básicamente

| Actividad                    | Duración | Responsable |
|------------------------------|----------|-------------|
| Verificar Docker Compose UP  | 1 hora   | DevOps      |
| Ejecutar E2E críticos (P0)   | 2 horas  | QA          |
| Validar conectividad MongoDB | 30 min   | QA          |
| Validar RabbitMQ funcional   | 30 min   | QA          |

---

### Fase 2: Pruebas Funcionales - 3 días

#### Día 1: Autenticación y Usuarios
- TC-US-001-XX (Login unificado)
- TC-US-005-XX a TC-US-008-XX (CRUD usuarios)
- **Criterio de Paso:** 100% de casos críticos P0 pasando

#### Día 2: Productos, Mesas y Pedidos
- TC-US-010-XX a TC-US-012-XX (Productos)
- TC-US-013-XX a TC-US-016-XX (Mesas)
- TC-US-018-XX a TC-US-023-XX (Pedidos)
- **Criterio de Paso:** ≥90% de casos P1 pasando

#### Día 3: Cocina y Flujo Completo
- TC-US-024-XX a TC-US-027-XX (Worker + WebSocket)
- Pruebas de flujo completo (mesero → cocina → listo)
- **Criterio de Paso:** ≥80% de casos de integración pasando

---

### Fase 3: Pruebas de Regresión - 1 día
- Re-ejecutar suite E2E completa (108 tests)
- Validar que correcciones no rompieron funcionalidad existente
- **Criterio de Paso:** ≥80% de tests pasando (84+)

---

### Fase 4: Pruebas de Rendimiento y Seguridad - 2 días
- Load testing con k6 (100 usuarios concurrentes)
- Security scan con OWASP ZAP
- **Criterio de Paso:** Sin vulnerabilidades críticas, <500ms response time

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Criterios de Entrada (Entry Criteria)
- [ ] Todas las 25 HU implementadas y desplegadas en entorno de pruebas
- [ ] Docker Compose levanta todos los servicios sin errores
- [ ] MongoDB y RabbitMQ accesibles
- [ ] Datos de prueba (seed) cargados correctamente
- [ ] Documentación técnica actualizada (REFINED_BACKLOG_ACTUALIZADO.md, TEST_CASE_ACTUALIZADO.md)

### Criterios de Salida (Exit Criteria)
- [ ] **≥80% de casos de prueba pasando** (actualmente 88/88 = 100% ✅)
- [ ] **100% de casos P0 (críticos) pasando**
- [ ] **Cero defectos críticos abiertos**
- [ ] **≤3 defectos mayores abiertos**
- [ ] **Todos los defectos menores documentados**
- [ ] **Reporte de cobertura generado** (TEST_COVERAGE.md)
- [ ] **Aprobación formal del Product Owner**

### Criterios de Suspensión (Suspension Criteria)
- Si **>30% de tests críticos P0 fallan**
- Si **servicios clave (MongoDB, RabbitMQ) no disponibles**
- Si **defectos críticos bloquean flujos principales**

---

## 🐛 GESTIÓN DE DEFECTOS

### Prioridades de Defectos

| Prioridad | Descripción                                   | Tiempo de Respuesta | Ejemplo                              |
|-----------|-----------------------------------------------|---------------------|--------------------------------------|
| **P0**    | Crítico - Sistema no funciona                 | Inmediato           | Login no funciona, BD inaccesible    |
| **P1**    | Mayor - Funcionalidad clave afectada          | <4 horas            | No se pueden crear pedidos           |
| **P2**    | Medio - Funcionalidad secundaria afectada     | <24 horas           | Filtros de búsqueda no funcionan     |
| **P3**    | Menor - Issues cosméticos o mejoras           | <1 semana           | Alineación de texto incorrecta       |

### Ciclo de Vida de Defectos
1. **Nuevo** → QA reporta defecto
2. **Asignado** → Asignado a desarrollador
3. **En Progreso** → Desarrollador trabajando en fix
4. **Resuelto** → Fix desplegado en entorno de pruebas
5. **Verificado** → QA confirma corrección
6. **Cerrado** → Defecto completamente resuelto

### Herramientas
- **Tracking:** Jira, GitHub Issues
- **Documentación:** Markdown en `/test-results/`

### Reportes Generados
1. **REPORTE_FINAL.md** - Estado general de pruebas
2. **COBERTURA_REAL.md** - Cobertura detallada de tests
3. **EVIDENCIAS.md** - Screenshots y videos de ejecuciones
4. **AUDIT_REPORT.md** - Análisis de concordancia doc vs código

---

## 🚀 AMBIENTE DE PRUEBAS

### Configuración Docker

| Servicio                   | Puerto | Tecnología      | Estado |
|----------------------------|--------|-----------------|--------|
| **Frontend Mesero**        | 5173   | React + Vite    | ✅     |
| **Frontend Admin**         | 5174   | React + Vite    | ✅     |
| **API Gateway**            | 3000   | Node.js         | ✅     |
| **Admin Service**          | 4001   | Node.js + TS    | ✅     |
| **Orders Python**          | 8000   | FastAPI         | ✅     |
| **Orders Node (Kitchen)**  | 5001   | Node.js + WS    | ✅     |
| **MongoDB**                | 27017  | MongoDB 5.0     | ✅     |
| **RabbitMQ**               | 5672   | RabbitMQ 3.11   | ✅     |

### Comandos de Ejecución

**Levantar ambiente:**
```powershell
docker-compose up -d
```

**Ejecutar tests E2E:**
```powershell
cd e2e-tests
npm test
```

**Ver logs de servicios:**
```powershell
docker-compose logs -f [service-name]
```

**Seed de datos de prueba:**
```powershell
node seed-test-users.js
node seed-tables.js
```

---

## 👥 ROLES Y RESPONSABILIDADES

| Rol                  | Responsable(s)         | Responsabilidades                                    |
|----------------------|------------------------|------------------------------------------------------|
| **QA Lead**          |  Equipo QA      | Coordinar ejecución, aprobar reportes, gestión bugs  |
| **QA Engineer**      | Equipo QA              | Ejecutar casos de prueba, reportar defectos          |
| **Desarrollador**    | Dev Team               | Corregir defectos, unit tests, code reviews          |
| **DevOps**           | DevOps Team            | Mantener ambientes, CI/CD, monitoreo                 |
| **Product Owner**    | PO                     | Aprobar criterios de aceptación, priorizar defectos  |

---

## 📚 ANEXOS

### Documentos de Referencia
1. **REFINED_BACKLOG.md** - 25 HU implementadas
2. **TEST_CASE.md** - 87 casos de prueba ajustados
3. **REPORTE_FINAL.md** - Estado final de pruebas E2E
4. **COBERTURA_REAL.md** - Cobertura detallada por módulo
5. **AUDIT_REPORT.md** - Análisis de concordancia 71% → 100%

