import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'

interface JWTPayload {
  userId: string
  email: string
  iat?: number
  exp?: number
}

interface AuthRequest extends Request {
  user?: JWTPayload
}

export const generateToken = (userId: string, email: string): string => {
  const payload: JWTPayload = { userId, email }
  
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h',
    issuer: 'engageiq',
    audience: 'engageiq-users'
  })
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
      issuer: 'engageiq',
      audience: 'engageiq-users'
    }
  )
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      code: 'TOKEN_MISSING'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET!, {
    issuer: 'engageiq',
    audience: 'engageiq-users'
  }, (err, decoded) => {
    if (err) {
      let errorMessage = 'Invalid or expired token'
      let errorCode = 'TOKEN_INVALID'
      
      if (err.name === 'TokenExpiredError') {
        errorMessage = 'Token expired'
        errorCode = 'TOKEN_EXPIRED'
      } else if (err.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token format'
        errorCode = 'TOKEN_MALFORMED'
      }
      
      return res.status(403).json({ 
        error: errorMessage,
        code: errorCode,
        details: err.message 
      })
    }
    
    req.user = decoded as JWTPayload
    next()
  })
}

// Refresh token mechanism
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  
  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'Refresh token required',
      code: 'REFRESH_TOKEN_MISSING'
    })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET!) as any
    
    if (decoded.type !== 'refresh') {
      return res.status(403).json({ 
        error: 'Invalid refresh token',
        code: 'REFRESH_TOKEN_INVALID'
      })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(403).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      })
    }

    const newAccessToken = generateToken(user.id, user.email)
    
    res.json({ 
      accessToken: newAccessToken,
      expiresIn: '24h'
    })
  } catch (error) {
    res.status(403).json({ 
      error: 'Invalid refresh token',
      code: 'REFRESH_TOKEN_EXPIRED'
    })
  }
}

// Optional authentication - doesn't fail if no token
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next() // Continue without user
  }

  jwt.verify(token, process.env.JWT_SECRET!, {
    issuer: 'engageiq',
    audience: 'engageiq-users'
  }, (err, decoded) => {
    if (!err) {
      req.user = decoded as JWTPayload
    }
    // Continue regardless of token validity
    next()
  })
}

// Role-based authentication (for future use)
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      })
    }
    
    // This would be implemented when we have roles in the database
    // For now, just pass through
    next()
  }
}

export default {
  generateToken,
  generateRefreshToken,
  authenticateToken,
  refreshToken,
  optionalAuth,
  requireRole
}
