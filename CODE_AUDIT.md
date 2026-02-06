# Code Audit Report

**Generated:** 2026-02-06
**Status:** ❌ CRITICAL VIOLATIONS FOUND

## Summary

The current codebase has **multiple critical violations** of the agent rules. This document outlines all violations and provides recommendations for remediation.

---

## Critical Violations

### 1. ❌ Security: Missing Input Validation Schema

**Location:** [route.ts](src/app/api/patients/route.ts:41)

**Violation:**
```typescript
const data = await request.json()
// No validation against schema before using data
```

**Rule Violated:**
- Security Principles - Input Validation & Sanitization
- "Validate against a strict Schema (Zod/Pydantic) at the Controller/Port boundary"

**Impact:**
- No type safety for incoming data
- Invalid data can cause runtime errors
- Missing business rule validation
- Potential security vulnerabilities

**Recommended Fix:**
```typescript
import { z } from 'zod'

const CreatePatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  dateOfBirth: z.string(), // Should validate date format
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  insuranceNumber: z.string().optional().nullable(),
  bloodType: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medications: z.string().optional().nullable(),
  medicalHistory: z.string().optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { status: 'error', code: 401, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    const rawData = await request.json()
    const validationResult = CreatePatientSchema.safeParse(rawData)

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
          correlationId: crypto.randomUUID()
        },
        { status: 400 }
      )
    }

    const data = validationResult.data
    // ... rest of code
  }
}
```

---

### 2. ❌ Architecture: No I/O Abstraction (Database Coupled)

**Location:** [route.ts](src/app/api/patients/route.ts:14)

**Violation:**
```typescript
const patients = await prisma.patient.findMany({
  include: { clinic: true },
  orderBy: { createdAt: 'desc' },
})
```

**Rule Violated:**
- Architectural Patterns - Rule 1: I/O Isolation
- "Abstract all I/O behind interfaces/contracts"

**Impact:**
- Cannot test without database
- Business logic coupled to Prisma ORM
- Cannot swap database implementation
- Tests are slow and require infrastructure

**Recommended Fix:**

Create interface:
```typescript
// src/features/patient/api/patient.api.ts
export interface PatientRepository {
  findAll(): Promise<Patient[]>
  findById(id: string): Promise<Patient | null>
  create(data: CreatePatientDTO): Promise<Patient>
  update(id: string, data: UpdatePatientDTO): Promise<Patient>
  delete(id: string): Promise<void>
}
```

Create implementation:
```typescript
// src/features/patient/api/patient.repository.prisma.ts
export class PrismaPatientRepository implements PatientRepository {
  async findAll(): Promise<Patient[]> {
    return await prisma.patient.findMany({
      include: { clinic: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: CreatePatientDTO): Promise<Patient> {
    return await prisma.patient.create({ data })
  }
  // ... other methods
}
```

Create mock for tests:
```typescript
// src/features/patient/api/patient.repository.mock.ts
export class MockPatientRepository implements PatientRepository {
  private patients: Patient[] = []

  async findAll(): Promise<Patient[]> {
    return [...this.patients]
  }

  async create(data: CreatePatientDTO): Promise<Patient> {
    const patient = { id: crypto.randomUUID(), ...data }
    this.patients.push(patient)
    return patient
  }
  // ... other methods
}
```

---

### 3. ❌ Error Handling: Generic Error Messages, No Correlation ID

**Location:** [route.ts](src/app/api/patients/route.ts:24-30)

**Violation:**
```typescript
catch (error) {
  console.error('Error fetching patients:', error)
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
```

**Rules Violated:**
- Error Handling Principles - "Provide Context"
- "Include error codes, correlation IDs, actionable messages"
- API Design Principles - Error Response Format

**Impact:**
- No way to trace errors across logs
- Generic message doesn't help users
- No structured error response
- Difficult to debug production issues

**Recommended Fix:**
```typescript
// Add correlation ID generation
import { randomUUID } from 'crypto'

// In the handler
export async function GET() {
  const correlationId = randomUUID()

  try {
    logger.info('Fetching patients', { correlationId, operation: 'fetch_patients' })

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        {
          status: 'error',
          code: 401,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
          correlationId
        },
        { status: 401 }
      )
    }

    const patients = await patientRepository.findAll()

    logger.info('Successfully fetched patients', {
      correlationId,
      operation: 'fetch_patients',
      duration: Date.now() - startTime,
      count: patients.length
    })

    return NextResponse.json({ data: patients, meta: { total: patients.length } })
  } catch (error) {
    logger.error('Failed to fetch patients', {
      correlationId,
      operation: 'fetch_patients',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      {
        status: 'error',
        code: 500,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while fetching patients',
        },
        correlationId
      },
      { status: 500 }
    )
  }
}
```

