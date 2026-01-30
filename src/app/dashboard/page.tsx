import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, FileText, DollarSign } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await Promise.all([
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.medicalRecord.count(),
    prisma.invoice.count(),
  ])

  const [patientCount, appointmentCount, recordCount, invoiceCount] = stats

  const recentAppointments = await prisma.appointment.findMany({
    take: 5,
    include: {
      patient: true,
    },
    orderBy: {
      startTime: 'desc',
    },
  })

  const cards = [
    {
      title: 'Total Patients',
      value: patientCount,
      description: 'Registered patients',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Appointments',
      value: appointmentCount,
      description: 'Total appointments',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Medical Records',
      value: recordCount,
      description: 'Patient records',
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      title: 'Invoices',
      value: invoiceCount,
      description: 'Billing records',
      icon: DollarSign,
      color: 'text-yellow-600',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to your clinic management dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.length === 0 ? (
                <p className="text-sm text-gray-500">No appointments found</p>
              ) : (
                recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {appointment.patient.firstName} {appointment.patient.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.title} - {new Date(appointment.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/dashboard/patients/new"
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Add New Patient</div>
              <div className="text-sm text-gray-500">Register a new patient</div>
            </a>
            <a
              href="/dashboard/appointments/new"
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Schedule Appointment</div>
              <div className="text-sm text-gray-500">Book a new appointment</div>
            </a>
            <a
              href="/dashboard/invoices/new"
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Create Invoice</div>
              <div className="text-sm text-gray-500">Generate a new invoice</div>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}