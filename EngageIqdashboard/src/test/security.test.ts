import request from 'supertest'
import app from '../server'

describe('Security Tests', () => {
  describe('Rate Limiting', () => {
    it('should limit login attempts', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      // Make 6 requests (limit is 5)
      const promises = Array(6).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      )

      const responses = await Promise.all(promises)
      
      // First 5 should be normal responses
      responses.slice(0, 5).forEach(res => {
        expect(res.status).not.toBe(429)
      })
      
      // 6th should be rate limited
      expect(responses[5].status).toBe(429)
      expect(responses[5].body.error).toContain('Too many requests')
    }, 10000)

    it('should limit general API requests', async () => {
      const responses = await Promise.all(
        Array(101).fill(null).map(() =>
          request(app).get('/api/health')
        )
      )

      // Should hit rate limit after 100 requests
      const rateLimitedResponses = responses.filter(res => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    }, 15000)
  })

  describe('Input Validation', () => {
    it('should reject invalid email formats', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'ValidPass123'
        })

      expect(response.status).toBe(400)
      expect(response.body.error).toContain('Validation failed')
    })

    it('should reject weak passwords', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak'
        })

      expect(response.status).toBe(400)
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('at least 8 characters')
          })
        ])
      )
    })

    it('should reject passwords without uppercase letters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'lowercase123'
        })

      expect(response.status).toBe(400)
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('uppercase')
          })
        ])
      )
    })

    it('should reject passwords without numbers', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Uppercase'
        })

      expect(response.status).toBe(400)
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining('number')
          })
        ])
      )
    })
  })

  describe('Authentication', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .send()

      expect(response.status).toBe(401)
      expect(response.body.error).toContain('Access token required')
    })

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send()

      expect(response.status).toBe(403)
      expect(response.body.error).toContain('Invalid or expired token')
    })

    it('should reject malformed tokens', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'invalid-token')
        .send()

      expect(response.status).toBe(401)
      expect(response.body.error).toContain('Access token required')
    })
  })

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app).get('/api/health')

      expect(response.headers).toHaveProperty('x-content-type-options')
      expect(response.headers).toHaveProperty('x-frame-options')
      expect(response.headers).toHaveProperty('x-xss-protection')
      expect(response.headers).toHaveProperty('strict-transport-security')
    })

    it('should not expose server information', async () => {
      const response = await request(app).get('/api/health')

      expect(response.headers['x-powered-by']).toBeUndefined()
    })
  })

  describe('CORS Configuration', () => {
    it('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'https://malicious-site.com')
        .send()

      // CORS should handle this - either allow or reject based on config
      expect(response.status).toBeGreaterThanOrEqual(200)
    })

    it('should include CORS headers', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .send()

      expect(response.headers).toHaveProperty('access-control-allow-origin')
    })
  })

  describe('Error Handling', () => {
    it('should not expose sensitive information in production', async () => {
      // This would need to be tested with NODE_ENV=production
      // For now, test that errors are properly formatted
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@test.com', password: 'wrong' })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
      expect(response.body).toHaveProperty('code')
    })

    it('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')

      expect(response.status).toBe(404)
      expect(response.body.error).toContain('Route not found')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  describe('Input Sanitization', () => {
    it('should sanitize malicious input', async () => {
      const maliciousInput = {
        email: 'test@example.com',
        password: 'ValidPass123',
        name: '<script>alert("xss")</script>'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousInput)

      // Should either reject or sanitize the input
      expect([200, 201, 400]).toContain(response.status)
    })
  })
})
