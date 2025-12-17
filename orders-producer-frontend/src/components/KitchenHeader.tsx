import { useEffect, useState } from 'react';
import { LogoutButton } from './LogoutButton';

interface KitchenHeaderProps {
  currentDate?: string;
}

export function KitchenHeader({ currentDate = new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  month: 'long', 
  day: 'numeric', 
  year: 'numeric' 
}) }: KitchenHeaderProps) {
  const [chefName, setChefName] = useState<string>('');

  useEffect(() => {
    const userStr = sessionStorage.getItem('user') || sessionStorage.getItem('adminUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setChefName(user.username || 'Chef');
      } catch (error) {
        console.error('[Kitchen] Error parsing user:', error);
        setChefName('Chef');
      }
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi, here are today's orders!</h1>
            <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
            {chefName && (
              <p className="text-sm text-gray-600 mt-1">
                Chef: <span className="font-semibold text-orange-600">{chefName}</span>
              </p>
            )}
          </div>
          
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
