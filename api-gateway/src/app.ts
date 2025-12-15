import express, { Application } from 'express';
import { corsConfig } from './middlewares/cors';
import { requestLogger } from './middlewares/logger';
import { performanceMonitoring } from './middlewares/performance';
import { errorHandler } from './middlewares/errorHandler';
import ordersRoutes from './routes/orders.routes';
import kitchenRoutes from './routes/kitchen.routes';
import metricsRoutes from './routes/metrics.routes';

// Configura y retorna la aplicación Express
export function createApp(): Application {
  const app = express();

  // Middlewares globales
  app.use(corsConfig);
  app.use(express.json());
  app.use(performanceMonitoring);
  app.use(requestLogger);

  // Rutas de la aplicación
  app.use('/api/orders', ordersRoutes);
  app.use('/api/kitchen', kitchenRoutes);
  app.use('/api/metrics', metricsRoutes);

  // Manejo de errores (debe ir al final)
  app.use(errorHandler);

  return app;
}