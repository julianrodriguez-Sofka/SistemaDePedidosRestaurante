import { ProductModel, IProduct } from '../models/product.model';

export class ProductRepository {
  async getNextId(): Promise<number> {
    const lastProduct = await ProductModel.findOne().sort({ id: -1 });
    return lastProduct ? lastProduct.id + 1 : 1;
  }

  async create(productData: Partial<IProduct>) {
    return ProductModel.create(productData);
  }

  async findAll() {
    return ProductModel.find();
  }

  async findById(id: number) {
    return ProductModel.findOne({ id });
  }

  async update(id: number, updateData: Partial<IProduct>) {
    return ProductModel.findOneAndUpdate({ id }, updateData, { new: true });
  }

  async delete(id: number) {
    const result = await ProductModel.findOneAndDelete({ id });
    return result !== null;
  }
}
