from uuid import uuid4
from datetime import datetime, timezone, timedelta
from typing import Optional

from app.models.order import OrderIn, OrderMessage
from app.messaging.messaging import publish_order
from app.repositories.order_repository import OrderRepository

# Timezone de Colombia (UTC-5)
COLOMBIA_TZ = timezone(timedelta(hours=-5))

class OrderService:
    def __init__(self, repository: OrderRepository):
        self.repository = repository

    def create_order(self, order_in: OrderIn) -> OrderMessage:
        order_msg = OrderMessage(
            id=str(uuid4()),
            customerName=order_in.customerName,
            table=order_in.table,
            items=order_in.items,
            createdAt=datetime.now(COLOMBIA_TZ),
            status="pendiente"
        )
        self.repository.add(order_msg)
        publish_order(order_msg)
        return order_msg

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
