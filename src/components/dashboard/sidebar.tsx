'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Stethoscope,
  TrendingUp,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview & analytics'
  },
  {
    name: 'Patients',
    href: '/dashboard/patients',
    icon: Users,
    description: 'Patient management'
  },
  {
    name: 'Appointments',
    href: '/dashboard/appointments',
    icon: Calendar,
    description: 'Schedule & calendar'
  },
  {
    name: 'Medical Records',
    href: '/dashboard/medical-records',
    icon: FileText,
    description: 'Clinical records'
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: DollarSign,
    description: 'Invoices & payments'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'System settings'
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="sidebar">
      <div className="flex flex-col flex-grow h-full">
        {/* Logo Section */}
        <div className="flex items-center flex-shrink-0 px-6 py-8 border-b border-cyan-800/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-cyan-700"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight">ClinicSaaS</span>
              <span className="text-xs text-cyan-200 font-medium">Medical Management</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-cyan-200 uppercase tracking-wider mb-3 px-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${isActive
                      ? 'bg-cyan-400/10 text-white shadow-sm'
                      : 'text-cyan-100 hover:bg-cyan-400/10 hover:text-white'
                      }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <span className="text-xs text-cyan-200">{item.description}</span>
                      )}
                    </div>
                    {isActive && (
                      <div className="w-1 h-6 bg-white rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-cyan-200 uppercase tracking-wider mb-3 px-3">
              Quick Stats
            </h3>
            <div className="px-3 space-y-3">
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-cyan-200">Active Patients</span>
                  <TrendingUp className="h-3 w-3 text-green-400" />
                </div>
                <p className="text-lg font-bold text-white">248</p>
                <p className="text-xs text-green-400">+12% this month</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-cyan-200">Today's Appointments</span>
                  <Calendar className="h-3 w-3 text-cyan-400" />
                </div>
                <p className="text-lg font-bold text-white">18</p>
                <p className="text-xs text-cyan-300">3 pending</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}