import type { PatientRepository } from './patient.repository'
import type { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'

/**
 * Mock implementation of PatientRepository for testing
 * Stores data in memory
 */
export class MockPatientRepository implements PatientRepository {
  private patients: Patient[] = []

  async findAll(filter?: PatientFilter): Promise<Patient[]> {
    let result = [...this.patients]

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.firstName.toLowerCase().includes(searchLower) ||
          p.lastName.toLowerCase().includes(searchLower) ||
          (p.email && p.email.toLowerCase().includes(searchLower))
      )
    }

    if (filter?.clinicId) {
      result = result.filter((p) => p.clinicId === filter.clinicId)
    }

    if (filter?.gender) {
      result = result.filter((p) => p.gender === filter.gender)
    }

    return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async findById(id: string): Promise<Patient | null> {
    return this.patients.find((p) => p.id === id) || null
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return this.patients.find((p) => p.email === email) || null
  }

  async create(data: CreatePatientDTO & { clinicId: string }): Promise<Patient> {
    const patient: Patient = {
      id: this.generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ?? null,
      phone: data.phone ?? null,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      address: data.address ?? null,
      emergencyContact: data.emergencyContact ?? null,
      insuranceNumber: data.insuranceNumber ?? null,
      bloodType: data.bloodType ?? null,
      allergies: data.allergies ?? null,
      medications: data.medications ?? null,
      medicalHistory: data.medicalHistory ?? null,
      clinicId: data.clinicId,
      clinic: {
        id: data.clinicId,
        name: 'Test Clinic',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.patients.push(patient)
    return patient
  }

  async update(id: string, data: UpdatePatientDTO): Promise<Patient> {
    const index = this.patients.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error('Patient not found')
    }

    this.patients[index] = {
      ...this.patients[index],
      ...data,
      updatedAt: new Date(),
    }

    return this.patients[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.patients.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new Error('Patient not found')
    }

    this.patients.splice(index, 1)
  }

  async count(filter?: PatientFilter): Promise<number> {
    const filtered = await this.findAll(filter)
    return filtered.length
  }

  async exists(id: string): Promise<boolean> {
    return this.patients.some((p) => p.id === id)
  }

  /**
   * Helper method for testing: Clear all data
   */
  clear(): void {
    this.patients = []
  }

  /**
   * Helper method for testing: Seed with test data
   */
  seed(patients: Patient[]): void {
    this.patients = patients
  }

  /**
   * Helper method for testing: Get all data (for assertions)
   */
  getAll(): Patient[] {
    return [...this.patients]
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `patient_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
