import axios from 'axios';
import type { User, Product, Table, Config, Order, LoginResponse, ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('adminToken');
    console.log('[API] Making request to:', config.url);
    console.log('[API] Token present:', !!token);
    console.log('[API] Token value:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[API] Authorization header set');
    } else {
      console.warn('[API] NO TOKEN FOUND IN SESSIONSTORAGE');
    }
    return config;
  },
  (error) => {
    console.error('[API] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    console.log('[API] Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.response?.status, error.config?.url);
    console.error('[API] Error details:', error.response?.data);
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized - Clearing token and redirecting');
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUser');
      window.location.href = '/';
    } else if (error.response?.status === 403) {
      console.error('[API] 403 Forbidden - Check user permissions');
      console.error('[API] Current token:', sessionStorage.getItem('adminToken')?.substring(0, 50));
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', credentials),
};

// Users
export const usersAPI = {
  getAll: () => api.get<ApiResponse<User[]>>('/users'),
  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: Partial<User>) => api.post<ApiResponse<User>>('/users', data),
  update: (id: string, data: Partial<User>) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/users/${id}`),
  assignRole: (id: string, roles: string[]) => api.put<ApiResponse<User>>(`/users/${id}/role`, { roles }),
};

// Products
export const productsAPI = {
  getAll: () => api.get<ApiResponse<Product[]>>('/products'),
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<ApiResponse<Product>>('/products', data),
  update: (id: number, data: Partial<Product>) => api.put<ApiResponse<Product>>(`/products/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/products/${id}`),
};

// Tables
export const tablesAPI = {
  getAll: () => api.get<ApiResponse<Table[]>>('/tables'),
  getById: (id: string) => api.get<ApiResponse<Table>>(`/tables/${id}`),
  create: (data: Partial<Table>) => api.post<ApiResponse<Table>>('/tables', data),
  update: (id: string, data: Partial<Table>) => api.put<ApiResponse<Table>>(`/tables/${id}`, data),
  updateStatus: (id: string, status: string) => api.put<ApiResponse<Table>>(`/tables/${id}/status`, { status }),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/tables/${id}`),
};

// Config
export const configAPI = {
  get: () => api.get<ApiResponse<Config>>('/config'),
  update: (data: Partial<Config>) => api.put<ApiResponse<Config>>('/config', data),
};

// Helper function to transform backend order to frontend format
const transformOrder = (backendOrder: any): Order => {
  console.log('[API Transform] Input order:', backendOrder);
  
  // Extract table number from "Table X" string
  const tableNumber = typeof backendOrder.table === 'string' 
    ? parseInt(backendOrder.table.replace(/\D/g, '')) || 0
    : backendOrder.tableNumber || 0;

  // Transform items to match frontend format
  const items = (backendOrder.items || []).map((item: any) => ({
    productName: item.productName || item.name,
    quantity: item.quantity || 1,
    price: item.unitPrice || item.price || 0,
    unitPrice: item.unitPrice || item.price || 0,
    note: item.note || null
  }));

  // Calculate total
  const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  const transformed = {
    id: backendOrder.id || backendOrder._id,
    orderNumber: backendOrder.orderNumber || backendOrder.id || backendOrder._id,
    customerName: backendOrder.customerName || 'Unknown',
    table: backendOrder.table || `Table ${tableNumber}`,
    tableNumber,
    status: backendOrder.status || 'pending',
    items,
    total,
    notes: backendOrder.notes || backendOrder.note,
    createdAt: backendOrder.createdAt || new Date().toISOString()
  };
  
  console.log('[API Transform] Output order:', transformed);
  return transformed;
};

// Orders
export const ordersAPI = {
  getActive: () => api.get<ApiResponse<Order[]>>('/orders/active').then(response => {
    console.log('[API ordersAPI] getActive raw response:', response.data);
    if (response.data.data) {
      console.log('[API ordersAPI] Transforming', response.data.data.length, 'orders');
      response.data.data = response.data.data.map(transformOrder);
      console.log('[API ordersAPI] Transformed orders:', response.data.data);
    }
    return response;
  }),
  getAll: () => {
    console.log('[API ordersAPI] getAll called');
    return api.get<ApiResponse<Order[]>>('/orders').then(response => {
      console.log('[API ordersAPI] getAll raw response:', response.data);
      if (response.data.data) {
        console.log('[API ordersAPI] Transforming', response.data.data.length, 'orders');
        response.data.data = response.data.data.map(transformOrder);
        console.log('[API ordersAPI] Transformed orders:', response.data.data);
      }
      return response;
    }).catch(error => {
      console.error('[API ordersAPI] getAll error:', error);
      throw error;
    });
  },
};

export default api;

