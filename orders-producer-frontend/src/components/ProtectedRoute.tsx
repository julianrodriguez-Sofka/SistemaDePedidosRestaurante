import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // Buscar token en sessionStorage (independiente por pestaña)
  const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('adminToken');
  const userStr = sessionStorage.getItem('user') || sessionStorage.getItem('adminUser');

  console.log('🔐 ProtectedRoute: Checking authentication...');
  console.log('   Token exists:', !!token);
  console.log('   User exists:', !!userStr);

  // Si no hay token, redirigir al login
  if (!token) {
    console.log('❌ ProtectedRoute: No token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Si no hay usuario, también redirigir
  if (!userStr) {
    console.log('❌ ProtectedRoute: No user found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, verificar rol
  try {
    const user = JSON.parse(userStr);
    console.log('👤 ProtectedRoute: User:', user.username);
    console.log('   Roles:', user.roles, '| Required:', allowedRoles);
    
    if (!user.roles || !Array.isArray(user.roles)) {
      console.log('❌ ProtectedRoute: Invalid user roles format');
      return <Navigate to="/" replace />;
    }
    
    const hasRole = user.roles.some((role: string) => allowedRoles.includes(role));
    
    if (!hasRole) {
      console.log('❌ ProtectedRoute: User does not have required role');
      return <Navigate to="/" replace />;
    }
    
    console.log('✅ ProtectedRoute: Access granted');
    return <>{children}</>;
  } catch (error) {
    console.error('❌ ProtectedRoute: Error parsing user', error);
    return <Navigate to="/" replace />;
  }
}