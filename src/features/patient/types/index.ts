/**
 * Patient domain types
 */

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
  clinic?: {
    id: string
    name: string
  }
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
