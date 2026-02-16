import axios from 'axios'

interface TwitterUser {
  id: string
  username: string
  name: string
  profile_image_url: string
  followers_count: number
  following_count: number
  tweet_count: number
  created_at: string
  description: string
}

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
    quote_count: number
  }
  author_id: string
  attachments?: {
    media_keys?: string[]
  }
}

interface TwitterMedia {
  media_key: string
  type: 'photo' | 'video' | 'animated_gif'
  url?: string
  preview_image_url?: string
  width?: number
  height?: number
}

class TwitterService {
  private bearerToken: string
  private apiKey: string
  private apiSecret: string
  private baseURL = 'https://api.twitter.com/2'

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || ''
    this.apiKey = process.env.TWITTER_API_KEY || ''
    this.apiSecret = process.env.TWITTER_API_SECRET || ''

    if (!this.bearerToken) {
      console.warn('Twitter Bearer Token not found in environment variables')
    }
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    }
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/users/by/username/${username}`,
        {
          headers: this.getHeaders(),
          params: {
            'user.fields': 'id,name,username,profile_image_url,public_metrics,created_at,description'
          }
        }
      )

      return response.data.data
    } catch (error: any) {
      console.error('Error fetching Twitter user:', error.response?.data || error.message)
      throw this.handleTwitterError(error)
    }
  }

  // Get user tweets
  async getUserTweets(userId: string, maxResults = 20): Promise<TwitterTweet[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/users/${userId}/tweets`,
        {
          headers: this.getHeaders(),
          params: {
            'tweet.fields': 'id,text,created_at,public_metrics,author_id,attachments',
            'expansions': 'attachments.media_keys',
            'media.fields': 'media_key,type,url,preview_image_url,width,height',
            'max_results': maxResults
          }
        }
      )

      const tweets = response.data.data || []
      const includes = response.data.includes || {}
      
      // Attach media information if available
      if (includes.media && tweets.length > 0) {
        const mediaMap = new Map(includes.media.map((m: TwitterMedia) => [m.media_key, m]))
        
        tweets.forEach((tweet: TwitterTweet) => {
          if (tweet.attachments?.media_keys) {
            (tweet as any).media = tweet.attachments.media_keys.map(key => mediaMap.get(key)).filter(Boolean)
          }
        })
      }

      return tweets
    } catch (error: any) {
      console.error('Error fetching Twitter tweets:', error.response?.data || error.message)
      throw this.handleTwitterError(error)
    }
  }

  // Get user's recent tweets by username
  async getUserRecentTweets(username: string, maxResults = 20): Promise<{ user: TwitterUser; tweets: TwitterTweet[] }> {
    try {
      const user = await this.getUserByUsername(username)
      if (!user) {
        throw new Error('User not found')
      }

      const tweets = await this.getUserTweets(user.id, maxResults)
      
      return { user, tweets }
    } catch (error) {
      console.error('Error fetching user tweets:', error)
      throw error
    }
  }

  // Search tweets
  async searchTweets(query: string, maxResults = 20): Promise<TwitterTweet[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/tweets/search/recent`,
        {
          headers: this.getHeaders(),
          params: {
            query,
            'tweet.fields': 'id,text,created_at,public_metrics,author_id,attachments',
            'expansions': 'author_id,attachments.media_keys',
            'user.fields': 'id,name,username,profile_image_url',
            'media.fields': 'media_key,type,url,preview_image_url,width,height',
            'max_results': maxResults
          }
        }
      )

      const tweets = response.data.data || []
      const includes = response.data.includes || {}
      
      // Attach user and media information
      if (includes.users && tweets.length > 0) {
        const userMap = new Map(includes.users.map((u: TwitterUser) => [u.id, u]))
        
        tweets.forEach((tweet: TwitterTweet) => {
          (tweet as any).user = userMap.get(tweet.author_id)
        })
      }

      if (includes.media && tweets.length > 0) {
        const mediaMap = new Map(includes.media.map((m: TwitterMedia) => [m.media_key, m]))
        
        tweets.forEach((tweet: TwitterTweet) => {
          if (tweet.attachments?.media_keys) {
            (tweet as any).media = tweet.attachments.media_keys.map(key => mediaMap.get(key)).filter(Boolean)
          }
        })
      }

      return tweets
    } catch (error: any) {
      console.error('Error searching Twitter tweets:', error.response?.data || error.message)
      throw this.handleTwitterError(error)
    }
  }

  // Get tweet metrics
  async getTweetMetrics(tweetId: string): Promise<TwitterTweet | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/tweets/${tweetId}`,
        {
          headers: this.getHeaders(),
          params: {
            'tweet.fields': 'id,text,created_at,public_metrics,author_id,attachments'
          }
        }
      )

      return response.data.data
    } catch (error: any) {
      console.error('Error fetching tweet metrics:', error.response?.data || error.message)
      throw this.handleTwitterError(error)
    }
  }

  // Get user followers count
  async getUserFollowers(userId: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.baseURL}/users/${userId}`,
        {
          headers: this.getHeaders(),
          params: {
            'user.fields': 'public_metrics'
          }
        }
      )

      return response.data.data.public_metrics.followers_count
    } catch (error: any) {
      console.error('Error fetching user followers:', error.response?.data || error.message)
      throw this.handleTwitterError(error)
    }
  }

  // Rate limit check
  async getRateLimitStatus(): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/application/rate_limit_status`,
        {
          headers: this.getHeaders()
        }
      )

      return response.data.resources
    } catch (error: any) {
      console.error('Error fetching rate limit status:', error.response?.data || error.message)
      throw this.handleTwitterError(error)
    }
  }

  // Error handling
  private handleTwitterError(error: any): Error {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 401:
          return new Error('Twitter API: Invalid or expired credentials')
        case 403:
          return new Error('Twitter API: Access forbidden - check permissions')
        case 404:
          return new Error('Twitter API: Resource not found')
        case 429:
          const resetTime = data?.reset || error.response.headers['x-rate-limit-reset']
          return new Error(`Twitter API: Rate limit exceeded. Reset at ${new Date(resetTime * 1000).toISOString()}`)
        case 500:
          return new Error('Twitter API: Internal server error')
        case 503:
          return new Error('Twitter API: Service unavailable')
        default:
          return new Error(`Twitter API: ${data?.detail || data?.title || 'Unknown error'}`)
      }
    } else if (error.request) {
      return new Error('Twitter API: No response received from server')
    } else {
      return new Error(`Twitter API: ${error.message}`)
    }
  }

  // Format tweets for database storage
  formatTweetsForDB(tweets: TwitterTweet[], userId: string): any[] {
    return tweets.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      retweet_count: tweet.public_metrics.retweet_count,
      like_count: tweet.public_metrics.like_count,
      reply_count: tweet.public_metrics.reply_count,
      quote_count: tweet.public_metrics.quote_count,
      created_at: new Date(tweet.created_at),
      account_id: userId,
      // Additional fields as needed
    }))
  }

  // Format user for database storage
  formatUserForDB(user: TwitterUser): any {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      profile_image_url: user.profile_image_url,
      followers_count: user.followers_count,
      following_count: user.following_count,
      tweet_count: user.tweet_count,
      created_at: new Date(user.created_at),
      description: user.description
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: string }> {
    try {
      await this.getRateLimitStatus()
      return {
        status: 'healthy',
        details: 'Twitter API is accessible'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `Twitter API error: ${error.message}`
      }
    }
  }
}

export const twitterService = new TwitterService()
export default TwitterService
