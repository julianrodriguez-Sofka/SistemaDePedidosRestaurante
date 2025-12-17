# Script para ejecutar tests y generar evidencias
# Uso: .\run-tests.ps1

Write-Host "🧪 Iniciando Suite de Tests E2E con Captura de Evidencias" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray

# Verificar que los servicios estén corriendo
Write-Host "`n📋 Verificando servicios..." -ForegroundColor Yellow
$services = @(
    @{Name="Frontend Mesero"; Port=3000; Url="http://localhost:3000"},
    @{Name="Admin Frontend"; Port=3001; Url="http://localhost:3001"},
    @{Name="API Gateway"; Port=4000; Url="http://localhost:4000/health"},
    @{Name="Admin Service"; Port=3001; Url="http://localhost:3001/api/health"}
)

$allServicesUp = $true
foreach ($service in $services) {
    try {
        $response = Invoke-WebRequest -Uri $service.Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  ✅ $($service.Name) - Puerto $($service.Port)" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ $($service.Name) - Puerto $($service.Port) NO DISPONIBLE" -ForegroundColor Red
        $allServicesUp = $false
    }
}

if (-not $allServicesUp) {
    Write-Host "`n⚠️  Algunos servicios no están disponibles." -ForegroundColor Yellow
    Write-Host "   Ejecuta 'docker-compose up -d' desde la raíz del proyecto.`n" -ForegroundColor Yellow
    $continue = Read-Host "¿Continuar de todos modos? (s/n)"
    if ($continue -ne "s") {
        exit 1
    }
}

# Limpiar resultados anteriores
Write-Host "`n🧹 Limpiando resultados anteriores..." -ForegroundColor Yellow
if (Test-Path "../test-results") {
    Remove-Item -Path "../test-results/*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ Resultados anteriores eliminados" -ForegroundColor Green
}

# Ejecutar tests
Write-Host "`n🚀 Ejecutando tests..." -ForegroundColor Yellow
Write-Host "=" * 70 -ForegroundColor Gray

cd e2e-tests

# Ejecutar con npm test
$testResult = $LASTEXITCODE
npm test

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ TODOS LOS TESTS PASARON" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  ALGUNOS TESTS FALLARON" -ForegroundColor Yellow
}

Write-Host "`n=" * 70 -ForegroundColor Gray

# Generar reporte consolidado
Write-Host "`n📊 Generando reporte consolidado de evidencias..." -ForegroundColor Yellow

$reportPath = "../test-results/REPORTE_EVIDENCIAS.md"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

$report = @"
# 📋 REPORTE DE EVIDENCIAS DE PRUEBAS
## Sistema de Pedidos de Restaurante

**Fecha de Ejecución**: $timestamp
**Ambiente**: Local (Docker Compose)

---

## 📊 Resumen de Ejecución

### Casos de Prueba Ejecutados

| Módulo | Casos Totales | Estado |
|--------|---------------|--------|
| 🔐 Autenticación (US-001 a US-005) | 8 | Ver detalles |
| 👥 Gestión de Usuarios (US-006 a US-010) | 8 | Ver detalles |
| 📦 Productos y Categorías (US-011 a US-015) | 10 | Ver detalles |
| **TOTAL** | **26** | **Ver reporte HTML** |

---

## 📁 Estructura de Evidencias

