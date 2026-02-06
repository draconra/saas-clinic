# Quick Implementation Guide

This guide provides concrete examples for refactoring the existing codebase to comply with the agent rules.

---

## Table of Contents

1. [Setup: Project Structure](#setup-project-structure)
2. [Step 1: Create Feature Structure](#step-1-create-feature-structure)
3. [Step 2: Implement Repository Pattern](#step-2-implement-repository-pattern)
4. [Step 3: Add Input Validation](#step-3-add-input-validation)
5. [Step 4: Implement Business Logic](#step-4-implement-business-logic)
6. [Step 5: Create API Route with Logging](#step-5-create-api-route-with-logging)
7. [Step 6: Write Tests](#step-6-write-tests)
8. [Step 7: Add Middleware](#step-7-add-middleware)

---

## Setup: Project Structure

### Target Structure

```
src/
  features/
    patient/
      api/
        index.ts                        # Public exports
        patient.repository.ts           # Interface definition
        patient.repository.prisma.ts    # Prisma implementation
        patient.repository.mock.ts      # Mock for tests
      services/
        index.ts                        # Public exports
        patient.service.ts              # Business logic
        patient.service.spec.ts         # Unit tests
      types/
        index.ts                        # TypeScript types
      components/
        # Feature-specific components
  lib/
    logger.ts                           # Structured logging
    validator.ts                        # Validation helpers
    errors.ts                           # Custom error classes
  middleware/
    rate-limit.ts                       # Rate limiting
    error-handler.ts                    # Error handling middleware
    correlation-id.ts                   # Correlation ID middleware
```

---

## Step 1: Create Feature Structure

### 1.1 Create Types

```typescript
// src/features/patient/types/index.ts
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address: string | null
  emergencyContact: string | null
  insuranceNumber: string | null
  bloodType: string | null
  allergies: string | null
  medications: string | null
  medicalHistory: string | null
  clinicId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreatePatientDTO {
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  dateOfBirth: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address?: string | null
  emergencyContact?: string | null
  insuranceNumber?: string | null
  bloodType?: string | null
  allergies?: string | null
  medications?: string | null
  medicalHistory?: string | null
}

export interface UpdatePatientDTO extends Partial<CreatePatientDTO> {}

export interface PatientFilter {
  search?: string
  clinicId?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
}
```

---

## Step 2: Implement Repository Pattern

### 2.1 Define Repository Interface

```typescript
// src/features/patient/api/patient.repository.ts
import { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'

export interface PatientRepository {
  findAll(filter?: PatientFilter): Promise<Patient[]>
  findById(id: string): Promise<Patient | null>
  findByEmail(email: string): Promise<Patient | null>
  create(data: CreatePatientDTO & { clinicId: string }): Promise<Patient>
  update(id: string, data: UpdatePatientDTO): Promise<Patient>
  delete(id: string): Promise<void>
  count(filter?: PatientFilter): Promise<number>
}
```

### 2.2 Create Prisma Implementation

```typescript
// src/features/patient/api/patient.repository.prisma.ts
import { prisma } from '@/lib/prisma'
import { PatientRepository } from './patient.repository'
import { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'

export class PrismaPatientRepository implements PatientRepository {
  async findAll(filter?: PatientFilter): Promise<Patient[]> {
    const where: any = {}

    if (filter?.search) {
      where.OR = [
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } }
      ]
    }

    if (filter?.clinicId) {
      where.clinicId = filter.clinicId
    }

    if (filter?.gender) {
      where.gender = filter.gender
    }

    return await prisma.patient.findMany({
      where,
      include: { clinic: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async findById(id: string): Promise<Patient | null> {
    return await prisma.patient.findUnique({
      where: { id },
      include: { clinic: true }
    })
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return await prisma.patient.findUnique({
      where: { email },
      include: { clinic: true }
    })
  }

  async create(data: CreatePatientDTO & { clinicId: string }): Promise<Patient> {
    return await prisma.patient.create({
      data,
      include: { clinic: true }
    })
  }

  async update(id: string, data: UpdatePatientDTO): Promise<Patient> {
    return await prisma.patient.update({
      where: { id },
      data,
      include: { clinic: true }
    })
  }

  async delete(id: string): Promise<void> {
    await prisma.patient.delete({ where: { id } })
  }

  async count(filter?: PatientFilter): Promise<number> {
    const where: any = {}

    if (filter?.clinicId) {
      where.clinicId = filter.clinicId
    }

    if (filter?.gender) {
      where.gender = filter.gender
    }

    return await prisma.patient.count({ where })
  }
}
```

### 2.3 Create Mock Implementation

```typescript
// src/features/patient/api/patient.repository.mock.ts
import { PatientRepository } from './patient.repository'
import { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'

export class MockPatientRepository implements PatientRepository {
  private patients: Patient[] = []

  async findAll(filter?: PatientFilter): Promise<Patient[]> {
    let result = [...this.patients]

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(p =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower) ||
        (p.email && p.email.toLowerCase().includes(searchLower))
      )
    }

    if (filter?.clinicId) {
      result = result.filter(p => p.clinicId === filter.clinicId)
    }

    if (filter?.gender) {
      result = result.filter(p => p.gender === filter.gender)
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async findById(id: string): Promise<Patient | null> {
    return this.patients.find(p => p.id === id) || null
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.patients.find(p => p.email === email) || null
  }

  async create(data: CreatePatientDTO & { clinicId: string }): Promise<Patient> {
    const patient: Patient = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.patients.push(patient)
    return patient
  }

  async update(id: string, data: UpdatePatientDTO): Promise<Patient> {
    const index = this.patients.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Patient not found')
    }

    this.patients[index] = {
      ...this.patients[index],
      ...data,
      updatedAt: new Date()
    }

    return this.patients[index]
  }

  async delete(id: string): Promise<void> {
    this.patients = this.patients.filter(p => p.id !== id)
  }

  async count(filter?: PatientFilter): Promise<number> {
    const filtered = await this.findAll(filter)
    return filtered.length
  }

  // Helper for testing
  clear() {
    this.patients = []
  }
}
```

### 2.4 Export from Feature

```typescript
// src/features/patient/api/index.ts
export { PatientRepository } from './patient.repository'
export { PrismaPatientRepository } from './patient.repository.prisma'
export { MockPatientRepository } from './patient.repository.mock'
```

---

## Step 3: Add Input Validation

### 3.1 Create Validation Schemas

```typescript
// src/lib/validator.ts
import { z } from 'zod'

export const createPatientSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .nullable(),
  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  dateOfBirth: z.string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid date format')
    .transform(val => new Date(val))
    .refine(val => {
      const age = new Date().getFullYear() - val.getFullYear()
      return age >= 0 && age <= 150
    }, 'Invalid date of birth'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Gender must be MALE, FEMALE, or OTHER' })
  }),
  address: z.string().max(500).optional().nullable(),
  emergencyContact: z.string().max(200).optional().nullable(),
  insuranceNumber: z.string().max(50).optional().nullable(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .nullable(),
  allergies: z.string().max(2000).optional().nullable(),
  medications: z.string().max(2000).optional().nullable(),
  medicalHistory: z.string().max(5000).optional().nullable(),
})

export const updatePatientSchema = createPatientSchema.partial()

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email format'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
})

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
export type RegisterInput = z.infer<typeof registerSchema>
```

---

## Step 4: Implement Business Logic

### 4.1 Create Custom Errors

```typescript
// src/lib/errors.ts
export class BusinessError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'BusinessError'
  }
}

export class ValidationError extends BusinessError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400)
    this.details = details
  }
  details?: any
}

export class NotFoundError extends BusinessError {
  constructor(resource: string, id?: string) {
    super(
      'NOT_FOUND',
      id ? `${resource} with id ${id} not found` : `${resource} not found`,
      404
    )
  }
}

export class UnauthorizedError extends BusinessError {
  constructor(message: string = 'Authentication required') {
    super('UNAUTHORIZED', message, 401)
  }
}

export class ForbiddenError extends BusinessError {
  constructor(message: string = 'Permission denied') {
    super('FORBIDDEN', message, 403)
  }
}
```

### 4.2 Create Service Layer

```typescript
// src/features/patient/services/patient.service.ts
import { PatientRepository } from '../api'
import { CreatePatientDTO, UpdatePatientDTO, Patient } from '../types'
import { BusinessError, NotFoundError, ValidationError } from '@/lib/errors'

export class PatientService {
  constructor(
    private patientRepo: PatientRepository,
    private clinicRepo: any // Would also have ClinicRepository interface
  ) {}

  async getAllPatients(filter?: any): Promise<Patient[]> {
    return await this.patientRepo.findAll(filter)
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findById(id)

    if (!patient) {
      throw new NotFoundError('Patient', id)
    }

    return patient
  }

  async createPatient(data: CreatePatientDTO, userId: string): Promise<Patient> {
    // Business rule: Get default clinic
    const clinic = await this.clinicRepo.findDefault()

    if (!clinic) {
      throw new BusinessError(
        'NO_CLINIC_FOUND',
        'No clinic found. Please create a clinic first.'
      )
    }

    // Business rule: Check for duplicate email
    if (data.email) {
      const existing = await this.patientRepo.findByEmail(data.email)
      if (existing) {
        throw new BusinessError(
          'DUPLICATE_EMAIL',
          'A patient with this email already exists'
        )
      }
    }

    // Business rule: Validate age
    const age = this.calculateAge(data.dateOfBirth)
    if (age < 0 || age > 150) {
      throw new ValidationError('Invalid date of birth')
    }

    return await this.patientRepo.create({
      ...data,
      clinicId: clinic.id
    })
  }

  async updatePatient(id: string, data: UpdatePatientDTO): Promise<Patient> {
    // Business rule: Check if patient exists
    const existing = await this.patientRepo.findById(id)

    if (!existing) {
      throw new NotFoundError('Patient', id)
    }

    // Business rule: Check for duplicate email
    if (data.email && data.email !== existing.email) {
      const duplicate = await this.patientRepo.findByEmail(data.email)
      if (duplicate) {
        throw new BusinessError(
          'DUPLICATE_EMAIL',
          'A patient with this email already exists'
        )
      }
    }

    return await this.patientRepo.update(id, data)
  }

  async deletePatient(id: string): Promise<void> {
    // Business rule: Check if patient exists
    const existing = await this.patientRepo.findById(id)

    if (!existing) {
      throw new NotFoundError('Patient', id)
    }

    // Business rule: Check if patient has active appointments
    // const hasAppointments = await this.appointmentRepo.hasActiveAppointments(id)
    // if (hasAppointments) {
    //   throw new BusinessError(
    //     'ACTIVE_APPOINTMENTS',
    //     'Cannot delete patient with active appointments'
    //   )
    // }

    await this.patientRepo.delete(id)
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    let age = today.getFullYear() - dateOfBirth.getFullYear()
    const monthDiff = today.getMonth() - dateOfBirth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--
    }

    return age
  }
}
```

---

## Step 5: Create API Route with Logging

### 5.1 Create Logger Utility

```typescript
// src/lib/logger.ts
type LogLevel = 'info' | 'warn' | 'error'

interface LogContext {
  correlationId?: string
  operation?: string
  userId?: string
  duration?: number
  error?: string
  stack?: string
  [key: string]: any
}

export class Logger {
  private formatMessage(level: LogLevel, message: string, context: LogContext) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context
    })
  }

  info(message: string, context: LogContext = {}) {
    console.log(this.formatMessage('info', message, context))
  }

  warn(message: string, context: LogContext = {}) {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, context: LogContext = {}) {
    console.error(this.formatMessage('error', message, context))
  }
}

export const logger = new Logger()
```

### 5.2 Create API Route

```typescript
// src/app/api/patients/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { BusinessError } from '@/lib/errors'
import { PrismaPatientRepository } from '@/features/patient/api'
import { PatientService } from '@/features/patient/services/patient.service'
import { createPatientSchema } from '@/lib/validator'
import { randomUUID } from 'crypto'

// Initialize dependencies
const patientRepo = new PrismaPatientRepository()
const patientService = new PatientService(patientRepo, null) // Would pass clinicRepo

export async function GET(request: Request) {
  const correlationId = randomUUID()
  const startTime = Date.now()

  try {
    logger.info('Fetching patients', {
      correlationId,
      operation: 'fetch_patients'
    })

    // Authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        {
          status: 'error',
          code: 401,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          },
          correlationId
        },
        { status: 401 }
      )
    }

    // Fetch patients
    const patients = await patientService.getAllPatients()

    logger.info('Successfully fetched patients', {
      correlationId,
      operation: 'fetch_patients',
      duration: Date.now() - startTime,
      userId: session.user?.id,
      count: patients.length
    })

    return NextResponse.json({
      data: patients,
      meta: { total: patients.length }
    })
  } catch (error) {
    logger.error('Failed to fetch patients', {
      correlationId,
      operation: 'fetch_patients',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      {
        status: 'error',
        code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching patients'
        },
        correlationId
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const correlationId = randomUUID()
  const startTime = Date.now()

  try {
    logger.info('Creating patient', {
      correlationId,
      operation: 'create_patient'
    })

    // Authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        {
          status: 'error',
          code: 401,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          },
          correlationId
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const rawData = await request.json()
    const validationResult = createPatientSchema.safeParse(rawData)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          status: 'error',
          code: 400,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: validationResult.error.format()
          },
          correlationId
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create patient via service
    const patient = await patientService.createPatient(
      data,
      session.user?.id || 'system'
    )

    logger.info('Successfully created patient', {
      correlationId,
      operation: 'create_patient',
      duration: Date.now() - startTime,
      userId: session.user?.id,
      patientId: patient.id
    })

    return NextResponse.json(
      { data: patient },
      { status: 201 }
    )
  } catch (error) {
    // Handle business errors
    if (error instanceof BusinessError) {
      logger.warn('Business error while creating patient', {
        correlationId,
        operation: 'create_patient',
        duration: Date.now() - startTime,
        errorCode: error.code,
        error: error.message
      })

      return NextResponse.json(
        {
          status: 'error',
          code: error.statusCode,
          error: {
            code: error.code,
            message: error.message
          },
          correlationId
        },
        { status: error.statusCode }
      )
    }

    // Handle unexpected errors
    logger.error('Failed to create patient', {
      correlationId,
      operation: 'create_patient',
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      {
        status: 'error',
        code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating patient'
        },
        correlationId
      },
      { status: 500 }
    )
  }
}
```

---

## Step 6: Write Tests

### 6.1 Unit Tests for Service

```typescript
// src/features/patient/services/patient.service.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { PatientService } from './patient.service'
import { MockPatientRepository } from '../api'
import { NotFoundError, BusinessError } from '@/lib/errors'

describe('PatientService', () => {
  let service: PatientService
  let mockPatientRepo: MockPatientRepository
  let mockClinicRepo: any

  beforeEach(() => {
    mockPatientRepo = new MockPatientRepository()
    mockClinicRepo = {
      findDefault: async () => ({ id: 'clinic-1', name: 'Test Clinic' })
    }
    service = new PatientService(mockPatientRepo, mockClinicRepo)
  })

  describe('createPatient', () => {
    it('should create patient successfully', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE' as const
      }

      const patient = await service.createPatient(data, 'user-1')

      expect(patient).toHaveProperty('id')
      expect(patient.firstName).toBe('John')
      expect(patient.email).toBe('john@example.com')
    })

    it('should throw error when no clinic exists', async () => {
      mockClinicRepo.findDefault = async () => null

      const data = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE' as const
      }

      await expect(
        service.createPatient(data, 'user-1')
      ).rejects.toThrow('NO_CLINIC_FOUND')
    })

    it('should reject duplicate email', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE' as const
      }

      await service.createPatient(data, 'user-1')

      await expect(
        service.createPatient(data, 'user-1')
      ).rejects.toThrow('DUPLICATE_EMAIL')
    })
  })

  describe('getPatientById', () => {
    it('should return patient when found', async () => {
      const created = await service.createPatient({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'MALE'
      }, 'user-1')

      const patient = await service.getPatientById(created.id)

      expect(patient).toHaveProperty('id', created.id)
      expect(patient.firstName).toBe('John')
    })

    it('should throw NotFoundError when not found', async () => {
      await expect(
        service.getPatientById('non-existent')
      ).rejects.toThrow(NotFoundError)
    })
  })
})
```

---

## Step 7: Add Middleware

### 7.1 Rate Limiting Middleware

```typescript
// src/middleware/rate-limit.ts
import { LRUCache } from 'lru-cache'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 15, // 15 minutes
})

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function checkRateLimit(
  identifier: string,
  limit: number = 5
): Promise<RateLimitResult> {
  const count = (rateLimit.get(identifier) as number) || 0
  const remaining = Math.max(0, limit - count - 1)
  const reset = Date.now() + (1000 * 60 * 15) // 15 minutes from now

  if (count >= limit) {
    return { success: false, limit, remaining: 0, reset }
  }

  rateLimit.set(identifier, count + 1)
  return { success: true, limit, remaining, reset }
}

export function rateLimitMiddleware(limit: number = 5) {
  return async (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    const result = await checkRateLimit(ip, limit)

    if (!result.success) {
      return NextResponse.json(
        {
          status: 'error',
          code: 429,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many attempts. Please try again later.'
          }
        },
        { status: 429, headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString()
        }}
      )
    }

    return NextResponse.next()
  }
}
```

### 7.2 Correlation ID Middleware

```typescript
// src/middleware/correlation-id.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

export function correlationIdMiddleware(request: NextRequest) {
  const existingId = request.headers.get('x-correlation-id')
  const correlationId = existingId || randomUUID()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-correlation-id', correlationId)

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}
```

---

## Configuration Files

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.types.ts',
        '**/index.ts'
      ]
    }
  }
})
```

### package.json scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run -c vitest.integration.config.ts",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  }
}
```

---

## Usage Checklist

- [ ] Create feature folder structure under `src/features/`
- [ ] Define TypeScript types
- [ ] Create repository interface
- [ ] Implement Prisma repository
- [ ] Implement mock repository
- [ ] Create validation schemas with Zod
- [ ] Create service layer with business logic
- [ ] Write unit tests for service
- [ ] Create API route handlers
- [ ] Add logging to all operations
- [ ] Add error handling
- [ ] Add rate limiting to public endpoints
- [ ] Write integration tests
- [ ] Write E2E tests
- [ ] Update documentation

---

## Migration Strategy

1. **Phase 1: Setup** (1-2 days)
   - Create folder structure
   - Set up validation, logging, errors
   - Configure test framework

2. **Phase 2: Refactor One Feature** (2-3 days)
   - Choose a simple feature (patients)
   - Create repositories, services
   - Write tests
   - Update API routes

3. **Phase 3: Repeat for All Features** (1-2 weeks)
   - Apply same pattern to all features
   - Ensure consistency

4. **Phase 4: Hardening** (3-5 days)
   - Add comprehensive E2E tests
   - Performance testing
   - Security audit

5. **Phase 5: Documentation** (1-2 days)
   - Update API documentation
   - Create runbooks
   - Team training
