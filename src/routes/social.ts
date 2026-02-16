import { Router } from 'express'
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Get all social media accounts for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    
    const [instagram, youtube, twitter] = await Promise.all([
      prisma.instagramAccount.findMany({
        where: { userId },
        include: {
          posts: {
            orderBy: { timestamp: 'desc' },
            take: 10
          }
        }
      }),
      prisma.youTubeAccount.findMany({
        where: { userId },
        include: {
          videos: {
            orderBy: { publishedAt: 'desc' },
            take: 10
          }
        }
      }),
      prisma.twitterAccount.findMany({
        where: { userId },
        include: {
          tweets: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
    ])

    res.json({
      instagram,
      youtube,
      twitter
    })
  } catch (error) {
    console.error('Get accounts error:', error)
    res.status(500).json({ error: 'Failed to get accounts' })
  }
})

// Add Instagram account
router.post('/instagram', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { username, accessToken, refreshToken } = req.body
    const userId = (req as any).user.id

    const account = await prisma.instagramAccount.create({
      data: {
        userId,
        username,
        accessToken,
        refreshToken
      }
    })

    res.status(201).json({
      message: 'Instagram account added successfully',
      account
    })
  } catch (error) {
    console.error('Add Instagram account error:', error)
    res.status(500).json({ error: 'Failed to add Instagram account' })
  }
})

// Add YouTube account
router.post('/youtube', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { channelId, channelTitle, accessToken, refreshToken } = req.body
    const userId = (req as any).user.id

    const account = await prisma.youTubeAccount.create({
      data: {
        userId,
        channelId,
        channelTitle,
        accessToken,
        refreshToken
      }
    })

    res.status(201).json({
      message: 'YouTube account added successfully',
      account
    })
  } catch (error) {
    console.error('Add YouTube account error:', error)
    res.status(500).json({ error: 'Failed to add YouTube account' })
  }
})

// Add Twitter account
router.post('/twitter', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { username, accessToken, refreshToken } = req.body
    const userId = (req as any).user.id

    const account = await prisma.twitterAccount.create({
      data: {
        userId,
        username,
        accessToken,
        refreshToken
      }
    })

    res.status(201).json({
      message: 'Twitter account added successfully',
      account
    })
  } catch (error) {
    console.error('Add Twitter account error:', error)
    res.status(500).json({ error: 'Failed to add Twitter account' })
  }
})

// Delete account
router.delete('/:platform/:accountId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { platform, accountId } = req.params
    const userId = (req as any).user.id

    let account
    switch (platform) {
      case 'instagram':
        account = await prisma.instagramAccount.deleteMany({
          where: { id: accountId as string, userId }
        })
        break
      case 'youtube':
        account = await prisma.youTubeAccount.deleteMany({
          where: { id: accountId as string, userId }
        })
        break
      case 'twitter':
        account = await prisma.twitterAccount.deleteMany({
          where: { id: accountId as string, userId }
        })
        break
      default:
        return res.status(400).json({ error: 'Invalid platform' })
    }

    if (account.count === 0) {
      return res.status(404).json({ error: 'Account not found' })
    }

    res.json({ message: `${platform} account deleted successfully` })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
})

export default router
