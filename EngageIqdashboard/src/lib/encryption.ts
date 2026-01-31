import crypto from 'crypto'

class EncryptionService {
  private readonly algorithm = 'aes-256-gcm'
  private readonly keyLength = 32
  private readonly ivLength = 16
  private readonly tagLength = 16

  private getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY
    if (!key) {
      // Generate a key if not exists (for development)
      if (process.env.NODE_ENV !== 'production') {
        const generatedKey = crypto.randomBytes(32).toString('hex')
        console.warn('ENCRYPTION_KEY not set, using generated key for development:', generatedKey.substring(0, 8) + '...')
        return Buffer.from(generatedKey, 'hex')
      }
      throw new Error('ENCRYPTION_KEY environment variable is not set')
    }
    return Buffer.from(key, 'hex')
  }

  encrypt(text: string): string {
    try {
      const key = this.getEncryptionKey()
      const iv = crypto.randomBytes(this.ivLength)
      
      const cipher = crypto.createCipheriv(this.algorithm, key, iv)
      cipher.setAAD(Buffer.from('engageiq', 'utf8'))
      
      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const tag = cipher.getAuthTag()
      
      return iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const key = this.getEncryptionKey()
      const parts = encryptedData.split(':')
      
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format')
      }
      
      const iv = Buffer.from(parts[0], 'hex')
      const tag = Buffer.from(parts[1], 'hex')
      const encrypted = parts[2]
      
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv)
      decipher.setAuthTag(tag)
      decipher.setAAD(Buffer.from('engageiq', 'utf8'))
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  // Method to generate a new encryption key
  static generateKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  // Method to hash passwords (separate from encryption)
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
  }

  // Method to verify password
  verifyPassword(password: string, hashedPassword: string): boolean {
    try {
      const [salt, hash] = hashedPassword.split(':')
      const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
      return hash === verifyHash
    } catch (error) {
      return false
    }
  }
}

export const encryption = new EncryptionService()

// Secure token storage service
class TokenService {
  async storeEncryptedToken(userId: string, platform: string, tokens: any): Promise<void> {
    try {
      const encryptedTokens = encryption.encrypt(JSON.stringify(tokens))
      
      // This would be implemented with your database
      // For now, we'll store in memory (in production, use database)
      console.log(`Storing encrypted tokens for user ${userId}, platform ${platform}`)
      
      // Example implementation with Prisma (when schema is ready):
      // await prisma.socialToken.upsert({
      //   where: { userId_platform: { userId, platform } },
      //   update: { encryptedTokens, updatedAt: new Date() },
      //   create: { userId, platform, encryptedTokens }
      // })
    } catch (error) {
      console.error('Failed to store encrypted tokens:', error)
      throw new Error('Failed to store tokens securely')
    }
  }

  async getDecryptedTokens(userId: string, platform: string): Promise<any> {
    try {
      // This would be implemented with your database
      console.log(`Retrieving encrypted tokens for user ${userId}, platform ${platform}`)
      
      // Example implementation with Prisma (when schema is ready):
      // const tokenRecord = await prisma.socialToken.findUnique({
      //   where: { userId_platform: { userId, platform } }
      // })
      
      // if (!tokenRecord) {
      //   throw new Error('No tokens found for this platform')
      // }
      
      // const decryptedTokens = encryption.decrypt(tokenRecord.encryptedTokens)
      // return JSON.parse(decryptedTokens)
      
      // For now, return null (will be implemented with database)
      return null
    } catch (error) {
      console.error('Failed to retrieve encrypted tokens:', error)
      throw new Error('Failed to retrieve tokens')
    }
  }

  async deleteTokens(userId: string, platform: string): Promise<void> {
    try {
      console.log(`Deleting tokens for user ${userId}, platform ${platform}`)
      
      // Example implementation with Prisma:
      // await prisma.socialToken.delete({
      //   where: { userId_platform: { userId, platform } }
      // })
    } catch (error) {
      console.error('Failed to delete tokens:', error)
      throw new Error('Failed to delete tokens')
    }
  }
}

export const tokenService = new TokenService()
export default EncryptionService
