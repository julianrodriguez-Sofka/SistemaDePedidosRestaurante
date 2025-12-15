import { Router, Request, Response } from 'express';
import { 
  getPerformanceStats, 
  getPerformanceMetrics, 
  getP90ResponseTime 
} from '../middlewares/performance';

const router = Router();

/**
 * GET /api/metrics/performance
 * Obtiene estadísticas agregadas de performance
 */
router.get('/performance', (req: Request, res: Response) => {
  const { path } = req.query;
  const stats = getPerformanceStats(path as string | undefined);
  
  res.json({
    success: true,
    data: stats
  });
});

/**
 * GET /api/metrics/performance/all
 * Obtiene todas las métricas individuales
 */
router.get('/performance/all', (req: Request, res: Response) => {
  const metrics = getPerformanceMetrics();
  
  res.json({
    success: true,
    data: metrics,
    count: metrics.length
  });
});

/**
 * GET /api/metrics/performance/p90
 * Obtiene el tiempo P90
 */
router.get('/performance/p90', (req: Request, res: Response) => {
  const { path } = req.query;
  const p90 = getP90ResponseTime(path as string | undefined);
  
  res.json({
    success: true,
    data: {
      p90ResponseTime: p90,
      path: path || 'all',
      unit: 'ms'
    }
  });
});

export default router;
