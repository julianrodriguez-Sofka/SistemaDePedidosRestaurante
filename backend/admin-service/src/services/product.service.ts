import { ProductRepository } from '../repositories/product.repository';
import { IProduct } from '../models/product.model';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    // Generar el siguiente ID automáticamente
    if (!productData.id) {
      productData.id = await this.productRepository.getNextId();
    }

    // Validar que el precio sea positivo
    if (productData.price && productData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    return await this.productRepository.create(productData);
  }

  async getAllProducts(): Promise<IProduct[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<IProduct | null> {
    return await this.productRepository.findById(id);
  }

  async updateProduct(id: number, productData: Partial<IProduct>): Promise<IProduct | null> {
    // Validar que el precio sea positivo
    if (productData.price && productData.price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    return await this.productRepository.update(id, productData);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result;
  }
}