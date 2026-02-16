import { PrismaClient } from '@prisma/client'

class DatabaseService {
  private prisma: PrismaClient
  private static instance: DatabaseService

  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty',
    })

    this.setupConnection()
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  private setupConnection() {
    this.prisma.$connect()
      .then(() => console.log('Database connected successfully'))
      .catch((error) => console.error('Database connection failed:', error))

    // Graceful shutdown
    process.on('beforeExit', async () => {
      await this.prisma.$disconnect()
    })
  }

  get client(): PrismaClient {
    return this.prisma
  }

  // Database optimization methods
  async createIndexes() {
    console.log('Creating database indexes for performance optimization...')

    try {
      // Analytics table indexes
      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_analytics_user_platform_date 
        ON analytics(user_id, platform, date DESC);
      `

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_analytics_user_metric_type 
        ON analytics(user_id, metric_type, date DESC);
      `

      // Instagram posts indexes
      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_instagram_posts_account_timestamp 
        ON instagram_posts(account_id, timestamp DESC);
      `

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_instagram_posts_likes_count 
        ON instagram_posts(likes_count DESC);
      `

      // YouTube videos indexes
      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_youtube_videos_account_published 
        ON youtube_videos(account_id, published_at DESC);
      `

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_youtube_videos_views_count 
        ON youtube_videos(views_count DESC);
      `

      // Twitter tweets indexes
      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_twitter_tweets_account_created 
        ON twitter_tweets(account_id, created_at DESC);
      `

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_twitter_tweets_retweets_count 
        ON twitter_tweets(retweet_count DESC);
      `

      // User indexes
      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_users_email 
        ON users(email);
      `

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_users_created_at 
        ON users(created_at DESC);
      `

      // Social account indexes
      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS idx_social_accounts_user_platform 
        ON social_media_accounts(user_id, platform);
      `

      console.log('Database indexes created successfully')
    } catch (error) {
      console.error('Error creating database indexes:', error)
    }
  }

  // Query optimization methods
  async getAnalyticsWithOptimization(
    userId: string,
    platform?: string,
    startDate?: Date,
    endDate?: Date,
    limit = 100,
    offset = 0
  ) {
    const where: any = { userId }

    if (platform) {
      where.platform = platform
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = startDate
      if (endDate) where.date.lte = endDate
    }

    // Optimized query with proper indexing
    const [analytics, totalCount] = await Promise.all([
      this.prisma.analytics.findMany({
        where,
        orderBy: [
          { date: 'desc' },
          { platform: 'asc' }
        ],
        select: {
          id: true,
          platform: true,
          metricType: true,
          value: true,
          date: true,
          // Select only necessary fields to reduce payload
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.analytics.count({ where })
    ])

    return {
      data: analytics,
      pagination: {
        total: totalCount,
        page: Math.floor(offset / limit) + 1,
        pages: Math.ceil(totalCount / limit),
        limit,
        offset
      }
    }
  }

  async getRecentPostsOptimized(userId: string, platform?: string, limit = 20) {
    const where: any = {}

    if (platform) {
      where.platform = platform
    }

    // Use raw queries for better performance on large datasets
    switch (platform) {
      case 'instagram':
        return await this.prisma.$queryRaw`
          SELECT 
            ip.id,
            ip.caption,
            ip.likes_count,
            ip.comments_count,
            ip.timestamp,
            ip.media_url,
            ia.username,
            ia.profile_image_url
          FROM instagram_posts ip
          JOIN instagram_accounts ia ON ip.account_id = ia.id
          WHERE ia.user_id = ${userId}
          ORDER BY ip.timestamp DESC
          LIMIT ${limit}
        `

      case 'youtube':
        return await this.prisma.$queryRaw`
          SELECT 
            yv.id,
            yv.title,
            yv.description,
            yv.views_count,
            yv.likes_count,
            yv.comments_count,
            yv.published_at,
            yv.thumbnail_url,
            ya.channel_name
          FROM youtube_videos yv
          JOIN youtube_accounts ya ON yv.account_id = ya.id
          WHERE ya.user_id = ${userId}
          ORDER BY yv.published_at DESC
          LIMIT ${limit}
        `

      case 'twitter':
        return await this.prisma.$queryRaw`
          SELECT 
            tt.id,
            tt.text,
            tt.retweet_count,
            tt.like_count,
            tt.created_at,
            ta.username,
            ta.profile_image_url
          FROM twitter_tweets tt
          JOIN twitter_accounts ta ON tt.account_id = ta.id
          WHERE ta.user_id = ${userId}
          ORDER BY tt.created_at DESC
          LIMIT ${limit}
        `

      default:
        // Get posts from all platforms
        const [instagramPosts, youtubeVideos, twitterTweets] = await Promise.all([
          this.getRecentPostsOptimized(userId, 'instagram', Math.ceil(limit / 3)),
          this.getRecentPostsOptimized(userId, 'youtube', Math.ceil(limit / 3)),
          this.getRecentPostsOptimized(userId, 'twitter', Math.ceil(limit / 3))
        ])

        return [
          ...instagramPosts.map(post => ({ ...post, platform: 'instagram' })),
          ...youtubeVideos.map(video => ({ ...video, platform: 'youtube' })),
          ...twitterTweets.map(tweet => ({ ...tweet, platform: 'twitter' }))
        ].sort((a, b) => new Date(b.timestamp || b.published_at || b.created_at).getTime() - 
                         new Date(a.timestamp || a.published_at || a.created_at).getTime())
         .slice(0, limit)
    }
  }

  // Batch operations for better performance
  async batchInsertAnalytics(data: any[]) {
    if (data.length === 0) return

    try {
      // Use Prisma's createMany for bulk insertion
      await this.prisma.analytics.createMany({
        data,
        skipDuplicates: true
      })
      console.log(`Batch inserted ${data.length} analytics records`)
    } catch (error) {
      console.error('Error in batch insert analytics:', error)
      throw error
    }
  }

  async batchUpdateSocialMediaData(platform: string, data: any[]) {
    if (data.length === 0) return

    try {
      switch (platform) {
        case 'instagram':
          await this.prisma.instagramPost.createMany({
            data,
            skipDuplicates: true
          })
          break
        case 'youtube':
          await this.prisma.youTubeVideo.createMany({
            data,
            skipDuplicates: true
          })
          break
        case 'twitter':
          await this.prisma.twitterTweet.createMany({
            data,
            skipDuplicates: true
          })
          break
      }
      console.log(`Batch inserted ${data.length} ${platform} records`)
    } catch (error) {
      console.error(`Error in batch insert ${platform}:`, error)
      throw error
    }
  }

  // Database cleanup and maintenance
  async cleanupOldData(daysToKeep = 90) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    try {
      // Clean up old analytics data
      const deletedAnalytics = await this.prisma.analytics.deleteMany({
        where: {
          date: {
            lt: cutoffDate
          }
        }
      })

      // Clean up old posts (keep more recent ones)
      const deletedInstagramPosts = await this.prisma.instagramPost.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      })

      const deletedYouTubeVideos = await this.prisma.youTubeVideo.deleteMany({
        where: {
          publishedAt: {
            lt: cutoffDate
          }
        }
      })

      const deletedTwitterTweets = await this.prisma.twitterTweet.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      })

      console.log('Database cleanup completed:', {
        deletedAnalytics: deletedAnalytics.count,
        deletedInstagramPosts: deletedInstagramPosts.count,
        deletedYouTubeVideos: deletedYouTubeVideos.count,
        deletedTwitterTweets: deletedTwitterTweets.count
      })

      return {
        deletedAnalytics: deletedAnalytics.count,
        deletedInstagramPosts: deletedInstagramPosts.count,
        deletedYouTubeVideos: deletedYouTubeVideos.count,
        deletedTwitterTweets: deletedTwitterTweets.count
      }
    } catch (error) {
      console.error('Error during database cleanup:', error)
      throw error
    }
  }

  // Database health check
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      
      const [userCount, analyticsCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.analytics.count()
      ])

      return {
        status: 'healthy',
        details: {
          connected: true,
          userCount,
          analyticsCount,
          timestamp: new Date().toISOString()
        }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }
    }
  }

  // Performance monitoring
  async getDatabaseStats() {
    try {
      const [
        userCount,
        analyticsCount,
        instagramAccounts,
        youtubeAccounts,
        twitterAccounts,
        instagramPosts,
        youtubeVideos,
        twitterTweets
      ] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.analytics.count(),
        this.prisma.instagramAccount.count(),
        this.prisma.youTubeAccount.count(),
        this.prisma.twitterAccount.count(),
        this.prisma.instagramPost.count(),
        this.prisma.youTubeVideo.count(),
        this.prisma.twitterTweet.count()
      ])

      return {
        users: userCount,
        analytics: analyticsCount,
        socialAccounts: {
          instagram: instagramAccounts,
          youtube: youtubeAccounts,
          twitter: twitterAccounts
        },
        posts: {
          instagram: instagramPosts,
          youtube: youtubeVideos,
          twitter: twitterTweets
        },
        totalPosts: instagramPosts + youtubeVideos + twitterTweets
      }
    } catch (error) {
      console.error('Error getting database stats:', error)
      throw error
    }
  }

  // Connection pool management
  async getConnectionPoolStats() {
    try {
      const poolStats = await this.prisma.$queryRaw`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `

      return poolStats
    } catch (error) {
      console.error('Error getting connection pool stats:', error)
      return null
    }
  }

  // Graceful shutdown
  async disconnect() {
    await this.prisma.$disconnect()
    console.log('Database disconnected')
  }
}

export const db = DatabaseService.getInstance()
export default DatabaseService
