import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'mesero' | 'cocina';

export interface User {
  name: string;
  role: UserRole;
  loginTime: number;
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Recuperar usuario de localStorage al cargar la aplicación
    const storedUser = localStorage.getItem('restaurant_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('restaurant_user');
      }
    }
  }, []);

  const login = (name: string, role: UserRole) => {
    const userData: User = {
      name,
      role,
      loginTime: performance.now()
    };
    setUser(userData);
    localStorage.setItem('restaurant_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('restaurant_user');
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
