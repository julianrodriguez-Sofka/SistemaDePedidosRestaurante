import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { productsAPI } from '../services/api';
import type { Product } from '../types';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    desc: '',
    image: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        loadProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: 0, desc: '', image: '' });
    setEditingProduct(null);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      desc: product.desc,
      image: product.image,
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Product },
    { header: 'Name', accessor: 'name' as keyof Product },
    {
      header: 'Price',
      accessor: (row: Product) => `$${row.price.toFixed(2)}`,
    },
    { header: 'Description', accessor: 'desc' as keyof Product },
    {
      header: 'Status',
      accessor: (row: Product) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {row.enabled ? 'Enabled' : 'Disabled'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (row: Product) => (
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
              handleDelete(row.id);
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
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage menu items and pricing</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <Table data={products} columns={columns} />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <Input
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
            <Button type="submit">{editingProduct ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}

