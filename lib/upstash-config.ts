import { Redis } from '@upstash/redis'

// Upstash Redis configuration with fallback
export const createRedisClient = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    console.warn('Upstash Redis credentials not found. Caching will be disabled.')
    return null
  }

  try {
    return new Redis({
      url,
      token,
    })
  } catch (error) {
    console.error('Failed to initialize Upstash Redis:', error)
    return null
  }
}

// Global Redis client instance
export const redis = createRedisClient()

// Check if Redis is available
export const isRedisAvailable = () => redis !== null
