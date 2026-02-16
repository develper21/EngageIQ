import request from 'supertest'
import app from '../server'

describe('Basic Security Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health')
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('status', 'OK')
      expect(response.body).toHaveProperty('timestamp')
    })

    it('should include security headers', async () => {
      const response = await request(app).get('/api/health')
      
      expect(response.headers).toHaveProperty('x-content-type-options')
      expect(response.headers).toHaveProperty('x-frame-options')
      expect(response.headers).toHaveProperty('x-xss-protection')
    })
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
  })

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/api/nonexistent-endpoint')

      expect(response.status).toBe(404)
      expect(response.body.error).toContain('Route not found')
      expect(response.body).toHaveProperty('timestamp')
    })
  })

  describe('Rate Limiting Headers', () => {
    it('should include rate limiting headers', async () => {
      const response = await request(app).get('/api/health')
      
      expect(response.headers).toHaveProperty('x-ratelimit-limit')
      expect(response.headers).toHaveProperty('x-ratelimit-remaining')
    })
  })
})
