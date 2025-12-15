import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { WaiterPage } from './pages/WaiterPage';
import { KitchenPage } from './pages/KitchenPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { PrivateRoute } from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route 
            path="/mesero" 
            element={
              <PrivateRoute allowedRole="mesero">
                <WaiterPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/cocina" 
            element={
              <PrivateRoute allowedRole="cocina">
                <KitchenPage />
              </PrivateRoute>
            } 
          />
          <Route path="/forbidden" element={<ForbiddenPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
