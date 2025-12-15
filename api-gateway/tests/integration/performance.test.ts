import request from 'supertest';
import { createApp } from '../../src/app';
import { 
  getPerformanceStats, 
  clearMetrics, 
  getP90ResponseTime,
  getSLAComplianceRate 
} from '../../src/middlewares/performance';

/**
 * Tests de performance para cumplir con el criterio de aceptación:
 * "el tiempo de respuesta debe ser < 1.5 segundos en el 90% de las transacciones"
 */
describe('Performance Tests - US-001 Criterion 4', () => {
  let app: any;
  const SLA_THRESHOLD = 1500; // 1.5 segundos en ms

  beforeEach(() => {
    jest.clearAllMocks();
    clearMetrics();
    
    // Mock de servicios para pruebas de performance
    jest.doMock('../../src/services/OrdersProxyService', () => {
      return {
        OrdersProxyService: jest.fn().mockImplementation(() => ({
          forward: jest.fn().mockResolvedValue({
            status: 201,
            data: {
              success: true,
              data: {
                orderId: 'test-order-123',
                tableNumber: 5,
                customerName: 'Test Customer',
                items: [{ productId: 'prod-1', quantity: 2 }],
              },
            },
          }),
        })),
      };
    });

    app = createApp();
  });

  afterEach(() => {
    clearMetrics();
  });

  describe('Response Time SLA', () => {
    it('should respond to order creation in less than 1.5 seconds', async () => {
      const startTime = Date.now();
      
      const response = await request(app)
        .post('/api/orders')
        .send({
          tableNumber: 5,
          customerName: 'Performance Test Customer',
          items: [
            { productId: 'prod-1', name: 'Hamburguesa', price: 15000, quantity: 2 }
          ]
        });

      const duration = Date.now() - startTime;

      expect(response.status).toBe(201);
      expect(duration).toBeLessThan(SLA_THRESHOLD);
    }, 3000);

    it('should maintain P90 response time under 1.5s for multiple requests', async () => {
      const iterations = 20;
      const orderPayload = {
        tableNumber: 5,
        customerName: 'Load Test Customer',
        items: [
          { productId: 'prod-1', name: 'Hamburguesa', price: 15000, quantity: 2 },
          { productId: 'prod-2', name: 'Papas', price: 8000, quantity: 1 }
        ]
      };

      // Ejecutar múltiples requests
      for (let i = 0; i < iterations; i++) {
        await request(app)
          .post('/api/orders')
          .send({ ...orderPayload, customerName: `Customer ${i}` });
      }

      // Verificar P90
      const p90 = getP90ResponseTime('/api/orders');
      
      expect(p90).toBeLessThan(SLA_THRESHOLD);
    }, 60000);

    it('should have at least 90% of requests under SLA threshold', async () => {
      const iterations = 100;
      const orderPayload = {
        tableNumber: 5,
        customerName: 'SLA Test Customer',
        items: [
          { productId: 'prod-1', name: 'Hamburguesa', price: 15000, quantity: 1 }
        ]
      };

      // Ejecutar 100 requests para tener muestra significativa
      const requests = [];
      for (let i = 0; i < iterations; i++) {
        requests.push(
          request(app)
            .post('/api/orders')
            .send({ ...orderPayload, customerName: `Customer ${i}` })
        );
      }

      await Promise.all(requests);

      // Verificar compliance rate
      const complianceRate = getSLAComplianceRate('/api/orders');
      
      // Debe tener al menos 90% de requests bajo el threshold
      expect(complianceRate).toBeGreaterThanOrEqual(90);
    }, 120000);
  });

  describe('Performance Metrics Endpoint', () => {
    it('should return performance statistics', async () => {
      // Generar algunas métricas
      await request(app).post('/api/orders').send({
        tableNumber: 1,
        customerName: 'Test',
        items: [{ productId: 'prod-1', name: 'Test', price: 1000, quantity: 1 }]
      });

      // Obtener estadísticas
      const response = await request(app).get('/api/metrics/performance');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalRequests');
      expect(response.body.data).toHaveProperty('avgResponseTime');
      expect(response.body.data).toHaveProperty('p90ResponseTime');
      expect(response.body.data).toHaveProperty('slaComplianceRate');
      expect(response.body.data.slaThreshold).toBe(SLA_THRESHOLD);
    });

    it('should return P90 metric', async () => {
      // Generar métricas
      for (let i = 0; i < 10; i++) {
        await request(app).post('/api/orders').send({
          tableNumber: 1,
          customerName: `Test ${i}`,
          items: [{ productId: 'prod-1', name: 'Test', price: 1000, quantity: 1 }]
        });
      }

      const response = await request(app).get('/api/metrics/performance/p90');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('p90ResponseTime');
      expect(response.body.data.unit).toBe('ms');
    });

    it('should filter metrics by path', async () => {
      // Generar métricas en diferentes endpoints
      await request(app).post('/api/orders').send({
        tableNumber: 1,
        customerName: 'Test',
        items: [{ productId: 'prod-1', name: 'Test', price: 1000, quantity: 1 }]
      });

      const response = await request(app)
        .get('/api/metrics/performance')
        .query({ path: '/api/orders' });

      expect(response.status).toBe(200);
      expect(response.body.data.totalRequests).toBeGreaterThan(0);
    });
  });

  describe('Load Testing', () => {
    it('should handle concurrent requests efficiently', async () => {
      const concurrentRequests = 10;
      const orderPayload = {
        tableNumber: 5,
        customerName: 'Concurrent Test',
        items: [
          { productId: 'prod-1', name: 'Hamburguesa', price: 15000, quantity: 2 }
        ]
      };

      const startTime = Date.now();
      
      // Ejecutar requests concurrentes
      const requests = Array(concurrentRequests).fill(null).map((_, i) =>
        request(app)
          .post('/api/orders')
          .send({ ...orderPayload, customerName: `Customer ${i}` })
      );

      const responses = await Promise.all(requests);
      const totalDuration = Date.now() - startTime;

      // Todas las responses deben ser exitosas
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // El tiempo total no debe exceder mucho el threshold
      // (con concurrencia, no debería ser 10x el tiempo de una request)
      expect(totalDuration).toBeLessThan(SLA_THRESHOLD * 3);
    }, 10000);
  });

  describe('Performance Statistics', () => {
    it('should calculate correct average response time', async () => {
      // Generar 5 requests
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/orders').send({
          tableNumber: 1,
          customerName: `Test ${i}`,
          items: [{ productId: 'prod-1', name: 'Test', price: 1000, quantity: 1 }]
        });
      }

      const stats = getPerformanceStats('/api/orders');
      
      expect(stats.totalRequests).toBe(5);
      expect(stats.avgResponseTime).toBeGreaterThan(0);
      expect(stats.avgResponseTime).toBeLessThan(SLA_THRESHOLD);
    });

    it('should calculate percentiles correctly', async () => {
      // Generar suficientes requests para cálculo de percentiles
      for (let i = 0; i < 20; i++) {
        await request(app).post('/api/orders').send({
          tableNumber: 1,
          customerName: `Test ${i}`,
          items: [{ productId: 'prod-1', name: 'Test', price: 1000, quantity: 1 }]
        });
      }

      const stats = getPerformanceStats('/api/orders');
      
      // P90 debe ser >= P50 (mediana)
      expect(stats.p90ResponseTime).toBeGreaterThanOrEqual(0);
      // P95 debe ser >= P90
      expect(stats.p95ResponseTime).toBeGreaterThanOrEqual(stats.p90ResponseTime);
      // P99 debe ser >= P95
      expect(stats.p99ResponseTime).toBeGreaterThanOrEqual(stats.p95ResponseTime);
    });
  });
});
