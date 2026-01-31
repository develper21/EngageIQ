import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import compression from 'compression'
import { prisma } from './lib/prisma'
import authRoutes from './routes/auth'
import socialRoutes from './routes/social'
import analyticsRoutes from './routes/analytics'
import apiRoutes from './routes/api'

// Import security middlewares
import { securityMiddleware, corsMiddleware, additionalSecurityMiddleware } from './middleware/security'
import { apiLimiter, authLimiter, socialApiLimiter, reportLimiter } from './middleware/rateLimiter'
import { validate, sanitize } from './middleware/validation'
import { auditLog, securityLog, errorLog, performanceLog } from './middleware/audit'

// Import performance optimization middlewares
import { cacheMiddleware, smartCacheMiddleware, cacheStatsMiddleware, analyticsCacheMiddleware, socialMediaCacheMiddleware } from './middleware/cache'
import performanceMonitor from './middleware/performance'
import { db } from './lib/database'
import { queueService } from './lib/queue'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security Middleware (order matters!)
app.use(securityMiddleware)
app.use(corsMiddleware)
app.use(additionalSecurityMiddleware)
app.use(performanceLog)

// Performance Optimization Middleware
app.use(compression({ level: 6, threshold: 1024 }))
app.use(performanceMonitor.middleware())
app.use(performanceMonitor.memoryMonitor())

// Basic middleware
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(sanitize)

// Rate limiting
app.use('/api/', apiLimiter)
app.use('/api/auth/', authLimiter)
app.use('/api/social/', socialApiLimiter)

// Security logging for sensitive routes
app.use('/api/auth/', securityLog('AUTH_ATTEMPT', 'medium'))
app.use('/api/social/', securityLog('SOCIAL_API_ACCESS', 'low'))

// Routes with audit logging and caching
app.use('/api/auth', auditLog('AUTH', 'AUTHENTICATION'), authRoutes)
app.use('/api/social', auditLog('SOCIAL', 'SOCIAL_MEDIA'), socialMediaCacheMiddleware({}), socialRoutes)
app.use('/api/analytics', auditLog('ANALYTICS', 'DATA_ANALYTICS'), analyticsCacheMiddleware({}), analyticsRoutes)
app.use('/api', auditLog('API', 'API_INTEGRATION'), apiRoutes)

// Health check (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Metrics endpoint (for monitoring)
app.get('/api/metrics', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Enhanced error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Log the error
  errorLog(err, req)
  
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const errorResponse = {
    error: isDevelopment ? err.message : 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: err.stack })
  }
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      ...errorResponse,
      error: 'Validation failed',
      details: err.details
    })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      ...errorResponse,
      error: 'Unauthorized access'
    })
  }
  
  res.status(err.status || 500).json(errorResponse)
})

// 404 handler with audit logging
app.use((req, res) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`)
  errorLog(error, req)
  
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString()
  })
})

// Start server with performance optimizations
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔒 Security features enabled`)
  
  // Initialize database optimizations
  try {
    await db.createIndexes()
    console.log('📈 Database indexes created')
  } catch (error) {
    console.error('❌ Database optimization failed:', error)
  }
  
  // Initialize queue service
  try {
    queueService.schedulePeriodicJobs()
    console.log('⚡ Background jobs scheduled')
  } catch (error) {
    console.error('❌ Queue initialization failed:', error)
  }
  
  // Performance monitoring
  setInterval(() => {
    performanceMonitor.cleanup()
  }, 60000) // Cleanup every minute
  
  console.log('✅ Performance optimizations enabled')
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

export default app