---

### 4. ❌ Logging: No Structured Logging

**Location:** [route.ts](src/app/api/patients/route.ts:25)

**Violation:**
```typescript
console.error('Error fetching patients:', error)
```

**Rules Violated:**
- Logging and Observability Mandate - "All Operations Must Be Logged"
- Missing mandatory context: correlationId, operation, duration, userId

**Impact:**
- Cannot trace requests across systems
- No structured logs for analysis
- Missing operation metrics
- Difficult to debug production issues

**Recommended Fix:**

Create logger utility:
```typescript
// src/lib/logger.ts
import { randomUUID } from 'crypto'

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

---

### 5. ❌ Security: Weak Password Validation

**Location:** [route.ts](src/app/api/auth/register/route.ts:15-20)

**Violation:**
```typescript
if (password.length < 6) {
  return NextResponse.json(
    { error: 'Password must be at least 6 characters long' },
    { status: 400 }
  )
}
```

**Rules Violated:**
- Security Principles - Password requirements
- "Hash with Argon2id or Bcrypt (min cost 12)"

**Impact:**
- Weak password policy (6 characters is too short)
- No complexity requirements
- Passwords may not be hashed properly (need to verify)

**Recommended Fix:**
```typescript
import { z } from 'zod'

const PasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: PasswordSchema
})

// In the handler
const validationResult = RegisterSchema.safeParse({ name, email, password })

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
      correlationId: randomUUID()
    },
    { status: 400 }
  )
}
```

---

### 6. ❌ Architecture: Business Logic Mixed with I/O

**Location:** [route.ts](src/app/api/patients/route.ts:45-52)

**Violation:**
```typescript
const clinic = await prisma.clinic.findFirst()

if (!clinic) {
  return NextResponse.json(
    { error: 'No clinic found. Please create a clinic first.' },
    { status: 400 }
  )
}
```

**Rules Violated:**
- Architectural Patterns - Rule 2: Pure Business Logic
- "Business rules mixed with I/O are impossible to test without infrastructure"

**Impact:**
- Business rule "patient must belong to a clinic" is embedded in API handler
- Cannot test business logic without database
- Harder to reuse business logic

**Recommended Fix:**

Extract business logic:
```typescript
// src/features/patient/services/patient.service.ts
export class PatientService {
  constructor(
    private patientRepo: PatientRepository,
    private clinicRepo: ClinicRepository
  ) {}

  async createPatient(data: CreatePatientDTO, userId: string): Promise<Patient> {
    // Business rule: Validate clinic exists
    const clinic = await this.clinicRepo.findDefault()

    if (!clinic) {
      throw new BusinessError(
        'NO_CLINIC_FOUND',
        'No clinic found. Please create a clinic first.'
      )
    }

    // Business rule: Validate patient age
    const age = this.calculateAge(data.dateOfBirth)
    if (age < 0 || age > 150) {
      throw new BusinessError(
        'INVALID_DATE_OF_BIRTH',
        'Invalid date of birth'
      )
    }

    return await this.patientRepo.create({
      ...data,
      clinicId: clinic.id,
      createdBy: userId
    })
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    return today.getFullYear() - dateOfBirth.getFullYear()
  }
}

// Test the business logic
describe('PatientService', () => {
  it('should reject patient creation when no clinic exists', async () => {
    const mockPatientRepo = new MockPatientRepository()
    const mockClinicRepo = new MockClinicRepository()
    mockClinicRepo.findDefault = async () => null

    const service = new PatientService(mockPatientRepo, mockClinicRepo)

    await expect(
      service.createPatient(mockData, 'user-123')
    ).rejects.toThrow('NO_CLINIC_FOUND')
  })
})
```

---

### 7. ❌ Security: No Rate Limiting

**Location:** [route.ts](src/app/api/auth/register/route.ts)

**Violation:**
Missing rate limiting on registration endpoint

**Rules Violated:**
- Security Principles - Rate Limiting
- "Enforce strictly on public endpoints (Login, Register, Password Reset). Standard: 5 attempts / 15 mins."

**Impact:**
- Vulnerable to automated account creation attacks
- Can be used for credential stuffing
- Potential DoS vector

**Recommended Fix:**

Implement rate limiting middleware:
```typescript
// src/lib/rate-limit.ts
import { LRUCache } from 'lru-cache'

const rateLimit = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 15, // 15 minutes
})

