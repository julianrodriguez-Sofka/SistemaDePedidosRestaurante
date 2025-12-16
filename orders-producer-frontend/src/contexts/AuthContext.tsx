import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'mesero' | 'cocina' | 'cocinero';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  loginTime: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, expectedRole: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Recuperar usuario de localStorage al cargar la aplicación
    const storedUser = localStorage.getItem('restaurant_user');
    const storedToken = localStorage.getItem('restaurant_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('restaurant_user');
        localStorage.removeItem('restaurant_token');
      }
    }
  }, []);

  const login = async (email: string, password: string, expectedRole: UserRole) => {
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
    
    // Normalizar rol (cocinero -> cocina)
    const userRole = data.user.role === 'cocinero' ? 'cocina' : data.user.role;
    
    // Verificar que el rol coincida con el esperado
    if (userRole !== expectedRole) {
      throw new Error(`Esta cuenta no tiene permisos de ${expectedRole === 'cocina' ? 'cocinero' : 'mesero'}`);
    }
    
    const userData: User = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: userRole,
      loginTime: performance.now()
    };
    
    setUser(userData);
    localStorage.setItem('restaurant_user', JSON.stringify(userData));
    localStorage.setItem('restaurant_token', data.access_token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant_user');
    localStorage.removeItem('restaurant_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
