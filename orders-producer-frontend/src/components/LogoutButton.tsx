import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar todos los tokens y datos de usuario
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    
    // Redirigir al login del admin panel
    window.location.href = 'http://localhost:5174';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
      title="Logout"
    >
      <LogOut size={20} />
      <span className="font-medium">Logout</span>
    </button>
  );
}