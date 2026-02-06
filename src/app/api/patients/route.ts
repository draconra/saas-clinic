import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger, getCorrelationId } from '@/lib/logger'
import {
  UnauthorizedError,
  AppError,
  getLogContext,
} from '@/lib/errors'
import { createPatientSchema } from '@/lib/validator'
import { PrismaPatientRepository, PatientService } from '@/features/patient'
import { MockClinicRepository } from '@/lib/clinic.repository.mock'

// Initialize dependencies (in production, these would be wired differently)
const patientRepo = new PrismaPatientRepository()
const clinicRepo = new MockClinicRepository()
const patientService = new PatientService(patientRepo, clinicRepo)

/**
 * GET /api/patients
 * Fetch all patients for the authenticated user's clinic
 */
export async function GET(request: Request) {
  const correlationId = getCorrelationId(new Headers(request.headers))
  const startTime = Date.now()
  const operation = 'fetch_patients'

  try {
    logger.logStart(operation, { correlationId })

    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new UnauthorizedError('Authentication required')
    }

    // Fetch patients via service
    const patients = await patientService.getAllPatients()

    logger.logSuccess(operation, {
      correlationId,
      duration: Date.now() - startTime,
      userId: session.user?.id,
      count: patients.length,
    })

    return NextResponse.json({
      data: patients,
      meta: { total: patients.length },
    })
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
          message: 'An error occurred while fetching patients',
        },
        correlationId,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/patients
 * Create a new patient
 */
export async function POST(request: Request) {
  const correlationId = getCorrelationId(new Headers(request.headers))
  const startTime = Date.now()
  const operation = 'create_patient'

  try {
    logger.logStart(operation, { correlationId })

    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new UnauthorizedError('Authentication required')
    }

    // Parse and validate request body
    const rawData = await request.json()
    const validationResult = createPatientSchema.safeParse(rawData)

    if (!validationResult.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid input data',
        400,
        validationResult.error.format()
      )
    }

    const data = validationResult.data

    // Create patient via service (includes business logic)
    const patient = await patientService.createPatient(
      data,
      session.user?.id || 'system'
    )

    logger.logSuccess(operation, {
      correlationId,
      duration: Date.now() - startTime,
      userId: session.user?.id,
      patientId: patient.id,
    })

    return NextResponse.json(
      {
        data: patient,
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
          message: 'An error occurred while creating patient',
        },
        correlationId,
      },
      { status: 500 }
    )
  }
}
