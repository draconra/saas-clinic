import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, FileText, User, Calendar, Search, Activity, TrendingUp, Clock, Filter } from 'lucide-react'

export default async function MedicalRecordsPage() {
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

  const recentRecords = records.slice(0, 20)
  const totalBodyCharts = records.reduce((sum, record) => sum + record.bodyCharts.length, 0)

  return (
    <div className="container-elegant py-8">
      <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
        <div className="flex-1">
          <h1 className="heading-1 mb-2">Medical Records</h1>
          <p className="text-lead">Patient health records and comprehensive medical history</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn btn-outline btn-lg">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <Link href="/dashboard/medical-records/new" className="btn btn-medical btn-lg">
            <Plus className="h-4 w-4" />
            Add Medical Record
          </Link>
        </div>
      </div>

      {/* Elegant Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="card hover:scale-[1.02] transition-transform duration-300">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{records.length}</p>
                  <p className="text-sm font-medium text-slate-600">Total Records</p>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-slate-400 hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>

        <div className="card hover:scale-[1.02] transition-transform duration-300">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {new Set(records.map(r => r.patientId)).size}
                  </p>
                  <p className="text-sm font-medium text-slate-600">Unique Patients</p>
                </div>
              </div>
              <div className="status-dot status-online" />
            </div>
          </div>
        </div>

        <div className="card hover:scale-[1.02] transition-transform duration-300">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{totalBodyCharts}</p>
                  <p className="text-sm font-medium text-slate-600">Body Charts</p>
                </div>
              </div>
              <div className="badge badge-medical text-xs">Interactive</div>
            </div>
          </div>
        </div>

        <div className="card hover:scale-[1.02] transition-transform duration-300">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {records.filter(r => r.followUpDate && new Date(r.followUpDate) >= new Date()).length}
                  </p>
                  <p className="text-sm font-medium text-slate-600">Follow-ups</p>
                </div>
              </div>
              <Clock className="h-4 w-4 text-slate-400 hover:text-amber-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Records List */}
      <div className="card">
        <div className="card-header">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="card-title">Recent Medical Records</h3>
              <p className="card-description">Comprehensive patient examination records</p>
            </div>
            <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="input pl-10"
                placeholder="Search records by patient, diagnosis, or doctor..."
              />
            </div>
          </div>
        </div>
        <div className="card-content p-0">
          {recentRecords.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="heading-4 mb-2">No medical records</h3>
              <p className="text-muted mb-6">
                Start tracking patient health by adding your first medical record.
              </p>
              <Link
                href="/dashboard/medical-records/new"
                className="btn btn-medical btn-lg"
              >
                <Plus className="h-4 w-4" />
                Add Medical Record
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Patient</th>
                    <th className="table-header-cell">Doctor</th>
                    <th className="table-header-cell">Diagnosis</th>
                    <th className="table-header-cell">Treatment</th>
                    <th className="table-header-cell">Body Charts</th>
                    <th className="table-header-cell">Date</th>
                    <th className="table-header-cell">Follow-up</th>
                    <th className="table-header-cell text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record) => (
                    <tr key={record.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                              {record.patient.firstName.charAt(0)}{record.patient.lastName.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors">
                              <Link href={`/dashboard/patients/${record.patient.id}`} className="hover:underline">
                                {record.patient.firstName} {record.patient.lastName}
                              </Link>
                            </div>
                            <div className="text-small text-slate-500">
                              ID: {record.patient.id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm font-medium text-slate-900">
                          Dr. {record.doctor.name}
                        </div>
                        <div className="text-small text-slate-500">Attending</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-slate-900 max-w-xs truncate font-medium">
                          {record.diagnosis || (
                            <span className="text-slate-400 italic">No diagnosis recorded</span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-slate-900 max-w-xs truncate">
                          {record.treatment || (
                            <span className="text-slate-400 italic">No treatment recorded</span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          {record.bodyCharts.length > 0 ? (
                            <>
                              <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600">
                                <Activity className="h-3.5 w-3.5" />
                              </div>
                              <span className="text-sm font-medium text-cyan-600">
                                {record.bodyCharts.length}
                              </span>
                              <span className="text-small text-slate-500">findings</span>
                            </>
                          ) : (
                            <span className="text-small text-slate-400">None</span>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-slate-900">
                          {new Date(record.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-small text-slate-500">
                          {new Date(record.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="table-cell">
                        {record.followUpDate ? (
                          <div className="flex items-center space-x-2">
                            <div className="status-dot status-busy" />
                            <span className="text-sm text-slate-900">
                              {new Date(record.followUpDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-small text-slate-400">-</span>
                        )}
                      </td>
                      <td className="table-cell text-right">
                        <Link
                          href={`/dashboard/medical-records/${record.id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}