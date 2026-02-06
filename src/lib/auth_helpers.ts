import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema, type RegisterInput } from '@/lib/validator'
import { ConflictError, ValidationError } from '@/lib/errors'

/**
 * Hash a password using bcrypt with cost factor 12
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Bcrypt with cost factor 12 (meets security requirement: min cost 12)
  return await bcrypt.hash(password, 12)
}

/**
 * Verify a password against a hash
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Validate password against security requirements
 * @param password - Plain text password to validate
 * @returns Zod validation result
 */
export function validatePassword(password: string) {
  // Password requirements from security rules:
  // - Minimum 12 characters
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one number
  // - At least one special character
  const passwordSchema = registerSchema.shape.password

  return passwordSchema.safeParse(password)
}

/**
 * Create a new user with validated and hashed password
 * @param email - User email
 * @param password - Plain text password (will be validated and hashed)
 * @param name - User name
 * @param role - User role (default: 'STAFF')
 * @returns Created user object
 * @throws {ValidationError} If password doesn't meet security requirements
 * @throws {ConflictError} If user with email already exists
 */
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: string = 'STAFF'
) {
  // Validate input using Zod schema
  const validationResult = registerSchema.safeParse({
    name,
    email,
    password,
  })

  if (!validationResult.success) {
    throw new ValidationError(
      'Invalid input data',
      validationResult.error.format()
    )
  }

  const data = validationResult.data

  // Check for existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new ConflictError(`A user with email '${data.email}' already exists`)
  }

  // Hash password with bcrypt (cost factor 12)
  const hashedPassword = await hashPassword(data.password)

  // Create user
  return await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })
}

/**
 * Verify user credentials
 * @param email - User email
 * @param password - Plain text password
 * @returns User object if credentials are valid
 * @throws {UnauthorizedError} If credentials are invalid
 */
export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new ValidationError('Invalid email or password')
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    throw new ValidationError('Invalid email or password')
  }

  // Return user without password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user

  return userWithoutPassword
}
