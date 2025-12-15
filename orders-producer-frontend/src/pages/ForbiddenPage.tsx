import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

export function ForbiddenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const state = location.state as { 
    attemptedRole?: string; 
    userRole?: string;
    from?: { pathname: string };
  } | undefined;

  const handleGoToMyDashboard = () => {
    if (user?.role) {
      navigate(`/${user.role}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-2">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>

        {state?.attemptedRole && state?.userRole && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-left">
            <p className="font-semibold text-yellow-800 mb-1">Why am I seeing this?</p>
            <p className="text-yellow-700">
              You're logged in as <span className="font-semibold">{state.userRole}</span>, 
              but tried to access the <span className="font-semibold">{state.attemptedRole}</span> section.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleGoToMyDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to My Dashboard
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            Logout and Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
