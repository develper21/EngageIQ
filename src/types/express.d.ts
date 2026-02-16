import { Request } from 'express'
import { JWTPayload } from '../middleware/auth'

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export {}
