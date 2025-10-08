// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  startTimer(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const end = performance.now()
      const duration = end - start
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, [])
      }
      
      this.metrics.get(label)!.push(duration)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`)
      }
    }
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label) || []
    if (times.length === 0) return 0
    return times.reduce((a, b) => a + b, 0) / times.length
  }

  getMetrics(): Record<string, { average: number; count: number; total: number }> {
    const result: Record<string, { average: number; count: number; total: number }> = {}
    
    for (const [label, times] of this.metrics.entries()) {
      result[label] = {
        average: this.getAverageTime(label),
        count: times.length,
        total: times.reduce((a, b) => a + b, 0)
      }
    }
    
    return result
  }

  reset(): void {
    this.metrics.clear()
  }
}

// Decorator for measuring function performance
export function measurePerformance<T extends (...args: any[]) => any>(
  label: string,
  fn: T
): T {
  return ((...args: Parameters<T>) => {
    const monitor = PerformanceMonitor.getInstance()
    const endTimer = monitor.startTimer(label)
    
    try {
      const result = fn(...args)
      
      // Handle both sync and async functions
      if (result instanceof Promise) {
        return result.finally(endTimer)
      } else {
        endTimer()
        return result
      }
    } catch (error) {
      endTimer()
      throw error
    }
  }) as T
}

// Database query performance wrapper
export const dbQuery = {
  async measure<T>(label: string, query: () => Promise<T>): Promise<T> {
    const monitor = PerformanceMonitor.getInstance()
    const endTimer = monitor.startTimer(`DB: ${label}`)
    
    try {
      const result = await query()
      endTimer()
      return result
    } catch (error) {
      endTimer()
      throw error
    }
  }
}
