import { Request, Response, NextFunction } from 'express';
import { OrdersProxyService } from '../services/OrdersProxyService';
import { formatSuccessResponse, formatErrorResponse } from '../utils/responseFormatter';
import { HTTP_STATUS } from '../config/constants';

// Controlador para operaciones de pedidos
export class OrdersController {
  private proxyService: OrdersProxyService;

  constructor(proxyService: OrdersProxyService) {
    this.proxyService = proxyService;
  }

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('📥 Received order request:', JSON.stringify(req.body));
      console.log('🔄 Forwarding to Python MS at /api/v1/orders/');
      
      const response = await this.proxyService.forward('/api/v1/orders/', 'POST', req.body, req.headers as Record<string, string>);
      
      console.log('✅ Response from Python MS:', response.status, response.statusText);
      
      res.status(HTTP_STATUS.CREATED).json(
        formatSuccessResponse(response.data, 'Order created successfully')
      );
    } catch (error: any) {
      console.log('❌ Error creating order:', error.message, error.code);
      next(error);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this.proxyService.forward(`/api/v1/orders/${id}`, 'GET');
      
      res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(response.data)
      );
    } catch (error: any) {
      next(error);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this.proxyService.forward(`/api/v1/orders/${id}`, 'PUT', req.body, req.headers as Record<string, string>);
      
      res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(response.data, 'Order updated successfully')
      );
    } catch (error: any) {
      next(error);
    }
  };

  deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const response = await this.proxyService.forward(`/api/v1/orders/${id}`, 'DELETE', undefined, req.headers as Record<string, string>);
      
      res.status(HTTP_STATUS.OK).json(
        formatSuccessResponse(response.data, 'Order cancelled successfully')
      );
    } catch (error: any) {
      next(error);
    }
  };
}