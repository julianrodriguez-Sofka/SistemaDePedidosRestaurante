import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('adminToken');
  const userStr = localStorage.getItem('adminUser');

  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    // Verificar que el usuario tenga al menos un rol válido
    const hasValidRole = user.roles && user.roles.length > 0;

    if (!hasValidRole) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  } catch {
    return <Navigate to="/" replace />;
  }
}
