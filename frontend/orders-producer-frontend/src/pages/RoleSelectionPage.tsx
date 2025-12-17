import { useNavigate } from 'react-router-dom';

export function RoleSelectionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Chef Section - Orange */}
      <button
        onClick={() => navigate('/login/chef')}
        className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex flex-col items-center justify-center text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        <h2 className="text-6xl font-bold mb-12">I'm a Chef</h2>
        <img 
          src="/images/chef-image.png" 
          alt="Chef" 
          className="w-80 h-80 object-contain drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        />
      </button>
      
      {/* Waiter Section - Blue */}
      <button
        onClick={() => navigate('/login/waiter')}
        className="flex-1 bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 flex flex-col items-center justify-center text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
      >
        <h2 className="text-6xl font-bold mb-12">I'm a Waiter</h2>
        <img 
          src="/images/waiter_image.png" 
          alt="Waiter" 
          className="w-80 h-80 object-contain drop-shadow-2xl"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        />
      </button>
    </div>
  );
}
