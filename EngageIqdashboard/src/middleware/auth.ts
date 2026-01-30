import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    
    (req as AuthRequest).user = decoded as { id: string; email: string }
    next()
  })
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}
