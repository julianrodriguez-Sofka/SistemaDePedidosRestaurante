import { useState, useCallback, useRef } from 'react';

/**
 * Interface para las métricas de captura de pedido
 */
export interface OrderCaptureMetrics {
  startTime: number | null;
  endTime: number | null;
  duration: number | null;
  itemCount: number;
  tableNumber: number | null;
}

/**
 * Interface para el estado del tracking
 */
interface OrderTimingState {
  isTracking: boolean;
  startTime: number | null;
  metrics: OrderCaptureMetrics | null;
}

/**
 * Threshold definido en US-001: 45 segundos para 5 items
 */
const CAPTURE_TIME_THRESHOLD_MS = 45000;
const THRESHOLD_ITEM_COUNT = 5;

/**
 * Hook personalizado para trackear el tiempo de captura de pedidos
 * Cumple con el criterio: "el tiempo total de captura y envío debe ser < 45 segundos para 5 ítems"
 * 
 * @returns {Object} Funciones y estado para trackear el tiempo de captura
 */
export const useOrderCaptureTracking = () => {
  const [state, setState] = useState<OrderTimingState>({
    isTracking: false,
    startTime: null,
    metrics: null
  });

  const metricsHistory = useRef<OrderCaptureMetrics[]>([]);

  /**
   * Inicia el tracking cuando el mesero comienza a capturar un pedido
   */
  const startTracking = useCallback(() => {
    const now = Date.now();
    setState({
      isTracking: true,
      startTime: now,
      metrics: null
    });

    console.log('[ORDER TRACKING] Started at:', new Date(now).toISOString());
  }, []);

  /**
   * Detiene el tracking cuando el pedido es enviado
   */
  const stopTracking = useCallback((itemCount: number, tableNumber: number) => {
    if (!state.isTracking || !state.startTime) {
      console.warn('[ORDER TRACKING] Cannot stop: tracking not started');
      return null;
    }

    const endTime = Date.now();
    const duration = endTime - state.startTime;

    const metrics: OrderCaptureMetrics = {
      startTime: state.startTime,
      endTime,
      duration,
      itemCount,
      tableNumber
    };

    // Almacenar en historial
    metricsHistory.current.push(metrics);

    // Mantener solo las últimas 100 métricas
    if (metricsHistory.current.length > 100) {
      metricsHistory.current.shift();
    }

    // Log de métricas
    console.log('[ORDER TRACKING] Completed:', {
      duration: `${(duration / 1000).toFixed(2)}s`,
      itemCount,
      tableNumber,
      timestamp: new Date(endTime).toISOString()
    });

    // Validar si cumple con el SLA para 5 items
    if (itemCount >= THRESHOLD_ITEM_COUNT && duration > CAPTURE_TIME_THRESHOLD_MS) {
      console.warn(
        `[SLA WARNING] Order capture time exceeded for ${itemCount} items: ${(duration / 1000).toFixed(2)}s (threshold: ${CAPTURE_TIME_THRESHOLD_MS / 1000}s)`
      );
    } else if (itemCount >= THRESHOLD_ITEM_COUNT) {
      console.log(
        `[SLA COMPLIANCE] Order capture time OK for ${itemCount} items: ${(duration / 1000).toFixed(2)}s`
      );
    }

    setState({
      isTracking: false,
      startTime: null,
      metrics
    });

    return metrics;
  }, [state.isTracking, state.startTime]);

  /**
   * Cancela el tracking actual (si el usuario abandona el pedido)
   */
  const cancelTracking = useCallback(() => {
    if (state.isTracking) {
      console.log('[ORDER TRACKING] Cancelled');
      setState({
        isTracking: false,
        startTime: null,
        metrics: null
      });
    }
  }, [state.isTracking]);

  /**
   * Reinicia el tracking (útil para un nuevo pedido)
   */
  const resetTracking = useCallback(() => {
    setState({
      isTracking: false,
      startTime: null,
      metrics: null
    });
  }, []);

  /**
   * Obtiene el tiempo transcurrido actual en ms
   */
  const getElapsedTime = useCallback((): number => {
    if (!state.isTracking || !state.startTime) {
      return 0;
    }
    return Date.now() - state.startTime;
  }, [state.isTracking, state.startTime]);

  /**
   * Verifica si el tiempo actual excede el threshold para el número de items dado
   */
  const isExceedingThreshold = useCallback((itemCount: number): boolean => {
    if (!state.isTracking || !state.startTime) {
      return false;
    }

    // Solo aplicar threshold si hay 5 o más items
    if (itemCount < THRESHOLD_ITEM_COUNT) {
      return false;
    }

    const elapsed = getElapsedTime();
    return elapsed > CAPTURE_TIME_THRESHOLD_MS;
  }, [state.isTracking, state.startTime, getElapsedTime]);

  /**
   * Obtiene estadísticas del historial de capturas
   */
  const getStatistics = useCallback(() => {
    if (metricsHistory.current.length === 0) {
      return {
        totalOrders: 0,
        avgDuration: 0,
        avgItemCount: 0,
        complianceRate: 100
      };
    }

    // Filtrar solo pedidos con 5+ items para el cálculo de compliance
    const relevantMetrics = metricsHistory.current.filter((m: OrderCaptureMetrics) => m.itemCount >= THRESHOLD_ITEM_COUNT);
    
    const totalOrders = metricsHistory.current.length;
    const totalDuration = metricsHistory.current.reduce((sum: number, m: OrderCaptureMetrics) => sum + (m.duration || 0), 0);
    const totalItems = metricsHistory.current.reduce((sum: number, m: OrderCaptureMetrics) => sum + m.itemCount, 0);

    const compliantOrders = relevantMetrics.filter(
      (m: OrderCaptureMetrics) => m.duration !== null && m.duration <= CAPTURE_TIME_THRESHOLD_MS
    ).length;

    const complianceRate = relevantMetrics.length > 0
      ? (compliantOrders / relevantMetrics.length) * 100
      : 100;

    return {
      totalOrders,
      avgDuration: Math.round(totalDuration / totalOrders),
      avgItemCount: Math.round(totalItems / totalOrders),
      complianceRate: Math.round(complianceRate * 100) / 100,
      ordersWithThreshold: relevantMetrics.length,
      compliantOrders
    };
  }, []);

  /**
   * Limpia el historial de métricas
   */
  const clearHistory = useCallback(() => {
    metricsHistory.current = [];
  }, []);

  return {
    // Estado
    isTracking: state.isTracking,
    startTime: state.startTime,
    metrics: state.metrics,
    
    // Acciones
    startTracking,
    stopTracking,
    cancelTracking,
    resetTracking,
    
    // Utilidades
    getElapsedTime,
    isExceedingThreshold,
    getStatistics,
    clearHistory,
    
    // Constantes
    thresholdMs: CAPTURE_TIME_THRESHOLD_MS,
    thresholdItemCount: THRESHOLD_ITEM_COUNT
  };
};

export default useOrderCaptureTracking;
