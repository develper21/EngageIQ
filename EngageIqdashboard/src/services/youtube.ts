import axios from 'axios'

interface YouTubeChannel {
  id: string
  title: string
  description: string
  customUrl: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
  }
  subscriberCount: number
  videoCount: number
  viewCount: number
}

interface YouTubeVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnails: {
    default: { url: string; width: number; height: number }
    medium: { url: string; width: number; height: number }
    high: { url: string; width: number; height: number }
    standard?: { url: string; width: number; height: number }
    maxres?: { url: string; width: number; height: number }
  }
  channelTitle: string
  channelId: string
  duration: string
  viewCount: number
  likeCount: number
  commentCount: number
  tags?: string[]
  categoryId: string
}

interface YouTubePlaylist {
  id: string
  title: string
  description: string
  publishedAt: string
  itemCount: number
  thumbnails: any
}

class YouTubeService {
  private apiKey: string
  private baseURL = 'https://www.googleapis.com/youtube/v3'

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY || ''

    if (!this.apiKey) {
      console.warn('YouTube API key not found in environment variables')
    }
  }

  // Get channel by ID
  async getChannel(channelId: string): Promise<YouTubeChannel | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/channels`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: channelId,
            key: this.apiKey
          }
        }
      )

      const channel = response.data.items[0]
      if (!channel) return null

      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl,
        publishedAt: channel.snippet.publishedAt,
        thumbnails: channel.snippet.thumbnails,
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
        viewCount: parseInt(channel.statistics.viewCount)
      }
    } catch (error: any) {
      console.error('Error fetching YouTube channel:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get channel by username
  async getChannelByUsername(username: string): Promise<YouTubeChannel | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/channels`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            forUsername: username,
            key: this.apiKey
          }
        }
      )

      const channel = response.data.items[0]
      if (!channel) return null

      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl,
        publishedAt: channel.snippet.publishedAt,
        thumbnails: channel.snippet.thumbnails,
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount),
        viewCount: parseInt(channel.statistics.viewCount)
      }
    } catch (error: any) {
      console.error('Error fetching YouTube channel by username:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get channel videos
  async getChannelVideos(channelId: string, maxResults = 20): Promise<YouTubeVideo[]> {
    try {
      // First get uploads playlist ID
      const channelResponse = await axios.get(
        `${this.baseURL}/channels`,
        {
          params: {
            part: 'contentDetails',
            id: channelId,
            key: this.apiKey
          }
        }
      )

      const uploadsPlaylistId = channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads
      if (!uploadsPlaylistId) {
        throw new Error('Uploads playlist not found')
      }

      const response = await axios.get(
        `${this.baseURL}/playlistItems`,
        {
          params: {
            part: 'snippet,contentDetails',
            playlistId: uploadsPlaylistId,
            maxResults,
            key: this.apiKey
          }
        }
      )

      const videoIds = response.data.items.map((item: any) => item.contentDetails.videoId)
      
      // Get detailed video information
      const videosResponse = await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
            key: this.apiKey
          }
        }
      )

      return videosResponse.data.items.map(this.formatVideo)
    } catch (error: any) {
      console.error('Error fetching YouTube channel videos:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Search videos
  async searchVideos(query: string, maxResults = 20): Promise<YouTubeVideo[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/search`,
        {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults,
            key: this.apiKey
          }
        }
      )

      const videoIds = response.data.items.map((item: any) => item.id.videoId)
      
      // Get detailed video information
      const videosResponse = await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
            key: this.apiKey
          }
        }
      )

      return videosResponse.data.items.map(this.formatVideo)
    } catch (error: any) {
      console.error('Error searching YouTube videos:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get video details
  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    try {
      const response = await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoId,
            key: this.apiKey
          }
        }
      )

      const video = response.data.items[0]
      if (!video) return null

      return this.formatVideo(video)
    } catch (error: any) {
      console.error('Error fetching YouTube video details:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get video analytics
  async getVideoAnalytics(videoId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'statistics',
            id: videoId,
            key: this.apiKey
          }
        }
      )

      return response.data.items[0]?.statistics || {}
    } catch (error: any) {
      console.error('Error fetching YouTube video analytics:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get channel analytics
  async getChannelAnalytics(channelId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseURL}/channels`,
        {
          params: {
            part: 'statistics',
            id: channelId,
            key: this.apiKey
          }
        }
      )

      return response.data.items[0]?.statistics || {}
    } catch (error: any) {
      console.error('Error fetching YouTube channel analytics:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get popular videos
  async getPopularVideos(regionCode = 'US', maxResults = 20): Promise<YouTubeVideo[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            chart: 'mostPopular',
            regionCode,
            maxResults,
            key: this.apiKey
          }
        }
      )

      return response.data.items.map(this.formatVideo)
    } catch (error: any) {
      console.error('Error fetching popular YouTube videos:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get channel playlists
  async getChannelPlaylists(channelId: string, maxResults = 20): Promise<YouTubePlaylist[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/playlists`,
        {
          params: {
            part: 'snippet,contentDetails',
            channelId,
            maxResults,
            key: this.apiKey
          }
        }
      )

      return response.data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        itemCount: item.contentDetails.itemCount,
        thumbnails: item.snippet.thumbnails
      }))
    } catch (error: any) {
      console.error('Error fetching YouTube channel playlists:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Get playlist videos
  async getPlaylistVideos(playlistId: string, maxResults = 20): Promise<YouTubeVideo[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}/playlistItems`,
        {
          params: {
            part: 'snippet,contentDetails',
            playlistId,
            maxResults,
            key: this.apiKey
          }
        }
      )

      const videoIds = response.data.items.map((item: any) => item.contentDetails.videoId)
      
      // Get detailed video information
      const videosResponse = await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
            key: this.apiKey
          }
        }
      )

      return videosResponse.data.items.map(this.formatVideo)
    } catch (error: any) {
      console.error('Error fetching YouTube playlist videos:', error.response?.data || error.message)
      throw this.handleYouTubeError(error)
    }
  }

  // Helper method to format video data
  private formatVideo(video: any): YouTubeVideo {
    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: video.snippet.publishedAt,
      thumbnails: video.snippet.thumbnails,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      duration: video.contentDetails.duration,
      viewCount: parseInt(video.statistics.viewCount),
      likeCount: parseInt(video.statistics.likeCount || '0'),
      commentCount: parseInt(video.statistics.commentCount),
      tags: video.snippet.tags,
      categoryId: video.snippet.categoryId
    }
  }

  // Parse ISO 8601 duration to seconds
  parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return 0

    const hours = parseInt(match[1]) || 0
    const minutes = parseInt(match[2]) || 0
    const seconds = parseInt(match[3]) || 0

    return hours * 3600 + minutes * 60 + seconds
  }

  // Format duration to human readable
  formatDuration(duration: string): string {
    const seconds = this.parseDuration(duration)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
  }

  // Error handling
  private handleYouTubeError(error: any): Error {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          return new Error(`YouTube API: Bad request - ${data?.error?.message || 'Invalid parameters'}`)
        case 401:
          return new Error('YouTube API: Invalid API key')
        case 403:
          if (data?.error?.errors?.[0]?.reason === 'quotaExceeded') {
            return new Error('YouTube API: Quota exceeded')
          }
          return new Error('YouTube API: Forbidden - insufficient permissions')
        case 404:
          return new Error('YouTube API: Resource not found')
        case 429:
          return new Error('YouTube API: Rate limit exceeded')
        case 500:
          return new Error('YouTube API: Internal server error')
        case 503:
          return new Error('YouTube API: Service unavailable')
        default:
          return new Error(`YouTube API: ${data?.error?.message || 'Unknown error'}`)
      }
    } else if (error.request) {
      return new Error('YouTube API: No response received from server')
    } else {
      return new Error(`YouTube API: ${error.message}`)
    }
  }

  // Format video for database storage
  formatVideoForDB(videos: YouTubeVideo[], channelId: string): any[] {
    return videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      published_at: new Date(video.publishedAt),
      thumbnail_url: video.thumbnails.high?.url || video.thumbnails.medium?.url || video.thumbnails.default.url,
      views_count: video.viewCount,
      likes_count: video.likeCount,
      comments_count: video.commentCount,
      duration: video.duration,
      account_id: channelId
    }))
  }

  // Format channel for database storage
  formatChannelForDB(channel: YouTubeChannel): any {
    return {
      id: channel.id,
      channel_name: channel.title,
      description: channel.description,
      subscribers_count: channel.subscriberCount,
      video_count: channel.videoCount,
      total_views: channel.viewCount,
      thumbnail_url: channel.thumbnails.high?.url || channel.thumbnails.medium?.url || channel.thumbnails.default.url
    }
  }

  // Get API quota usage
  async getQuotaUsage(): Promise<{ used: number; limit: number }> {
    // YouTube API doesn't provide quota usage endpoint
    // This would need to be tracked manually
    return {
      used: 0,
      limit: 10000 // Daily quota limit
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: string }> {
    try {
      if (!this.apiKey) {
        return {
          status: 'unhealthy',
          details: 'YouTube API key not configured'
        }
      }

      // Test API with a simple request
      await axios.get(
        `${this.baseURL}/videos`,
        {
          params: {
            part: 'snippet',
            id: 'dQw4w9WgXcQ', // Rick roll video as test
            key: this.apiKey
          }
        }
      )

      return {
        status: 'healthy',
        details: 'YouTube API is accessible'
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: `YouTube API error: ${error.message}`
      }
    }
  }
}

export const youtubeService = new YouTubeService()
export default YouTubeService
