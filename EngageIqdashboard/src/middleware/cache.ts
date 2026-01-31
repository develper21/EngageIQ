import { Request, Response, NextFunction } from 'express'
import { cache } from '../lib/cache'

interface CacheOptions {
  ttl?: number
  keyGenerator?: (req: Request) => string
  condition?: (req: Request) => boolean
  tags?: string[]
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const { ttl = 300, keyGenerator, condition, tags = [] } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for POST/PUT/DELETE requests
    if (!['GET', 'HEAD'].includes(req.method)) {
      return next()
    }

    // Apply custom condition if provided
    if (condition && !condition(req)) {
      return next()
    }

    const cacheKey = keyGenerator 
      ? keyGenerator(req) 
      : `cache:${req.originalUrl}:${req.user?.userId || 'anonymous'}`

    try {
      const cachedData = await cache.get(cacheKey)
      
      if (cachedData) {
        res.set('X-Cache', 'HIT')
        res.set('X-Cache-TTL', (cachedData as any).ttl?.toString() || '0')
        res.set('X-Cache-Tags', tags.join(','))
        return res.json(cachedData)
      }

      // Override res.json to cache the response
      const originalJson = res.json
      res.json = function(data: any) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cache.set(cacheKey, { data, ttl: Date.now() + (ttl as number) * 1000 }, ttl as number)
          res.set('X-Cache', 'MISS')
          res.set('X-Cache-TTL', (ttl as number).toString())
          res.set('X-Cache-Tags', tags.join(','))
        }
        return originalJson.call(this, data)
      }

      next()
    } catch (error) {
      console.error('Cache middleware error:', error)
      next()
    }
  }
}

// Intelligent cache middleware with different strategies
export const smartCacheMiddleware = (options: {
  strategy?: 'aggressive' | 'moderate' | 'light'
  endpoint?: string
} = {}) => {
  const { strategy = 'moderate', endpoint } = options

  return cacheMiddleware({
    ttl: strategy === 'aggressive' ? 1800 : strategy === 'light' ? 300 : 600,
    keyGenerator: (req: Request) => {
      const baseKey = endpoint || req.route?.path || req.path
      const userId = req.user?.userId || 'anonymous'
      const queryParams = new URLSearchParams(req.url.split('?')[1] || '').toString()
      return `${baseKey}:${userId}:${queryParams}`
    },
    condition: (req) => {
      // Don't cache if there are query parameters that suggest real-time data
      const realtimeParams = ['refresh', 'force', 'live', 'realtime']
      const hasRealtimeParams = realtimeParams.some(param => 
        req.url.includes(param)
      )
      
      return !hasRealtimeParams
    },
    tags: [strategy]
  })
}

// Cache warming middleware
export const cacheWarmupMiddleware = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Warm up cache for common patterns
    for (const pattern of patterns) {
      try {
        await cache.get(pattern)
      } catch (error) {
        console.error(`Cache warmup error for pattern ${pattern}:`, error)
      }
    }
    
    next()
  }
}

// Cache invalidation middleware
export const cacheInvalidationMiddleware = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Invalidate cache on POST/PUT/DELETE requests
    if (!['GET', 'HEAD'].includes(req.method)) {
      for (const pattern of patterns) {
        try {
          await cache.invalidate(pattern)
        } catch (error) {
          console.error(`Cache invalidation error for pattern ${pattern}:`, error)
        }
      }
    }
    
    next()
  }
}

// Cache statistics middleware
export const cacheStatsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', async () => {
    const stats = await cache.getStats()
    
    // Add cache stats to response headers for monitoring
    res.set('X-Cache-Stats-Local-Size', stats.local.size.toString())
    res.set('X-Cache-Stats-Local-Max', stats.local.maxSize.toString())
    res.set('X-Cache-Stats-Redis-Status', stats.redis.connected ? 'connected' : 'disconnected')
    res.set('X-Cache-Hit-Rate', cache.getCacheHitRate().toString())
  })
  
  next()
}

// Tag-based cache invalidation
export const tagCacheMiddleware = (tags: string[]) => {
  return cacheMiddleware({
    tags,
    keyGenerator: (req: Request) => {
      const userId = req.user?.userId || 'anonymous'
      const path = req.route?.path || req.path
      return `tag:${tags.join(':')}:${path}:${userId}`
    }
  })
}

// User-specific cache middleware
export const userCacheMiddleware = cacheMiddleware({
  ttl: 600, // 10 minutes
  keyGenerator: (req: Request) => {
    const userId = req.user?.userId
    if (!userId) return null // Skip caching for unauthenticated requests
    
    const path = req.route?.path || req.path
    const queryParams = new URLSearchParams(req.url.split('?')[1] || '').toString()
    return `user:${userId}:${path}:${queryParams}`
  },
  condition: (req) => !!req.user?.userId // Only cache for authenticated users
})

// Analytics cache middleware (longer TTL)
export const analyticsCacheMiddleware = (options: any = {}) => cacheMiddleware({
  ttl: 1800, // 30 minutes
  keyGenerator: (req: Request) => {
    const userId = req.user?.userId || 'anonymous'
    const platform = req.query.platform as string || 'all'
    const startDate = req.query.startDate as string
    const endDate = req.query.endDate as string
    
    return `analytics:${userId}:${platform}:${startDate}:${endDate}`
  }
})

// Social media cache middleware (shorter TTL for real-time data)
export const socialMediaCacheMiddleware = (options: any = {}) => cacheMiddleware({
  ttl: 300, // 5 minutes
  keyGenerator: (req: Request) => {
    const userId = req.user?.userId || 'anonymous'
    const platform = req.params.platform || req.body.platform
    const action = req.route?.path?.split('/').pop() || 'unknown'
    
    return `social:${platform}:${action}:${userId}`
  }
})

export default {
  cacheMiddleware,
  smartCacheMiddleware,
  cacheWarmupMiddleware,
  cacheInvalidationMiddleware,
  cacheStatsMiddleware,
  tagCacheMiddleware,
  userCacheMiddleware,
  analyticsCacheMiddleware,
  socialMediaCacheMiddleware
}
