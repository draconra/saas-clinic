import { z } from 'zod'

/**
 * Validation schemas for API endpoints
 * All input validation should happen at the API boundary using these schemas
 */

// ============================================
// Patient Validation Schemas
// ============================================

export const createPatientSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters')
    .trim(),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters')
    .trim(),
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
    }, 'Date of birth must be within the last 150 years'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Gender must be MALE, FEMALE, or OTHER' })
  }),
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .optional()
    .nullable(),
  emergencyContact: z.string()
    .max(200, 'Emergency contact must be less than 200 characters')
    .optional()
    .nullable(),
  insuranceNumber: z.string()
    .max(50, 'Insurance number must be less than 50 characters')
    .optional()
    .nullable(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .nullable(),
  allergies: z.string()
    .max(2000, 'Allergies must be less than 2000 characters')
    .optional()
    .nullable(),
  medications: z.string()
    .max(2000, 'Medications must be less than 2000 characters')
    .optional()
    .nullable(),
  medicalHistory: z.string()
    .max(5000, 'Medical history must be less than 5000 characters')
    .optional()
    .nullable(),
})

export const updatePatientSchema = createPatientSchema.partial()

export const patientFilterSchema = z.object({
  search: z.string().optional(),
  clinicId: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
})

// ============================================
// Authentication Validation Schemas
// ============================================

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(12, 'Password must be at least 12 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
})

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase(),
  password: z.string()
    .min(1, 'Password is required'),
})

// ============================================
// Appointment Validation Schemas
// ============================================

export const createAppointmentSchema = z.object({
  patientId: z.string()
    .min(1, 'Patient ID is required'),
  doctorId: z.string()
    .min(1, 'Doctor ID is required'),
  startTime: z.string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid start time format')
    .transform(val => new Date(val))
    .refine(val => val > new Date(), 'Start time must be in the future'),
  endTime: z.string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid end time format')
    .transform(val => new Date(val)),
  reason: z.string()
    .min(1, 'Reason is required')
    .max(500, 'Reason must be less than 500 characters')
    .trim(),
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional()
    .nullable(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .optional()
    .default('SCHEDULED'),
}).refine(
  data => data.endTime > data.startTime,
  { message: 'End time must be after start time', path: ['endTime'] }
)

export const updateAppointmentSchema = createAppointmentSchema.partial().omit({
  patientId: true, // Cannot change the patient
})

// ============================================
// Medical Record Validation Schemas
// ============================================

export const createMedicalRecordSchema = z.object({
  patientId: z.string()
    .min(1, 'Patient ID is required'),
  doctorId: z.string()
    .min(1, 'Doctor ID is required'),
  visitDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid visit date format')
    .transform(val => new Date(val))
    .optional()
    .default(() => new Date()),
  chiefComplaint: z.string()
    .min(1, 'Chief complaint is required')
    .max(500, 'Chief complaint must be less than 500 characters')
    .trim(),
  diagnosis: z.string()
    .max(2000, 'Diagnosis must be less than 2000 characters')
    .optional()
    .nullable(),
  treatment: z.string()
    .max(5000, 'Treatment must be less than 5000 characters')
    .optional()
    .nullable(),
  notes: z.string()
    .max(5000, 'Notes must be less than 5000 characters')
    .optional()
    .nullable(),
  vitalSigns: z.object({
    bloodPressureSystolic: z.number().int().min(50).max(300).optional(),
    bloodPressureDiastolic: z.number().int().min(30).max(200).optional(),
    heartRate: z.number().int().min(30).max(250).optional(),
    temperature: z.number().min(30).max(45).optional(), // Celsius
    weight: z.number().min(0).max(500).optional(), // kg
    height: z.number().min(0).max(300).optional(), // cm
  }).optional().nullable(),
})

export const updateMedicalRecordSchema = createMedicalRecordSchema.partial()

// ============================================
// Invoice Validation Schemas
// ============================================

export const createInvoiceSchema = z.object({
  patientId: z.string()
    .min(1, 'Patient ID is required'),
  appointmentId: z.string()
    .optional()
    .nullable(),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required').max(500),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().positive('Unit price must be positive'),
  })).min(1, 'At least one item is required'),
  issueDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid issue date format')
    .transform(val => new Date(val))
    .optional()
    .default(() => new Date()),
  dueDate: z.string()
    .refine(val => !isNaN(Date.parse(val)), 'Invalid due date format')
    .transform(val => new Date(val))
    .optional(),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
    .nullable(),
}).refine(
  data => !data.dueDate || data.dueDate >= data.issueDate,
  { message: 'Due date must be on or after issue date', path: ['dueDate'] }
)

// ============================================
// Doctor Validation Schemas
// ============================================

export const createDoctorSchema = z.object({
  userId: z.string()
    .min(1, 'User ID is required'),
  specialization: z.string()
    .min(1, 'Specialization is required')
    .max(200, 'Specialization must be less than 200 characters')
    .trim(),
  licenseNumber: z.string()
    .min(1, 'License number is required')
    .max(100, 'License number must be less than 100 characters')
    .trim(),
  qualification: z.string()
    .min(1, 'Qualification is required')
    .max(200, 'Qualification must be less than 200 characters')
    .trim(),
  experience: z.number()
    .int()
    .min(0, 'Experience cannot be negative')
    .max(70, 'Experience cannot exceed 70 years')
    .optional(),
  consultationFee: z.number()
    .positive('Consultation fee must be positive')
    .optional(),
})

export const updateDoctorSchema = createDoctorSchema.partial()

// ============================================
// Type Exports
// ============================================

export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
export type PatientFilter = z.infer<typeof patientFilterSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>
export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>
