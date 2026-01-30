export type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'STAFF'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
export type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'SURGERY' | 'LAB_TEST' | 'IMAGING' | 'VACCINATION'
export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED'

export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  dateOfBirth: Date
  gender: Gender
  address?: string
  emergencyContact?: string
  insuranceNumber?: string
  bloodType?: string
  allergies?: string
  medications?: string
  medicalHistory?: string
  createdAt: Date
  updatedAt: Date
  clinicId: string
}

export interface Clinic {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  website?: string
  description?: string
  createdAt: Date
  updatedAt: Date
  ownerId: string
}

export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  createdAt: Date
  updatedAt: Date
  clinicId: string
  patientId: string
  doctorId: string
}

export interface MedicalRecord {
  id: string
  diagnosis?: string
  symptoms?: string
  treatment?: string
  prescription?: string
  notes?: string
  vitalSigns?: string
  labResults?: string
  imaging?: string
  followUpDate?: Date
  createdAt: Date
  updatedAt: Date
  clinicId: string
  patientId: string
  doctorId: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  amount: number
  status: InvoiceStatus
  description?: string
  dueDate: Date
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
  clinicId: string
  patientId: string
  createdBy: string
}

export interface BodyChart {
  id: string
  bodyRegion: string
  findings?: string | null
  severity?: string | null
  description?: string | null
  coordinates?: string | null
  bodyPart?: string | null
  side?: string | null
  medicalRecordId: string
  createdAt: Date
  updatedAt: Date
}

export interface BodyRegion {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  svgPath?: string
}

export interface MedicalRecordExtended extends Omit<MedicalRecord, 'bodyCharts'> {
  bodyCharts: BodyChart[]
}

export interface ExaminationFormData {
  patientId?: string
  chiefComplaint: string
  historyOfPresentIllness: string
  pastMedicalHistory: string
  familyHistory: string
  socialHistory: string
  reviewOfSystems: string
  vitalSigns: string
  physicalExam: string
  diagnosis: string
  assessment: string
  plan: string
  treatment: string
  prescription: string
  followUpDate: string
  notes: string
  bodyCharts: BodyChart[]
}