import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LayoutDashboard, Users, Package, LogOut } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <LayoutDashboard className="w-8 h-8 text-black" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Panel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Bienvenido, {user?.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/users')}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-black group"
          >
            <Users className="w-16 h-16 text-black mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Gestión de Usuarios
            </h3>
            <p className="text-gray-600">
              Crear y administrar cuentas de meseros y cocineros
            </p>
          </button>

          <button
            onClick={() => navigate('/products')}
            className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-black group"
          >
            <Package className="w-16 h-16 text-black mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Catálogo de Productos
            </h3>
            <p className="text-gray-600">
              Gestionar productos, precios y categorías del menú
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}
