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

    const records = await prisma.medicalRecord.findMany({
      include: {
        patient: true,
        doctor: true,
        clinic: true,
        bodyCharts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ records })
  } catch (error) {
    console.error('Error fetching medical records:', error)
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

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        chiefComplaint: data.chiefComplaint || null,
        historyOfPresentIllness: data.historyOfPresentIllness || null,
        pastMedicalHistory: data.pastMedicalHistory || null,
        familyHistory: data.familyHistory || null,
        socialHistory: data.socialHistory || null,
        reviewOfSystems: data.reviewOfSystems || null,
        vitalSigns: data.vitalSigns || null,
        physicalExam: data.physicalExam || null,
        diagnosis: data.diagnosis || null,
        assessment: data.assessment || null,
        plan: data.plan || null,
        treatment: data.treatment || null,
        prescription: data.prescription || null,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        symptoms: data.symptoms || null,
        notes: data.notes || null,
        labResults: data.labResults || null,
        imaging: data.imaging || null,
        clinicId: clinic.id,
        patientId: data.patientId,
        doctorId: session.user.id,
      },
    })

    // Create body charts if provided
    if (data.bodyCharts && data.bodyCharts.length > 0) {
      await prisma.bodyChart.createMany({
        data: data.bodyCharts.map((bodyChart: any) => ({
          bodyRegion: bodyChart.bodyRegion,
          findings: bodyChart.findings || null,
          severity: bodyChart.severity || null,
          description: bodyChart.description || null,
          coordinates: bodyChart.coordinates || null,
          bodyPart: bodyChart.bodyPart || null,
          side: bodyChart.side || null,
          medicalRecordId: medicalRecord.id,
        })),
      })
    }

    // Fetch the complete record with body charts
    const completeRecord = await prisma.medicalRecord.findUnique({
      where: { id: medicalRecord.id },
      include: {
        bodyCharts: true,
        patient: true,
        doctor: true,
      },
    })

    return NextResponse.json({ medicalRecord: completeRecord }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating medical record:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}