#!/bin/bash
# Script de inicio del sistema completo
# Este script levanta el backend, espera a que esté listo, y luego levanta el frontend

echo "🚀 Iniciando Sistema de Pedidos de Restaurante..."
echo ""

# Levantar backend
echo "📦 Levantando servicios de backend..."
cd backend
docker-compose up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios del backend estén listos (30 segundos)..."
sleep 30

# Levantar frontend
echo "🎨 Levantando aplicaciones frontend..."
cd ../frontend
docker-compose up -d

cd ..

echo ""
echo "✅ Sistema iniciado correctamente!"
echo ""
echo "📍 Acceso a las aplicaciones:"
echo "   - Toma de Pedidos (Meseros): http://localhost:5173"
echo "   - Panel de Administración:    http://localhost:5174"
echo "   - API Gateway:                http://localhost:3000"
echo "   - RabbitMQ Management:        http://localhost:15672 (guest/guest)"
echo ""
echo "📊 Ver logs:"
echo "   Backend:  cd backend && docker-compose logs -f"
echo "   Frontend: cd frontend && docker-compose logs -f"
echo ""
echo "🛑 Detener sistema:"
echo "   Backend:  cd backend && docker-compose down"
echo "   Frontend: cd frontend && docker-compose down"
echo "   O desde raíz: docker-compose down"
