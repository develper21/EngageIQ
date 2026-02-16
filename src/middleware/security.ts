import helmet from 'helmet'
import cors from 'cors'
import { Request, Response, NextFunction } from 'express'

// Security headers middleware
export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.twitter.com", "https://graph.instagram.com", "https://www.googleapis.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      childSrc: ["'none'"],
      workerSrc: ["'self'"],
      manifestSrc: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true
})

// CORS configuration
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://engageiq.com', 'https://app.engageiq.com', 'https://www.engageiq.com']
      : ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:5173']
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'X-CSRF-Token',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
})

// Additional security middleware
export const additionalSecurityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Remove server information
  res.removeHeader('X-Powered-By')
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  
  // Rate limiting headers
  res.setHeader('X-RateLimit-Limit', '100')
  res.setHeader('X-RateLimit-Remaining', '99')
  res.setHeader('X-RateLimit-Reset', new Date(Date.now() + 15 * 60 * 1000).toISOString())
  
  next()
}

// IP whitelist middleware (optional for admin routes)
export const ipWhitelistMiddleware = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.socket?.remoteAddress || req.headers['x-forwarded-for'] as string
    
    if (!clientIP || !allowedIPs.includes(clientIP)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Your IP address is not authorized to access this resource'
      })
    }
    
    next()
  }
}

// API key validation middleware
export const apiKeyValidation = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string
  const validApiKey = process.env.API_KEY
  
  if (!validApiKey) {
    // If no API key is set in environment, skip validation (for development)
    return next()
  }
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Invalid API key',
      message: 'A valid API key is required to access this resource'
    })
  }
  
  next()
}

export default {
  securityMiddleware,
  corsMiddleware,
  additionalSecurityMiddleware,
  ipWhitelistMiddleware,
  apiKeyValidation
}
