import { useState, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { ordersAPI } from '../services/api';
import type { Order } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { header: 'Order #', accessor: 'orderNumber' as keyof Order },
    { header: 'Customer', accessor: 'customerName' as keyof Order },
    { header: 'Table', accessor: 'tableNumber' as keyof Order },
    {
      header: 'Items',
      accessor: (row: Order) => `${row.items.length} items`,
    },
    {
      header: 'Total',
      accessor: (row: Order) => `$${row.total.toFixed(2)}`,
    },
    {
      header: 'Status',
      accessor: (row: Order) => (
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(row.status)}`}>
          {row.status.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Time',
      accessor: (row: Order) => new Date(row.createdAt).toLocaleString(),
    },
    {
      header: 'Actions',
      accessor: (row: Order) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(row);
            setIsModalOpen(true);
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-2">Monitor all restaurant orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.status === 'pending').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Preparing</p>
              <p className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.status === 'preparing').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Ready</p>
              <p className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.status === 'ready').length}
              </p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-600">
                {orders.filter((o) => o.status === 'completed').length}
              </p>
            </div>
          </Card>
        </div>

        <Card>
          <Table data={filteredOrders} columns={columns} />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        title={`Order #${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Table</p>
                <p className="font-medium">Table {selectedOrder.tableNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Product</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-700">Quantity</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-700">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{item.productName}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 font-semibold text-right">
                        Total:
                      </td>
                      <td className="px-4 py-2 font-bold text-right">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {selectedOrder.notes && (
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                <p className="text-sm bg-gray-50 p-2 rounded">{selectedOrder.notes}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

