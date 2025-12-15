import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export function PrivateRoute({ children, allowedRole }: PrivateRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Log para debugging y métricas
    if (isAuthenticated && user?.role !== allowedRole) {
      console.warn(`🔒 Acceso denegado: Usuario con rol "${user?.role}" intentó acceder a ruta "${allowedRole}"`);
    }
  }, [isAuthenticated, user, allowedRole]);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Si el rol no coincide, redirigir a página de error 403
  if (user?.role !== allowedRole) {
    return <Navigate to="/forbidden" replace state={{ 
      from: location,
      attemptedRole: allowedRole,
      userRole: user?.role
    }} />;
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>;
}
