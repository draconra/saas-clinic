/**
 * Patient API exports
 * Includes repository interface and implementations
 */

export { PatientRepository } from './patient.repository'
export { PrismaPatientRepository } from './patient.repository.prisma'
export { MockPatientRepository } from './patient.repository.mock'

// Re-export types for convenience
export type { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'
