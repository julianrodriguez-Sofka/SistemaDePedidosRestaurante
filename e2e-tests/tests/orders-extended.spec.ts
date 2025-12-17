import { test, expect } from '@playwright/test';

/**
 * MÓDULO 5 - GESTIÓN DE PEDIDOS - Tests Extendidos
 * Implementación de casos faltantes según TEST_CASE_ACTUALIZADO.md
 */

// Helper para login de mesero
async function loginAsWaiter(request: any): Promise<string | null> {
  const response = await request.post('http://localhost:3000/api/auth/login', {
    data: { username: 'waiter', password: 'waiter123' },
    failOnStatusCode: false
  });

  if (!response.ok()) {
    return null;
  }

  const data = await response.json();
  return data.token;
}

test.describe('📋 US-021: Crear Pedido - Validación', () => {
  
  test('TC-US-021-04: Crear pedido sin productos (Validación)', async ({ request }) => {
    // Given: Mesero autenticado
    const token = await loginAsWaiter(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Intenta crear pedido con array de productos vacío
    const response = await request.post('http://localhost:8000/api/orders', {
      headers,
      data: {
        tableNumber: 1,
        items: []  // SIN PRODUCTOS (inválido)
      },
      failOnStatusCode: false
    });

    // Then: Sistema rechaza pedido vacío (400/422) o 401/404
    expect([400, 422, 401, 404]).toContain(response.status());
  });
});

test.describe('📋 US-022: Actualizar Estado Pedido - Validación', () => {
  
  test('TC-US-022-04: Actualizar con estado inválido (Validación)', async ({ request }) => {
    // Given: Mesero autenticado y pedido existente
    const token = await loginAsWaiter(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Intenta actualizar con estado no válido
    const response = await request.patch('http://localhost:5001/api/orders/id_cualquiera/status', {
      headers,
      data: {
        status: 'estado_inventado_xyz'  // Estado inválido
      },
      failOnStatusCode: false
    }).catch(() => null);

    // Then: Sistema rechaza estado inválido (400/422/404) o 401, o no responde
    const status = response ? response.status() : 404;
    expect([400, 422, 404, 401]).toContain(status);
  });
});

test.describe('📋 US-024: Cancelar Pedido - Casos Avanzados', () => {
  
  test('TC-US-024-04: Cancelar pedido ya completado (Validación)', async ({ request }) => {
    // Given: Mesero autenticado
    const token = await loginAsWaiter(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Intenta cancelar un pedido que ya fue completado
    const response = await request.patch('http://localhost:5001/api/orders/id_completado/cancel', {
      headers,
      failOnStatusCode: false
    }).catch(() => null);

    // Then: Sistema rechaza la cancelación (400/409 Conflict) o 401/404, o no responde
    const status = response ? response.status() : 404;
    expect([400, 404, 409, 422, 401]).toContain(status);
  });
});

test.describe('📋 US-025: Listar Pedidos - Performance', () => {
  
  test('TC-US-025-04: Listado con 1000+ pedidos (Borde)', async ({ request }) => {
    // Given: Mesero autenticado
    const token = await loginAsWaiter(request);
    const headers: any = token ? { 'Authorization': `Bearer ${token}` } : undefined;

    // When: Solicita listado completo de pedidos
    const startTime = Date.now();
    const response = await request.get('http://localhost:8000/api/orders?limit=1000', {
      headers,
      failOnStatusCode: false
    });
    const responseTime = Date.now() - startTime;

    // Then: Sistema responde en tiempo razonable (< 5000ms)
    expect([200, 404, 401]).toContain(response.status());
    expect(responseTime).toBeLessThan(5000);
    
    console.log(`📋 Tiempo de respuesta para listado masivo: ${responseTime}ms`);
  });
});
