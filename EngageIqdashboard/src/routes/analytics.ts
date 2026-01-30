import { Router } from 'express'
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Get analytics data
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const { platform, metricType, startDate, endDate } = req.query

    let whereClause: any = { userId }
    
    if (platform) whereClause.platform = platform as string
    if (metricType) whereClause.metricType = metricType as string
    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }

    const analytics = await prisma.analytics.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    })

    res.json({ analytics })
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({ error: 'Failed to get analytics' })
  }
})

// Add analytics data
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { platform, metricType, date, value, metadata } = req.body
    const userId = (req as any).user.id

    const analytics = await prisma.analytics.create({
      data: {
        userId,
        platform,
        metricType,
        date: new Date(date),
        value,
        metadata
      }
    })

    res.status(201).json({
      message: 'Analytics data added successfully',
      analytics
    })
  } catch (error) {
    console.error('Add analytics error:', error)
    res.status(500).json({ error: 'Failed to add analytics data' })
  }
})

// Get reports
router.get('/reports', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id

    const reports = await prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ reports })
  } catch (error) {
    console.error('Get reports error:', error)
    res.status(500).json({ error: 'Failed to get reports' })
  }
})

// Create report
router.post('/reports', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, type, startDate, endDate, data } = req.body
    const userId = (req as any).user.id

    const report = await prisma.report.create({
      data: {
        userId,
        title,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        data
      }
    })

    res.status(201).json({
      message: 'Report created successfully',
      report
    })
  } catch (error) {
    console.error('Create report error:', error)
    res.status(500).json({ error: 'Failed to create report' })
  }
})

// Get single report
router.get('/reports/:reportId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params
    const userId = (req as any).user.id

    const report = await prisma.report.findFirst({
      where: { id: reportId as string, userId }
    })

    if (!report) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({ report })
  } catch (error) {
    console.error('Get report error:', error)
    res.status(500).json({ error: 'Failed to get report' })
  }
})

// Delete report
router.delete('/reports/:reportId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params
    const userId = (req as any).user.id

    const report = await prisma.report.deleteMany({
      where: { id: reportId as string, userId }
    })

    if (report.count === 0) {
      return res.status(404).json({ error: 'Report not found' })
    }

    res.json({ message: 'Report deleted successfully' })
  } catch (error) {
    console.error('Delete report error:', error)
    res.status(500).json({ error: 'Failed to delete report' })
  }
})

export default router
