import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { ChefLoginPage } from './pages/ChefLoginPage';
import { WaiterLoginPage } from './pages/WaiterLoginPage';
import { KitchenPage } from './pages/KitchenPage';
import { WaiterPage } from './pages/WaiterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de selección de rol */}
        <Route path="/" element={<RoleSelectionPage />} />
        
        {/* Páginas de login por rol */}
        <Route path="/login/chef" element={<ChefLoginPage />} />
        <Route path="/login/waiter" element={<WaiterLoginPage />} />
        
        {/* Rutas protegidas para chef */}
        <Route 
          path="/cocina" 
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <KitchenPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas protegidas para waiter */}
        <Route 
          path="/mesero" 
          element={
            <ProtectedRoute allowedRoles={['waiter']}>
              <WaiterPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;