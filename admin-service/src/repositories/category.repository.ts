import { CategoryModel, ICategory } from '../models/category.model';
import { ProductModel } from '../models/product.model';

export class CategoryRepository {
  async getNextId(): Promise<number> {
    const lastCategory = await CategoryModel.findOne().sort({ id: -1 });
    return lastCategory ? lastCategory.id + 1 : 1;
  }

  async create(categoryData: Partial<ICategory>) {
    return CategoryModel.create(categoryData);
  }

  async findAll() {
    return CategoryModel.find();
  }

  async findById(id: number) {
    return CategoryModel.findOne({ id });
  }

  async findByName(name: string) {
    return CategoryModel.findOne({ name });
  }

  async update(id: number, updateData: Partial<ICategory>) {
    return CategoryModel.findOneAndUpdate({ id }, updateData, { new: true });
  }

  async delete(id: number) {
    const result = await CategoryModel.findOneAndDelete({ id });
    return result !== null;
  }

  async countProductsByCategory(categoryName: string): Promise<number> {
    return ProductModel.countDocuments({ category: categoryName });
  }
}
