import React from 'react'
import Link from 'next/link'
import { Users, FileText, CreditCard, Calendar, Stethoscope, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="container-elegant py-16 lg:py-24">
          <div className="text-center">
            {/* Logo and Brand */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl">
                  <Stethoscope className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>

            <h1 className="heading-1 mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to ClinicSaaS
            </h1>
            <p className="text-lead text-slate-600 max-w-2xl mx-auto mb-8">
              Transform your medical practice with our comprehensive clinic management system.
              Streamline patient care, billing, and appointments in one elegant platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="btn btn-medical btn-xl shadow-xl"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard/patients"
                className="btn btn-outline btn-xl"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-elegant py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">Comprehensive Medical Practice Management</h2>
          <p className="text-lead text-slate-600 max-w-3xl mx-auto">
            Everything you need to run your clinic efficiently, from patient records to billing,
            all in one powerful, easy-to-use platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Patient Management */}
          <div className="card hover:scale-[1.02] transition-all duration-300">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <Users className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-slate-400 hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="heading-4 mb-2">Patient Management</h3>
              <p className="text-muted mb-4">
                Comprehensive patient records and demographic information management with
                advanced search and filtering capabilities.
              </p>
              <Link href="/dashboard/patients" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1">
                Explore Patients →
              </Link>
            </div>
          </div>

          {/* Electronic Health Records */}
          <div className="card hover:scale-[1.02] transition-all duration-300">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="status-dot status-online" />
              </div>
              <h3 className="heading-4 mb-2">Electronic Health Records</h3>
              <p className="text-muted mb-4">
                Secure digital storage for medical histories, prescriptions, and treatment plans
                with interactive body charts and clinical findings.
              </p>
              <Link href="/dashboard/medical-records" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1">
                Manage Records →
              </Link>
            </div>
          </div>

          {/* Payment Processing */}
          <div className="card hover:scale-[1.02] transition-all duration-300">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div className="badge badge-success text-xs">Secure</div>
              </div>
              <h3 className="heading-4 mb-2">Payment Processing</h3>
              <p className="text-muted mb-4">
                Integrated billing system with secure payment processing and insurance management
                for seamless financial operations.
              </p>
              <Link href="/dashboard/billing" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1">
                View Billing →
              </Link>
            </div>
          </div>

          {/* Appointments */}
          <div className="card hover:scale-[1.02] transition-all duration-300">
            <div className="card-content">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="badge badge-medical text-xs">Smart</div>
              </div>
              <h3 className="heading-4 mb-2">Appointments</h3>
              <p className="text-muted mb-4">
                Smart scheduling system with automated reminders and calendar integration
                to optimize your clinic's time management.
              </p>
              <Link href="/dashboard/appointments" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1">
                Schedule →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="card bg-gradient-to-r from-cyan-50 to-blue-50/30 border-cyan-200/60">
          <div className="card-content">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div>
                <p className="text-3xl font-bold text-cyan-600 mb-2">10,000+</p>
                <p className="text-sm font-medium text-slate-600">Patients Managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 mb-2">50,000+</p>
                <p className="text-sm font-medium text-slate-600">Appointments</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-600 mb-2">$2M+</p>
                <p className="text-sm font-medium text-slate-600">Revenue Processed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600 mb-2">99.9%</p>
                <p className="text-sm font-medium text-slate-600">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container-elegant py-16 text-center">
          <h2 className="heading-2 mb-4 text-white">Ready to Transform Your Practice?</h2>
          <p className="text-lg mb-8 text-cyan-100 max-w-2xl mx-auto">
            Join hundreds of healthcare professionals who have streamlined their operations
            with ClinicSaaS. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="btn bg-white text-cyan-600 hover:bg-cyan-50 font-semibold btn-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-ghost text-white border-white hover:bg-white hover:text-cyan-600 font-semibold btn-lg"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}