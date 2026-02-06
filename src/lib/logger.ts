import { randomUUID } from 'crypto'

/**
 * Structured logging utility
 * All logs should be structured JSON for easy parsing and analysis
 */

export type LogLevel = 'info' | 'warn' | 'error'

export interface LogContext {
  correlationId?: string
  operation?: string
  userId?: string
  duration?: number
  error?: string
  stack?: string
  errorCode?: string
  statusCode?: number
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context: LogContext
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private formatMessage(level: LogLevel, message: string, context: LogContext): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    return JSON.stringify(entry)
  }

  /**
   * Log informational message
   */
  info(message: string, context: LogContext = {}): void {
    console.log(this.formatMessage('info', message, context))
  }

  /**
   * Log warning message
   */
  warn(message: string, context: LogContext = {}): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  /**
   * Log error message
   */
  error(message: string, context: LogContext = {}): void {
    console.error(this.formatMessage('error', message, context))
  }

  /**
   * Log operation start
   */
  logStart(operation: string, context: LogContext = {}): void {
    this.info(`Operation started: ${operation}`, {
      operation,
      ...context,
    })
  }

  /**
   * Log operation success
   */
  logSuccess(operation: string, context: LogContext = {}): void {
    this.info(`Operation completed: ${operation}`, {
      operation,
      ...context,
    })
  }

  /**
   * Log operation failure
   */
  logFailure(operation: string, error: Error | unknown, context: LogContext = {}): void {
    const errorContext = {
      operation,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...(error instanceof Error && { stack: error.stack }),
      ...context,
    }

    this.error(`Operation failed: ${operation}`, errorContext)
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger()

/**
 * Create a correlation ID
 */
export function createCorrelationId(): string {
  return randomUUID()
}

/**
 * Get correlation ID from request headers or create a new one
 */
export function getCorrelationId(headers: Headers): string {
  return headers.get('x-correlation-id') || createCorrelationId()
}

/**
 * Measure execution time of an async operation
 */
export async function measureTime<T>(
  operation: string,
  fn: () => Promise<T>,
  context: LogContext = {}
): Promise<T> {
  const startTime = Date.now()
  const correlationId = context.correlationId || createCorrelationId()

  logger.logStart(operation, { correlationId, ...context })

  try {
    const result = await fn()
    const duration = Date.now() - startTime

    logger.logSuccess(operation, {
      correlationId,
      duration,
      ...context,
    })

    return result
  } catch (error) {
    const duration = Date.now() - startTime

    logger.logFailure(operation, error, {
      correlationId,
      duration,
      ...context,
    })

    throw error
  }
}

/**
 * Decorator for measuring function execution time
 */
export function logOperation(operation: string, context: LogContext = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now()
      const correlationId = context.correlationId || createCorrelationId()

      logger.logStart(operation, {
        correlationId,
        method: propertyKey,
        ...context,
      })

      try {
        const result = await originalMethod.apply(this, args)
        const duration = Date.now() - startTime

        logger.logSuccess(operation, {
          correlationId,
          duration,
          method: propertyKey,
          ...context,
        })

        return result
      } catch (error) {
        const duration = Date.now() - startTime

        logger.logFailure(operation, error, {
          correlationId,
          duration,
          method: propertyKey,
          ...context,
        })

        throw error
      }
    }

    return descriptor
  }
}
