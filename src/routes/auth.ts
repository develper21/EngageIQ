import { Router } from 'express'
import { register, login, getProfile } from '../controllers/auth'
import { authenticateToken, refreshToken } from '../middleware/auth'
import { validate, registerSchema, loginSchema } from '../middleware/validation'

const router = Router()

// Register with validation
router.post('/register', validate(registerSchema), register)

// Login with validation and rate limiting
router.post('/login', validate(loginSchema), login)

// Refresh token
router.post('/refresh', refreshToken)

// Get profile (requires authentication)
router.get('/profile', authenticateToken, getProfile)

// Logout (requires authentication)
router.post('/logout', authenticateToken, async (req, res) => {
  // In a real implementation, you would invalidate the token
  // For now, we'll just return success
  res.json({ message: 'Logout successful' })
})

export default router
