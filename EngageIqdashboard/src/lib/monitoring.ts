import { Request, Response, NextFunction } from 'express'

// Simple metrics collection without external dependencies
class MetricsCollector {
  private static instance: MetricsCollector
  private metrics: Map<string, any> = new Map()

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector()
    }
    return MetricsCollector.instance
  }

  recordMetric(name: string, value: number, labels?: Record<string, string>) {
    const key = labels ? `${name}:${JSON.stringify(labels)}` : name
    const existing = this.metrics.get(key)
    
    if (existing) {
      existing.value += value
    } else {
      this.metrics.set(key, { value, labels: labels || {}, count: 1 })
    }
  }

  getMetric(name: string, labels?: Record<string, string>) {
    const key = labels ? `${name}:${JSON.stringify(labels)}` : name
    return this.metrics.get(key)
  }

  getAllMetrics() {
    return Array.from(this.metrics.entries()).map(([key, value]) => ({
      name: key.split(':')[0],
      ...value
    }))
  }

  reset() {
    this.metrics.clear()
  }
}

export const metrics = MetricsCollector.getInstance()

// Performance metrics collection
export const collectMetrics = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const route = (req as any).route?.path || req.path
    const method = req.method
    const statusCode = res.statusCode

    // Record request duration
    metrics.recordMetric('http_request_duration_seconds', duration / 1000, {
      method,
      route,
      status_code: statusCode.toString()
    })

    // Record request count
    metrics.recordMetric('http_requests_total', 1, {
      method,
      route,
      status_code: statusCode.toString()
    })

    // Record error rate
    if (statusCode >= 400) {
      metrics.recordMetric('error_rate', 1)
    }

    // Update cache hit rate
    if ((res as any).get && (res as any).get('X-Cache') === 'HIT') {
      metrics.recordMetric('cache_hit_rate', 1)
    }
  })

  next()
}

export default {
  collectMetrics,
  metrics
}
