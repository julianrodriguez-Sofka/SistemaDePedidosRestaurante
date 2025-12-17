# 📋 RESUMEN EJECUTIVO - PLAN DE PRUEBAS
## Sistema de Pedidos de Restaurante

**Versión:** 1.0  
**Fecha:** 16 de Diciembre de 2025  
**Estado:** ✅ Aprobado

---

## 🎯 OBJETIVO

Validar las **35 historias de usuario** del Sistema de Pedidos de Restaurante en **4 sprints (8 semanas)**, garantizando:
- ⚡ SLOs < 2 segundos (90%)
- 🏗️ Arquitectura de microservicios funcional
- 🔒 Seguridad y RBAC implementados
- 🔄 Sincronización en tiempo real vía WebSocket

---

## ✅ ALCANCE DE PRUEBAS

### En Alcance

**Módulos Funcionales:**
- ✅ **Autenticación** (5 US) - Login/Logout por rol, JWT tokens
- ✅ **Usuarios** (4 US) - CRUD, encriptación bcrypt
- ✅ **Productos** (6 US) - CRUD con categorías, disponibilidad
- ✅ **Mesas** (5 US) - Estados, sincronización en tiempo real
- ✅ **Pedidos Mesero** (6 US) - Toma de pedidos, envío a RabbitMQ
- ✅ **Pedidos Cocina** (4 US) - Kanban, preparación, notificaciones
- ✅ **Monitoreo** (3 US) - Dashboard admin, métricas
- ✅ **Configuración** (2 US) - Info restaurante, impuestos

**Componentes Técnicos:**
- ✅ WebSocket en tiempo real (2 servidores: `admin-service:4001`, `orders-producer-node:4000`)
- ✅ Arquitectura microservicios (8 servicios Docker)
- ✅ RBAC (3 roles: mesero, cocinero, admin)
- ✅ RabbitMQ + MongoDB + API Gateway

### Fuera de Alcance ❌

- ❌ Facturación electrónica
- ❌ Pasarelas de pago (Stripe, PayPal)
- ❌ Aplicación móvil nativa
- ❌ Módulo de inventario
- ❌ Penetration testing
- ❌ Accesibilidad WCAG 2.1
---

## 🧪 ESTRATEGIA DE PRUEBAS

### Distribución por Tipo

| Tipo | Porcentaje | Descripción |
|------|------------|-------------|
| 🟢 **Automatizado** | 60% | Unit + Integration + E2E + Performance |
| 🔵 **Manual** | 30% | Exploratorio + UX + Edge cases |
| 🔴 **Carga** | 10% | Load + Stress + Soak tests |

### Pirámide de Pruebas

```
                    /\
                   /  \
                  / E2E \ ─────────── 10% (35 flujos Playwright)
                 /______\
                /        \
               / Integr.  \ ────────── 30% (150 casos Jest + Supertest)
              /____________\
             /              \
            /   Unit Tests   \ ────── 60% (240 casos Jest/PyTest/Vitest)
           /__________________\
```

**Cobertura Objetivo:** ≥ 80% en todos los niveles
---

## 📊 MÉTRICAS CLAVE

| Métrica | Objetivo | Estado |
|---------|----------|--------|
| **Total casos de prueba** | 440+ | 📈 |
| **Cobertura de código** | ≥ 80% | 🎯 |
| **Performance (P95)** | < 2s con 100 usuarios | ⚡ |
| **WebSocket propagación** | < 2s | 🔄 |
| **Bugs críticos** | 0 para release | ✅ |
| **Regresión completa** | 35 flujos (100%) | 🔍 |

---

## 🗓️ CRONOGRAMA DE EJECUCIÓN

| Sprint | Semanas | User Stories | Test Cases | Esfuerzo | Focus |
|--------|---------|--------------|------------|----------|-------|
| **Sprint 1** | 1-2 | US-001 → US-009 | 85 | 30h | 🔐 Autenticación + Usuarios |
| **Sprint 2** | 3-4 | US-010 → US-020 | 119 | 44h | 🍔 Productos + Mesas |
| **Sprint 3** | 5-6 | US-021 → US-030 | 150 | 62h | 📋 Pedidos (Mesero + Cocina) |
| **Sprint 4** | 7-8 | US-031 → US-035 | 116 | 64h | 📊 Monitoreo + Regresión Full |
| **TOTAL** | **8 semanas** | **35 historias** | **470 casos** | **200h** | ✅ **Release** |
---

## 🛠️ HERRAMIENTAS Y TECNOLOGÍAS

### Stack de Automatización

| Categoría | Herramientas | Propósito |
|-----------|--------------|-----------|
| **Unit Testing** | Jest, PyTest, Vitest | Pruebas unitarias por lenguaje |
| **Integration** | Jest + Supertest | APIs REST, WebSocket |
| **E2E Testing** | Playwright | Flujos completos multi-browser |
| **Performance** | k6 / Artillery | Load, Stress, Soak tests |
| **Coverage** | Jest Coverage, PyTest-cov | Métricas de cobertura |

