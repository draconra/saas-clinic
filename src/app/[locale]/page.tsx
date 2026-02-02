import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, FileText, CreditCard, Calendar, Stethoscope, TrendingUp } from 'lucide-react'
import CountUp from '@/components/ui/count-up'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from '@/components/language-switcher'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const tHero = await getTranslations('Hero')
  const tFeatures = await getTranslations('Features')
  const tStats = await getTranslations('Stats')
  const tCTA = await getTranslations('CTA')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>

        <div className="container-elegant py-16 lg:py-24">
          <div className="absolute top-4 right-4 z-20">
            <LanguageSwitcher />
          </div>

          <div className="text-center">
            {/* Logo and Brand */}
            <div className="flex justify-center mb-8">
              <div className="relative animate-in fade-in zoom-in duration-700">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl">
                  <Stethoscope className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>

            <h1 className="heading-1 mb-4 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150">
              {tHero('title')}
            </h1>
            <p className="text-lead text-slate-600 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
              {tHero('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
              <Link
                href="/dashboard"
                className="btn btn-medical btn-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                {tHero('getStarted')}
              </Link>
              <Link
                href="/dashboard/patients"
                className="btn btn-outline btn-xl hover:bg-white/80"
              >
                {tHero('viewDemo')}
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative mx-auto max-w-3xl rounded-2xl shadow-2xl overflow-hidden border-4 border-white/50 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none"></div>
              <Image
                src="/dashboard-hero.png"
                alt="ClinicSaaS Dashboard Interface"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-elegant py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">{tFeatures('title')}</h2>
          <p className="text-lead text-slate-600 max-w-3xl mx-auto">
            {tFeatures('subtitle')}
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
              <h3 className="heading-4 mb-2">{tFeatures('patientManagement')}</h3>
              <p className="text-muted mb-4">
                {tFeatures('patientManagementDesc')}
              </p>
              <Link href="/dashboard/patients" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1 group">
                {tFeatures('explore')} <span className="group-hover:translate-x-1 transition-transform">→</span>
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
              <h3 className="heading-4 mb-2">{tFeatures('ehr')}</h3>
              <p className="text-muted mb-4">
                {tFeatures('ehrDesc')}
              </p>
              <Link href="/dashboard/medical-records" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1 group">
                {tFeatures('manage')} <span className="group-hover:translate-x-1 transition-transform">→</span>
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
              <h3 className="heading-4 mb-2">{tFeatures('payment')}</h3>
              <p className="text-muted mb-4">
                {tFeatures('paymentDesc')}
              </p>
              <Link href="/dashboard/billing" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1 group">
                {tFeatures('view')} <span className="group-hover:translate-x-1 transition-transform">→</span>
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
              <h3 className="heading-4 mb-2">{tFeatures('appointments')}</h3>
              <p className="text-muted mb-4">
                {tFeatures('appointmentsDesc')}
              </p>
              <Link href="/dashboard/appointments" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm flex items-center gap-1 group">
                {tFeatures('schedule')} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section with Animations */}
        <div className="card bg-gradient-to-r from-cyan-50 to-blue-50/30 border-cyan-200/60">
          <div className="card-content">
            <div className="grid gap-8 md:grid-cols-4 text-center divide-y md:divide-y-0 md:divide-x divide-cyan-200/40">
              <div className="p-4">
                <p className="text-3xl font-bold text-cyan-600 mb-2 flex justify-center items-center">
                  <CountUp end={10000} duration={2000} />
                  <span>+</span>
                </p>
                <p className="text-sm font-medium text-slate-600">{tStats('patients')}</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-emerald-600 mb-2 flex justify-center items-center">
                  <CountUp end={50000} duration={2000} delay={200} />
                  <span>+</span>
                </p>
                <p className="text-sm font-medium text-slate-600">{tStats('appointments')}</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-amber-600 mb-2 flex justify-center items-center">
                  <span>$</span>
                  <CountUp end={2} duration={1500} decimals={1} suffix="M" />
                  <span>+</span>
                </p>
                <p className="text-sm font-medium text-slate-600">{tStats('revenue')}</p>
              </div>
              <div className="p-4">
                <p className="text-3xl font-bold text-purple-600 mb-2 flex justify-center items-center">
                  <CountUp end={99.9} duration={2500} decimals={1} />
                  <span>%</span>
                </p>
                <p className="text-sm font-medium text-slate-600">{tStats('uptime')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container-elegant py-16 text-center relative z-10">
          <h2 className="heading-2 mb-4 text-white">{tCTA('title')}</h2>
          <p className="text-lg mb-8 text-cyan-100 max-w-2xl mx-auto">
            {tCTA('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="btn bg-white text-cyan-600 hover:bg-cyan-50 font-semibold btn-lg shadow-lg"
            >
              {tCTA('startTrial')}
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-ghost text-white border-white hover:bg-white hover:text-cyan-600 font-semibold btn-lg"
            >
              {tCTA('scheduleDemo')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}