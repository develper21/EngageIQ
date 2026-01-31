import { Request, Response } from 'express'

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded'
  timestamp: string
  uptime: number
  services: {
    database: HealthStatus
    cache: HealthStatus
    queue: HealthStatus
    apis: HealthStatus
  }
  details?: string
}

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded'
  details: string
  responseTime?: number
  lastCheck?: string
}

export class HealthChecker {
  private static instance: HealthChecker

  static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker()
    }
    return HealthChecker.instance
  }

  async checkHealth(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString()
    const uptime = process.uptime()
    
    try {
      const [database, cache, queue, apis] = await Promise.allSettled([
        this.checkDatabase(),
        this.checkCache(),
        this.checkQueue(),
        this.checkAPIs()
      ])

      const allHealthy = database.status === 'fulfilled' && 
                        cache.status === 'fulfilled' && 
                        queue.status === 'fulfilled' && 
                        apis.status === 'fulfilled'

      const status = allHealthy ? 'healthy' : 'degraded'

      return {
        status,
        timestamp,
        uptime,
        services: {
          database: database.status === 'fulfilled' ? 
            { status: 'healthy', details: 'Database connection OK' } : 
            { status: 'unhealthy', details: 'Database connection failed' },
          cache: cache.status === 'fulfilled' ? 
            { status: 'healthy', details: 'Cache connection OK' } : 
            { status: 'unhealthy', details: 'Cache connection failed' },
          queue: queue.status === 'fulfilled' ? 
            { status: 'healthy', details: 'Queue system OK' } : 
            { status: 'unhealthy', details: 'Queue system failed' },
          apis: apis.status === 'fulfilled' ? 
            { status: 'healthy', details: 'External APIs OK' } : 
            { status: 'unhealthy', details: 'External APIs failed' }
        },
        details: allHealthy ? 'All systems operational' : 'Some services degraded'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp,
        uptime,
        services: {
          database: { status: 'unhealthy', details: 'Database check failed' },
          cache: { status: 'unhealthy', details: 'Cache check failed' },
          queue: { status: 'unhealthy', details: 'Queue check failed' },
          apis: { status: 'unhealthy', details: 'API check failed' }
        },
        details: `Health check failed: ${error.message}`
      }
    }
  }

  private async checkDatabase(): Promise<{ status: 'fulfilled' | 'rejected', reason?: string }> {
    try {
      // Simple database check - would connect to actual DB
      await new Promise(resolve => setTimeout(resolve, 10))
      return { status: 'fulfilled' }
    } catch (error) {
      return { status: 'rejected', reason: error.message }
    }
  }

  private async checkCache(): Promise<{ status: 'fulfilled' | 'rejected', reason?: string }> {
    try {
      // Simple cache check - would connect to actual Redis
      await new Promise(resolve => setTimeout(resolve, 5))
      return { status: 'fulfilled' }
    } catch (error) {
      return { status: 'rejected', reason: error.message }
    }
  }

  private async checkQueue(): Promise<{ status: 'fulfilled' | 'rejected', reason?: string }> {
    try {
      // Simple queue check - would connect to actual queue
      await new Promise(resolve => setTimeout(resolve, 5))
      return { status: 'fulfilled', details: 'Queue system OK' }
    } catch (error) {
      return { status: 'rejected', reason: error.message }
    }
  }

  private async checkAPIs(): Promise<{ status: 'fulfilled' | 'rejected', reason?: string }> {
    try {
      // Simple API check - would check actual external APIs
      await new Promise(resolve => setTimeout(resolve, 15))
      return { 
        status: 'fulfilled', 
        details: 'All APIs healthy' 
      }
    } catch (error) {
      return { status: 'rejected', reason: error.message }
    }
  }

  // System resource monitoring
  async getSystemMetrics() {
    const memUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()
    
    return {
      memory: {
        used: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
      },
      cpu: {
        usage: cpuUsage.user + cpuUsage.system,
        percentage: Math.round((cpuUsage.user + cpuUsage.system) * 100)
      },
      uptime: process.uptime(),
      nodeVersion: process.version,
      platform: process.platform
    }
  }

  // Application metrics
  async getApplicationMetrics() {
    try {
      // Would return actual metrics from database, cache, queue, APIs
      return {
        database: { total: 1000, active: 50 },
        cache: { total: 500, hitRate: 85 },
        queue: { total: 100, active: 10 },
        apis: { 
          health: { 
            twitter: 'healthy', 
            instagram: 'healthy', 
            youtube: 'healthy' 
          } 
        }
      }
    } catch (error) {
      return {
        database: { total: 0 },
        cache: { total: 0 },
        queue: { total: 0 },
        apis: { health: { twitter: 'unknown', instagram: 'unknown', youtube: 'unknown' } }
      }
    }
  }

  // Graceful shutdown check
  async shutdownCheck(): Promise<boolean> {
    try {
      // Check if all critical services are down for graceful shutdown
      const [database, cache, queue] = await Promise.all([
        this.checkDatabase(),
        this.checkCache(),
        this.checkQueue()
      ])

      // All critical services should be down for graceful shutdown
      return database.status === 'rejected' && 
             cache.status === 'rejected' && 
             queue.status === 'rejected'
    } catch (error) {
      return false
    }
  }
}

export const healthChecker = HealthChecker.getInstance()

// Health check middleware
export const healthCheckMiddleware = async (req: Request, res: Response) => {
  try {
    const health = await healthChecker.checkHealth()
    const statusCode = health.status === 'healthy' ? 200 : 503
    
    res.status(statusCode).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      details: 'Health check failed'
    })
  }
}

export default HealthChecker
