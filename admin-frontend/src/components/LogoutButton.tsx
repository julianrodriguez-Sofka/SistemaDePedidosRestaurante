import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar todos los tokens del sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('adminUser');
    
    // Redirigir al login del admin panel
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}
