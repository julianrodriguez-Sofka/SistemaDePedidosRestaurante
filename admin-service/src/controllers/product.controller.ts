import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { broadcastEvent } from '../services/websocket.service';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      
      // Emitir evento de producto creado
      broadcastEvent({
        type: 'product.created',
        data: product
      });
      
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.updateProduct(id, req.body);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      
      // Emitir evento de producto actualizado
      broadcastEvent({
        type: 'product.updated',
        data: product
      });
      
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.productService.deleteProduct(id);
      if (!result) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      
      // Emitir evento de producto eliminado
      broadcastEvent({
        type: 'product.deleted',
        data: { id }
      });
      
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}