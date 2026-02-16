import { twitterService } from './twitter'
import { instagramService } from './instagram'
import { youtubeService } from './youtube'
import { db } from '../lib/database'
import { queueService } from '../lib/queue'

interface SyncResult {
  platform: string
  success: boolean
  itemsProcessed: number
  errors: string[]
  duration: number
}

interface APIHealthStatus {
  twitter: { status: 'healthy' | 'unhealthy'; details: string }
  instagram: { status: 'healthy' | 'unhealthy'; details: string }
  youtube: { status: 'healthy' | 'unhealthy'; details: string }
}

class APIManager {
  private static instance: APIManager

  static getInstance(): APIManager {
    if (!APIManager.instance) {
      APIManager.instance = new APIManager()
    }
    return APIManager.instance
  }

  // Sync data for all platforms
  async syncAllPlatforms(userId: string): Promise<SyncResult[]> {
    const platforms = ['twitter', 'instagram', 'youtube']
    const results: SyncResult[] = []

    for (const platform of platforms) {
      try {
        const result = await this.syncPlatform(userId, platform)
        results.push(result)
      } catch (error) {
        results.push({
          platform,
          success: false,
          itemsProcessed: 0,
          errors: [error.message],
          duration: 0
        })
      }
    }

    return results
  }

  // Sync specific platform
  async syncPlatform(userId: string, platform: string): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
      platform,
      success: false,
      itemsProcessed: 0,
      errors: [],
      duration: 0
    }

    try {
      switch (platform) {
        case 'twitter':
          await this.syncTwitterData(userId, result)
          break
        case 'instagram':
          await this.syncInstagramData(userId, result)
          break
        case 'youtube':
          await this.syncYouTubeData(userId, result)
          break
        default:
          throw new Error(`Unsupported platform: ${platform}`)
      }

      result.success = true
    } catch (error) {
      result.errors.push(error.message)
      console.error(`Error syncing ${platform} for user ${userId}:`, error)
    }

    result.duration = Date.now() - startTime
    return result
  }

  // Sync Twitter data
  private async syncTwitterData(userId: string, result: SyncResult): Promise<void> {
    try {
      // Get user's Twitter accounts from database
      const accounts = await this.getTwitterAccounts(userId)
      
      for (const account of accounts) {
        try {
          // Fetch recent tweets
          const tweets = await twitterService.getUserTweets(account.id)
          
          // Format for database
          const formattedTweets = twitterService.formatTweetsForDB(tweets, account.id)
          
          // Store in database
          await db.batchInsertAnalytics(formattedTweets.map(tweet => ({
            userId,
            platform: 'twitter',
            metricType: 'engagement',
            value: tweet.like_count + tweet.retweet_count,
            date: new Date(tweet.created_at),
            data: {
              tweetId: tweet.id,
              text: tweet.text,
              likes: tweet.like_count,
              retweets: tweet.retweet_count,
              comments: tweet.reply_count
            }
          })))

          result.itemsProcessed += tweets.length
        } catch (error) {
          result.errors.push(`Twitter account ${account.username}: ${error.message}`)
        }
      }
    } catch (error) {
      result.errors.push(`Twitter sync error: ${error.message}`)
    }
  }

  // Sync Instagram data
  private async syncInstagramData(userId: string, result: SyncResult): Promise<void> {
    try {
      const accounts = await this.getInstagramAccounts(userId)
      
      for (const account of accounts) {
        try {
          // Fetch recent media
          const media = await instagramService.getUserMedia(account.access_token)
          
          // Format for database
          const formattedMedia = instagramService.formatMediaForDB(media, account.id)
          
          // Store in database
          await db.batchInsertAnalytics(formattedMedia.map(item => ({
            userId,
            platform: 'instagram',
            metricType: 'engagement',
            value: item.likes_count + item.comments_count,
            date: new Date(item.timestamp),
            data: {
              mediaId: item.id,
              caption: item.caption,
              likes: item.likes_count,
              comments: item.comments_count,
              mediaType: item.media_type
            }
          })))

          result.itemsProcessed += media.length
        } catch (error) {
          result.errors.push(`Instagram account ${account.username}: ${error.message}`)
        }
      }
    } catch (error) {
      result.errors.push(`Instagram sync error: ${error.message}`)
    }
  }

  // Sync YouTube data
  private async syncYouTubeData(userId: string, result: SyncResult): Promise<void> {
    try {
      const accounts = await this.getYouTubeAccounts(userId)
      
      for (const account of accounts) {
        try {
          // Fetch recent videos
          const videos = await youtubeService.getChannelVideos(account.id)
          
          // Format for database
          const formattedVideos = youtubeService.formatVideoForDB(videos, account.id)
          
          // Store in database
          await db.batchInsertAnalytics(formattedVideos.map(video => ({
            userId,
            platform: 'youtube',
            metricType: 'engagement',
            value: video.likes_count + video.comments_count,
            date: new Date(video.published_at),
            data: {
              videoId: video.id,
              title: video.title,
              views: video.views_count,
              likes: video.likes_count,
              comments: video.comments_count,
              duration: video.duration
            }
          })))

          result.itemsProcessed += videos.length
        } catch (error) {
          result.errors.push(`YouTube channel ${account.channel_name}: ${error.message}`)
        }
      }
    } catch (error) {
      result.errors.push(`YouTube sync error: ${error.message}`)
    }
  }

  // Get Twitter accounts for user
  private async getTwitterAccounts(userId: string): Promise<any[]> {
    try {
      return await db.client.twitterAccount.findMany({
        where: { userId }
      })
    } catch (error) {
      console.error('Error fetching Twitter accounts:', error)
      return []
    }
  }

  // Get Instagram accounts for user
  private async getInstagramAccounts(userId: string): Promise<any[]> {
    try {
      return await db.client.instagramAccount.findMany({
        where: { userId }
      })
    } catch (error) {
      console.error('Error fetching Instagram accounts:', error)
      return []
    }
  }

  // Get YouTube accounts for user
  private async getYouTubeAccounts(userId: string): Promise<any[]> {
    try {
      return await db.client.youTubeAccount.findMany({
        where: { userId }
      })
    } catch (error) {
      console.error('Error fetching YouTube accounts:', error)
      return []
    }
  }

  // Schedule periodic sync
  schedulePeriodicSync(userId: string, intervalMinutes = 60): void {
    setInterval(async () => {
      try {
        await this.syncAllPlatforms(userId)
        console.log(`Periodic sync completed for user ${userId}`)
      } catch (error) {
        console.error(`Periodic sync failed for user ${userId}:`, error)
      }
    }, intervalMinutes * 60 * 1000)
  }

  // Add sync job to queue
  async addSyncJob(userId: string, platform?: string): Promise<void> {
    if (platform) {
      await queueService.addDataSyncJob(userId, platform, userId)
    } else {
      // Add jobs for all platforms
      await Promise.all([
        queueService.addDataSyncJob(userId, 'twitter', userId),
        queueService.addDataSyncJob(userId, 'instagram', userId),
        queueService.addDataSyncJob(userId, 'youtube', userId)
      ])
    }
  }

  // Get API health status
  async getAPIHealthStatus(): Promise<APIHealthStatus> {
    const [twitter, instagram, youtube] = await Promise.all([
      twitterService.healthCheck(),
      instagramService.healthCheck(),
      youtubeService.healthCheck()
    ])

    return {
      twitter,
      instagram,
      youtube
    }
  }

  // Get sync statistics
  async getSyncStatistics(userId: string): Promise<any> {
    try {
      const [twitterCount, instagramCount, youtubeCount] = await Promise.all([
        db.client.twitterTweet.count({
          where: {
            account: { userId }
          }
        }),
        db.client.instagramPost.count({
          where: {
            account: { userId }
          }
        }),
        db.client.youTubeVideo.count({
          where: {
            account: { userId }
          }
        })
      ])

      return {
        twitter: twitterCount,
        instagram: instagramCount,
        youtube: youtubeCount,
        total: twitterCount + instagramCount + youtubeCount
      }
    } catch (error) {
      console.error('Error getting sync statistics:', error)
      return {
        twitter: 0,
        instagram: 0,
        youtube: 0,
        total: 0
      }
    }
  }

  // Get recent activity
  async getRecentActivity(userId: string, limit = 20): Promise<any[]> {
    try {
      const [recentTweets, recentPosts, recentVideos] = await Promise.all([
        db.client.twitterTweet.findMany({
          where: {
            account: { userId }
          },
          orderBy: { createdAt: 'desc' },
          take: Math.ceil(limit / 3),
          include: {
            account: {
              select: { username: true }
            }
          }
        }),
        db.client.instagramPost.findMany({
          where: {
            account: { userId }
          },
          orderBy: { timestamp: 'desc' },
          take: Math.ceil(limit / 3),
          include: {
            account: {
              select: { username: true }
            }
          }
        }),
        db.client.youTubeVideo.findMany({
          where: {
            account: { userId }
          },
          orderBy: { publishedAt: 'desc' },
          take: Math.ceil(limit / 3),
          include: {
            account: {
              select: { channelName: true }
            }
          }
        })
      ])

      // Combine and format recent activity
      const activity = [
        ...recentTweets.map(tweet => ({
          id: tweet.id,
          type: 'twitter',
          content: tweet.text,
          timestamp: tweet.createdAt,
          author: tweet.account.username,
          metrics: {
            likes: tweet.likeCount,
            retweets: tweet.retweetCount,
            comments: tweet.replyCount
          }
        })),
        ...recentPosts.map(post => ({
          id: post.id,
          type: 'instagram',
          content: post.caption,
          timestamp: post.timestamp,
          author: post.account.username,
          metrics: {
            likes: post.likesCount,
            comments: post.commentsCount
          }
        })),
        ...recentVideos.map(video => ({
          id: video.id,
          type: 'youtube',
          content: video.title,
          timestamp: video.publishedAt,
          author: video.account.channelName,
          metrics: {
            views: video.viewsCount,
            likes: video.likesCount,
            comments: video.commentsCount
          }
        }))
      ]

      // Sort by timestamp and limit
      return activity
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting recent activity:', error)
      return []
    }
  }

  // Handle API rate limits
  async handleRateLimit(platform: string, error: any): Promise<void> {
    console.warn(`Rate limit hit for ${platform}:`, error.message)
    
    // Add delay before retry
    const delay = platform === 'twitter' ? 15 * 60 * 1000 : // 15 minutes
                  platform === 'instagram' ? 60 * 60 * 1000 : // 1 hour
                  60 * 1000 // 1 minute for YouTube

    await new Promise(resolve => setTimeout(resolve, delay))
  }

  // Validate API credentials
  async validateCredentials(): Promise<{ valid: boolean; issues: string[] }> {
    const issues: string[] = []
    
    // Check Twitter
    try {
      await twitterService.healthCheck()
    } catch (error) {
      issues.push(`Twitter: ${error.message}`)
    }

    // Check Instagram
    try {
      await instagramService.healthCheck()
    } catch (error) {
      issues.push(`Instagram: ${error.message}`)
    }

    // Check YouTube
    try {
      await youtubeService.healthCheck()
    } catch (error) {
      issues.push(`YouTube: ${error.message}`)
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }

  // Get API usage statistics
  async getAPIUsageStats(): Promise<any> {
    try {
      const health = await this.getAPIHealthStatus()
      
      return {
        health,
        quota: {
          youtube: await youtubeService.getQuotaUsage()
        },
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error getting API usage stats:', error)
      return {
        health: { twitter: { status: 'unhealthy', details: error.message } },
        quota: { youtube: { used: 0, limit: 10000 } },
        timestamp: new Date().toISOString()
      }
    }
  }
}

export const apiManager = APIManager.getInstance()
export default APIManager
