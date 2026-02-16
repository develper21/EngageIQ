import Bull from 'bull'
import Redis from 'ioredis'

interface QueueJob {
  userId: string
  platform: string
  accountId?: string
  type?: string
  data?: any
  priority?: number
  delay?: number
  attempts?: number
}

interface QueueOptions {
  removeOnComplete?: number
  removeOnFail?: number
  attempts?: number
  backoff?: 'fixed' | 'exponential'
  delay?: number
}

class QueueService {
  private redis: Redis
  public dataSyncQueue: Bull.Queue
  public reportGenerationQueue: Bull.Queue
  public emailQueue: Bull.Queue
  public analyticsQueue: Bull.Queue
  public cleanupQueue: Bull.Queue

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keyPrefix: 'engageiq:queue:',
      enableReadyCheck: true
    })

    // Configure queues with different priorities
    this.dataSyncQueue = new Bull('data sync', `redis://:${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`, {
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: 'exponential' as const,
        delay: 2000,
      },
    })

    this.reportGenerationQueue = new Bull('report generation', `redis://:${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`, {
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 25,
        attempts: 2,
        backoff: 'fixed' as const,
        delay: 1000,
      },
    })

    this.emailQueue = new Bull('email sending', `redis://:${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`, {
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 5,
        backoff: 'exponential',
      },
    })

    this.analyticsQueue = new Bull('analytics processing', `redis://:${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`, {
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 3,
        backoff: 'exponential',
      },
    })

    this.cleanupQueue = new Bull('data cleanup', `redis://:${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`, {
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 1,
        backoff: 'fixed' as const,
      },
    })

    this.setupProcessors()
    this.setupEventListeners()
  }

  private setupProcessors() {
    // Data sync processor
    this.dataSyncQueue.process(5, async (job) => {
      const { userId, platform, accountId, type, data } = job.data as QueueJob
      
      try {
        console.log(`Processing data sync for ${platform} - User: ${userId}`)
        
        switch (platform) {
          case 'twitter':
            await this.syncTwitterData(userId, accountId, data)
            break
          case 'instagram':
            await this.syncInstagramData(userId, accountId, data)
            break
          case 'youtube':
            await this.syncYouTubeData(userId, accountId, data)
            break
          default:
            throw new Error(`Unsupported platform: ${platform}`)
        }
        
        console.log(`Successfully synced ${platform} data for user ${userId}`)
        return { success: true, platform, userId }
      } catch (error) {
        console.error(`Failed to sync ${platform} data:`, error)
        throw error
      }
    })

    // Report generation processor
    this.reportGenerationQueue.process(2, async (job) => {
      const { userId, reportId, type, format, data } = job.data as QueueJob
      
      try {
        console.log(`Generating report for user ${userId}, type: ${type}`)
        
        const reportData = await this.generateReport(userId, reportId as string, type, format, data)
        await this.saveReport(reportId as string, reportData)
        
        console.log(`Successfully generated report ${reportId}`)
        return { success: true, reportId, format }
      } catch (error) {
        console.error('Report generation failed:', error)
        throw error
      }
    })

    // Email processor
    this.emailQueue.process(10, async (job) => {
      const { to, subject, template, data } = job.data as QueueJob
      
      try {
        console.log(`Sending email to ${to}`)
        await this.sendEmail(to as string, subject as string, template as string, data)
        return { success: true, to }
      } catch (error) {
        console.error('Email sending failed:', error)
        throw error
      }
    })

    // Analytics processor
    this.analyticsQueue.process(3, async (job) => {
      const { userId, type, data } = job.data as QueueJob
      
      try {
        console.log(`Processing analytics for user ${userId}, type: ${type}`)
        
        switch (type) {
          case 'engagement':
            await this.processEngagementAnalytics(userId, data)
            break
          case 'growth':
            await this.processGrowthAnalytics(userId, data)
            break
          case 'performance':
            await this.processPerformanceAnalytics(userId, data)
            break
          default:
            await this.processGenericAnalytics(userId, type, data)
        }
        
        return { success: true, type, userId }
      } catch (error) {
        console.error(`Analytics processing failed for ${type}:`, error)
        throw error
      }
    })

    // Cleanup processor
    this.cleanupQueue.process(1, async (job) => {
      try {
        console.log('Running cleanup job')
        
        await this.cleanupOldData()
        await this.cleanupExpiredCache()
        await this.cleanupFailedJobs()
        
        console.log('Cleanup completed successfully')
        return { success: true }
      } catch (error) {
        console.error('Cleanup failed:', error)
        throw error
      }
    })
  }

  private setupEventListeners() {
    // Data sync queue events
    this.dataSyncQueue.on('completed', (job) => {
      console.log(`Data sync job completed: ${job.id}`)
    })

    this.dataSyncQueue.on('failed', (job, err) => {
      console.error(`Data sync job failed: ${job.id}`, err)
    })

    // Report generation queue events
    this.reportGenerationQueue.on('completed', (job) => {
      console.log(`Report generation job completed: ${job.id}`)
    })

    // Email queue events
    this.emailQueue.on('completed', (job) => {
      console.log(`Email job completed: ${job.id}`)
    })

    // Analytics queue events
    this.analyticsQueue.on('completed', (job) => {
      console.log(`Analytics job completed: ${job.id}`)
    })

    // Global queue events
    const queues = [this.dataSyncQueue, this.reportGenerationQueue, this.emailQueue, this.analyticsQueue, this.cleanupQueue]
    
    queues.forEach(queue => {
      queue.on('error', (err) => {
        console.error(`Queue error: ${queue.name}`, err)
      })
    })
  }

  // Schedule periodic jobs
  schedulePeriodicJobs() {
    // Sync data every 6 hours
    this.dataSyncQueue.add(
      { type: 'periodic_sync' },
      { 
        repeat: { cron: '0 */6 * * *' }, // Every 6 hours
        jobId: 'periodic-data-sync'
      }
    )

    // Generate weekly reports
    this.reportGenerationQueue.add(
      { type: 'weekly_reports' },
      { 
        repeat: { cron: '0 9 * * 1' }, // Monday 9 AM
        jobId: 'weekly-reports'
      }
    )

    // Cleanup old data
    this.cleanupQueue.add(
      { type: 'cleanup' },
      { 
        repeat: { cron: '0 2 * * 0' }, // Sunday 2 AM
        jobId: 'data-cleanup'
      }
    )

    // Process analytics every hour
    this.analyticsQueue.add(
      { type: 'hourly_analytics' },
      {
        repeat: { cron: '0 * * * * *' }, // Every hour
        jobId: 'hourly-analytics'
      }
    )
  }

  async addDataSyncJob(userId: string, platform: string, accountId: string, delay = 0): Promise<Bull.Job> {
    return await this.dataSyncQueue.add(
      { userId, platform, accountId },
      { 
        delay,
        priority: this.getPriority(platform),
        jobId: `sync-${userId}-${platform}-${accountId}`
      }
    )
  }

  async addReportGenerationJob(userId: string, reportId: string, type: string, format: string, data: any): Promise<Bull.Job> {
    return await this.reportGenerationQueue.add(
      { userId, reportId, type, format, data },
      {
        priority: 5,
        jobId: `report-${userId}-${reportId}`
      }
    )
  }

  async addEmailJob(to: string, subject: string, template: string, data: any): Promise<Bull.Job> {
    return await this.emailQueue.add(
      { to, subject, template, data },
      {
        priority: 3,
        jobId: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    )
  }

  async addAnalyticsJob(userId: string, type: string, data: any): Promise<Bull.Job> {
    return await this.analyticsQueue.add(
      { userId, type, data },
      {
        priority: 4,
        jobId: `analytics-${userId}-${type}-${Date.now()}`
      }
    )
  }

  private getPriority(platform: string): number {
    const priorities = { twitter: 10, instagram: 8, youtube: 6 }
    return priorities[platform as keyof typeof priorities] || 5
  }

  // Placeholder methods - these would be implemented with actual business logic
  private async syncTwitterData(userId: string, accountId: string, data: any): Promise<void> {
    console.log(`Syncing Twitter data for user ${userId}, account ${accountId}`)
    // Implementation would go here
  }

  private async syncInstagramData(userId: string, accountId: string, data: any): Promise<void> {
    console.log(`Syncing Instagram data for user ${userId}, account ${accountId}`)
    // Implementation would go here
  }

  private async syncYouTubeData(userId: string, accountId: string, data: any): Promise<void> {
    console.log(`Syncing YouTube data for user ${userId}, account ${accountId}`)
    // Implementation would go here
  }

  private async generateReport(userId: string, reportId: string, type: string, format: string, data: any): Promise<any> {
    console.log(`Generating ${type} report in ${format} format for user ${userId}`)
    return { reportId, type, format, data }
  }

  private async saveReport(reportId: string, reportData: any): Promise<void> {
    console.log(`Saving report ${reportId}`)
    // Implementation would go here
  }

  private async sendEmail(to: string, subject: string, template: string, data: any): Promise<void> {
    console.log(`Sending email to ${to} with subject: ${subject}`)
    // Implementation would go here
  }

  private async processEngagementAnalytics(userId: string, data: any): Promise<void> {
    console.log(`Processing engagement analytics for user ${userId}`)
    // Implementation would go here
  }

  private async processGrowthAnalytics(userId: string, data: any): Promise<void> {
    console.log(`Processing growth analytics for user ${userId}`)
    // Implementation would go here
  }

  private async processPerformanceAnalytics(userId: string, data: any): Promise<void> {
    console.log(`Processing performance analytics for user ${userId}`)
    // Implementation would go here
  }

  private async processGenericAnalytics(userId: string, type: string, data: any): Promise<void> {
    console.log(`Processing ${type} analytics for user ${userId}`)
    // Implementation would go here
  }

  private async cleanupOldData(): Promise<void> {
    console.log('Cleaning up old data')
    // Implementation would go here
  }

  private async cleanupExpiredCache(): Promise<void> {
    console.log('Cleaning up expired cache')
    // Implementation would go here
  }

  private async cleanupFailedJobs(): Promise<void> {
    console.log('Cleaning up failed jobs')
    // Implementation would go here
  }

  // Queue statistics
  async getQueueStats(): Promise<{
    dataSync: { waiting: number; active: number; completed: number; failed: number }
    reports: { waiting: number; active: number; completed: number; failed: number }
    email: { waiting: number; active: number; completed: number; failed: number }
    analytics: { waiting: number; active: number; completed: number; failed: number }
    cleanup: { waiting: number; active: number; completed: number; failed: number }
  }> {
    const [
      dataSyncWaiting,
      dataSyncActive,
      dataSyncCompleted,
      dataSyncFailed
    ] = await Promise.all([
      this.dataSyncQueue.getWaiting(),
      this.dataSyncQueue.getActive(),
      this.dataSyncQueue.getCompleted(),
      this.dataSyncQueue.getFailed()
    ])

    const [
      reportsWaiting,
      reportsActive,
      reportsCompleted,
      reportsFailed
    ] = await Promise.all([
      this.reportGenerationQueue.getWaiting(),
      this.reportGenerationQueue.getActive(),
      this.reportGenerationQueue.getCompleted(),
      this.reportGenerationQueue.getFailed()
    ])

    const [
      emailWaiting,
      emailActive,
      emailCompleted,
      emailFailed
    ] = await Promise.all([
      this.emailQueue.getWaiting(),
      this.emailQueue.getActive(),
      this.emailQueue.getCompleted(),
      this.emailQueue.getFailed()
    ])

    const [
      analyticsWaiting,
      analyticsActive,
      analyticsCompleted,
      analyticsFailed
    ] = await Promise.all([
      this.analyticsQueue.getWaiting(),
      this.analyticsQueue.getActive(),
      this.analyticsQueue.getCompleted(),
      this.analyticsQueue.getFailed()
    ])

    const [
      cleanupWaiting,
      cleanupActive,
      cleanupCompleted,
      cleanupFailed
    ] = await Promise.all([
      this.cleanupQueue.getWaiting(),
      this.cleanupQueue.getActive(),
      this.cleanupQueue.getCompleted(),
      this.cleanupQueue.getFailed()
    ])

    return {
      dataSync: { waiting: dataSyncWaiting, active: dataSyncActive, completed: dataSyncCompleted, failed: dataSyncFailed },
      reports: { waiting: reportsWaiting, active: reportsActive, completed: reportsCompleted, failed: reportsFailed },
      email: { waiting: emailWaiting, active: emailActive, completed: emailCompleted, failed: emailFailed },
      analytics: { waiting: analyticsWaiting, active: analyticsActive, completed: analyticsCompleted, failed: analyticsFailed },
      cleanup: { waiting: cleanupWaiting, active: cleanupActive, completed: cleanupCompleted, failed: cleanupFailed }
    }
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    console.log('Shutting down queues...')
    
    const queues = [this.dataSyncQueue, this.reportGenerationQueue, this.emailQueue, this.analyticsQueue, this.cleanupQueue]
    
    await Promise.all(queues.map(queue => queue.close()))
    
    await this.redis.disconnect()
    console.log('Queues shut down successfully')
  }
}

export const queueService = new QueueService()
export default QueueService
