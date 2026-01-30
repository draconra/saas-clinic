import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const patients = await prisma.patient.findMany({
      include: {
        clinic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ patients })
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // For demo purposes, we'll use the first clinic
    // In a real app, you'd get this from the user's session or context
    const clinic = await prisma.clinic.findFirst()

    if (!clinic) {
      return NextResponse.json(
        { error: 'No clinic found. Please create a clinic first.' },
        { status: 400 }
      )
    }

    const patient = await prisma.patient.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        insuranceNumber: data.insuranceNumber || null,
        bloodType: data.bloodType || null,
        allergies: data.allergies || null,
        medications: data.medications || null,
        medicalHistory: data.medicalHistory || null,
        clinicId: clinic.id,
      },
    })

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating patient:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Patient with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}