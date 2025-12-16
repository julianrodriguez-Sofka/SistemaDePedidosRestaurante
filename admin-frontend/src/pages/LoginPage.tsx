import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ username, password });
      const { token, user } = response.data.data;

      // Guardar token y usuario (compatible con ambos frontends)
      localStorage.setItem('adminToken', token);
      localStorage.setItem('authToken', token); // Para orders-producer-frontend
      localStorage.setItem('adminUser', JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user)); // Para orders-producer-frontend

      // Redirigir según el rol del usuario (priorizar roles específicos)
      if (user.roles.includes('chef') && !user.roles.includes('waiter')) {
        // Solo chef, sin rol de mesero
        window.location.href = 'http://localhost:5173/cocina';
      } else if (user.roles.includes('waiter') && !user.roles.includes('chef')) {
        // Solo mesero, sin rol de chef
        window.location.href = 'http://localhost:5173/mesero';
      } else if (user.roles.includes('admin')) {
        // Admin o usuarios con múltiples roles
        navigate('/admin/dashboard');
      } else {
        setError('No valid role assigned to this user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Three colored sections as background */}
      <div className="absolute inset-0 flex">
        {/* Chef Section - Orange */}
        <div className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 flex flex-col items-center justify-center text-white">
          <h2 className="text-6xl font-bold mb-12">I'm a Chef</h2>
          <img 
            src="/images/chef-image.png" 
            alt="Chef" 
            className="w-80 h-80 object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
          />
        </div>
        
        {/* Admin Section - Green */}
        <div className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 flex flex-col items-center justify-center text-white">
          <h2 className="text-6xl font-bold mb-12">I'm Admin</h2>
          <div className="text-9xl drop-shadow-2xl">👔</div>
        </div>
        
        {/* Waiter Section - Blue */}
        <div className="flex-1 bg-gradient-to-br from-blue-400 to-blue-500 flex flex-col items-center justify-center text-white">
          <h2 className="text-6xl font-bold mb-12">I'm a Waiter</h2>
          <img 
            src="/images/waiter_image.png" 
            alt="Waiter" 
            className="w-80 h-80 object-contain drop-shadow-2xl"
            style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
          />
        </div>
      </div>

      {/* Login Form - Centered with backdrop */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome User</h1>
          <p className="text-gray-600 mt-2">If you are an admin, waiter or chef, log in here.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

