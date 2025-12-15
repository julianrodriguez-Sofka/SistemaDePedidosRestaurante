import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { broadcastEvent } from '../services/websocket.service';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      
      // Emitir evento de categoría creada
      broadcastEvent({
        type: 'category.created',
        data: category
      });
      
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      if (error.message.includes('required') || error.message.includes('already exists')) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      res.status(200).json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.updateCategory(id, req.body);
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      
      // Emitir evento de categoría actualizada
      broadcastEvent({
        type: 'category.updated',
        data: category
      });
      
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.categoryService.deleteCategory(id);
      if (!result) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      
      // Emitir evento de categoría eliminada
      broadcastEvent({
        type: 'category.deleted',
        data: { id }
      });
      
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
      // Error específico cuando hay productos asociados
      if (error.message.includes('No se puede eliminar la categoría')) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  };

  getProductCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryName = req.params.name;
      const count = await this.categoryService.getProductCountByCategory(categoryName);
      res.status(200).json({ success: true, data: { count } });
    } catch (error) {
      next(error);
    }
  };
}
