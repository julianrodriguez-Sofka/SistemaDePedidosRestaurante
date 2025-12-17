# Script de inicio del sistema completo (Windows PowerShell)
# Este script levanta el backend, espera a que esté listo, y luego levanta el frontend

Write-Host "🚀 Iniciando Sistema de Pedidos de Restaurante..." -ForegroundColor Green
Write-Host ""

# Levantar backend
Write-Host "📦 Levantando servicios de backend..." -ForegroundColor Cyan
Set-Location backend
docker-compose up -d

# Esperar a que los servicios estén listos
Write-Host "⏳ Esperando a que los servicios del backend estén listos (30 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Levantar frontend
Write-Host "🎨 Levantando aplicaciones frontend..." -ForegroundColor Cyan
Set-Location ../frontend
docker-compose up -d

Set-Location ..

Write-Host ""
Write-Host "✅ Sistema iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Acceso a las aplicaciones:" -ForegroundColor White
Write-Host "   - Toma de Pedidos (Meseros): http://localhost:5173" -ForegroundColor White
Write-Host "   - Panel de Administración:    http://localhost:5174" -ForegroundColor White
Write-Host "   - API Gateway:                http://localhost:3000" -ForegroundColor White
Write-Host "   - RabbitMQ Management:        http://localhost:15672 (guest/guest)" -ForegroundColor White
Write-Host ""
Write-Host "📊 Ver logs:" -ForegroundColor Yellow
Write-Host "   Backend:  cd backend; docker-compose logs -f" -ForegroundColor Gray
Write-Host "   Frontend: cd frontend; docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Detener sistema:" -ForegroundColor Red
Write-Host "   Backend:  cd backend; docker-compose down" -ForegroundColor Gray
Write-Host "   Frontend: cd frontend; docker-compose down" -ForegroundColor Gray
Write-Host "   O desde raíz: docker-compose down" -ForegroundColor Gray
