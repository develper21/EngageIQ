import { Request, Response, NextFunction } from 'express'

interface PerformanceMetrics {
  requestId: string
  method: string
  url: string
  userAgent: string
  ip: string
  userId?: string
  startTime: number
  endTime?: number
  duration?: number
  statusCode?: number
  memoryUsage?: NodeJS.MemoryUsage
  cacheHit?: boolean
  databaseQueries?: number
  error?: string
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private slowRequestThreshold = 1000 // 1 second
  private memoryThreshold = 100 * 1024 * 1024 // 100MB

  // Main performance monitoring middleware
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = this.generateRequestId()
      const startTime = Date.now()
      
      const metrics: PerformanceMetrics = {
        requestId,
        method: req.method,
        url: req.originalUrl || req.url,
        userAgent: req.get('User-Agent') || 'unknown',
        ip: this.getClientIP(req),
        userId: (req as any).user?.userId,
        startTime,
        memoryUsage: process.memoryUsage()
      }

      this.metrics.set(requestId, metrics)

      // Override res.end to capture completion
      const originalEnd = res.end
      const self = this
      
      res.end = function(...args: any[]) {
        const endTime = Date.now()
        const duration = endTime - startTime

        metrics.endTime = endTime
        metrics.duration = duration
        metrics.statusCode = res.statusCode
        metrics.cacheHit = res.get('X-Cache') === 'HIT'

        // Log slow requests
        if (duration > self.slowRequestThreshold) {
          console.warn('Slow request detected:', {
            requestId,
            method: req.method,
            url: req.url,
            duration: `${duration}ms`,
            statusCode: res.statusCode
          })
        }

        // Log memory usage if high
        const currentMemory = process.memoryUsage()
        if (currentMemory.heapUsed > self.memoryThreshold) {
          console.warn('High memory usage detected:', {
            requestId,
            heapUsed: `${Math.round(currentMemory.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(currentMemory.heapTotal / 1024 / 1024)}MB`
          })
        }

        // Store metrics for analytics
        self.storeMetrics(metrics)

        // Call original end and return result
        return originalEnd.apply(this, args)
      } as any

