import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { KitchenPage } from './pages/KitchenPage';
import { WaiterPage } from './pages/WaiterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route 
          path="/cocina" 
          element={
            <ProtectedRoute allowedRoles={['chef']}>
              <KitchenPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/mesero" 
          element={
            <ProtectedRoute allowedRoles={['waiter']}>
              <WaiterPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de admin protegidas */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              {/* Aquí irán las rutas del admin frontend */}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;