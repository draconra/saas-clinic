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

    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        clinic: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
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
    const clinic = await prisma.clinic.findFirst()

    if (!clinic) {
      return NextResponse.json(
        { error: 'No clinic found. Please create a clinic first.' },
        { status: 400 }
      )
    }

    // Validate that the doctor and patient exist
    const doctor = await prisma.user.findUnique({
      where: { id: data.doctorId },
    })

    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    })

    if (!doctor || !patient) {
      return NextResponse.json(
        { error: 'Invalid doctor or patient' },
        { status: 400 }
      )
    }

    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        description: data.description || null,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        type: data.type,
        notes: data.notes || null,
        clinicId: clinic.id,
        patientId: data.patientId,
        doctorId: data.doctorId,
      },
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating appointment:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Time slot already booked' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}