/**
 * Test básico para validar el hook de tracking de tiempo de captura de pedidos
 * Cumple con US-001 Criterio 5: tiempo total de captura < 45 segundos para 5 ítems
 */

import { renderHook, act } from '@testing-library/react';
import { useOrderCaptureTracking } from '../useOrderCaptureTracking';

describe('useOrderCaptureTracking - US-001 Criterion 5', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Tracking', () => {
    it('should start tracking when startTracking is called', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      expect(result.current.isTracking).toBe(false);

      act(() => {
        result.current.startTracking();
      });

      expect(result.current.isTracking).toBe(true);
      expect(result.current.startTime).toBeTruthy();
    });

    it('should stop tracking and calculate duration', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
      });

      // Simulate 30 seconds passing
      act(() => {
        jest.advanceTimersByTime(30000);
      });

      let metrics;
      act(() => {
        metrics = result.current.stopTracking(5, 3);
      });

      expect(result.current.isTracking).toBe(false);
      expect(metrics).toBeTruthy();
      expect(metrics?.duration).toBe(30000);
      expect(metrics?.itemCount).toBe(5);
      expect(metrics?.tableNumber).toBe(3);
    });

    it('should calculate elapsed time correctly', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
      });

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(result.current.getElapsedTime()).toBe(10000);
    });
  });

  describe('SLA Compliance - 45 seconds threshold for 5+ items', () => {
    it('should NOT flag as exceeding threshold with less than 5 items', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
      });

      act(() => {
        jest.advanceTimersByTime(50000); // 50 seconds
      });

      // Only 3 items, threshold should not apply
      expect(result.current.isExceedingThreshold(3)).toBe(false);
    });

    it('should flag as exceeding threshold when 5+ items take more than 45s', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
      });

      act(() => {
        jest.advanceTimersByTime(46000); // 46 seconds
      });

      expect(result.current.isExceedingThreshold(5)).toBe(true);
    });

    it('should NOT flag as exceeding when 5+ items take less than 45s', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
      });

      act(() => {
        jest.advanceTimersByTime(40000); // 40 seconds
      });

      expect(result.current.isExceedingThreshold(5)).toBe(false);
    });

    it('should have correct threshold constants', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      expect(result.current.thresholdMs).toBe(45000); // 45 seconds
      expect(result.current.thresholdItemCount).toBe(5);
    });
  });

  describe('Statistics', () => {
    it('should calculate compliance rate correctly', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      // Order 1: 5 items, 40s (compliant)
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(40000);
        result.current.stopTracking(5, 1);
        result.current.resetTracking();
      });

      // Order 2: 5 items, 50s (non-compliant)
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(50000);
        result.current.stopTracking(5, 2);
        result.current.resetTracking();
      });

      // Order 3: 5 items, 30s (compliant)
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(30000);
        result.current.stopTracking(5, 3);
        result.current.resetTracking();
      });

      const stats = result.current.getStatistics();

      expect(stats.totalOrders).toBe(3);
      expect(stats.ordersWithThreshold).toBe(3); // All have 5+ items
      expect(stats.compliantOrders).toBe(2); // 2 out of 3 under 45s
      expect(stats.complianceRate).toBe(66.67); // 2/3 * 100
    });

    it('should not count orders with less than 5 items in compliance rate', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      // Order with 3 items, 50s (shouldn't count for compliance)
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(50000);
        result.current.stopTracking(3, 1);
        result.current.resetTracking();
      });

      // Order with 5 items, 40s (compliant)
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(40000);
        result.current.stopTracking(5, 2);
      });

      const stats = result.current.getStatistics();

      expect(stats.totalOrders).toBe(2);
      expect(stats.ordersWithThreshold).toBe(1); // Only one has 5+ items
      expect(stats.compliantOrders).toBe(1);
      expect(stats.complianceRate).toBe(100); // 1/1 * 100
    });

    it('should calculate average duration and item count', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      // Order 1: 30s, 3 items
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(30000);
        result.current.stopTracking(3, 1);
        result.current.resetTracking();
      });

      // Order 2: 40s, 5 items
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(40000);
        result.current.stopTracking(5, 2);
      });

      const stats = result.current.getStatistics();

      expect(stats.avgDuration).toBe(35000); // (30000 + 40000) / 2
      expect(stats.avgItemCount).toBe(4); // (3 + 5) / 2
    });
  });

  describe('Reset and Cancel', () => {
    it('should cancel tracking', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
      });

      expect(result.current.isTracking).toBe(true);

      act(() => {
        result.current.cancelTracking();
      });

      expect(result.current.isTracking).toBe(false);
      expect(result.current.metrics).toBeNull();
    });

    it('should reset tracking for new order', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(20000);
        result.current.stopTracking(3, 1);
      });

      expect(result.current.metrics).toBeTruthy();

      act(() => {
        result.current.resetTracking();
      });

      expect(result.current.isTracking).toBe(false);
      expect(result.current.startTime).toBeNull();
      expect(result.current.metrics).toBeNull();
    });

    it('should clear metrics history', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      // Create some history
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(20000);
        result.current.stopTracking(3, 1);
      });

      let stats = result.current.getStatistics();
      expect(stats.totalOrders).toBe(1);

      act(() => {
        result.current.clearHistory();
      });

      stats = result.current.getStatistics();
      expect(stats.totalOrders).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should return null when stopping without starting', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      let metrics;
      act(() => {
        metrics = result.current.stopTracking(5, 1);
      });

      expect(metrics).toBeNull();
    });

    it('should return 0 elapsed time when not tracking', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      expect(result.current.getElapsedTime()).toBe(0);
    });

    it('should handle multiple orders in sequence', () => {
      const { result } = renderHook(() => useOrderCaptureTracking());

      // Order 1
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(35000);
        result.current.stopTracking(5, 1);
        result.current.resetTracking();
      });

      // Order 2
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(42000);
        result.current.stopTracking(6, 2);
        result.current.resetTracking();
      });

      // Order 3
      act(() => {
        result.current.startTracking();
        jest.advanceTimersByTime(48000);
        result.current.stopTracking(5, 3);
      });

      const stats = result.current.getStatistics();
      expect(stats.totalOrders).toBe(3);
      expect(stats.compliantOrders).toBe(2); // First two under 45s
      expect(stats.complianceRate).toBe(66.67);
    });
  });
});
