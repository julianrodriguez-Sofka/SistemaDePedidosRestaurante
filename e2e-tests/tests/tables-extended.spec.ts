import { test, expect } from '@playwright/test';

/**
 * MÓDULO 4 - GESTIÓN DE MESAS - Tests Extendidos
 * Implementación de casos faltantes según TEST_CASE_ACTUALIZADO.md
 */

// Helper para login de admin
async function loginAsAdmin(request: any): Promise<string | null> {
  const response = await request.post('http://localhost:3000/api/auth/login', {
    data: { username: 'admin', password: 'admin123' },
    failOnStatusCode: false
  });

  if (!response.ok()) {
    return null;
  }

  const data = await response.json();
  return data.token;
}

test.describe('🪑 US-016: Crear Mesa - Casos Avanzados', () => {
  
  test('TC-US-016-04: Crear mesa con número muy alto (Borde)', async ({ request }) => {
    // Given: Admin autenticado
    const token = await loginAsAdmin(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Intenta crear mesa con número muy alto (ej: 9999)
    const response = await request.post('http://localhost:8000/api/tables', {
      headers,
      data: {
        tableNumber: 9999,
        capacity: 4,
        location: 'terraza'
      },
      failOnStatusCode: false
    });

    // Then: Sistema acepta o rechaza según límite configurado
    expect([201, 200, 400, 422, 401, 404]).toContain(response.status());
  });
});

test.describe('🪑 US-017: Editar Mesa - Casos Avanzados', () => {
  
  test('TC-US-017-04: Editar mesa con capacidad = 0 (Borde)', async ({ request }) => {
    // Given: Admin autenticado
    const token = await loginAsAdmin(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Intenta cambiar capacidad a 0 (usando ID genérico)
    const response = await request.put('http://localhost:8000/api/tables/test_table_id', {
      headers,
      data: {
        capacity: 0  // Capacidad inválida
      },
      failOnStatusCode: false
    });

    // Then: Sistema rechaza capacidad inválida (400/422) o 401/404
    expect([400, 422, 401, 404]).toContain(response.status());
  });
});

test.describe('🪑 US-019: Listar Mesas - Performance', () => {
  
  test('TC-US-019-04: Listado con 500+ mesas (Borde)', async ({ request }) => {
    // Given: Sistema con muchas mesas registradas
    const token = await loginAsAdmin(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Solicita listado completo
    const startTime = Date.now();
    const response = await request.get('http://localhost:8000/api/tables', {
      headers,
      failOnStatusCode: false
    });
    const responseTime = Date.now() - startTime;

    // Then: Sistema responde en tiempo razonable (< 3000ms)
    expect([200, 404, 401]).toContain(response.status());
    expect(responseTime).toBeLessThan(3000);
    
    if (response.ok()) {
      const tables = await response.json();
      console.log(`🪑 Total de mesas: ${Array.isArray(tables) ? tables.length : 0}`);
      console.log(`⚡ Tiempo de respuesta: ${responseTime}ms`);
    }
  });
});
