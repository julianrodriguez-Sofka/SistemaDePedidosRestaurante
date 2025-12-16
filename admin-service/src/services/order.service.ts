import axios from 'axios';

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  note?: string | null;
}

interface Order {
  id: string;
  customerName: string;
  table: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export class OrderService {
  private nodeServiceUrl: string;

  constructor() {
    this.nodeServiceUrl = process.env.NODE_MS_URL || 'http://node-ms:3002';
  }

  async getActiveOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${this.nodeServiceUrl}/kitchen/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active orders:', error);
      throw new Error('Failed to fetch active orders from Order Service');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${this.nodeServiceUrl}/kitchen/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw new Error('Failed to fetch orders from Order Service');
    }
  }
}