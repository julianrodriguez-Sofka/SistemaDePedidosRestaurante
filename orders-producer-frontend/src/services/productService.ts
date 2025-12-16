import type { Product } from '../types/order';

const PRODUCTS_API_URL = '/api/products/';

/**
 * Get all active products from the admin service
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${PRODUCTS_API_URL}?active_only=true`);
    
    if (!response.ok) {
      throw new Error('Error al cargar productos');
    }
    
    const products = await response.json();
    
    // Transform backend format to frontend format
    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      desc: p.description || p.name,
      image: p.image_url || '/images/placeholder.jpg'
    }));
  } catch (error) {
    console.error('Error loading products:', error);
    // Return empty array if there's an error
    return [];
  }
}
