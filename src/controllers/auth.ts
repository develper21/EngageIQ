import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { generateToken, generateRefreshToken } from '../middleware/auth'
import { encryption } from '../lib/encryption'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    // Validation is handled by middleware, but double-check
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        code: 'MISSING_FIELDS'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists',
        code: 'USER_EXISTS'
      })
    }

    // Hash password with stronger salt rounds
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    // Generate tokens
    const token = generateToken(user.id, user.email)
    const refreshToken = generateRefreshToken(user.id)

    // Store refresh token securely (in production, store in database)
    // For now, we'll include it in response (implement proper storage)

    res.status(201).json({
      message: 'User created successfully',
      user,
      token,
      refreshToken,
      expiresIn: '24h'
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific database errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'User already exists',
        code: 'DUPLICATE_EMAIL'
      })
    }
    
    res.status(500).json({ 
      error: 'Failed to create user',
      code: 'REGISTRATION_FAILED'
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      })
    }

    // Generate tokens
    const token = generateToken(user.id, user.email)
    const refreshToken = generateRefreshToken(user.id)

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    })

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      },
      token,
      refreshToken,
      expiresIn: '24h'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      error: 'Failed to login',
      code: 'LOGIN_FAILED'
    })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user
    
    if (!user || !user.userId) {
      return res.status(401).json({ 
        error: 'Invalid authentication',
        code: 'INVALID_AUTH'
      })
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!userProfile) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      })
    }

    res.json({ 
      user: userProfile,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ 
      error: 'Failed to get profile',
      code: 'PROFILE_FETCH_FAILED'
    })
  }
}
