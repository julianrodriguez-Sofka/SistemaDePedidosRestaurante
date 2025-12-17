# 🧪 PLAN DE PRUEBAS REFINADO  
## Sistema de Pedidos de Restaurante

Este plan de pruebas incluye la **totalidad de las 35 Historias de Usuario (HU)**, abarcando los módulos de **Autenticación, Gestión de Usuarios, Productos, Mesas, Pedidos y Cocina**, validando la **arquitectura de microservicios**, la **mensajería asíncrona (RabbitMQ)** y la **comunicación en tiempo real (WebSocket)**.

---

## I. 🎯 Alcance: El Qué y el Qué No se Prueba (Trazado a HU)

### ✅ Definición del Alcance Positivo (Qué se va a probar)

Se probará el **sistema completo**, desde el nivel más alto de administración hasta el procesamiento asíncrono y en tiempo real de los pedidos.

| Módulo / Componente | Funcionalidades Críticas | Historias de Usuario (HU) | Criticidad |
|--------------------|--------------------------|---------------------------|------------|
| **I. Autenticación y Acceso** | Login de Mesero, Cocinero y Administrador; Cierre de sesión; Selección de Rol (RBAC). | US-001 a US-005 | 🔴 Crítica |
| **II. Gestión Administrativa** | CRUD completo de Usuarios, Productos/Categorías y Mesas. Validación de unicidad, integridad referencial y propagación. | US-006 a US-020 | 🟠 Alta |
| **III. Flujo Crítico Operacional** | Toma, validación, modificación/cancelación y envío de pedidos vía backend Python. Integración HTTP → RabbitMQ. | US-021 a US-026 | 🔴 Crítica |
| **IV. Procesamiento Asíncrono** | Consumo secuencial de pedidos (Worker Node.js), gestión de estados y notificación en tiempo real vía WebSocket. | US-027 a US-030 | 🔴 Crítica |
| **V. Cierre y Auditoría** | Cierre de pedidos, auditoría de cambios de estado y generación de reportes. | US-031 a US-035 | 🟠 Alta |

---

### ❌ Definición del Alcance Negativo (Qué NO se va a probar)

Al incluir todas las 35 HU, el alcance negativo se limita estrictamente a componentes **externos o no funcionales**.

| Componente Excluido | Justificación (Riesgo / Contexto) |
|--------------------|-----------------------------------|
| **Integraciones Legacy** | No se prueban sistemas externos antiguos; solo integraciones definidas (HTTP, RabbitMQ, WebSocket). |
| **Pruebas de Seguridad Avanzadas** | No incluye pen-testing, fuzz testing ni análisis profundo de vulnerabilidades, salvo lo definido en los CA. |
| **Configuración de Hardware / Red Física** | No se prueban fallas físicas; solo fallas lógicas y de reconexión. |
| **Compatibilidad Multi-Navegador** | El foco es el navegador principal (ej. Chrome). |

---

## II. 🌎 Entorno: Definición del Ambiente de Pruebas (El Dónde)

### 🔧 Configuración del Ambiente

El ambiente de pruebas será una **réplica completa** de la arquitectura de microservicios, asegurando la correcta comunicación entre contenedores Docker.

| Componente | Plataforma / Tecnología | Rol en Pruebas |
|-----------|--------------------------|----------------|
| **Orquestación** | Docker & Docker Compose | Despliegue de 6 servicios clave (3 Frontends, 2 Backends, 1 Broker). |
| **Frontends** | React + TypeScript | Interfaces de Mesero, Cocinero y Administrador. |
| **Backend de Pedidos** | Docker – FastAPI (Python) | Punto de entrada transaccional (HU 21–26, HU 6–20). |
| **Backend Cocina / Worker** | Docker – Node.js (TypeScript) | Flujo asíncrono y tiempo real (HU 27–30). |
| **Broker / BD** | Docker – RabbitMQ, PostgreSQL / MongoDB | Mensajería asíncrona y persistencia de datos. |
| **Herramientas** | Cypress / Playwright, JMeter / Locust, Postman | E2E, rendimiento y pruebas de integración API. |

---

### 🧪 Definición de Datos de Prueba

