import { Router } from 'express';
import { TableController } from '../controllers/table.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const tableController = new TableController();

// GET all tables - público para que meseros puedan ver mesas disponibles
router.get('/', tableController.getAllTables);

// Endpoint interno para que otros servicios actualicen el estado de mesas
router.put('/internal/:id/status', tableController.updateTableStatus);

// El resto de rutas requieren autenticación y rol de admin
router.use(authenticate, authorize(['admin']));

router.post('/', tableController.createTable);
router.get('/:id', tableController.getTableById);
router.put('/:id', tableController.updateTable);
router.put('/:id/status', tableController.updateTableStatus);
router.delete('/:id', tableController.deleteTable);

export default router;