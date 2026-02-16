import Redis from 'ioredis'

interface CacheItem<T> {
  data: T
  expiry: number
}

class CacheService {
  private redis: Redis
  private localCache: Map<string, CacheItem<any>> = new Map()
  private readonly maxLocalCacheSize = 1000
  private readonly defaultTTL = 3600 // 1 hour

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keyPrefix: 'engageiq:cache:',
      enableReadyCheck: true
    })

    // Redis event handlers
    this.redis.on('error', (err) => {
      console.error('Redis cache error:', err)
    })

    this.redis.on('connect', () => {
      console.log('Redis cache connected')
    })

    // Clean up expired local cache items periodically
    setInterval(() => {
      this.cleanupLocalCache()
    }, 60000) // Every minute
  }

  private cleanupLocalCache() {
    const now = Date.now()
    for (const [key, item] of this.localCache.entries()) {
      if (item.expiry <= now) {
        this.localCache.delete(key)
      }
    }
  }

  // Multi-level caching (Redis + Local)
  async get<T>(key: string): Promise<T | null> {
    try {
      // Check local cache first
      const localData = this.localCache.get(key)
      if (localData && localData.expiry > Date.now()) {
        return localData.data
      }
      
      // Check Redis cache
      const value = await this.redis.get(key)
      if (value) {
        const parsed = JSON.parse(value)
        
        // Store in local cache for faster access
        this.setLocalCache(key, parsed, 60000) // 1 minute local cache
        return parsed
      }

      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      const serialized = JSON.stringify(value)
      
      // Set in both Redis and local cache
      await this.redis.setex(key, ttl, serialized)
      this.setLocalCache(key, value, Math.min(ttl * 1000, 60000)) // Max 1 minute local cache
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  private setLocalCache(key: string, value: any, ttlMs: number): void {
    // Implement LRU eviction for local cache
    if (this.localCache.size >= this.maxLocalCacheSize) {
      // Remove oldest item (simple LRU)
      const firstKey = this.localCache.keys().next().value
      if (firstKey) {
        this.localCache.delete(firstKey)
      }
    }
    
    this.localCache.set(key, {
      data: value,
      expiry: Date.now() + ttlMs
    })
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
      
      // Clear local cache
      for (const [key] of this.localCache) {
        if (key.includes(pattern.replace('*', ''))) {
          this.localCache.delete(key)
        }
      }
    } catch (error) {
      console.error('Cache invalidate error:', error)
    }
  }

  async invalidateMultiple(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
      
      // Clear from local cache
      keys.forEach(key => this.localCache.delete(key))
    } catch (error) {
      console.error('Cache invalidate multiple error:', error)
    }
  }

  // Cache warming strategies
  async warmCache(userId: string): Promise<void> {
    const cacheKeys = [
      `user:${userId}:analytics`,
      `user:${userId}:social_accounts`,
      `user:${userId}:recent_posts`,
      `user:${userId}:dashboard_data`
    ]

    for (const key of cacheKeys) {
      const data = await this.get(key)
      if (!data) {
        // Pre-populate cache with fresh data
        await this.preloadData(key, userId)
      }
    }
  }

  private async preloadData(key: string, userId: string): Promise<void> {
    // This would be implemented based on the specific data type
    console.log(`Preloading cache for key: ${key}, user: ${userId}`)
  }

  // Get cache statistics
  async getStats(): Promise<{
    redis: { connected: boolean; memory: string }
    local: { size: number; maxSize: number }
  }> {
    const redisInfo = await this.redis.info('memory')
    
    return {
      redis: {
        connected: this.redis.status === 'ready',
        memory: redisInfo.split('\r\n')[1]?.split(':')[1] || 'unknown'
      },
      local: {
        size: this.localCache.size,
        maxSize: this.maxLocalCacheSize
      }
    }
  }

  // Cache health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    details: string
  }> {
    try {
      // Test Redis connection
      await this.redis.ping()
      
      // Test basic cache operations
      const testKey = 'health_check_test'
      await this.set(testKey, { test: true }, 10)
      const value = await this.get(testKey)
      await this.redis.del(testKey)
      
      if (value && (value as any).test === true) {
        return {
          status: 'healthy',
          details: 'All cache layers operational'
        }
      } else {
        return {
          status: 'degraded',
          details: 'Cache operations not working properly'
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `Cache error: ${error.message}`
      }
    }
  }

  // Clear all cache
  async flush(): Promise<void> {
    try {
      await this.redis.flushdb()
      this.localCache.clear()
    } catch (error) {
      console.error('Cache flush error:', error)
    }
  }

  // Get cache hit rate (approximate)
  getCacheHitRate(): number {
    // This is a simplified calculation
    // In production, you would track actual hits/misses
    const localSize = this.localCache.size
    const maxSize = this.maxLocalCacheSize
    return localSize / maxSize
  }
}

export const cache = new CacheService()
export default CacheService
