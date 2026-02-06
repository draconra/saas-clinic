import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth_helpers'
import { logger, getCorrelationId } from '@/lib/logger'
import {
  AppError,
  getLogContext,
} from '@/lib/errors'
import { rateLimitMiddleware, rateLimitConfig } from '@/lib/rate-limit'

/**
 * POST /api/auth/register
 * Register a new user
 *
 * Rate limit: 5 requests per 15 minutes per IP address
 */
export async function POST(request: Request) {
  const correlationId = getCorrelationId(new Headers(request.headers))
  const startTime = Date.now()
  const operation = 'register_user'

  try {
    logger.logStart(operation, { correlationId })

    // Check rate limit
    const rateLimitResponse = await rateLimitMiddleware(request, rateLimitConfig.auth)
    if (rateLimitResponse) {
      logger.warn(`${operation} rate limited`, {
        correlationId,
        operation,
      })

      return rateLimitResponse
    }

    // Parse request body
    const { name, email, password } = await request.json()

    // Create user (includes validation and password hashing)
    const user = await createUser(email, password, name)

    logger.logSuccess(operation, {
      correlationId,
      duration: Date.now() - startTime,
      userId: user.id,
      email,
    })

    return NextResponse.json(
      {
        data: {
          message: 'User created successfully',
          userId: user.id,
        },
        correlationId,
      },
      { status: 201 }
    )
  } catch (error) {
    const duration = Date.now() - startTime

    // Handle AppError instances
    if (error instanceof AppError) {
      logger.warn(`${operation} failed`, {
        correlationId,
        duration,
        ...getLogContext(error),
      })

      return NextResponse.json(
        {
          ...error.toJSON(),
          correlationId,
        },
        { status: error.statusCode }
      )
    }

    // Handle unexpected errors
    logger.error(`${operation} failed`, {
      correlationId,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        status: 'error',
        code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating user',
        },
        correlationId,
      },
      { status: 500 }
    )
  }
}
