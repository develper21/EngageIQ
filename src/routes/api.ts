import express from 'express'
import { authenticateToken } from '../middleware/auth'
import { apiManager } from '../services/apiManager'
import { twitterService } from '../services/twitter'
import { instagramService } from '../services/instagram'
import { youtubeService } from '../services/youtube'

const router = express.Router()

// Sync all platforms
router.post('/sync/all', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const results = await apiManager.syncAllPlatforms(userId)
    
    res.json({
      success: true,
      results,
      message: 'Sync completed for all platforms'
    })
  } catch (error) {
    console.error('Error syncing all platforms:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to sync platforms',
      details: error.message
    })
  }
})

// Sync specific platform
router.post('/sync/:platform', authenticateToken, async (req, res) => {
  try {
    const platform = Array.isArray(req.params.platform) ? req.params.platform[0] : req.params.platform
    const userId = (req as any).user.userId
    
    const result = await apiManager.syncPlatform(userId, platform)
    
    res.json({
      success: true,
      result,
      message: `Sync completed for ${platform}`
    })
  } catch (error) {
    console.error(`Error syncing ${req.params.platform}:`, error)
    res.status(500).json({
      success: false,
      error: `Failed to sync ${req.params.platform}`,
      details: error.message
    })
  }
})

// Add sync job to queue
router.post('/sync-job', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    
    await Promise.all([
      apiManager.addSyncJob(userId, 'twitter'),
      apiManager.addSyncJob(userId, 'instagram'),
      apiManager.addSyncJob(userId, 'youtube')
    ])
    
    res.json({
      success: true,
      message: 'Sync jobs added for all platforms'
    })
  } catch (error) {
    console.error('Error adding sync job:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add sync job',
      details: error.message
    })
  }
})

router.post('/sync-job/:platform', authenticateToken, async (req, res) => {
  try {
    const platform = Array.isArray(req.params.platform) ? req.params.platform[0] : req.params.platform
    const userId = (req as any).user.userId
    
    await apiManager.addSyncJob(userId, platform)
    
    res.json({
      success: true,
      message: `Sync job added for ${platform}`
    })
  } catch (error) {
    console.error('Error adding sync job:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add sync job',
      details: error.message
    })
  }
})

// Get API health status
router.get('/health', authenticateToken, async (req, res) => {
  try {
    const health = await apiManager.getAPIHealthStatus()
    
    res.json({
      success: true,
      health
    })
  } catch (error) {
    console.error('Error getting API health:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get API health status',
      details: error.message
    })
  }
})

// Get sync statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const stats = await apiManager.getSyncStatistics(userId)
    
    res.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error getting sync statistics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get sync statistics',
      details: error.message
    })
  }
})

// Get recent activity
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const limit = parseInt(req.query.limit as string) || 20
    
    const activity = await apiManager.getRecentActivity(userId, limit)
    
    res.json({
      success: true,
      activity
    })
  } catch (error) {
    console.error('Error getting recent activity:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get recent activity',
      details: error.message
    })
  }
})

// Get API usage statistics
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const usage = await apiManager.getAPIUsageStats()
    
    res.json({
      success: true,
      usage
    })
  } catch (error) {
    console.error('Error getting API usage:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get API usage',
      details: error.message
    })
  }
})

// Validate API credentials
router.get('/validate', authenticateToken, async (req, res) => {
  try {
    const validation = await apiManager.validateCredentials()
    
    res.json({
      success: true,
      validation
    })
  } catch (error) {
    console.error('Error validating credentials:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to validate credentials',
      details: error.message
    })
  }
})

// Twitter specific routes
router.get('/twitter/user/:username', authenticateToken, async (req, res) => {
  try {
    const username = Array.isArray(req.params.username) ? req.params.username[0] : req.params.username
    const maxResults = parseInt(req.query.limit as string) || 20
    
    const data = await twitterService.getUserRecentTweets(username, maxResults)
    
    res.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error fetching Twitter user:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Twitter user',
      details: error.message
    })
  }
})

router.get('/twitter/search', authenticateToken, async (req, res) => {
  try {
    const q = req.query.q
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      })
    }
    
    const maxResults = parseInt(req.query.limit as string) || 20
    const tweets = await twitterService.searchTweets(q as string, maxResults)
    
    res.json({
      success: true,
      tweets
    })
  } catch (error) {
    console.error('Error searching Twitter:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search Twitter',
      details: error.message
    })
  }
})

// Instagram specific routes
router.get('/instagram/media', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId
    const limit = parseInt(req.query.limit as string) || 25
    
    // This would need to get user's Instagram access token from database
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Instagram media endpoint - requires access token',
      limit
    })
  } catch (error) {
    console.error('Error fetching Instagram media:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Instagram media',
      details: error.message
    })
  }
})

// YouTube specific routes
router.get('/youtube/channel/:channelId', authenticateToken, async (req, res) => {
  try {
    const channelId = Array.isArray(req.params.channelId) ? req.params.channelId[0] : req.params.channelId
    const maxResults = parseInt(req.query.limit as string) || 20
    
    const channel = await youtubeService.getChannel(channelId)
    const videos = await youtubeService.getChannelVideos(channelId, maxResults)
    
    res.json({
      success: true,
      channel,
      videos
    })
  } catch (error) {
    console.error('Error fetching YouTube channel:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch YouTube channel',
      details: error.message
    })
  }
})

router.get('/youtube/search', authenticateToken, async (req, res) => {
  try {
    const q = req.query.q
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      })
    }
    
    const maxResults = parseInt(req.query.limit as string) || 20
    const videos = await youtubeService.searchVideos(q as string, maxResults)
    
    res.json({
      success: true,
      videos
    })
  } catch (error) {
    console.error('Error searching YouTube:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to search YouTube',
      details: error.message
    })
  }
})

router.get('/youtube/video/:videoId', authenticateToken, async (req, res) => {
  try {
    const videoId = Array.isArray(req.params.videoId) ? req.params.videoId[0] : req.params.videoId
    const video = await youtubeService.getVideoDetails(videoId)
    
    res.json({
      success: true,
      video
    })
  } catch (error) {
    console.error('Error fetching YouTube video:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch YouTube video',
      details: error.message
    })
  }
})

// Schedule periodic sync
router.post('/schedule-sync', authenticateToken, async (req, res) => {
  try {
    const { intervalMinutes = 60 } = req.body
    const userId = (req as any).user.userId
    
    apiManager.schedulePeriodicSync(userId, intervalMinutes)
    
    res.json({
      success: true,
      message: `Periodic sync scheduled every ${intervalMinutes} minutes`
    })
  } catch (error) {
    console.error('Error scheduling periodic sync:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to schedule periodic sync',
      details: error.message
    })
  }
})

export default router