### Gestión y Reporting

| Herramienta | Uso |
|-------------|-----|
| **Jira** | Gestión de defectos y tasks |
| **TestRail** | Test case management |
| **Allure** | Reporting y dashboards |
| **GitHub Actions** | CI/CD pipeline |
| **SonarQube** | Análisis de código estático |

---

## 🚨 GESTIÓN DE RIESGOS

### Top 3 Riesgos Críticos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|--------|--------------|---------|------------|
| 1️⃣ | **WebSocket desconexiones bajo carga** | 🟡 Media | 🔴 Alto | • Retry logic con backoff exponencial<br>• Load tests desde Sprint 2<br>• Soak tests 4+ horas |
| 2️⃣ | **Pérdida sincronización microservicios** | 🟡 Media | 🔴 Alto | • Event sourcing + idempotencia<br>• Integration tests robustos<br>• Health checks de sincronización |
| 3️⃣ | **Memory leaks en WebSocket connections** | 🟡 Media | 🔴 Alto | • Memory profiling continuo<br>• Cleanup en unmount<br>• Soak tests extendidos |

### Plan de Contingencia

**Si se detecta riesgo crítico:**
1. ⏸️ Pausar despliegue inmediato
2. 🔍 Análisis root cause (< 4 horas)
3. 🧪 Reproducción en ambiente controlado
4. 🔧 Implementación de fix + tests
5. ✅ Validación completa antes de continuar
6. 📈 Monitoreo intensivo 48 horas post-fix

---

## ✔️ CRITERIOS DE RELEASE

### Gate de Producción (Obligatorios)

| Criterio | Descripción | Estado |
|----------|-------------|--------|
| ✅ **User Stories** | 100% de 35 historias validadas | - |
| ✅ **Bugs Críticos** | 0 bugs críticos o altos pendientes | - |
| ✅ **Cobertura** | ≥ 80% code coverage | - |
| ✅ **Performance** | < 2s (P95) con 100 usuarios | - |
| ✅ **Load Test** | 200 usuarios concurrentes sin errores | - |
| ✅ **Soak Test** | 4 horas sin degradación | - |
| ✅ **Regresión** | 35 flujos E2E pasando (100%) | - |
| ✅ **Cross-browser** | Chrome, Firefox, Edge, Safari validados | - |
| ✅ **Sign-off** | Aprobación de PO + Stakeholders | - |

### Criterios de Salida por Sprint

**Sprint 1-3:**
- 100% US del sprint validadas
- 0 bugs críticos
- ≤ 10% bugs altos pendientes
- Cobertura ≥ 80%

**Sprint 4 (Release):**
- Todos los criterios del Gate de Producción cumplidos
- Smoke tests en staging exitosos
- Plan de rollback documentado
- Documentación actualizada

---

## 👥 EQUIPO Y RECURSOS

### Composición del Equipo

| Rol | Cant. | Dedicación | Responsabilidades Clave |
|-----|-------|------------|-------------------------|
| 👔 **QA Lead** | 1 | 100% | Estrategia, planificación, coordinación |
| 🧪 **QA Manual Engineer** | 2 | 100% | Pruebas exploratorias, casos de prueba, UX |
| 🤖 **QA Automation Engineer** | 2 | 100% | Scripts automatización, frameworks, CI/CD |
| ⚡ **Performance Engineer** | 1 | 50% | Load tests, performance tuning, análisis |
| 🔧 **DevOps Engineer** | 1 | 25% | Ambientes, CI/CD, monitoreo |
| 💻 **Developers** | 4 | 20% | Unit tests, bug fixes, code reviews |

**Esfuerzo Total:** ~200 horas por sprint

---

## 📝 ENTREGABLES

### Por Sprint
- ✅ Test execution report (PDF)
- ✅ Defect summary (Jira export)
- ✅ Coverage report (SonarQube)
- ✅ Performance report (k6 HTML)

### Release Final
- ✅ Test plan completo ejecutado
- ✅ Matriz de trazabilidad (US → Test cases)
- ✅ Reporte de regresión completa
- ✅ Sign-off document
- ✅ Lessons learned

---

## 📌 NOTAS IMPORTANTES

> **⚠️ Limitaciones Conocidas:**
> - Sistema diseñado para máximo **200 usuarios concurrentes**
> - Requiere **conexión a internet permanente** (no offline mode)
> - Sistema **mono-restaurante** (sin multi-tenancy)

> **📋 Referencias:**
> - [REFINED_BACKLOG.md](./REFINED_BACKLOG.md) - 35 User Stories detalladas
> - [TEST_PLAN.md](./TEST_PLAN.md) - Plan de pruebas completo
> - [docker-compose.yml](./docker-compose.yml) - Arquitectura de servicios

---

**Documento:** TEST-PLAN.md (Resumen Ejecutivo)  
**Última Actualización:** 16 de Diciembre de 2025  
**Próxima Revisión:** Inicio de cada Sprint