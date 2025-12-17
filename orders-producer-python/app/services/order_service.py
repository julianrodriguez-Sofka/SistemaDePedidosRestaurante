from uuid import uuid4
from datetime import datetime, timezone, timedelta
from typing import Optional
import asyncio

from app.models.order import OrderIn, OrderMessage
from app.messaging.messaging import publish_order
from app.repositories.order_repository import OrderRepository
from app.services.table_service import update_table_status

# Timezone de Colombia (UTC-5)
COLOMBIA_TZ = timezone(timedelta(hours=-5))

class OrderService:
    def __init__(self, repository: OrderRepository):
        self.repository = repository

    async def create_order(self, order_in: OrderIn) -> OrderMessage:
        order_msg = OrderMessage(
            id=str(uuid4()),
            customerName=order_in.customerName,
            table=order_in.table,
            items=order_in.items,
            createdAt=datetime.now(COLOMBIA_TZ),
            status="pendiente"
        )
        self.repository.add(order_msg)
        
        # Publicar a RabbitMQ en background para no bloquear la respuesta
        asyncio.create_task(self._publish_order_in_background(order_msg))
        
        # Actualizar mesa en background
        asyncio.create_task(self._update_table_in_background(order_in.table, order_msg.id))
        
        return order_msg
    
    async def _publish_order_in_background(self, order_msg: OrderMessage):
        """Publica el pedido a RabbitMQ en background sin bloquear la respuesta"""
        try:
            print(f"📤 Publicando pedido {order_msg.id} a RabbitMQ...")
            # Ejecutar la función bloqueante en un thread pool
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, publish_order, order_msg)
            print(f"✅ Pedido {order_msg.id} publicado a RabbitMQ")
        except Exception as e:
            print(f"❌ Error publicando pedido {order_msg.id} a RabbitMQ: {str(e)}")
    
    async def _update_table_in_background(self, table: str, order_id: str):
        """Actualiza el estado de la mesa en background sin bloquear la respuesta"""
        try:
            print(f"🔄 Actualizando mesa {table} a estado 'occupied'...")
            await update_table_status(table, 'occupied', order_id)
            print(f"✅ Mesa {table} actualizada a 'occupied'")
        except Exception as e:
            print(f"❌ Error actualizando mesa {table}: {str(e)}")

    def get_order(self, order_id: str) -> Optional[OrderMessage]:
        return self.repository.get(order_id)

    def update_order(self, order_id: str, order_in: OrderIn) -> OrderMessage:
        order = self.repository.get(order_id)
        if not order:
            raise ValueError("Order not found")
        if order.status == "preparando":
            raise PermissionError("No se puede editar una orden en preparación")
        updated_order = OrderMessage(
            id=order.id,
            customerName=order_in.customerName,
            table=order_in.table,
            items=order_in.items,
            createdAt=order.createdAt,
            status=order.status
        )
        self.repository.update(order_id, updated_order)
        # Republish the updated order to notify kitchen
        publish_order(updated_order)
        return updated_order

    async def cancel_order(self, order_id: str) -> OrderMessage:
        """Cancela un pedido y notifica a cocina"""
        order = self.repository.get(order_id)
        if not order:
            raise ValueError("Order not found")
        
        # Solo permitir cancelar si no está completado
        if order.status == "completado":
            raise PermissionError("No se puede cancelar un pedido ya completado")
        
        # Actualizar status a 'cancelled'
        cancelled_order = OrderMessage(
            id=order.id,
            customerName=order.customerName,
            table=order.table,
            items=order.items,
            createdAt=order.createdAt,
            status="cancelled"
        )
        self.repository.update(order_id, cancelled_order)
        
        # Publicar el pedido cancelado a RabbitMQ para notificar a cocina
        publish_order(cancelled_order)
        
        # Liberar mesa en background (no bloquea la respuesta)
        asyncio.create_task(self._release_table_in_background(order.table))
        
        return cancelled_order
    
    async def _release_table_in_background(self, table: str):
        """Libera la mesa en background sin bloquear la respuesta"""
        try:
            print(f"🔄 Liberando mesa {table} por cancelación de pedido...")
            await update_table_status(table, 'available', None)
            print(f"✅ Mesa {table} liberada")
        except Exception as e:
            print(f"⚠️ Error liberando mesa {table}: {str(e)}")
