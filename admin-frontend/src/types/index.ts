export interface User {
  id: string;
  name: string;
  email: string;
  role: 'mesero' | 'cocinero' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  preparation_time: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
