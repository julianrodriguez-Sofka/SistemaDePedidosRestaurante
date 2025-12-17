import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const productController = new ProductController();

// GET routes públicas (meseros necesitan ver productos)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas que modifican datos requieren autenticación y rol admin
router.post('/', authenticate, authorize(['admin']), productController.createProduct);
router.put('/:id', authenticate, authorize(['admin']), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

export default router;