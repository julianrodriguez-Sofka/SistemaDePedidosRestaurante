const API_BASE_URL = '/api';

async function request(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('admin_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (response.status === 401) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/';
    throw new Error('No autorizado');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || 'Error en la solicitud');
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

export const authService = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Error en el login' }));
      throw new Error(error.detail || 'Credenciales inválidas');
    }
    
    const data = await response.json();
    localStorage.setItem('admin_token', data.access_token);
    localStorage.setItem('admin_user', JSON.stringify(data.user));
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('admin_token');
  },
};

export const userService = {
  getAll: () => request('/users/'),
  
  create: (data: { name: string; email: string; password: string; role: string }) =>
    request('/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Partial<{ name: string; role: string; is_active: boolean }>) =>
    request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  deactivate: (id: string) =>
    request(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const productService = {
  getAll: (params?: { category?: string; active_only?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.active_only) query.append('active_only', 'true');
    const queryStr = query.toString();
    return request(`/products/${queryStr ? '?' + queryStr : ''}`);
  },
  
  getCategories: () => request('/products/categories/'),
  
  create: (data: {
    name: string;
    price: number;
    category: string;
    description?: string;
    image_url?: string;
    preparation_time?: number;
  }) =>
    request('/products/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Partial<{
    name: string;
    price: number;
    category: string;
    description: string;
    image_url: string;
    preparation_time: number;
    is_active: boolean;
  }>) =>
    request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    request(`/products/${id}`, {
      method: 'DELETE',
    }),
};