      next()
    }
  }

  // Database query monitoring
  databaseMonitor() {
    return (req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-request-id'] as string
      if (!requestId) return next()

      const metrics = this.metrics.get(requestId)
      if (!metrics) return next()

      // This would integrate with Prisma query logging
      // For now, we'll track query count manually
      let queryCount = 0

      // Override Prisma query logging (simplified)
      const originalLog = console.log
      console.log = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('prisma:query')) {
          queryCount++
          metrics.databaseQueries = queryCount
        }
        originalLog.apply(console, args)
      }

      res.on('finish', () => {
        // Restore original console.log
        console.log = originalLog
      })

      next()
    }
  }

  // Memory usage monitoring
  memoryMonitor() {
    return (req: Request, res: Response, next: NextFunction) => {
      const memoryBefore = process.memoryUsage()
      
      res.on('finish', () => {
        const memoryAfter = process.memoryUsage()
        const memoryDiff = {
          heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
          heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
          external: memoryAfter.external - memoryBefore.external
        }

        // Log significant memory changes
        if (Math.abs(memoryDiff.heapUsed) > 10 * 1024 * 1024) { // 10MB
          console.log('Memory usage change:', {
            url: req.url,
            method: req.method,
            heapUsedDiff: `${Math.round(memoryDiff.heapUsed / 1024 / 1024)}MB`
          })
        }
      })

      next()
    }
  }

  // Cache performance monitoring
  cacheMonitor() {
    return (req: Request, res: Response, next: NextFunction) => {
      res.on('finish', () => {
        const cacheStatus = res.get('X-Cache')
        const cacheTTL = res.get('X-Cache-TTL')
        
        if (cacheStatus) {
          console.log('Cache performance:', {
            url: req.url,
            method: req.method,
            cacheStatus,
            cacheTTL,
            statusCode: res.statusCode
          })
        }
      })

      next()
    }
  }

  // API response time monitoring
  responseTimeMonitor() {
    return (req: Request, res: Response, next: NextFunction) => {
      const start = Date.now()
      
      res.on('finish', () => {
        const duration = Date.now() - start
        
        // Store response time metrics
        this.storeResponseTimeMetrics({
          method: req.method,
          route: this.getRoutePattern(req),
          duration,
          statusCode: res.statusCode,
          timestamp: new Date()
        })
      })

      next()
    }
  }

  // Error rate monitoring
  errorMonitor() {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      const requestId = req.headers['x-request-id'] as string
      if (requestId) {
        const metrics = this.metrics.get(requestId)
        if (metrics) {
          metrics.error = err.message
          this.storeMetrics(metrics)
        }
      }

      // Log error metrics
      this.storeErrorMetrics({
        method: req.method,
        url: req.url,
        statusCode: res.statusCode || 500,
        error: err.message,
        stack: err.stack,
        timestamp: new Date()
      })

      next(err)
    }
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Get client IP address
  private getClientIP(req: Request): string {
    return req.ip || 
           req.headers['x-forwarded-for'] as string || 
           req.headers['x-real-ip'] as string || 
           req.connection.remoteAddress || 
           'unknown'
  }

  // Get route pattern for grouping
  private getRoutePattern(req: Request): string {
    const route = req.route?.path || req.path
    // Replace dynamic segments with placeholders
    return route.replace(/\/:[^\/]+/g, '/:id')
  }

  // Store metrics for analytics
  private storeMetrics(metrics: PerformanceMetrics) {
    // In a real implementation, this would store to a database or time-series DB
    console.log('Performance metrics:', {
      requestId: metrics.requestId,
      method: metrics.method,
      url: metrics.url,
      duration: metrics.duration,
      statusCode: metrics.statusCode,
      cacheHit: metrics.cacheHit,
      databaseQueries: metrics.databaseQueries
    })
  }

  // Store response time metrics
  private storeResponseTimeMetrics(metrics: {
    method: string
    route: string
    duration: number
    statusCode: number
    timestamp: Date
  }) {
    // Store for performance analytics
    console.log('Response time metrics:', metrics)
  }

  // Store error metrics
  private storeErrorMetrics(metrics: {
    method: string
    url: string
    statusCode: number
    error: string
    stack?: string
    timestamp: Date
  }) {
    // Store for error monitoring
    console.log('Error metrics:', metrics)
  }

  // Get performance statistics
  async getPerformanceStats(timeRange: 'hour' | 'day' | 'week' = 'hour') {
    const now = new Date()
    const ranges = {
      hour: new Date(now.getTime() - 60 * 60 * 1000),
      day: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    const cutoff = ranges[timeRange]
    
    // Filter metrics within time range
    const recentMetrics = Array.from(this.metrics.values())
      .filter(m => m.startTime >= cutoff.getTime())

    if (recentMetrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        errorRate: 0,
        cacheHitRate: 0
      }
    }

    const totalRequests = recentMetrics.length
    const completedRequests = recentMetrics.filter(m => m.duration !== undefined)
    const averageResponseTime = completedRequests.reduce((sum, m) => sum + (m.duration || 0), 0) / completedRequests.length
    const slowRequests = completedRequests.filter(m => (m.duration || 0) > this.slowRequestThreshold).length
    const errorRequests = recentMetrics.filter(m => m.statusCode && m.statusCode >= 400).length
    const cacheHits = recentMetrics.filter(m => m.cacheHit === true).length

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowRequests,
      errorRate: Math.round((errorRequests / totalRequests) * 100),
      cacheHitRate: Math.round((cacheHits / totalRequests) * 100),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    }
  }

  // Health check for performance monitoring
  healthCheck() {
    const memoryUsage = process.memoryUsage()
    const memoryUsagePercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100

    return {
      status: memoryUsagePercent > 90 ? 'warning' : 'healthy',
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        percentage: Math.round(memoryUsagePercent)
      },
      uptime: `${Math.round(process.uptime())}s`,
      activeRequests: this.metrics.size
    }
  }

  // Cleanup old metrics
  cleanup() {
    const cutoff = Date.now() - (60 * 60 * 1000) // 1 hour ago
    
    for (const [requestId, metrics] of this.metrics.entries()) {
      if (metrics.startTime < cutoff) {
        this.metrics.delete(requestId)
      }
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
export default performanceMonitor
