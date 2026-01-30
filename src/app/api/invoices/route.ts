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

    const invoices = await prisma.invoice.findMany({
      include: {
        patient: true,
        clinic: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ invoices })
  } catch (error) {
    console.error('Error fetching invoices:', error)
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

    // Validate that the patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    })

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        amount: data.amount,
        description: data.description || null,
        dueDate: new Date(data.dueDate),
        clinicId: clinic.id,
        patientId: data.patientId,
        createdBy: session.user?.email || 'unknown',
      },
    })

    return NextResponse.json({ invoice }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating invoice:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Invoice number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}