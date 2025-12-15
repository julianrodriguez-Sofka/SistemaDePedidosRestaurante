import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export function LoginPage() {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    
    if (!selectedRole) {
      setError('Por favor selecciona tu rol');
      return;
    }

    const startTime = performance.now();
    
    // Realizar login
    login(name.trim(), selectedRole);
    
    // Simular procesamiento asíncrono mínimo
    requestAnimationFrame(() => {
      const redirectTime = performance.now() - startTime;
      
      // Verificar SLO de 1.5 segundos
      if (redirectTime > 1500) {
        console.warn(`⚠️ Redirección superó el SLO: ${redirectTime.toFixed(2)}ms`);
      } else {
        console.log(`✓ Redirección exitosa en: ${redirectTime.toFixed(2)}ms`);
      }
      
      // Redirigir a la ruta correspondiente
      navigate(`/${selectedRole}`, { replace: true });
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Chef Section - Left Side */}
      <div
        onClick={() => handleRoleSelect('cocina')}
        className={`flex-1 bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-300 flex flex-col items-center justify-center text-white relative group overflow-hidden cursor-pointer ${
          selectedRole === 'cocina' ? 'ring-8 ring-white ring-inset' : ''
        }`}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            I'm a Chef
          </h2>
          
          <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <img 
              src="/images/chef-image.png" 
              alt="Chef"
              className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {selectedRole === 'cocina' && (
            <div className="absolute top-4 right-4">
              <div className="bg-white text-orange-500 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Waiter Section - Right Side */}
      <div
        onClick={() => handleRoleSelect('mesero')}
        className={`flex-1 bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500 transition-all duration-300 flex flex-col items-center justify-center text-white relative group overflow-hidden cursor-pointer ${
          selectedRole === 'mesero' ? 'ring-8 ring-white ring-inset' : ''
        }`}
      >
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        
        <div className="relative z-10 flex flex-col items-center gap-8 px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center">
            I'm a Waiter
          </h2>
          
          <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <img 
              src="/images/waiter_image.png" 
              alt="Waiter"
              className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {selectedRole === 'mesero' && (
            <div className="absolute top-4 right-4">
              <div className="bg-white text-blue-500 rounded-full p-3">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Form Overlay */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedRole === 'cocina' ? '👨‍🍳 Chef Login' : '🧑‍💼 Waiter Login'}
            </h3>
            <p className="text-gray-600 mb-6">Enter your name to continue</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedRole('');
                    setError('');
                    setName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`flex-1 ${
                    selectedRole === 'cocina' 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Continue
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
