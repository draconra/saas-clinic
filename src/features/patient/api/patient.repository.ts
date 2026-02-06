import type { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'

/**
 * Patient Repository Interface
 * Defines the contract for patient data access operations
 *
 * This interface enables:
 * - Testability: Mock implementations for unit tests
 * - Flexibility: Easy to swap database implementations
 * - Clean architecture: Business logic depends on abstractions, not concretions
 */
export interface PatientRepository {
  /**
   * Find all patients matching optional filter criteria
   */
  findAll(filter?: PatientFilter): Promise<Patient[]>

  /**
   * Find a patient by ID
   * @returns Patient if found, null otherwise
   */
  findById(id: string): Promise<Patient | null>

  /**
   * Find a patient by email
   * @returns Patient if found, null otherwise
   */
  findByEmail(email: string): Promise<Patient | null>

  /**
   * Create a new patient
   * @returns Created patient with generated ID
   */
  create(data: CreatePatientDTO & { clinicId: string }): Promise<Patient>

  /**
   * Update an existing patient
   * @returns Updated patient
   * @throws {NotFoundError} If patient not found
   */
  update(id: string, data: UpdatePatientDTO): Promise<Patient>

  /**
   * Delete a patient
   * @throws {NotFoundError} If patient not found
   */
  delete(id: string): Promise<void>

  /**
   * Count patients matching optional filter criteria
   */
  count(filter?: PatientFilter): Promise<number>

  /**
   * Check if a patient exists by ID
   */
  exists(id: string): Promise<boolean>
}
