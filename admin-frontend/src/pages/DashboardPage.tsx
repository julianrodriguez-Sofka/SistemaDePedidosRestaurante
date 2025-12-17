import { useState, useEffect } from 'react';
import { Users, Package, Table2, ShoppingCart } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import axios from 'axios';

const API_URL = 'http://localhost:4001/api';

export function DashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    tables: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = sessionStorage.getItem('adminToken');
      console.log('[Dashboard] Token:', token ? 'Present' : 'Missing');
      if (!token) {
        console.error('[Dashboard] No token found');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('[Dashboard] Loading stats from:', API_URL);

      const [usersRes, productsRes, tablesRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/users`, { headers }).catch((e) => { console.error('[Dashboard] Users error:', e.message); return { data: { data: [] } }; }),
        axios.get(`${API_URL}/products`, { headers }).catch((e) => { console.error('[Dashboard] Products error:', e.message); return { data: { data: [] } }; }),
        axios.get(`${API_URL}/tables`, { headers }).catch((e) => { console.error('[Dashboard] Tables error:', e.message); return { data: { data: [] } }; }),
        axios.get(`${API_URL}/orders`, { headers }).catch((e) => { console.error('[Dashboard] Orders error:', e.message); return { data: { data: [] } }; })
      ]);

      console.log('[Dashboard] Raw responses:', {
        users: usersRes.data,
        products: productsRes.data,
        tables: tablesRes.data,
        orders: ordersRes.data
      });

      const newStats = {
        users: usersRes.data?.data?.length || 0,
        products: productsRes.data?.data?.length || 0,
        tables: tablesRes.data?.data?.length || 0,
        orders: ordersRes.data?.data?.filter((o: any) => o.status !== 'completed' && o.status !== 'cancelled').length || 0
      };

      console.log('[Dashboard] Calculated stats:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('[Dashboard] Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { icon: Users, label: 'Total Users', value: stats.users, color: 'bg-blue-500' },
    { icon: Package, label: 'Products', value: stats.products, color: 'bg-green-500' },
    { icon: Table2, label: 'Tables', value: stats.tables, color: 'bg-purple-500' },
    { icon: ShoppingCart, label: 'Active Orders', value: stats.orders, color: 'bg-orange-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center py-8 text-gray-600">Loading stats...</div>
          ) : (
            statsData.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Card title="Quick Actions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">Create, edit and manage users</p>
            </a>
            <a
              href="/admin/products"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-600 mt-1">Add and update menu items</p>
            </a>
            <a
              href="/admin/tables"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">Manage Tables</h3>
              <p className="text-sm text-gray-600 mt-1">Configure restaurant tables</p>
            </a>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