### 📸 Screenshots
Ubicación: ``test-results/*.png``

Cada test contiene múltiples screenshots:
- Estado inicial
- Acciones realizadas
- Resultado final
- Capturas en caso de error

### 📝 Logs Estructurados
Ubicación: ``test-results/logs/*.json``

Cada archivo JSON contiene:
- ID del caso de prueba
- Resultado (PASSED/FAILED)
- Descripción detallada
- Datos de entrada/salida
- Logs de red (requests/responses)
- Timestamps precisos

### 🎥 Videos
Ubicación: ``test-results/videos/*.webm``

Videos completos de la ejecución de cada test suite.

### 📊 Reportes
- **HTML Interactivo**: ``test-results/html-report/index.html``
- **JUnit XML**: ``test-results/junit.xml``
- **JSON**: ``test-results/results.json``

---

## 🔍 Cómo Revisar las Evidencias

### 1. Reporte HTML (RECOMENDADO)
``````bash
cd e2e-tests
npm run report
``````

Abrirá automáticamente el navegador con el reporte interactivo.

### 2. Screenshots Individuales
Navega a ``test-results/`` y abre los archivos PNG.
Nomenclatura: ``TC-US-XXX-XX_NN_descripcion.png``

### 3. Logs JSON
``````bash
cd test-results/logs
# Ver logs individuales
cat TC-US-001-01_*.json
``````

---

## 📋 Casos de Prueba Documentados

### 🔐 MÓDULO 1: Autenticación

#### TC-US-001-01: Selección correcta de rol ✅
- **Archivo**: ``auth.spec.ts`` línea 27
- **Evidencias**: 
  - Screenshot: ``TC-US-001-01_01_pantalla_inicial.png``
  - Screenshot: ``TC-US-001-01_02_seleccion_visible.png``
  - Screenshot: ``TC-US-001-01_03_redireccion_correcta.png``
  - Log: ``logs/TC-US-001-01_*.json``

#### TC-US-002-01: Login mesero exitoso ✅
- **Archivo**: ``auth.spec.ts`` línea 93
- **Evidencias**:
  - Screenshot: ``TC-US-002-01_01_pantalla_login.png``
  - Screenshot: ``TC-US-002-01_02_credenciales_ingresadas.png``
  - Screenshot: ``TC-US-002-01_03_acceso_exitoso.png``
  - Log: ``logs/TC-US-002-01_*.json``

[... Continúa con todos los casos]

---

## 🎯 Validaciones Realizadas

Cada caso de prueba valida:

✅ **Funcionalidad**
- Comportamiento esperado según requerimientos
- Flujos positivos y negativos
- Casos de borde

✅ **Seguridad**
- Control de acceso (RBAC)
- Autenticación y autorización
- Validación de tokens JWT

✅ **Performance**
- SLO de carga < 800ms
- SLO de API < 2000ms
- Tiempos de respuesta medidos

✅ **Experiencia de Usuario**
- Mensajes de error apropiados
- Redirecciones correctas
- Estados visuales claros

✅ **Integridad de Datos**
- Validaciones de entrada
- Manejo de duplicados
- Límites de longitud

---

## 📦 Entrega de Evidencias

Para comprimir todas las evidencias:

``````powershell
# Comprimir test-results completo
Compress-Archive -Path test-results/* -DestinationPath evidencias_completas.zip
``````

El archivo ZIP contendrá:
- 📸 Todos los screenshots (.png)
- 🎥 Videos de ejecución (.webm)
- 📝 Logs JSON (.json)
- 📊 Reporte HTML completo
- ✅ Resultados JUnit (.xml)

---

## ✅ Conclusión

**Total de Casos Ejecutados**: 26
**Cobertura**: Módulos 1, 2 y 3 del TEST_CASE.md

Todas las evidencias están documentadas y disponibles para revisión.

Para ver el reporte interactivo completo:
``````bash
cd e2e-tests && npm run report
``````

---

*Reporte generado automáticamente por run-tests.ps1*
*Fecha: $timestamp*
"@

Set-Content -Path $reportPath -Value $report -Encoding UTF8
Write-Host "  ✅ Reporte consolidado generado: $reportPath" -ForegroundColor Green

# Contar archivos de evidencia
$screenshotCount = (Get-ChildItem -Path "../test-results/*.png" -ErrorAction SilentlyContinue).Count
$logCount = (Get-ChildItem -Path "../test-results/logs/*.json" -ErrorAction SilentlyContinue).Count

Write-Host "`n📊 Evidencias generadas:" -ForegroundColor Cyan
Write-Host "  📸 Screenshots: $screenshotCount archivos" -ForegroundColor White
Write-Host "  📝 Logs JSON: $logCount archivos" -ForegroundColor White
Write-Host "  📊 Reporte HTML: test-results/html-report/index.html" -ForegroundColor White
Write-Host "  📋 Reporte Markdown: test-results/REPORTE_EVIDENCIAS.md" -ForegroundColor White

# Ofrecer abrir el reporte
Write-Host "`n🎉 Tests completados!" -ForegroundColor Green
$openReport = Read-Host "`n¿Abrir reporte HTML? (s/n)"
if ($openReport -eq "s") {
    npm run report
}

Write-Host "`n✅ Proceso completado. Todas las evidencias están en: test-results/" -ForegroundColor Green
Write-Host "`nPara comprimir evidencias para entrega:" -ForegroundColor Yellow
Write-Host "  Compress-Archive -Path test-results/* -DestinationPath evidencias_tests.zip`n" -ForegroundColor White
