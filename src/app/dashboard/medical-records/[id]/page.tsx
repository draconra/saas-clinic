import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, User, Calendar, FileText, Heart, Activity, Stethoscope } from 'lucide-react'
import BodyDiagram from '@/components/body-chart/body-diagram'

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function MedicalRecordDetailPage({ params }: Props) {
  const { id } = await params
  const record = await prisma.medicalRecord.findUnique({
    where: {
      id: id,
    },
    include: {
      patient: true,
      doctor: true,
      clinic: true,
      bodyCharts: true,
    },
  })

  if (!record) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Medical record not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The medical record you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/medical-records"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Medical Records
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard/medical-records" className="text-blue-600 hover:text-blue-800 mr-3">
            <ArrowLeft className="h-5 w-5 inline mr-1" />
            Back to Medical Records
          </Link>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medical Examination Record</h1>
            <p className="mt-2 text-gray-600">
              {record.patient.firstName} {record.patient.lastName} •{' '}
              {new Date(record.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Patient:</span>
                  <p className="font-medium">
                    {record.patient.firstName} {record.patient.lastName}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date of Birth:</span>
                  <p className="font-medium">
                    {new Date(record.patient.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Gender:</span>
                  <p className="font-medium">{record.patient.gender}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Examining Doctor:</span>
                  <p className="font-medium">Dr. {record.doctor.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Examination Date:</span>
                  <p className="font-medium">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Blood Type:</span>
                  <p className="font-medium">{record.patient.bloodType || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chief Complaint & History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                Chief Complaint & History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Chief Complaint</h4>
                <p className="text-gray-700 mt-1">
                  {record.chiefComplaint || 'Not recorded'}
                </p>
              </div>

              {record.historyOfPresentIllness && (
                <div>
                  <h4 className="font-medium text-gray-900">History of Present Illness</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.historyOfPresentIllness}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {record.pastMedicalHistory && (
                  <div>
                    <h4 className="font-medium text-gray-900">Past Medical History</h4>
                    <p className="text-gray-700 mt-1 text-sm whitespace-pre-wrap">
                      {record.pastMedicalHistory}
                    </p>
                  </div>
                )}

                {record.familyHistory && (
                  <div>
                    <h4 className="font-medium text-gray-900">Family History</h4>
                    <p className="text-gray-700 mt-1 text-sm whitespace-pre-wrap">
                      {record.familyHistory}
                    </p>
                  </div>
                )}

                {record.socialHistory && (
                  <div>
                    <h4 className="font-medium text-gray-900">Social History</h4>
                    <p className="text-gray-700 mt-1 text-sm whitespace-pre-wrap">
                      {record.socialHistory}
                    </p>
                  </div>
                )}
              </div>

              {record.reviewOfSystems && (
                <div>
                  <h4 className="font-medium text-gray-900">Review of Systems</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.reviewOfSystems}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Physical Examination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2" />
                Physical Examination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {record.vitalSigns && (
                <div>
                  <h4 className="font-medium text-gray-900">Vital Signs</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.vitalSigns}
                  </p>
                </div>
              )}

              {record.physicalExam && (
                <div>
                  <h4 className="font-medium text-gray-900">Physical Examination Findings</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.physicalExam}
                  </p>
                </div>
              )}

              {/* Body Chart */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Body Examination Chart</h4>
                <BodyDiagram
                  bodyCharts={record.bodyCharts}
                  readOnly={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Assessment & Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Assessment & Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {record.diagnosis && (
                <div>
                  <h4 className="font-medium text-gray-900">Diagnosis</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.diagnosis}
                  </p>
                </div>
              )}

              {record.assessment && (
                <div>
                  <h4 className="font-medium text-gray-900">Assessment</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.assessment}
                  </p>
                </div>
              )}

              {record.plan && (
                <div>
                  <h4 className="font-medium text-gray-900">Treatment Plan</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.plan}
                  </p>
                </div>
              )}

              {record.treatment && (
                <div>
                  <h4 className="font-medium text-gray-900">Treatment</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.treatment}
                  </p>
                </div>
              )}

              {record.prescription && (
                <div>
                  <h4 className="font-medium text-gray-900">Prescription</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.prescription}
                  </p>
                </div>
              )}

              {record.followUpDate && (
                <div>
                  <h4 className="font-medium text-gray-900">Follow-up Date</h4>
                  <p className="text-gray-700 mt-1">
                    {new Date(record.followUpDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {record.notes && (
                <div>
                  <h4 className="font-medium text-gray-900">Additional Notes</h4>
                  <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                    {record.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/dashboard/appointments/new?patientId=${record.patientId}`}
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Schedule Follow-up</div>
                <div className="text-sm text-gray-500">Book next appointment</div>
              </Link>
              <Link
                href={`/dashboard/invoices/new?patientId=${record.patientId}`}
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Create Invoice</div>
                <div className="text-sm text-gray-500">Generate billing</div>
              </Link>
              <Link
                href={`/dashboard/patients/${record.patientId}`}
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">View Patient</div>
                <div className="text-sm text-gray-500">Patient details</div>
              </Link>
              <Link
                href={`/dashboard/medical-records/new?patientId=${record.patientId}`}
                className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">New Examination</div>
                <div className="text-sm text-gray-500">Add new record</div>
              </Link>
            </CardContent>
          </Card>

          {/* Patient Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Contact:</span>
                  <p className="text-sm">
                    {record.patient.email || record.patient.phone || 'No contact info'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Address:</span>
                  <p className="text-sm">
                    {record.patient.address || 'No address on file'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Emergency Contact:</span>
                  <p className="text-sm">
                    {record.patient.emergencyContact || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Insurance:</span>
                  <p className="text-sm">
                    {record.patient.insuranceNumber || 'Not specified'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Allergies:</span>
                  <p className="text-sm">
                    {record.patient.allergies || 'None known'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Current Medications:</span>
                  <p className="text-sm">
                    {record.patient.medications || 'None listed'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}