export interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  id: number;
  name: string;
  price: number;
  desc: string;
  image: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  _id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  capacity: number;
  location: string;
  currentOrder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Config {
  _id: string;
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  schedule: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  preparationTimes: {
    default: number;
    express: number;
    complex: number;
  };
  updatedAt: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  unitPrice: number;
  note?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  table: string;
  tableNumber: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
  notes?: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
