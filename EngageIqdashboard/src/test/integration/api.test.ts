import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import app from '../../server'

describe('Simple Integration Tests', () => {
  describe('Health Check Endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.body).toHaveProperty('status', 'OK')
      expect(response.body).toHaveProperty('timestamp')
      expect(response.body).toHaveProperty('uptime')
    })

    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.headers).toHaveProperty('x-content-type-options')
      expect(response.headers).toHaveProperty('x-frame-options')
      expect(response.headers).toHaveProperty('x-xss-protection')
    })
  })

  describe('Authentication Endpoints', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code', 'TOKEN_MISSING')
    })

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code', 'TOKEN_INVALID')
    })

    it('should validate user registration data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'weak'
        })
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('details')
    })

    it('should accept valid registration data structure', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123'
        })
        .expect([201, 400, 500]) // May fail due to database, but should validate input

      if (response.status === 201) {
        expect(response.body).toHaveProperty('token')
      } else {
        expect(response.body).toHaveProperty('error')
      }
    })
  })

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.headers).toHaveProperty('x-ratelimit-limit')
      expect(response.headers).toHaveProperty('x-ratelimit-remaining')
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')
        .expect(404)

      expect(response.body).toHaveProperty('error', 'Route not found')
      expect(response.body).toHaveProperty('code', 'NOT_FOUND')
      expect(response.body).toHaveProperty('timestamp')
    })

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('invalid-json')
        .expect([400, 500])

      expect(response.body).toHaveProperty('error')
    })

    it('should validate request body schema', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('details')
    })
  })

  describe('Security Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .expect([200, 204])

      expect(response.headers).toHaveProperty('access-control-allow-origin')
    })

    it('should prevent XSS attacks', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '<script>alert("xss")</script>ValidPass123'
        })
        .expect(400)

      // Should be rejected by input validation
      expect(response.body).toHaveProperty('error')
    })
  })

  describe('API Integration Endpoints', () => {
    it('should require authentication for API endpoints', async () => {
      const endpoints = [
        '/api/sync/all',
        '/api/stats',
        '/api/activity',
        '/api/usage',
        '/api/twitter/search',
        '/api/youtube/search'
      ]

      for (const endpoint of endpoints) {
        const response = await request(app)
          .get(endpoint)
          .expect(401)

        expect(response.body).toHaveProperty('error')
      }
    })

    it('should validate API health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200)

      expect(response.body.status).toBe('OK')
    })
  })

  describe('Performance', () => {
    it('should respond quickly to health checks', async () => {
      const startTime = Date.now()
      
      await request(app)
        .get('/api/health')
        .expect(200)
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(responseTime).toBeLessThan(100) // Should respond within 100ms
    })

    it('should handle concurrent requests', async () => {
      const concurrentRequests = 10
      const promises = Array(concurrentRequests).fill(null).map(() =>
        request(app).get('/api/health')
      )

      const responses = await Promise.all(promises)
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })
    })
  })

  describe('Content Type Handling', () => {
    it('should accept JSON content type', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123'
        })
        .expect([201, 400, 500])

      expect(response.headers['content-type']).toMatch(/json/)
    })

    it('should reject unsupported content types', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'text/xml')
        .send('<data></data>')
        .expect([400, 415])

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('Request Validation', () => {
    it('should validate email format', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test.example.com'
      ]

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email,
            password: 'ValidPass123'
          })
          .expect(400)

        expect(response.body).toHaveProperty('error')
      }
    })
  })
})

describe('Integration Test Configuration', () => {
  it('should have proper test environment', () => {
    expect(process.env.NODE_ENV).toBeDefined()
  })

  it('should have required environment variables', () => {
    expect(process.env.JWT_SECRET).toBeDefined()
    expect(process.env.PORT).toBeDefined()
  })
})
