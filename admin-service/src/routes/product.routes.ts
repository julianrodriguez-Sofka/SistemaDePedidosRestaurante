import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateProduct, validateProductUpdate } from '../middlewares/validation.middleware';

const router = Router();
const productController = new ProductController();

// Todas las rutas requieren autenticación y rol de admin
router.use(authenticate, authorize(['admin']));

router.post('/', validateProduct, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', validateProductUpdate, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;