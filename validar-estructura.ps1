#!/usr/bin/env pwsh
# Script de validación de la estructura separada

Write-Host "🔍 Validando estructura Backend/Frontend..." -ForegroundColor Cyan
Write-Host ""

$errores = 0
$advertencias = 0

# Validar carpetas principales
Write-Host "📁 Validando carpetas principales..." -ForegroundColor Yellow

$carpetasRequeridas = @(
    "backend",
    "frontend"
)

foreach ($carpeta in $carpetasRequeridas) {
    if (Test-Path $carpeta) {
        Write-Host "  ✅ $carpeta" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $carpeta - NO ENCONTRADA" -ForegroundColor Red
        $errores++
    }
}

Write-Host ""

# Validar servicios backend
Write-Host "📦 Validando servicios Backend..." -ForegroundColor Yellow

$serviciosBackend = @(
    "backend/api-gateway",
    "backend/admin-service",
    "backend/orders-producer-node",
    "backend/orders-producer-python"
)

foreach ($servicio in $serviciosBackend) {
    if (Test-Path $servicio) {
        Write-Host "  ✅ $servicio" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $servicio - NO ENCONTRADO" -ForegroundColor Red
        $errores++
    }
}

Write-Host ""

# Validar aplicaciones frontend
Write-Host "🎨 Validando aplicaciones Frontend..." -ForegroundColor Yellow

$appsFrontend = @(
    "frontend/orders-producer-frontend",
    "frontend/admin-frontend"
)

foreach ($app in $appsFrontend) {
    if (Test-Path $app) {
        Write-Host "  ✅ $app" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $app - NO ENCONTRADA" -ForegroundColor Red
        $errores++
    }
}

Write-Host ""

# Validar archivos docker-compose
Write-Host "🐳 Validando archivos Docker Compose..." -ForegroundColor Yellow

$dockerFiles = @(
    "docker-compose.yml",
    "backend/docker-compose.yml",
    "frontend/docker-compose.yml"
)

foreach ($file in $dockerFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file - NO ENCONTRADO" -ForegroundColor Red
        $errores++
    }
}

Write-Host ""

# Validar scripts de inicio
Write-Host "🚀 Validando scripts de inicio..." -ForegroundColor Yellow

$scripts = @(
    "start-system.ps1",
    "start-system.sh"
)

foreach ($script in $scripts) {
    if (Test-Path $script) {
        Write-Host "  ✅ $script" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $script - NO ENCONTRADO" -ForegroundColor Yellow
        $advertencias++
    }
}

Write-Host ""

# Validar documentación
Write-Host "📚 Validando documentación..." -ForegroundColor Yellow

$docs = @(
    "README.md",
    "backend/README.md",
    "frontend/README.md",
    "SEPARACION_BACKEND_FRONTEND.md",
    "RESUMEN_SEPARACION.md",
    "GUIA_MIGRACION_2_REPOS.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  ✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $doc - NO ENCONTRADO" -ForegroundColor Yellow
        $advertencias++
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor White

# Resumen
if ($errores -eq 0 -and $advertencias -eq 0) {
    Write-Host "✅ VALIDACIÓN EXITOSA - Sin errores ni advertencias" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 El sistema está correctamente estructurado y listo para usar!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puedes levantar el sistema con:" -ForegroundColor Cyan
    Write-Host "  docker-compose up -d                    # Todo el sistema" -ForegroundColor White
    Write-Host "  .\start-system.ps1                     # Con script automatizado" -ForegroundColor White
    Write-Host "  cd backend; docker-compose up -d       # Solo backend" -ForegroundColor White
    Write-Host "  cd frontend; docker-compose up -d      # Solo frontend" -ForegroundColor White
    exit 0
} elseif ($errores -eq 0) {
    Write-Host "⚠️  VALIDACIÓN COMPLETADA CON ADVERTENCIAS" -ForegroundColor Yellow
    Write-Host "   Advertencias: $advertencias" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "El sistema debería funcionar, pero faltan algunos archivos opcionales." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "❌ VALIDACIÓN FALLIDA" -ForegroundColor Red
    Write-Host "   Errores: $errores" -ForegroundColor Red
    Write-Host "   Advertencias: $advertencias" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor, verifica que la separación se haya realizado correctamente." -ForegroundColor Red
    exit 1
}
