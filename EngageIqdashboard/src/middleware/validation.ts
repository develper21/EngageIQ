import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

// User registration schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
})

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// Social media account schema
export const socialAccountSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional()
})

// Analytics query schema
export const analyticsQuerySchema = z.object({
  platform: z.enum(['twitter', 'instagram', 'youtube', 'all']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  metricType: z.string().optional()
})

// Report creation schema
export const reportSchema = z.object({
  title: z.string().min(1, 'Report title is required'),
  type: z.enum(['weekly', 'monthly', 'custom']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  data: z.any().optional()
})

// User profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  preferences: z.object({
    timezone: z.string().optional(),
    emailNotifications: z.boolean().optional(),
    reportFrequency: z.enum(['daily', 'weekly', 'monthly']).optional()
  }).optional()
})

// Validation middleware factory
export const validate = (schema: z.ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = source === 'body' ? req.body : 
                           source === 'query' ? req.query : 
                           req.params
      
      schema.parse(dataToValidate)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        })
      }
      next(error)
    }
  }
}

// Sanitization middleware
export const sanitize = (req: Request, res: Response, next: NextFunction) => {
  // Basic XSS prevention
  const sanitizeString = (str: string): string => {
    return str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj)
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject)
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value)
      }
      return sanitized
    }
    return obj
  }

  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }

  next()
}

export default {
  validate,
  sanitize,
  registerSchema,
  loginSchema,
  socialAccountSchema,
  analyticsQuerySchema,
  reportSchema,
  profileUpdateSchema
}
