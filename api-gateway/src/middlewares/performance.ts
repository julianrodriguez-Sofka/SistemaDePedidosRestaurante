import { Request, Response, NextFunction } from 'express';

// Interfaz para métricas de performance
interface PerformanceMetrics {
  method: string;
  path: string;
  duration: number;
  statusCode: number;
  timestamp: string;
}

// Array para almacenar métricas (en producción usar base de datos o sistema de métricas)
const performanceMetrics: PerformanceMetrics[] = [];

// Límite de métricas en memoria (para evitar memory leaks)
const MAX_METRICS = 1000;

// SLA definido: 1.5 segundos para el 90% de las transacciones
const SLA_THRESHOLD_MS = 1500;

/**
 * Middleware para monitorear el tiempo de respuesta de cada petición
 * Cumple con el criterio: "el tiempo de respuesta debe ser < 1.5 segundos en el 90% de las transacciones"
 */
export const performanceMonitoring = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Interceptar el evento 'finish' para calcular el tiempo total
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const metric: PerformanceMetrics = {
      method: req.method,
      path: req.path,
      duration,
      statusCode: res.statusCode,
      timestamp: new Date().toISOString()
    };

    // Almacenar métrica
    performanceMetrics.push(metric);
    
    // Mantener solo las últimas MAX_METRICS métricas
    if (performanceMetrics.length > MAX_METRICS) {
      performanceMetrics.shift();
    }

    // Log de performance
    console.log(`[PERFORMANCE] ${metric.method} ${metric.path} - ${duration}ms - Status: ${metric.statusCode}`);

    // Alerta si se excede el SLA
    if (duration > SLA_THRESHOLD_MS) {
      console.warn(`[SLA VIOLATION] ${metric.method} ${metric.path} exceeded ${SLA_THRESHOLD_MS}ms: ${duration}ms`);
    }
  });

  next();
};

/**
 * Obtiene las métricas de performance almacenadas
 */
export const getPerformanceMetrics = (): PerformanceMetrics[] => {
  return [...performanceMetrics];
};

/**
 * Calcula el percentil P90 de los tiempos de respuesta
 * @param path - Opcional: filtrar por path específico
 * @returns El tiempo en ms del percentil 90
 */
export const getP90ResponseTime = (path?: string): number => {
  let metrics = performanceMetrics;
  
  if (path) {
    metrics = metrics.filter(m => m.path === path);
  }

  if (metrics.length === 0) {
    return 0;
  }

  const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
  const p90Index = Math.floor(durations.length * 0.9);
  
  return durations[p90Index];
};

/**
 * Calcula el porcentaje de requests que cumplen el SLA
 * @param path - Opcional: filtrar por path específico
 * @returns Porcentaje de requests bajo el threshold
 */
export const getSLAComplianceRate = (path?: string): number => {
  let metrics = performanceMetrics;
  
  if (path) {
    metrics = metrics.filter(m => m.path === path);
  }

  if (metrics.length === 0) {
    return 100;
  }

  const compliantRequests = metrics.filter(m => m.duration < SLA_THRESHOLD_MS).length;
  return (compliantRequests / metrics.length) * 100;
};

/**
 * Obtiene estadísticas agregadas de performance
 */
export const getPerformanceStats = (path?: string) => {
  let metrics = performanceMetrics;
  
  if (path) {
    metrics = metrics.filter(m => m.path === path);
  }

  if (metrics.length === 0) {
    return {
      totalRequests: 0,
      avgResponseTime: 0,
      p90ResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      slaComplianceRate: 100,
      slaThreshold: SLA_THRESHOLD_MS
    };
  }

  const durations = metrics.map(m => m.duration).sort((a, b) => a - b);
  const sum = durations.reduce((acc, val) => acc + val, 0);

  return {
    totalRequests: metrics.length,
    avgResponseTime: Math.round(sum / metrics.length),
    p90ResponseTime: durations[Math.floor(durations.length * 0.9)],
    p95ResponseTime: durations[Math.floor(durations.length * 0.95)],
    p99ResponseTime: durations[Math.floor(durations.length * 0.99)],
    slaComplianceRate: getSLAComplianceRate(path),
    slaThreshold: SLA_THRESHOLD_MS
  };
};

/**
 * Limpia las métricas almacenadas
 */
export const clearMetrics = (): void => {
  performanceMetrics.length = 0;
};
