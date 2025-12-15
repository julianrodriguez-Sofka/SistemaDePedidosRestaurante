import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { categoriesAPI } from '../services/api';
import wsService from '../services/websocket.service';
import type { Category } from '../types';

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    
    // Suscribirse a eventos de categorías en tiempo real
    const handleCategoryCreated = (category: Category) => {
      console.log('[Categories] New category created:', category);
      setCategories((prev) => [...prev, category]);
    };
    
    const handleCategoryUpdated = (category: Category) => {
      console.log('[Categories] Category updated:', category);
      setCategories((prev) => 
        prev.map((c) => c.id === category.id ? category : c)
      );
    };
    
    const handleCategoryDeleted = ({ id }: { id: number }) => {
      console.log('[Categories] Category deleted:', id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    };
    
    wsService.on('category.created', handleCategoryCreated);
    wsService.on('category.updated', handleCategoryUpdated);
    wsService.on('category.deleted', handleCategoryDeleted);
    
    return () => {
      wsService.off('category.created', handleCategoryCreated);
      wsService.off('category.updated', handleCategoryUpdated);
      wsService.off('category.deleted', handleCategoryDeleted);
    };
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDelete = async (category: Category) => {
    // Primero verificar cuántos productos tiene
    try {
      const countResponse = await categoriesAPI.getProductCount(category.name);
      const productCount = countResponse.data.data.count;

      if (productCount > 0) {
        setDeleteError(
          `No se puede eliminar la categoría "${category.name}". Primero mueva o elimine los ${productCount} productos asociados.`
        );
        return;
      }

      // Si no tiene productos, proceder con la eliminación
      if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
        await categoriesAPI.delete(category.id);
        loadCategories();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error deleting category';
      setDeleteError(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id' as keyof Category },
    { header: 'Name', accessor: 'name' as keyof Category },
    { header: 'Description', accessor: 'description' as keyof Category },
    {
      header: 'Status',
      accessor: (row: Category) => (
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
      accessor: (row: Category) => (
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
              handleDelete(row);
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
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">Manage product categories</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Error de eliminación - HU-004 Criterio 5 */}
        {deleteError && (
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-start gap-3 p-4">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Cannot Delete Category</p>
                <p className="text-red-700 text-sm mt-1">{deleteError}</p>
              </div>
              <button
                onClick={() => setDeleteError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </div>
          </Card>
        )}

        <Card>
          <Table data={categories} columns={columns} />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
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
            <Button type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
