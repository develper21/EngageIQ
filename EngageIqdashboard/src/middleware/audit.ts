import winston from 'winston'
import { Request, Response, NextFunction } from 'express'

// Configure audit logger
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}] AUDIT: ${message} ${JSON.stringify(meta)}`
    })
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/audit.log',
      maxsize: 5242880, // 5MB
      maxFiles: 10
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

interface AuditLog {
  userId?: string
  action: string
  resource: string
  resourceId?: string
  ipAddress?: string | undefined
  userAgent?: string
  oldValues?: any
  newValues?: any
  timestamp: Date
  statusCode?: number
  method?: string
  url?: string
  duration?: number
}

export const auditLog = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send
    const startTime = Date.now()
    
    res.send = function(data: any) {
      // Log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const auditData: AuditLog = {
          userId: (req as any).user?.userId,
          action,
          resource,
          resourceId: req.params.id as string,
          ipAddress: req.ip || req.socket?.remoteAddress || (() => {
            const xff = req.headers['x-forwarded-for']
            return Array.isArray(xff) ? xff[0] : xff
          })(),
          userAgent: req.get('User-Agent'),
          oldValues: req.body.oldValues,
          newValues: req.body.newValues,
          timestamp: new Date(),
          statusCode: res.statusCode,
          method: req.method,
          url: req.originalUrl,
          duration: Date.now() - startTime
        }
        
        auditLogger.info(`${action} on ${resource}`, auditData)
      }
      
      return originalSend.call(this, data)
    }
    
    next()
  }
}

// Security event logging
export const securityLog = (event: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const securityData = {
      event,
      severity,
      userId: (req as any).user?.userId,
      ipAddress: req.ip || req.socket?.remoteAddress || (() => {
            const xff = req.headers['x-forwarded-for']
            return Array.isArray(xff) ? xff[0] : xff
          })(),
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date(),
      headers: {
        'user-agent': req.get('User-Agent'),
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'referer': req.get('Referer')
      }
    }
    
    if (severity === 'critical' || severity === 'high') {
      auditLogger.warn(`SECURITY: ${event}`, securityData)
    } else {
      auditLogger.info(`SECURITY: ${event}`, securityData)
    }
    
    next()
  }
}

// Error logging
export const errorLog = (error: Error, req: Request) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    userId: (req as any).user?.userId,
    ipAddress: req.ip || req.socket?.remoteAddress || (() => {
            const xff = req.headers['x-forwarded-for']
            return Array.isArray(xff) ? xff[0] : xff
          })(),
    userAgent: req.get('User-Agent'),
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    headers: req.headers,
    timestamp: new Date()
  }
  
  auditLogger.error('APPLICATION_ERROR', errorData)
}

// Performance logging
export const performanceLog = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - startTime
    
    const perfData = {
      url: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      userId: (req as any).user?.userId,
      timestamp: new Date()
    }
    
    // Log slow requests
    if (duration > 1000) {
      auditLogger.warn('SLOW_REQUEST', perfData)
    } else if (duration > 500) {
      auditLogger.info('PERFORMANCE', perfData)
    }
  })
  
  next()
}

export default {
  auditLog,
  securityLog,
  errorLog,
  performanceLog
}
