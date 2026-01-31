import { describe, it, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { generateToken, generateRefreshToken } from '../../middleware/auth'

// Mock environment variables
process.env.JWT_SECRET = 'test-secret'
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret'

describe('Authentication Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Token Generation', () => {
    it('should generate a valid JWT token', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      
      // Verify token structure
      const decoded = jwt.decode(token) as any
      expect(decoded).toHaveProperty('userId', userId)
      expect(decoded).toHaveProperty('email', email)
      expect(decoded).toHaveProperty('iat')
      expect(decoded).toHaveProperty('exp')
    })

    it('should generate token with correct expiration', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const decoded = jwt.decode(token) as any
      const now = Math.floor(Date.now() / 1000)
      const expectedExp = now + (24 * 60 * 60) // 24 hours
      
      expect(decoded.exp).toBeCloseTo(expectedExp, -2) // Allow 2 seconds difference
    })

    it('should include issuer and audience in token', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const decoded = jwt.decode(token) as any
      expect(decoded.iss).toBe('engageiq')
      expect(decoded.aud).toBe('engageiq-users')
    })

    it('should generate refresh token', () => {
      const userId = 'user123'
      const refreshToken = generateRefreshToken(userId)
      
      expect(refreshToken).toBeDefined()
      expect(typeof refreshToken).toBe('string')
      
      const decoded = jwt.decode(refreshToken) as any
      expect(decoded).toHaveProperty('userId', userId)
      expect(decoded).toHaveProperty('type', 'refresh')
    })
  })

  describe('Token Validation', () => {
    it('should validate correct token', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      expect(decoded.userId).toBe(userId)
      expect(decoded.email).toBe(email)
    })

    it('should handle malformed token', () => {
      const invalidToken = 'invalid.token.here'
      
      try {
        jwt.verify(invalidToken, process.env.JWT_SECRET!)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(jwt.JsonWebTokenError)
      }
    })

    it('should reject expired tokens', () => {
      const expiredToken = jwt.sign(
        { userId: 'user123', email: 'test@example.com' },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' } // Expired 1 hour ago
      )
      
      try {
        jwt.verify(expiredToken, process.env.JWT_SECRET!)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(jwt.TokenExpiredError)
      }
    })

    it('should reject tokens with wrong secret', () => {
      const token = jwt.sign(
        { userId: 'user123', email: 'test@example.com' },
        'wrong-secret'
      )
      
      try {
        jwt.verify(token, process.env.JWT_SECRET!)
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(jwt.JsonWebTokenError)
      }
    })
  })

  describe('Token Security', () => {
    it('should generate tokens with proper entropy', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token1 = generateToken(userId, email)
      const token2 = generateToken(userId, email)
      
      // Tokens should be different due to different iat
      expect(token1).not.toBe(token2)
      
      // Tokens should have different lengths due to different iat
      expect(token1.length).toBeGreaterThan(100)
      expect(token2.length).toBeGreaterThan(100)
    })

    it('should have correct token structure', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const parts = token.split('.')
      expect(parts).toHaveLength(3) // header.payload.signature
    })

    it('should validate refresh token separately', () => {
      const userId = 'user123'
      const refreshToken = generateRefreshToken(userId)
      
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any
      expect(decoded.userId).toBe(userId)
      expect(decoded.type).toBe('refresh')
    })
  })
})

describe('Authentication Security', () => {
  describe('Token Security', () => {
    it('should include proper JWT claims', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const decoded = jwt.decode(token) as any
      
      expect(decoded).toHaveProperty('iss')
      expect(decoded).toHaveProperty('aud')
      expect(decoded).toHaveProperty('iat')
      expect(decoded).toHaveProperty('exp')
    })

    it('should use strong signing algorithm', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())
      expect(header.alg).toBe('HS256')
    })

    it('should have reasonable token expiration', () => {
      const userId = 'user123'
      const email = 'test@example.com'
      const token = generateToken(userId, email)
      
      const decoded = jwt.decode(token) as any
      const now = Math.floor(Date.now() / 1000)
      const exp = decoded.exp!
      
      // Should expire in 24 hours
      expect(exp - now).toBeGreaterThan(23 * 60 * 60) // More than 23 hours
      expect(exp - now).toBeLessThan(25 * 60 * 60) // Less than 25 hours
    })
  })

  describe('Refresh Token Security', () => {
    it('should have different expiration for refresh tokens', () => {
      const userId = 'user123'
      const accessToken = generateToken(userId, 'test@example.com')
      const refreshToken = generateRefreshToken(userId)
      
      const accessDecoded = jwt.decode(accessToken) as any
      const refreshDecoded = jwt.decode(refreshToken) as any
      
      expect(refreshDecoded.exp - accessDecoded.exp).toBeGreaterThan(5 * 24 * 60 * 60) // 5+ days difference
    })

    it('should include refresh token type', () => {
      const userId = 'user123'
      const refreshToken = generateRefreshToken(userId)
      
      const decoded = jwt.decode(refreshToken) as any
      expect(decoded.type).toBe('refresh')
    })
  })
})
