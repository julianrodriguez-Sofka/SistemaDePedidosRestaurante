import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import OrderSidebar from '../components/OrderSidebar';
import { EditOrderDialog } from '../components/EditOrderDialog';
import { ViewOrderDialog } from '@/components/ViewOrderDialog';
import { ActiveOrdersTracker } from '@/components/ActiveOrdersTracker';
import { useOrderManagement } from '../hooks/useOrderManagement';
import { useOrderSubmission } from '../hooks/useOrderSubmission';
import { useActiveOrders } from '../hooks/useActiveOrders';
import type { ActiveOrder } from '../hooks/useActiveOrders';
import { updateOrder, cancelOrder } from '../services/orderService';
import type { Product, OrderPayload } from '../types/order';
import { useWebSocket } from '@/hooks/useWebSocket';
import { LogoutButton } from '../components/LogoutButton';
import { wsService } from '../services/websocket.service';
import axios from 'axios';

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:4001/api';

type OrderStatusFilter = 'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export function WaiterPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [tables, setTables] = useState<any[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);
  const [orderStatus, setOrderStatus] = useState<OrderStatusFilter>('all');
  const [searchQuery] = useState<string>('');
  const [editingOrder, setEditingOrder] = useState<ActiveOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<ActiveOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  // Get logged-in user name
  const [userName, setUserName] = useState<string>('');
  
  useEffect(() => {
    const userStr = sessionStorage.getItem('user') || sessionStorage.getItem('adminUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.username || 'Mesero');
      } catch (error) {
        console.error('[Waiter] Error parsing user:', error);
        setUserName('Mesero');
      }
    }
  }, []);

  
  const { order, addToOrder, changeQty, addNoteToItem, total, clearOrder } = useOrderManagement();
  const { submitOrder, successMsg } = useOrderSubmission();
  const { activeOrders, setActiveOrders, loading: ordersLoading, refetch: refetchOrders } = useActiveOrders();
  const { lastMessage } = useWebSocket();

  // 🔥 Load products from API on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('[Waiter] 📦 Loading products from API...');
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('adminToken');
        const response = await axios.get(`${ADMIN_API_URL}/products`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const apiProducts = response.data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          desc: p.desc || p.description || p.name,
          image: p.image || '/images/default_pic.jpg'
        }));
        
        setProducts(apiProducts);
        console.log('[Waiter] ✅ Loaded', apiProducts.length, 'products from API');
      } catch (error) {
        console.error('[Waiter] ❌ Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // 🔥 Load tables from API on mount
  useEffect(() => {
    const loadTables = async () => {
      try {
        console.log('[Waiter] 🪑 Loading tables from API...');
        const token = sessionStorage.getItem('authToken') || sessionStorage.getItem('adminToken');
        const response = await axios.get(`${ADMIN_API_URL}/tables`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        const apiTables = response.data.data || [];
        setTables(apiTables);
        console.log('[Waiter] ✅ Loaded', apiTables.length, 'tables from API');
      } catch (error) {
        console.error('[Waiter] ❌ Error loading tables:', error);
      } finally {
        setLoadingTables(false);
      }
    };

    loadTables();
  }, []);

  // 🔥 Connect to admin-service WebSocket for real-time products and tables
  useEffect(() => {
    console.log('[Waiter] 🔌 Connecting to admin-service WebSocket...');
    wsService.connect('ws://localhost:4001/ws');

    // Listen for product events
    const handleProductCreated = (data: any) => {
      console.log('[Waiter] ➕ Product created:', data);
      setProducts(prev => [...prev, {
        id: data.id,
        name: data.name,
        price: data.price,
        desc: data.desc || data.name,
        image: data.image || '/images/default_pic.jpg'
      }]);
    };

    const handleProductUpdated = (data: any) => {
      console.log('[Waiter] ✏️ Product updated:', data);
      setProducts(prev => prev.map(p => 
        p.id === data.id 
          ? {
              ...p,
              name: data.name,
              price: data.price,
              desc: data.desc || data.name,
              image: data.image || p.image
            }
          : p
      ));
    };

    const handleProductDeleted = (data: any) => {
      console.log('[Waiter] ❌ Product deleted:', data);
      setProducts(prev => prev.filter(p => p.id !== data.id));
    };

    const handleTableCreated = (data: any) => {
      console.log('[Waiter] 🪑 Table created:', data);
      setTables(prev => [...prev, data]);
    };

    const handleTableUpdated = (data: any) => {
      console.log('[Waiter] ✏️ Table updated:', data);
      setTables(prev => prev.map(t => t.id === data.id ? { ...t, ...data } : t));
    };

    const handleTableDeleted = (data: any) => {
      console.log('[Waiter] ❌ Table deleted:', data);
      setTables(prev => prev.filter(t => t.id !== data.id));
    };

    wsService.on('product.created', handleProductCreated);
    wsService.on('product.updated', handleProductUpdated);
    wsService.on('product.deleted', handleProductDeleted);
    wsService.on('table.created', handleTableCreated);
    wsService.on('table.updated', handleTableUpdated);
    wsService.on('table.deleted', handleTableDeleted);

    return () => {
      console.log('[Waiter] 🔌 Cleaning up WebSocket listeners...');
      wsService.off('product.created', handleProductCreated);
      wsService.off('product.updated', handleProductUpdated);
      wsService.off('product.deleted', handleProductDeleted);
      wsService.off('table.created', handleTableCreated);
      wsService.off('table.updated', handleTableUpdated);
      wsService.off('table.deleted', handleTableDeleted);
    };
  }, []);

  // Refetch orders after successful order submission
  useEffect(() => {
    if (successMsg && successMsg.includes('enviado')) {
      setTimeout(() => {
        refetchOrders();
      }, 1000);
    }
  }, [successMsg, refetchOrders]);

   // Listen to WebSocket messages and update orders in real-time
useEffect(() => {
  if (lastMessage) {
    console.log('📨 WebSocket message received:', JSON.stringify(lastMessage, null, 2));
    
    if (lastMessage.type === 'ORDER_STATUS_CHANGED' && lastMessage.order) {
      console.log('🔄 Order status changed, updating local state...');
      
      // Mapear el status del backend al tipo ActiveOrderStatus
      const mapStatus = (status: string): 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' => {
        switch (status) {
          case 'preparing': return 'preparing';
          case 'ready': return 'ready';
          case 'completed': return 'completed';
          case 'cancelled': return 'cancelled';
          default: return 'pending';
        }
      };
      
      // Actualizar el estado local directamente sin hacer HTTP request
      setActiveOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.fullId === lastMessage.order.id) {
            // Mantener la estructura de ActiveOrder
            return {
              ...order,
              status: mapStatus(lastMessage.order.status),
              // Actualizar otros campos si es necesario
              customerName: lastMessage.order.customerName,
              table: lastMessage.order.table,
            };
          }
          return order;
        })
      );
      
      console.log('✅ Local state updated without HTTP request');
    } else if (lastMessage.type === 'ORDER_NEW' && lastMessage.order) {
      console.log('🆕 New order received, refetching to get complete data...');
      refetchOrders();
    }
  }
}, [lastMessage, setActiveOrders, refetchOrders]);

  const handleSend = async (table: string, clientName: string) => {
    if (order.items.length === 0) return;

    const customerName = clientName?.trim();
    
    // Validar que el nombre del cliente no esté vacío
    if (!customerName) {
      return;
    }

    const payload: OrderPayload = {
      customerName,
      table,
      items: order.items.map((it) => ({
        productName: it.name,
        quantity: it.qty,
        unitPrice: it.price,
        note: it.note || null
      }))
    };

    const success = await submitOrder(payload);
    
    if (success) {
      clearOrder();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditOrder = (order: ActiveOrder) => {
    setEditingOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleViewOrder = (order: ActiveOrder) => {
    setViewingOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setTimeout(() => setEditingOrder(null), 200);
  };

  const handleCloseViewDialog = () => {
    setIsViewDialogOpen(false);
    setTimeout(() => setViewingOrder(null), 200);
  };

  const handleSaveOrder = async (
    orderId: string,
    updates: {
      customerName: string;
      table: string;
      items: {
        productName: string;
        quantity: number;
        unitPrice: number;
        note?: string | null;
      }[];
    }
  ): Promise<boolean> => {
    try {
      const response = await updateOrder(orderId, updates);
      
      if (response.success) {
        // Refresh orders to show changes
        await refetchOrders();
        return true;
      } else {
        console.error('Update failed:', response.error || response.message);
        throw new Error(response.error?.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const handleCancelOrder = async (order: ActiveOrder) => {
    if (!confirm(`¿Estás seguro de cancelar el pedido ${order.id} de la mesa ${order.table}?`)) {
      return;
    }

    try {
      console.log(`🚫 Cancelando pedido ${order.fullId}...`);
      await cancelOrder(order.fullId);
      console.log(`✅ Pedido cancelado exitosamente`);
      
      // Refetch orders to update the list
      await refetchOrders();
    } catch (error) {
      console.error('❌ Error al cancelar pedido:', error);
      alert(error instanceof Error ? error.message : 'Error al cancelar el pedido');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Active Orders Section */}
        <ActiveOrdersTracker
          activeOrders={activeOrders}
          ordersLoading={ordersLoading}
          orderStatus={orderStatus}
          onOrderStatusChange={setOrderStatus}
          onEditOrder={handleEditOrder}
          onViewOrder={handleViewOrder}
          onCancelOrder={handleCancelOrder}
        />

        {/* Menu Section */}
        <div className="flex-1 overflow-y-auto px-6 py-12">
          {/* Header with Logout */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Menú</h2>
              {userName && (
                <p className="text-sm text-gray-600 mt-1">
                  Mesero: <span className="font-semibold text-gray-800">{userName}</span>
                </p>
              )}
            </div>
            <LogoutButton />
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Cargando productos...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">No hay productos disponibles</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const itemInCart = order.items.find(item => item.id === product.id);
                const quantity = itemInCart?.qty || 0;
                
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToOrder}
                    quantity={quantity}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Sidebar */}
      <div className="w-96 bg-white border-l shadow-lg">
        <OrderSidebar
          order={order}
          total={total}
          onChangeQty={changeQty}
          onAddNote={addNoteToItem}
          onSend={handleSend}
          successMsg={successMsg}
          tables={tables}
          userName={userName}
        />
      </div>

      {/* Edit Order Dialog */}
      <EditOrderDialog
        order={editingOrder}
        open={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveOrder}
        availableProducts={products}
      />

      {/* View Order Dialog */}
      <ViewOrderDialog
        order={viewingOrder}
        open={isViewDialogOpen}
        onClose={handleCloseViewDialog}
      />
    </div>
    
  );
}