export async function rateLimitCheck(
  identifier: string,
  limit: number = 5
): Promise<boolean> {
  const count = (rateLimit.get(identifier) as number) || 0

  if (count >= limit) {
    return false
  }

  rateLimit.set(identifier, count + 1)
  return true
}

// In the route
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'

  if (!(await rateLimitCheck(ip, 5))) {
    return NextResponse.json(
      {
        status: 'error',
        code: 429,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many attempts. Please try again later.',
        },
        correlationId: randomUUID()
      },
      { status: 429 }
    )
  }

  // ... rest of handler
}
```

---

### 8. ❌ Testing: No Test Files

**Location:** All API routes

**Violation:**
No test files found for any API routes

**Rules Violated:**
- Testing Strategy - Test Coverage Requirements
- "Unit tests: >85% code coverage"
- "Integration tests: All adapter implementations"

**Impact:**
- No guarantee code works as expected
- Refactoring is dangerous
- Bugs caught late (in production)

**Recommended Fix:**

Create test files for each API route:
```typescript
// src/app/api/patients/route.spec.ts
import { POST, GET } from './route'
import { MockPatientRepository } from '@/features/patient/api/patient.repository.mock'

describe('/api/patients', () => {
  describe('POST', () => {
    it('should create patient with valid data', async () => {
      const mockRepo = new MockPatientRepository()
      const request = new Request('http://localhost/api/patients', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          dateOfBirth: '1990-01-01',
          gender: 'MALE'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.data).toHaveProperty('id')
      expect(data.data.firstName).toBe('John')
    })

    it('should reject invalid email format', async () => {
      const request = new Request('http://localhost/api/patients', {
        method: 'POST',
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          dateOfBirth: '1990-01-01',
          gender: 'MALE'
        })
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error.code).toBe('VALIDATION_ERROR')
    })
  })
})
```

---

### 9. ❌ Resources: No Database Connection Timeout

**Location:** [prisma.ts](src/lib/prisma.ts:7)

**Violation:**
```typescript
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
```

**Rules Violated:**
- Resource and Memory Management - "Timeout All I/O Operations"
- "Database queries: 10s default, configure per query complexity"

**Impact:**
- Database queries can hang indefinitely
- No timeout on connection
- Can cause resource exhaustion

**Recommended Fix:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Configure timeouts
prisma.$connect()
prisma.$use(async (params, next) => {
  const timeout = 10000 // 10 seconds
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Query timeout')), timeout)
  )

  return Promise.race([next(params), timeoutPromise])
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

### 10. ❌ Security: Password Not Verified to be Hashed

**Location:** [auth_helpers.ts](src/lib/auth_helpers.ts) (not shown, but needs verification)

**Rules Violated:**
- Security Principles - "Hash with Argon2id or Bcrypt (min cost 12)"
- "Never plain text"

**Action Required:**
Verify password hashing implementation:
```typescript
import bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12) // min cost 12
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password)

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword, // Store hashed password only
    }
  })
}
```

---

## Recommendations Priority

### Priority 1: Critical Security
1. ✅ Implement input validation with Zod schemas
2. ✅ Add proper password hashing verification
3. ✅ Implement rate limiting on auth endpoints
4. ✅ Sanitize error messages (no stack traces to clients)

### Priority 2: Architecture
5. ✅ Create repository interfaces for all database operations
6. ✅ Extract business logic into pure functions/services
7. ✅ Implement mock repositories for testing

### Priority 3: Observability
8. ✅ Implement structured logging with correlation IDs
9. ✅ Add operation tracking (start, success, failure)
10. ✅ Implement proper error response format

### Priority 4: Testing
11. ✅ Write unit tests for all business logic
12. ✅ Write integration tests for all repositories
13. ✅ Write E2E tests for critical user flows

### Priority 5: Resource Management
14. ✅ Add database query timeouts
15. ✅ Implement connection pooling configuration

---

## Next Steps

1. **Immediate:** Fix security issues (input validation, password hashing, rate limiting)
2. **Short-term:** Refactor architecture to follow testability-first design
3. **Medium-term:** Add comprehensive logging and error handling
4. **Long-term:** Achieve >85% test coverage

---

## Compliance Score

| Category | Score | Status |
|----------|-------|--------|
| Security | 2/10 | ❌ Critical |
| Architecture | 3/10 | ❌ Poor |
| Error Handling | 2/10 | ❌ Poor |
| Logging | 1/10 | ❌ Critical |
| Testing | 0/10 | ❌ Critical |
| Resource Management | 3/10 | ⚠️ Needs Work |
| **Overall** | **1.8/10** | **❌ Critical** |

**Action Required:** This codebase needs significant refactoring to meet the agent rules standards.
