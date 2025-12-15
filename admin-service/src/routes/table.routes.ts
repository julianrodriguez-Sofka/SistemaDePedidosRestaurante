import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const tableController = new TableController();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate, authorize(['admin']));

router.post('/', tableController.createTable);
router.get('/', tableController.getAllTables);
router.get('/:id', tableController.getTableById);
router.put('/:id', tableController.updateTable);
router.put('/:id/status', tableController.updateTableStatus);
router.delete('/:id', tableController.deleteTable);

export default router;