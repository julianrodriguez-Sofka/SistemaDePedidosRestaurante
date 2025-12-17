import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const orderController = new OrderController();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate, authorize(['admin']));

router.get('/active', orderController.getActiveOrders);
router.get('/', orderController.getAllOrders);

export default router;