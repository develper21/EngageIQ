import { Router } from 'express'
import { register, login, getProfile } from '../controllers/auth'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Register
router.post('/register', register)

// Login
router.post('/login', login)

// Get profile
router.get('/profile', authenticateToken, getProfile)

export default router
