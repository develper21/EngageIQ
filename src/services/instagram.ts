import axios from 'axios'

interface InstagramUser {
  id: string
  username: string
  account_type: string
  media_count: number
  followers_count: number
  follows_count: number
}

interface InstagramMedia {
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  timestamp: string
  like_count: number
  comments_count: number
  is_comment_enabled: boolean
  children?: InstagramMedia[]
}

interface InstagramInsight {
  name: string
  period: string
  values: Array<{ value: any }>
}

class InstagramService {
  private baseURL = 'https://graph.instagram.com'
  private clientID: string
  private clientSecret: string

  constructor() {
    this.clientID = process.env.INSTAGRAM_CLIENT_ID || ''
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || ''

    if (!this.clientID || !this.clientSecret) {
      console.warn('Instagram credentials not found in environment variables')
    }
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string, redirectURI: string): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/oauth/access_token`,
        null,
        {
          params: {
            client_id: this.clientID,
            client_secret: this.clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectURI,
            code
          }
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error exchanging code for token:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get long-lived access token
  async getLongLivedToken(shortLivedToken: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/access_token`,
        {
          params: {
            grant_type: 'ig_exchange_token',
            client_secret: this.clientSecret,
            access_token: shortLivedToken
          }
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error getting long-lived token:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get user profile
  async getUserProfile(accessToken: string): Promise<InstagramUser | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/me`,
        {
          params: {
            fields: 'id,username,account_type,media_count,followers_count,follows_count',
            access_token: accessToken
          }
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error fetching Instagram user profile:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get user media
  async getUserMedia(accessToken: string, limit = 25): Promise<InstagramMedia[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/me/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,is_comment_enabled,children',
            access_token: accessToken,
            limit
          }
        }
      )

      return response.data.data || []
    } catch (error: any) {
      console.error('Error fetching Instagram media:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get media details
  async getMediaDetails(mediaId: string, accessToken: string): Promise<InstagramMedia | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/${mediaId}`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,is_comment_enabled,children',
            access_token: accessToken
          }
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error fetching Instagram media details:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get media insights (for business accounts)
  async getMediaInsights(mediaId: string, accessToken: string): Promise<InstagramInsight[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/${mediaId}/insights`,
        {
          params: {
            metric: 'impressions,reach,engagement',
            access_token: accessToken
          }
        }
      )

      return response.data.data || []
    } catch (error: any) {
      console.error('Error fetching Instagram media insights:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get user insights (for business accounts)
  async getUserInsights(accessToken: string, period = 'day'): Promise<InstagramInsight[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/me/insights`,
        {
          params: {
            metric: 'impressions,reach,profile_views,website_clicks',
            period,
            access_token: accessToken
          }
        }
      )

      return response.data.data || []
    } catch (error: any) {
      console.error('Error fetching Instagram user insights:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get recent media with insights
  async getRecentMediaWithInsights(accessToken: string, limit = 25): Promise<Array<InstagramMedia & { insights?: InstagramInsight[] }>> {
    try {
      const media = await this.getUserMedia(accessToken, limit)
      
      // Add insights to each media item
      const mediaWithInsights = await Promise.all(
        media.map(async (item) => {
          try {
            const insights = await this.getMediaInsights(item.id, accessToken)
            return { ...item, insights }
          } catch (error) {
            // If insights fail (e.g., not a business account), return media without insights
            return { ...item, insights: [] }
          }
        })
      )

      return mediaWithInsights
    } catch (error) {
      console.error('Error fetching recent media with insights:', error)
      throw error
    }
  }

  // Refresh access token
  async refreshToken(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/refresh_access_token`,
        {
          params: {
            grant_type: 'ig_refresh_token',
            access_token: accessToken
          }
        }
      )

      return response.data
    } catch (error: any) {
      console.error('Error refreshing Instagram token:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get hashtag info
  async getHashtagInfo(hashtagName: string, accessToken: string): Promise<any> {
    try {
      // First get hashtag ID
      const hashtagResponse = await axios.get(
        `${this.baseURL}/ig_hashtag_search`,
        {
          params: {
            user_id: await this.getUserId(accessToken),
            q: hashtagName,
            access_token: accessToken
          }
        }
      )

      const hashtagId = hashtagResponse.data.data[0]?.id
      if (!hashtagId) {
        throw new Error('Hashtag not found')
      }

      // Get hashtag info
      const infoResponse = await axios.get(
        `${this.baseURL}/${hashtagId}`,
        {
          params: {
            fields: 'id,name,media_count',
            access_token: accessToken
          }
        }
      )

      return infoResponse.data
    } catch (error: any) {
      console.error('Error fetching hashtag info:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Get hashtag media
  async getHashtagMedia(hashtagName: string, accessToken: string, limit = 25): Promise<InstagramMedia[]> {
    try {
      const hashtagInfo = await this.getHashtagInfo(hashtagName, accessToken)
      const hashtagId = hashtagInfo.id

      const response = await axios.get(
        `${this.baseURL}/${hashtagId}/recent_media`,
        {
          params: {
            user_id: await this.getUserId(accessToken),
            fields: 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count',
            access_token: accessToken,
            limit
          }
        }
      )

      return response.data.data || []
    } catch (error: any) {
      console.error('Error fetching hashtag media:', error.response?.data || error.message)
      throw this.handleInstagramError(error)
    }
  }

  // Helper method to get user ID
  private async getUserId(accessToken: string): Promise<string> {
    const profile = await this.getUserProfile(accessToken)
    return profile?.id || ''
  }

  // Error handling
  private handleInstagramError(error: any): Error {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 190:
          return new Error('Instagram API: Access token expired')
        case 200:
          if (data?.error?.code === 190) {
            return new Error('Instagram API: Access token expired')
          }
          break
        case 400:
          return new Error(`Instagram API: Bad request - ${data?.error?.message || 'Invalid parameters'}`)
        case 403:
          return new Error('Instagram API: Forbidden - insufficient permissions')
        case 404:
          return new Error('Instagram API: Resource not found')
        case 429:
          return new Error('Instagram API: Rate limit exceeded')
        case 500:
          return new Error('Instagram API: Internal server error')
        case 503:
          return new Error('Instagram API: Service unavailable')
        default:
          return new Error(`Instagram API: ${data?.error?.message || 'Unknown error'}`)
      }
    } else if (error.request) {
      return new Error('Instagram API: No response received from server')
    } else {
      return new Error(`Instagram API: ${error.message}`)
    }
  }

  // Format media for database storage
  formatMediaForDB(media: InstagramMedia[], accountId: string): any[] {
    return media.map(item => ({
      id: item.id,
      caption: item.caption,
      media_type: item.media_type.toLowerCase(),
      media_url: item.media_url,
      timestamp: new Date(item.timestamp),
      likes_count: item.like_count,
      comments_count: item.comments_count,
      account_id: accountId
    }))
  }

  // Format user for database storage
  formatUserForDB(user: InstagramUser): any {
    return {
      id: user.id,
      username: user.username,
      followers_count: user.followers_count,
      following_count: user.follows_count,
      media_count: user.media_count,
      account_type: user.account_type
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: string }> {
    try {
      if (!this.clientID || !this.clientSecret) {
        return {
          status: 'unhealthy',
          details: 'Instagram API credentials not configured'
        }
      }

      return {
        status: 'healthy',
        details: 'Instagram API is configured'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `Instagram API error: ${error.message}`
      }
    }
  }
}

export const instagramService = new InstagramService()
export default InstagramService
