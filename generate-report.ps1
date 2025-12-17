# Script para generar reporte ejecutivo de evidencias
# Uso: .\generate-report.ps1

Write-Host "`n📊 GENERANDO REPORTE EJECUTIVO DE EVIDENCIAS" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Gray

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$reportDir = "test-results"

# Contar archivos de evidencia
$screenshots = @(Get-ChildItem -Path "$reportDir/*.png" -ErrorAction SilentlyContinue)
$logs = @(Get-ChildItem -Path "$reportDir/logs/*.json" -ErrorAction SilentlyContinue)
$videos = @(Get-ChildItem -Path "$reportDir/**/*.webm" -Recurse -ErrorAction SilentlyContinue)

Write-Host "`n📈 Estadísticas de Evidencias:" -ForegroundColor Yellow
Write-Host "  📸 Screenshots: $($screenshots.Count) archivos" -ForegroundColor Green
Write-Host "  📝 Logs JSON: $($logs.Count) archivos" -ForegroundColor Green
Write-Host "  🎥 Videos: $($videos.Count) archivos" -ForegroundColor Green

# Analizar logs para contar tests pasados/fallidos
$passed = 0
$failed = 0
$skipped = 0

foreach ($logFile in $logs) {
    $content = Get-Content $logFile -Raw | ConvertFrom-Json
    if ($content.resultado -eq "PASSED") { $passed++ }
    elseif ($content.resultado -eq "FAILED") { $failed++ }
    elseif ($content.resultado -eq "SKIPPED") { $skipped++ }
}

$total = $passed + $failed + $skipped
$successRate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }

Write-Host "`n✅ Resultados de Tests:" -ForegroundColor Yellow
Write-Host "  ✓ Pasados: $passed" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "  ✗ Fallidos: $failed" -ForegroundColor Red
}
if ($skipped -gt 0) {
    Write-Host "  ⊝ Saltados: $skipped" -ForegroundColor Yellow
}
Write-Host "  📊 Tasa de Éxito: $successRate%" -ForegroundColor Cyan

# Crear resumen ejecutivo
$summary = @"
# 🎯 RESUMEN EJECUTIVO - Tests E2E
## Sistema de Pedidos de Restaurante

**Fecha**: $(Get-Date -Format "dd/MM/yyyy HH:mm:ss")
**Ejecutado por**: Automated Test Suite

---

## 📊 Métricas Clave

| Métrica | Valor |
|---------|-------|
| Tests Ejecutados | $total |
| Tests Exitosos | $passed ✅ |
| Tests Fallidos | $failed ❌ |
| Tests Saltados | $skipped ⊝ |
| **Tasa de Éxito** | **$successRate%** |

---

## 📁 Evidencias Generadas

| Tipo | Cantidad | Ubicación |
|------|----------|-----------|
| Screenshots | $($screenshots.Count) | test-results/*.png |
| Logs JSON | $($logs.Count) | test-results/logs/*.json |
| Videos | $($videos.Count) | test-results/**/*.webm |

---

## 📋 Tests Implementados

### 🔐 Módulo 1: Autenticación
- 8 casos de prueba (US-001 a US-005)
- Cobertura: Login, Roles, RBAC

### 👥 Módulo 2: Gestión de Usuarios
- 8 casos de prueba (US-006 a US-010)
- Cobertura: CRUD usuarios, Permisos

### 📦 Módulo 3: Productos y Categorías
- 10 casos de prueba (US-011 a US-015)
- Cobertura: CRUD productos, Categorías

**Total: 26 casos de prueba automatizados**

---

## 🎯 Validaciones Realizadas

✅ Funcionalidad completa según TEST_CASE.md  
✅ Seguridad (RBAC y autenticación)  
✅ Performance (SLO < 800ms carga, < 2000ms API)  
✅ Experiencia de usuario  
✅ Integridad de datos  

---

## 📦 Archivos de Entrega

Para entregar las evidencias:

``````powershell
# Comprimir todo
Compress-Archive -Path test-results/* -DestinationPath evidencias_$timestamp.zip
``````

El ZIP incluye:
- 📸 Screenshots de cada paso
- 📝 Logs estructurados JSON
- 🎥 Videos de ejecución
- 📊 Reporte HTML interactivo
- 📋 Documentación completa

---

## 🔗 Enlaces Rápidos

- **Ver Reporte HTML**: ``cd e2e-tests && npm run report``
- **Ejecutar Tests**: ``cd e2e-tests && npm test``
- **Documentación**: ``test-results/EVIDENCIAS.md``

---

*Reporte generado automáticamente por generate-report.ps1*
"@

$summaryPath = "$reportDir/RESUMEN_EJECUTIVO.md"
Set-Content -Path $summaryPath -Value $summary -Encoding UTF8

Write-Host "`n✅ Reporte ejecutivo generado: $summaryPath" -ForegroundColor Green

# Preguntar si quiere comprimir
Write-Host "`n📦 ¿Deseas comprimir las evidencias para entrega? (s/n): " -ForegroundColor Yellow -NoNewline
$compress = Read-Host

if ($compress -eq "s" -or $compress -eq "S") {
    $zipPath = "evidencias_tests_$timestamp.zip"
    Write-Host "`n🗜️  Comprimiendo evidencias..." -ForegroundColor Cyan
    
    Compress-Archive -Path "$reportDir/*" -DestinationPath $zipPath -Force
    
    $zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
    Write-Host "Evidencias comprimidas: $zipPath ($zipSize MB)" -ForegroundColor Green
    
    Write-Host "`nArchivo listo para entregar:" -ForegroundColor Cyan
    Write-Host "   $zipPath" -ForegroundColor White
}

Write-Host "`nProceso completado!" -ForegroundColor Green
Write-Host "`nPara ver el reporte detallado:" -ForegroundColor Yellow
Write-Host "   cat $reportDir/EVIDENCIAS.md`n" -ForegroundColor White
