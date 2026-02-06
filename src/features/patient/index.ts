/**
 * Patient feature exports
 * Public API for the patient feature
 */

// Repository exports
export type { PatientRepository } from './api/patient.repository'
export { PrismaPatientRepository } from './api/patient.repository.prisma'
export { MockPatientRepository } from './api/patient.repository.mock'

// Service exports
export { PatientService } from './services/patient.service'

// Type exports
export type { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from './types'
