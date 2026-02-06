import { prisma } from '@/lib/prisma'
import type { PatientRepository } from './patient.repository'
import type { Patient, CreatePatientDTO, UpdatePatientDTO, PatientFilter } from '../types'

/**
 * Prisma implementation of PatientRepository
 * Uses Prisma ORM for database operations
 */
export class PrismaPatientRepository implements PatientRepository {
  async findAll(filter?: PatientFilter): Promise<Patient[]> {
    const where: any = {}

    if (filter?.search) {
      where.OR = [
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ]
    }

    if (filter?.clinicId) {
      where.clinicId = filter.clinicId
    }

    if (filter?.gender) {
      where.gender = filter.gender
    }

    const patients = await prisma.patient.findMany({
      where,
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return patients as Patient[]
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return patient as Patient | null
  }

  async findByEmail(email: string): Promise<Patient | null> {
    if (!email) {
      return null
    }

    // Use findFirst since email may not be a unique field
    const patient = await prisma.patient.findFirst({
      where: { email },
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return patient as Patient | null
  }

  async create(data: CreatePatientDTO & { clinicId: string }): Promise<Patient> {
    const patient = await prisma.patient.create({
      data,
      include: {
        clinic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return patient as Patient
  }

  async update(id: string, data: UpdatePatientDTO): Promise<Patient> {
    try {
      const patient = await prisma.patient.update({
        where: { id },
        data,
        include: {
          clinic: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return patient as Patient
    } catch (error) {
      // Prisma throws when record not found
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        throw new Error('Patient not found')
      }
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.patient.delete({
        where: { id },
      })
    } catch (error) {
      // Prisma throws when record not found
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
        throw new Error('Patient not found')
      }
      throw error
    }
  }

  async count(filter?: PatientFilter): Promise<number> {
    const where: any = {}

    if (filter?.clinicId) {
      where.clinicId = filter.clinicId
    }

    if (filter?.gender) {
      where.gender = filter.gender
    }

    return await prisma.patient.count({ where })
  }

  async exists(id: string): Promise<boolean> {
    const patient = await prisma.patient.findUnique({
      where: { id },
      select: { id: true },
    })

    return patient !== null
  }
}
