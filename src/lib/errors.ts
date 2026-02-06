/**
 * Custom error classes for better error handling
 * All errors should have error codes and proper HTTP status codes
 */

// ============================================
// Base Error Class
// ============================================

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      status: 'error',
      code: this.statusCode,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details })
      }
    }
  }
}

// ============================================
// Validation Errors (400)
// ============================================

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details)
    this.name = 'ValidationError'
  }
}

// ============================================
// Authentication Errors (401)
// ============================================

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super('UNAUTHORIZED', message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid email or password') {
    super('INVALID_CREDENTIALS', message, 401)
    this.name = 'InvalidCredentialsError'
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired') {
    super('TOKEN_EXPIRED', message, 401)
    this.name = 'TokenExpiredError'
  }
}

// ============================================
// Authorization Errors (403)
// ============================================

export class ForbiddenError extends AppError {
  constructor(message: string = 'Permission denied') {
    super('FORBIDDEN', message, 403)
    this.name = 'ForbiddenError'
  }
}

// ============================================
// Not Found Errors (404)
// ============================================

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `${resource} with id '${id}' not found`
      : `${resource} not found`
    super('NOT_FOUND', message, 404)
    this.name = 'NotFoundError'
  }
}

// ============================================
// Conflict Errors (409)
// ============================================

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409)
    this.name = 'ConflictError'
  }
}

export class DuplicateEmailError extends ConflictError {
  constructor(email: string) {
    super(`A user with email '${email}' already exists`)
    this.name = 'DuplicateEmailError'
  }
}

// ============================================
// Business Logic Errors (422)
// ============================================

export class BusinessError extends AppError {
  constructor(code: string, message: string, details?: any) {
    super(code, message, 422, details)
    this.name = 'BusinessError'
  }
}

export class InvalidOperationError extends BusinessError {
  constructor(message: string) {
    super('INVALID_OPERATION', message)
    this.name = 'InvalidOperationError'
  }
}

// ============================================
// Rate Limit Errors (429)
// ============================================

export class RateLimitError extends AppError {
  constructor(
    public retryAfter: number,
    message: string = 'Too many requests. Please try again later.'
  ) {
    super('RATE_LIMIT_EXCEEDED', message, 429, { retryAfter })
    this.name = 'RateLimitError'
  }
}

// ============================================
// Server Errors (500)
// ============================================

export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred') {
    super('INTERNAL_SERVER_ERROR', message, 500)
    this.name = 'InternalServerError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'A database error occurred') {
    super('DATABASE_ERROR', message, 500)
    this.name = 'DatabaseError'
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Check if an error is an instance of AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

/**
 * Convert any error to an AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }

  if (error instanceof Error) {
    return new InternalServerError(error.message)
  }

  return new InternalServerError('An unknown error occurred')
}

/**
 * Get a user-friendly error message (for external responses)
 */
export function getUserMessage(error: AppError): string {
  // For 500 errors, return a generic message
  if (error.statusCode >= 500) {
    return 'An internal server error occurred. Please try again later.'
  }

  // For 4xx errors, return the actual message
  return error.message
}

/**
 * Format error for logging (internal use only)
 */
export function getLogContext(error: AppError | Error | unknown) {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      stack: error.stack,
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
      stack: error.stack,
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  }
}
