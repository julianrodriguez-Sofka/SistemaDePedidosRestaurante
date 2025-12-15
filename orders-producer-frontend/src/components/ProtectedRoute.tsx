import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem('authToken');
  const userStr = localStorage.getItem('user');

  // Si no hay token, redirigir al login
  if (!token) {
    console.log('ProtectedRoute: No token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Si hay usuario, verificar rol
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('ProtectedRoute: User roles:', user.roles, 'Allowed:', allowedRoles);
      const hasRole = user.roles.some((role: string) => allowedRoles.includes(role));
      
      if (!hasRole) {
        console.log('ProtectedRoute: User does not have required role');
        return <Navigate to="/" replace />;
      }
      
      console.log('ProtectedRoute: Access granted');
      return <>{children}</>;
    } catch (error) {
      console.error('ProtectedRoute: Error parsing user', error);
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}