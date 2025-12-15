import { CategoryRepository } from '../repositories/category.repository';
import { ICategory } from '../models/category.model';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    // Generar el siguiente ID automáticamente
    if (!categoryData.id) {
      categoryData.id = await this.categoryRepository.getNextId();
    }

    // Validar que el nombre no esté vacío
    if (!categoryData.name || categoryData.name.trim() === '') {
      throw new Error('Category name is required');
    }

    // Verificar que no exista una categoría con el mismo nombre
    const existing = await this.categoryRepository.findByName(categoryData.name);
    if (existing) {
      throw new Error('A category with this name already exists');
    }

    return await this.categoryRepository.create(categoryData);
  }

  async getAllCategories(): Promise<ICategory[]> {
    return await this.categoryRepository.findAll();
  }

  async getCategoryById(id: number): Promise<ICategory | null> {
    return await this.categoryRepository.findById(id);
  }

  async updateCategory(id: number, categoryData: Partial<ICategory>): Promise<ICategory | null> {
    // Si se está actualizando el nombre, verificar que no exista otra categoría con ese nombre
    if (categoryData.name) {
      const existing = await this.categoryRepository.findByName(categoryData.name);
      if (existing && existing.id !== id) {
        throw new Error('A category with this name already exists');
      }
    }

    return await this.categoryRepository.update(id, categoryData);
  }

  async deleteCategory(id: number): Promise<boolean> {
    // Obtener la categoría para saber su nombre
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      return false;
    }

    // Verificar si hay productos asociados
    const productCount = await this.categoryRepository.countProductsByCategory(category.name);
    if (productCount > 0) {
      throw new Error(
        `No se puede eliminar la categoría. Primero mueva o elimine los ${productCount} productos asociados.`
      );
    }

    const result = await this.categoryRepository.delete(id);
    return result;
  }

  async getProductCountByCategory(categoryName: string): Promise<number> {
    return await this.categoryRepository.countProductsByCategory(categoryName);
  }
}
