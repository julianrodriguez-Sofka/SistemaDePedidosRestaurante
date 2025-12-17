import { Router } from 'express';
import { OrdersController } from '../controllers/OrdersController';
import { OrdersProxyService } from '../services/OrdersProxyService';

const router = Router();
const proxyService = new OrdersProxyService();
const controller = new OrdersController(proxyService);

// Rutas para gestión de pedidos
router.post('/', controller.createOrder);
router.get('/:id', controller.getOrder);
router.put('/:id', controller.updateOrder);
router.delete('/:id', controller.deleteOrder);

export default router;