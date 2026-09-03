// Performance monitoring utility
// Tracks API response times and logs slow requests

interface PerformanceMetric {
  startTime: number;
  operation: string;
  metadata?: Record<string, unknown>;
}

/**
 * Start tracking performance of an operation
 */
export function startPerformanceTimer(
  operation: string,
  metadata?: Record<string, unknown>
): PerformanceMetric {
  return {
    startTime: performance.now(),
    operation,
    metadata,
  };
}

/**
 * End tracking and log the result
 */
export function endPerformanceTimer(metric: PerformanceMetric): number {
  const duration = performance.now() - metric.startTime;

  // Log slow operations (> 200ms target)
  if (duration > 200) {
    console.warn(
      `[SLOW] ${metric.operation} took ${duration.toFixed(2)}ms`,
      metric.metadata
    );
  }

  // In development, log all operations for profiling
  if (process.env.NODE_ENV === "development" && duration > 100) {
    console.log(
      `[PERF] ${metric.operation} took ${duration.toFixed(2)}ms`,
      metric.metadata
    );
  }

  return duration;
}

/**
 * Wrapper for async operations with performance tracking
 */
export async function withPerformanceTracking<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  const metric = startPerformanceTimer(operation, metadata);
  try {
    const result = await fn();
    return result;
  } finally {
    endPerformanceTimer(metric);
  }
}
