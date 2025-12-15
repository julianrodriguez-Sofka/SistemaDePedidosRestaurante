import { Users, Package, Table2, ShoppingCart } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';

export function DashboardPage() {
  const stats = [
    { icon: Users, label: 'Total Users', value: '0', color: 'bg-blue-500' },
    { icon: Package, label: 'Products', value: '0', color: 'bg-green-500' },
    { icon: Table2, label: 'Tables', value: '0', color: 'bg-purple-500' },
    { icon: ShoppingCart, label: 'Active Orders', value: '0', color: 'bg-orange-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
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
          })}
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

