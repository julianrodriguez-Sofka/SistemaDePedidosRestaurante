import { Router } from 'express';
import { ConfigController } from '../controllers/config.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const configController = new ConfigController();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate, authorize(['admin']));

router.get('/', configController.getConfig);
router.put('/', configController.updateConfig);

export default router;