import type { PatientRepository } from '../api'
import type { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'
import { NotFoundError, BusinessError, ConflictError } from '@/lib/errors'

/**
 * Patient Service
 * Contains business logic for patient operations
 *
 * This service:
 * - Enforces business rules
 * - Validates data beyond schema validation
 * - Coordinates between multiple repositories
 * - Can be tested independently of the API layer
 */
export class PatientService {
  constructor(
    private patientRepo: PatientRepository,
    private clinicRepo: any // Should be ClinicRepository interface
  ) {}

  /**
   * Get all patients matching optional filter criteria
   */
  async getAllPatients(filter?: PatientFilter): Promise<Patient[]> {
    return await this.patientRepo.findAll(filter)
  }

  /**
   * Get a patient by ID
   * @throws {NotFoundError} If patient not found
   */
  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findById(id)

    if (!patient) {
      throw new NotFoundError('Patient', id)
    }

    return patient
  }

  /**
   * Create a new patient
   * @throws {BusinessError} If no clinic exists
   * @throws {ConflictError} If email already exists
   */
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
      const existingPatient = await this.patientRepo.findByEmail(data.email)

      if (existingPatient) {
        throw new ConflictError(`A patient with email '${data.email}' already exists`)
      }
    }

    // Business rule: Validate age (0-150 years)
    const age = this.calculateAge(data.dateOfBirth)
    if (age < 0 || age > 150) {
      throw new BusinessError(
        'INVALID_DATE_OF_BIRTH',
        'Date of birth must be within the last 150 years'
      )
    }

    // Create patient
    return await this.patientRepo.create({
      ...data,
      clinicId: clinic.id,
    })
  }

  /**
   * Update an existing patient
   * @throws {NotFoundError} If patient not found
   * @throws {ConflictError} If email already exists (and is different from current)
   */
  async updatePatient(id: string, data: UpdatePatientDTO): Promise<Patient> {
    // Business rule: Check if patient exists
    const existingPatient = await this.patientRepo.findById(id)

    if (!existingPatient) {
      throw new NotFoundError('Patient', id)
    }

    // Business rule: Check for duplicate email (if email is being changed)
    if (data.email && data.email !== existingPatient.email) {
      const duplicatePatient = await this.patientRepo.findByEmail(data.email)

      if (duplicatePatient) {
        throw new ConflictError(`A patient with email '${data.email}' already exists`)
      }
    }

    // Business rule: Validate age (if date of birth is being changed)
    if (data.dateOfBirth) {
      const age = this.calculateAge(data.dateOfBirth)
      if (age < 0 || age > 150) {
        throw new BusinessError(
          'INVALID_DATE_OF_BIRTH',
          'Date of birth must be within the last 150 years'
        )
      }
    }

    return await this.patientRepo.update(id, data)
  }

  /**
   * Delete a patient
   * @throws {NotFoundError} If patient not found
   * @throws {BusinessError} If patient has active appointments/records
   */
  async deletePatient(id: string): Promise<void> {
    // Business rule: Check if patient exists
    const patient = await this.patientRepo.findById(id)

    if (!patient) {
      throw new NotFoundError('Patient', id)
    }

    // Business rule: Check if patient has related records
    // This would be implemented with appointment/record repositories
    // const hasAppointments = await this.appointmentRepo.hasActiveAppointments(id)
    // if (hasAppointments) {
    //   throw new BusinessError(
    //     'ACTIVE_APPOINTMENTS',
    //     'Cannot delete patient with active appointments'
    //   )
    // }

    await this.patientRepo.delete(id)
  }

  /**
   * Count patients matching optional filter criteria
   */
  async countPatients(filter?: PatientFilter): Promise<number> {
    return await this.patientRepo.count(filter)
  }

  /**
   * Calculate age from date of birth
   * @param dateOfBirth - Date of birth
   * @returns Age in years
   */
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
