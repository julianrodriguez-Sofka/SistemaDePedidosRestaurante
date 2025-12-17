import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar todos los tokens y datos de usuario del sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('adminUser');
    
    // Redirigir a la página de selección de rol
    navigate('/');
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