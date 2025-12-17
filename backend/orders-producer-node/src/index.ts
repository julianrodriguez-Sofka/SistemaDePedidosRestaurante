import { startServer } from "./infrastructure/http/server";
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
  createdAt: string;
  updatedAt: string;
}

export interface Config {
  _id: string;
  name: string;
  address: string;
  phone: string;
  schedule: string;
  email: string;
  updatedAt: string;
}

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  note?: string | null;
}

export interface Order {
  id: string;
  customerName: string;
  table: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  items: OrderItem[];
  total: number;
  createdAt: string;
}
startServer().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
