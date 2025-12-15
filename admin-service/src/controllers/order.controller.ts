import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getActiveOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getActiveOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orders = await this.orderService.getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };
}