// src/infrastructure/http/controllers/kitchen.controller.ts
import { Request, Response, NextFunction } from "express";
import { OrderRepository } from "../../../domain/interfaces/order.interface";
import { KitchenOrder } from "../../../domain/models/order";
import { notifyClients } from "../../websocket/ws-server";


// Repository debe ser inyectado desde index.ts (siempre MongoOrderRepository)
let repo: OrderRepository | null = null;

export function setOrderRepository(r: OrderRepository) {
  repo = r;
}

export function getRepository(): OrderRepository {
  if (!repo) {
    throw new Error("Repository no inicializado");
  }
  return repo;
}

export async function getKitchenOrders(req: Request, res: Response, next: NextFunction) {
  try {
    if (!repo) {
      return res.status(500).json({ error: "Repository no inicializado" });
    }
    const payload = await repo.getAll();
    // Solo retornar pedidos en preparación para la vista de cocina
    // const preparing = payload.filter((o) => o.status === "preparing");
    return res.json(payload);
  } catch (err) {
    return next(err);
  }
}

// helpers used by worker or other internal modules — async and non-blocking
export async function addKitchenOrder(order: KitchenOrder): Promise<void> {
  if (!repo) {
    throw new Error("Repository no inicializado");
  }
  order.status = "pending"; // Estado inicial: pending (esperando que cocina lo inicie)
  await repo.create(order);
  
  // 🔥 Notify clients about new order
  console.log(`📢 Enviando notificación WebSocket para nueva orden ${order.id}...`);
  notifyClients({ 
    type: "ORDER_NEW", 
    order 
  });
  console.log(`✅ Notificación enviada: Nueva orden ${order.id}`);
}

export async function markOrderReady(id: string): Promise<boolean> {
  if (!repo) {
    throw new Error("Repository no inicializado");
  }
  return repo.updateStatus(id, "ready");
}

export async function removeOrderFromKitchen(id: string): Promise<void> {
  if (!repo) {
    throw new Error("Repository no inicializado");
  }
  await repo.remove(id);
}

// Endpoint HTTP para actualizar estado de orden manualmente
export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  console.log('🔵 updateOrderStatus llamado con:', req.params.id, req.body.status);
  try {
    if (!repo) {
      return res.status(500).json({ error: "Repository no inicializado" });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Validar ID
    if (!id) {
      return res.status(400).json({ error: "ID de orden requerido" });
    }

    // Validar estado
    const validStatuses: KitchenOrder["status"][] = ["pending", "preparing", "ready", "completed", "cancelled"];
    if (!status || typeof status !== 'string' || !(validStatuses as string[]).includes(status)) {
      return res.status(400).json({ 
        error: "Estado inválido", 
        validStatuses 
      });
    }

    const updated = await repo.updateStatus(id, status as KitchenOrder["status"]);
    
    if (!updated) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // 🔥 Obtener la orden actualizada y notificar a los clientes
    const updatedOrder = await repo.getById(id);
    if (updatedOrder) {
      console.log(`📢 Enviando notificación WebSocket para orden ${id}...`);
      notifyClients({ 
        type: "ORDER_STATUS_CHANGED", 
        order: updatedOrder 
      });
      console.log(`✅ Notificación enviada: Orden ${id} cambió a estado ${status}`);
      
      // 🧹 Si la orden se completó, activar limpieza de mesa
      if (status === 'completed' && updatedOrder.table) {
        console.log(`🏁 Orden completada en mesa ${updatedOrder.table}, activando limpieza...`);
        const { triggerTableCleaning } = await import('../../../services/table.service');
        triggerTableCleaning(updatedOrder.table).catch(err => 
          console.error('Error al activar limpieza:', err)
        );
      }
    } else {
      console.log(`⚠️ No se encontró la orden ${id} después de actualizar`);
    }

    return res.json({ success: true, id, status });
  } catch (err) {
    console.error("❌ Error en updateOrderStatus:", err);
    return next(err);
  }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!repo) {
      return res.status(500).json({ error: "Repository no inicializado" });
    }

    const { id } = req.params;
    const { customerName, table, items } = req.body;

    // Validar ID
    if (!id) {
      return res.status(400).json({ error: "ID de orden requerido" });
    }

    // Get existing order
    const existingOrder = await repo.getById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Don't allow updates if order is being prepared or beyond
    if (existingOrder.status !== 'pending') {
      return res.status(409).json({ error: "No se puede editar una orden que ya está en preparación" });
    }

    // Create updated order
    const updatedOrder: KitchenOrder = {
      ...existingOrder,
      customerName: customerName || existingOrder.customerName,
      table: table || existingOrder.table,
      items: items || existingOrder.items
    };

    // Update in database (remove and create since there's no update method)
    await repo.remove(id);
    await repo.create(updatedOrder);

    // 🔥 Notificar cambios por WebSocket
    console.log(`📢 Enviando notificación ORDER_UPDATED para orden ${id}...`);
    notifyClients({ 
      type: "ORDER_UPDATED", 
      order: updatedOrder 
    });
    console.log(`✅ Notificación ORDER_UPDATED enviada`);

    return res.json({ 
      success: true, 
      data: updatedOrder,
      message: "Order updated successfully"
    });
  } catch (err) {
    console.error("❌ Error en updateOrder:", err);
    return next(err);
  }
}

export async function deleteOrder(req: Request, res: Response, next: NextFunction) {
  try {
    if (!repo) {
      return res.status(500).json({ error: "Repository no inicializado" });
    }

    const { id } = req.params;

    // Validar ID
    if (!id) {
      return res.status(400).json({ error: "ID de orden requerido" });
    }

    // Get existing order
    const existingOrder = await repo.getById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // No permitir cancelar pedidos ya completados
    if (existingOrder.status === 'completed') {
      return res.status(409).json({ error: "No se puede cancelar un pedido ya completado" });
    }

    // Actualizar status a cancelled
    const success = await repo.updateStatus(id, 'cancelled');
    
    if (!success) {
      return res.status(404).json({ error: "No se pudo actualizar el estado" });
    }

    // Obtener el pedido actualizado
    const cancelledOrder = await repo.getById(id);

    if (cancelledOrder) {
      console.log(`📢 Enviando notificación WebSocket para orden cancelada ${id}...`);
      notifyClients({ 
        type: "ORDER_STATUS_CHANGED", 
        order: cancelledOrder 
      });
      console.log(`✅ Notificación enviada: Orden ${id} cancelada`);
    }

    return res.json({ 
      success: true, 
      id, 
      status: 'cancelled',
      message: "Pedido cancelado exitosamente",
      order: cancelledOrder
    });
  } catch (err) {
    console.error("❌ Error en deleteOrder:", err);
    return next(err);
  }
}