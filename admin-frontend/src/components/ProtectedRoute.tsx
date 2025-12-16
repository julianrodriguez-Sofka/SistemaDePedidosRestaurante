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
    if (!user.roles || user.roles.length === 0) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  } catch {
    return <Navigate to="/" replace />;
  }
}
