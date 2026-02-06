import { NextResponse } from 'next/server'
import { getCorrelationId } from '@/lib/logger'
import { RateLimitError } from '@/lib/errors'

/**
 * Simple in-memory rate limiter
 * Note: For production, use Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private cache: Map<string, RateLimitEntry>
  private defaultWindowMs: number
  private maxEntries: number

  constructor(maxEntries: number = 10000, defaultWindowMs: number = 15 * 60 * 1000) {
    this.cache = new Map()
    this.defaultWindowMs = defaultWindowMs
    this.maxEntries = maxEntries

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000)
  }

  /**
   * Check if a request should be rate limited
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param limit - Max requests allowed in the time window
   * @param windowMs - Time window in milliseconds (default: 15 minutes)
   * @returns Rate limit result
   */
  check(
    identifier: string,
    limit: number,
    windowMs: number = this.defaultWindowMs
  ): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now()
    const entry = this.cache.get(identifier)

    // If no entry exists or window has expired, create new entry
    if (!entry || now >= entry.resetTime) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + windowMs,
      }

      this.cache.set(identifier, newEntry)

      // Enforce cache size limit
      if (this.cache.size > this.maxEntries) {
        this.cleanup()
      }

      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: newEntry.resetTime,
      }
    }

    // Increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: entry.resetTime,
      }
    }

    return {
      success: true,
      limit,
      remaining: limit - entry.count,
      reset: entry.resetTime,
    }
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.cache.delete(identifier)
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.resetTime) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key)
    }
  }

  /**
   * Get current cache size
   */
  get size(): number {
    return this.cache.size
  }
}

// Singleton instance
const rateLimiter = new RateLimiter()

/**
 * Rate limit configuration for different endpoints
 */
export const rateLimitConfig = {
  // Auth endpoints: 5 requests per 15 minutes
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // API endpoints: 100 requests per minute
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  // Strict endpoints: 3 requests per hour
  strict: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
}

/**
 * Check rate limit and throw error if exceeded
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @throws {RateLimitError} If rate limit is exceeded
 */
export function checkRateLimit(
  identifier: string,
  config: { limit: number; windowMs: number }
): void {
  const result = rateLimiter.check(identifier, config.limit, config.windowMs)

  if (!result.success) {
    throw new RateLimitError(
      Math.ceil((result.reset - Date.now()) / 1000), // Convert to seconds
      `Too many requests. Please try again later.`
    )
  }
}

/**
 * Middleware function to check rate limit
 * @param request - Next.js Request object
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limited, null otherwise
 */
export async function rateLimitMiddleware(
  request: Request,
  config: { limit: number; windowMs: number }
): Promise<NextResponse | null> {
  // Get identifier from IP address
  const headers = new Headers(request.headers)
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'

  const correlationId = getCorrelationId(headers)

  try {
    checkRateLimit(ip, config)
    return null // Proceed with request
  } catch (error) {
    if (error instanceof RateLimitError) {
      // Return rate limit error response
      return NextResponse.json(
        {
          status: 'error',
          code: 429,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: error.message,
          },
          correlationId,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.limit.toString(),
            'Retry-After': error.retryAfter.toString(),
          },
        }
      )
    }

    // Re-throw other errors
    throw error
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: Request): string {
  const headers = new Headers(request.headers)

  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