#### 📌 Datos Maestros (HU 6–20)
- **Usuarios:**  
  - Roles: Mesero, Cocinero, Administrador  
  - Casos borde: usuario duplicado, contraseña débil, usuario inactivo.
- **Productos / Categorías:**  
  - 10 productos, 3 categorías.  
  - Validación de precios (> 0, dos decimales).
- **Mesas:**  
  - 20 mesas con estados mixtos (`available`, `occupied`, `reserved`).  
  - Validación de unicidad del número de mesa.

#### 📌 Datos Transaccionales (HU 21–34)
- **Datos de Borde:**  
  - Pedidos con cantidades máximas.  
  - Pedidos con productos eliminados.  
  - Intentos de modificar pedidos en estado `Preparing` (US-026).
- **Carga:**  
  - Simulación de **200 pedidos en ráfaga** para concurrencia y estrés en RabbitMQ.
- **Recuperación:**  
  - Pedidos que no llegan al Worker para validar auditoría de estados (US-034).

---

## III. 💡 Estrategia: El Cómo se Ejecutarán las Pruebas

La estrategia combina **pruebas manuales**, **automatización** y **validación de rendimiento y resiliencia** en una arquitectura distribuida.

---

### 1️⃣ Pruebas Manuales  
**Foco:** Usabilidad, RBAC y flujos complejos

- **Pruebas Exploratorias / Usabilidad**
  - HU 21–26: Flujo completo de creación, edición y cancelación de pedidos.
  - Evaluación de la experiencia del mesero.
- **Mapa de Mesas**
  - HU 20: Actualización visual y en tiempo real de estados y colores.
- **Roles y Permisos (RBAC)**
  - HU 2, 3, 4, 30:  
    - Mesero intenta acceder a funciones de Administrador/Cocinero.  
    - Cocinero intenta crear pedidos.
- **Propagación en Tiempo Real**
  - HU 11, 14, 18:  
    - Cambios en maestros visibles en la UI del mesero en **< 2 s** (WebSocket).

---

### 2️⃣ Pruebas Automatizadas  
**Foco:** Regresión, integración y backend

| Tipo | Alcance (HU) | Herramienta | Detalle |
|----|--------------|-------------|---------|
| **A. Unitarias** | Lógica de negocio (FastAPI / Node.js) | Unittest / Jest | ≥ 80% de cobertura en validaciones (precios, unicidad, estructura de pedido, `prefetch=1`). |
| **B. API / Integración** | Backend → RabbitMQ | Postman / Pytest | Publicación y consumo de pedidos (HU 25, 27). CRUD con datos de borde (HU 6–19). |
| **C. End-to-End (E2E)** | Flujo operacional completo | Cypress / Playwright | Login Mesero → Crear Pedido → Login Cocinero → Estado `Ready`. |

---

### 3️⃣ Pruebas de Rendimiento y Resiliencia

- **Pruebas de Carga (HU 25, 27):**
  - 20 usuarios concurrentes durante 5 minutos.  
  - **Objetivo:** tiempo de respuesta `< 800 ms`.
- **Pruebas de Estrés (RabbitMQ):**
  - 200 pedidos en ráfaga.  
  - Validar encolado y consumo secuencial (`prefetch = 1`).
- **Resiliencia / Fallas (HU 33):**
  - Caída del Worker y recuperación automática.  
  - Caída del WebSocket y uso de API como contingencia.

---

## IV. ✅ Criterios de Éxito y ⛔ Suspensión

### 🎉 Criterios de Éxito
1. El **100% de las 35 HU** cumplen todos sus Criterios de Aceptación.  
2. Tiempo de respuesta de la API de Pedidos `< 800 ms` bajo carga.  
3. Mensajería asíncrona garantiza **100% de integridad y secuencia** (`prefetch=1`).  
4. Validación estricta de **RBAC** sin accesos indebidos.

### 🛑 Criterios de Suspensión
1. Falla del **80% o más** de las pruebas automatizadas de Smoke/Regresión E2E.  
2. Falla crítica en RabbitMQ (pérdida de mensajes o desorden).  
3. Violación de seguridad: acceso administrativo por Mesero/Cocinero.  
4. Fallas del WebSocket que bloqueen la visibilidad en cocina.

---
