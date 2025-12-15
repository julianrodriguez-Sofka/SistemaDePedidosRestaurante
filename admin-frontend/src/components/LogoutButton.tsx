import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
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
