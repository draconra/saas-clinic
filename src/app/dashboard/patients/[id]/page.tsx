import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Activity,
  FileText,
  DollarSign
} from 'lucide-react'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function PatientDetailsPage({ params }: Props) {
  const { id } = await params
  const patient = await prisma.patient.findUnique({
    where: {
      id: id,
    },
    include: {
      clinic: true,
      appointments: {
        take: 5,
        orderBy: {
          startTime: 'desc',
        },
      },
      medicalRecords: {
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      },
      invoices: {
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Patient not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The patient you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/patients"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Patients
          </Link>
        </div>
      </div>
    )
  }

  const age = Math.floor((new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365))

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard/patients" className="text-blue-600 hover:text-blue-800 mr-3">
            <ArrowLeft className="h-5 w-5 inline mr-1" />
            Back to Patients
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="mt-2 text-gray-600">
              Patient ID: {patient.id.slice(-8)} • Age: {age} • {patient.gender}
            </p>
          </div>
          <Link
            href={`/dashboard/patients/${patient.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Patient
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-sm text-gray-900">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-sm text-gray-900">{age} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender</label>
                <p className="text-sm text-gray-900">{patient.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Blood Type</label>
                <p className="text-sm text-gray-900">{patient.bloodType || 'Not specified'}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-500">Contact Information</label>
              <div className="mt-2 space-y-2">
                {patient.email && (
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {patient.email}
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center text-sm text-gray-900">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {patient.phone}
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {patient.address}
                  </div>
                )}
                {patient.emergencyContact && (
                  <div className="flex items-center text-sm text-gray-900">
                    <Activity className="h-4 w-4 mr-2 text-gray-400" />
                    Emergency: {patient.emergencyContact}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium text-gray-500">Insurance</label>
              <p className="mt-1 text-sm text-gray-900">{patient.insuranceNumber || 'Not specified'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Medical Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Allergies</label>
              <p className="mt-1 text-sm text-gray-900">{patient.allergies || 'None known'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Current Medications</label>
              <p className="mt-1 text-sm text-gray-900">{patient.medications || 'None'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Medical History</label>
              <p className="mt-1 text-sm text-gray-900">{patient.medicalHistory || 'No significant history'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Calendar className="h-4 w-4 mr-2" />
              Recent Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient.appointments.length === 0 ? (
              <p className="text-sm text-gray-500">No appointments yet</p>
            ) : (
              <div className="space-y-3">
                {patient.appointments.map((appointment) => (
                  <div key={appointment.id} className="text-sm">
                    <p className="font-medium text-gray-900">{appointment.title}</p>
                    <p className="text-gray-500">
                      {new Date(appointment.startTime).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href={`/dashboard/appointments/new?patientId=${patient.id}`}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 block"
            >
              Schedule Appointment →
            </Link>
          </CardContent>
        </Card>

        {/* Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <FileText className="h-4 w-4 mr-2" />
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient.medicalRecords.length === 0 ? (
              <p className="text-sm text-gray-500">No records yet</p>
            ) : (
              <div className="space-y-3">
                {patient.medicalRecords.map((record) => (
                  <div key={record.id} className="text-sm">
                    <p className="font-medium text-gray-900">{record.diagnosis || 'Visit'}</p>
                    <p className="text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href={`/dashboard/medical-records/new?patientId=${patient.id}`}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 block"
            >
              Add Record →
            </Link>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <DollarSign className="h-4 w-4 mr-2" />
              Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patient.invoices.length === 0 ? (
              <p className="text-sm text-gray-500">No invoices yet</p>
            ) : (
              <div className="space-y-3">
                {patient.invoices.map((invoice) => (
                  <div key={invoice.id} className="text-sm">
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                    <p className="text-gray-500">
                      ${invoice.amount} • {invoice.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <Link
              href={`/dashboard/invoices/new?patientId=${patient.id}`}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 block"
            >
              Create Invoice →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}