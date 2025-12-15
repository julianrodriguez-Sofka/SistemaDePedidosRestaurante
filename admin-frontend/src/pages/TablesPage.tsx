import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { tablesAPI } from '../services/api';
import type { Table as TableType } from '../types';

export function TablesPage() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const [formData, setFormData] = useState({
    number: 0,
    capacity: 0,
    location: '',
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const response = await tablesAPI.getAll();
      setTables(response.data.data || []);
    } catch (error) {
      console.error('Error loading tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await tablesAPI.update(editingTable._id, formData);
      } else {
        await tablesAPI.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadTables();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving table');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await tablesAPI.delete(id);
        loadTables();
      } catch (error) {
        alert('Error deleting table');
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await tablesAPI.updateStatus(id, status);
      loadTables();
    } catch (error) {
      alert('Error updating table status');
    }
  };

  const resetForm = () => {
    setFormData({ number: 0, capacity: 0, location: '' });
    setEditingTable(null);
  };

  const openEditModal = (table: TableType) => {
    setEditingTable(table);
    setFormData({
      number: table.number,
      capacity: table.capacity,
      location: table.location,
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      reserved: 'bg-blue-100 text-blue-800',
      cleaning: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const columns = [
    { header: 'Number', accessor: 'number' as keyof TableType },
    { header: 'Capacity', accessor: 'capacity' as keyof TableType },
    { header: 'Location', accessor: 'location' as keyof TableType },
    {
      header: 'Status',
      accessor: (row: TableType) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          className={`px-2 py-1 rounded text-xs border-0 ${getStatusColor(row.status)}`}
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
          <option value="cleaning">Cleaning</option>
        </select>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: TableType) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Tables</h1>
            <p className="text-gray-600 mt-2">Manage restaurant tables and their status</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {tables.filter((t) => t.status === 'available').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">
                  {tables.filter((t) => t.status === 'occupied').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tables.filter((t) => t.status === 'reserved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cleaning</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tables.filter((t) => t.status === 'cleaning').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
        </div>

        <Card>
          <Table data={tables} columns={columns} />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingTable ? 'Edit Table' : 'Add New Table'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Table Number"
            type="number"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g., Main Hall, Terrace, Window Side"
            required
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{editingTable ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

