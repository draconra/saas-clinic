import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Users, FileText, CreditCard, Calendar, Stethoscope, TrendingUp, Shield, Clock, Award, ArrowRight, CheckCircle2, Star } from 'lucide-react'
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container-elegant py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">ClinicSaaS</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">Features</Link>
              <Link href="#testimonials" className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">Testimonials</Link>
              <Link href="#pricing" className="text-slate-600 hover:text-cyan-600 transition-colors font-medium">Pricing</Link>
              <LanguageSwitcher />
              <Link href="/auth/signin" className="btn btn-outline">Sign In</Link>
              <Link href="/dashboard" className="btn btn-medical">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/20">
        <div className="container-elegant">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8 animate-in slide-in-from-left-8 fade-in duration-700">
              <div className="inline-flex items-center space-x-2 bg-cyan-50 text-cyan-700 px-4 py-2 rounded-full border border-cyan-200">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">Trusted by 10,000+ Healthcare Professionals</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Modern Healthcare
                <span className="block bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Transform your medical practice with our comprehensive clinic management platform.
                Streamline operations, enhance patient care, and grow your practice.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="btn btn-medical btn-xl group shadow-xl shadow-cyan-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#features"
                  className="btn btn-outline btn-xl"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white" />
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                    <p className="text-slate-600">5.0 from 2,500+ reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative animate-in slide-in-from-right-8 fade-in duration-700 delay-200">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/healthcare-team.png"
                  alt="Healthcare Team"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />

                {/* Floating Stats Card */}
                <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 max-w-xs animate-in zoom-in fade-in duration-700 delay-500">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">99.9%</p>
                      <p className="text-sm text-slate-600">Patient Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="container-elegant">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center">
                <CountUp end={10000} duration={2000} />
                <span className="ml-1">+</span>
              </p>
              <p className="text-slate-600 mt-2 font-medium">{tStats('patients')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center justify-center">
                <CountUp end={50000} duration={2000} delay={200} />
                <span className="ml-1">+</span>
              </p>
              <p className="text-slate-600 mt-2 font-medium">{tStats('appointments')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center">
                <span className="mr-1">$</span>
                <CountUp end={2} duration={1500} decimals={1} suffix="M" />
                <span className="ml-1">+</span>
              </p>
              <p className="text-slate-600 mt-2 font-medium">{tStats('revenue')}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center">
                <CountUp end={99.9} duration={2500} decimals={1} />
                <span className="ml-1">%</span>
              </p>
              <p className="text-slate-600 mt-2 font-medium">{tStats('uptime')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
        <div className="container-elegant">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              See ClinicSaaS in Action
            </h2>
            <p className="text-xl text-slate-600">
              A powerful, intuitive dashboard designed to streamline your clinic operations
            </p>
          </div>

          {/* Dashboard Screenshot - Main */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-2 bg-slate-100 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="h-2 bg-slate-300 rounded w-64 max-w-full"></div>
                  </div>
                </div>
              </div>
              <Image
                src="/dashboard-hero.png"
                alt="ClinicSaaS Dashboard Overview"
                width={1400}
                height={800}
                className="w-full h-auto"
                priority
              />
            </div>
            {/* Floating Label */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-700">Dashboard Overview</p>
            </div>
          </div>

          {/* Feature Screenshots Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Patient Management Screenshot */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Patient Management</h4>
                    <p className="text-sm text-slate-600">Complete patient profiles with medical history</p>
                    <div className="mt-4 text-xs text-slate-500">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full">/patients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EHR Screenshot */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-600/0 group-hover:from-emerald-500/10 group-hover:to-teal-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Electronic Health Records</h4>
                    <p className="text-sm text-slate-600">SOAP notes, vital signs & prescriptions</p>
                    <div className="mt-4 text-xs text-slate-500">
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">/medical-records</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments Screenshot */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-600/0 group-hover:from-purple-500/10 group-hover:to-pink-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Appointment Scheduling</h4>
                    <p className="text-sm text-slate-600">Calendar view with conflict detection</p>
                    <div className="mt-4 text-xs text-slate-500">
                      <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-full">/appointments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Screenshot */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-600/0 group-hover:from-amber-500/10 group-hover:to-orange-600/10 rounded-3xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Billing & Invoicing</h4>
                    <p className="text-sm text-slate-600">Track payments & revenue</p>
                    <div className="mt-4 text-xs text-slate-500">
                      <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full">/billing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Row */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {/* Analytics Dashboard */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/0 to-slate-900/0 group-hover:from-slate-700/10 group-hover:to-slate-900/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm">Analytics Dashboard</h4>
                    <p className="text-xs text-slate-600">Real-time metrics & insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-700/0 to-blue-800/0 group-hover:from-cyan-700/10 group-hover:to-blue-800/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-700 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm">Settings & Configuration</h4>
                    <p className="text-xs text-slate-600">Customize your clinic workflow</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-600/0 group-hover:from-pink-500/10 group-hover:to-rose-600/10 rounded-2xl transition-all duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group-hover:shadow-xl transition-shadow">
                <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1 text-sm">Mobile-First Design</h4>
                    <p className="text-xs text-slate-600">Access anywhere, any device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">
              Want to see more? <Link href="/dashboard" className="text-cyan-600 hover:text-cyan-700 font-semibold underline">Try our live demo</Link> or <Link href="#pricing" className="text-cyan-600 hover:text-cyan-700 font-semibold underline">start your free trial</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="container-elegant">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {tFeatures('title')}
            </h2>
            <p className="text-xl text-slate-600">
              {tFeatures('subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{tFeatures('patientManagement')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {tFeatures('patientManagementDesc')}
              </p>
              <Link href="/dashboard/patients" className="text-cyan-600 hover:text-cyan-700 font-semibold inline-flex items-center group">
                {tFeatures('explore')}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{tFeatures('ehr')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {tFeatures('ehrDesc')}
              </p>
              <Link href="/dashboard/medical-records" className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center group">
                {tFeatures('manage')}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{tFeatures('payment')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {tFeatures('paymentDesc')}
              </p>
              <Link href="/dashboard/billing" className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center group">
                {tFeatures('view')}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{tFeatures('appointments')}</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {tFeatures('appointmentsDesc')}
              </p>
              <Link href="/dashboard/appointments" className="text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center group">
                {tFeatures('schedule')}
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Features */}
      <section className="py-24 bg-white">
        <div className="container-elegant">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">HIPAA Compliant</h3>
                <p className="text-slate-600">Bank-level security with end-to-end encryption for all patient data.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">24/7 Support</h3>
                <p className="text-slate-600">Round-the-clock customer support to ensure smooth operations.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Analytics & Insights</h3>
                <p className="text-slate-600">Data-driven insights to help you make better business decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="container-elegant">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-slate-600">
              See what doctors and clinic administrators are saying about ClinicSaaS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center text-amber-500 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                "ClinicSaaS transformed how we manage our practice. Patient scheduling is seamless,
                and the EHR system is intuitive. Our staff productivity increased by 40%!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  DS
                </div>
                <div>
                  <p className="font-bold text-slate-900">Dr. Sarah Mitchell</p>
                  <p className="text-sm text-slate-600">Family Medicine Physician</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center text-amber-500 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                "The billing integration saved us countless hours. Insurance claims are processed faster,
                and our revenue cycle improved dramatically. Highly recommended!"
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  MP
                </div>
                <div>
                  <p className="font-bold text-slate-900">Michael Park</p>
                  <p className="text-sm text-slate-600">Clinic Administrator</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center text-amber-500 mb-4">
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
                <Star className="h-5 w-5 fill-current" />
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">
                "As a cardiologist, I need reliable tools. ClinicSaaS delivers on every front -
                from patient records to analytics. It's become indispensable to our practice."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  JC
                </div>
                <div>
                  <p className="font-bold text-slate-900">Dr. Jennifer Chen</p>
                  <p className="text-sm text-slate-600">Cardiologist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container-elegant">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600">
              Choose the perfect plan for your practice. All plans include 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200 hover:border-cyan-500 transition-all hover:shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
                <p className="text-slate-600">Perfect for small practices</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-slate-900">$49</span>
                  <span className="text-slate-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Billed monthly</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Up to 100 patients</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Basic EHR system</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Appointment scheduling</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Email support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Mobile app access</span>
                </li>
              </ul>

              <Link href="/dashboard" className="btn btn-outline w-full">
                Start Free Trial
              </Link>
            </div>

            {/* Professional Plan - Popular */}
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-8 shadow-2xl border-2 border-cyan-500 relative transform hover:scale-105 transition-transform">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <p className="text-cyan-100">For growing practices</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-white">$149</span>
                  <span className="text-cyan-100 ml-2">/month</span>
                </div>
                <p className="text-sm text-cyan-200 mt-2">Billed monthly</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Unlimited patients</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Advanced EHR with body charts</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Billing & invoicing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Priority support (24/7)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">Analytics dashboard</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">API access</span>
                </li>
              </ul>

              <Link href="/dashboard" className="btn bg-white text-cyan-600 hover:bg-cyan-50 w-full font-semibold">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-slate-200 hover:border-cyan-500 transition-all hover:shadow-xl">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
                <p className="text-slate-600">For hospitals & networks</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-slate-900">Custom</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">Contact for pricing</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Everything in Professional</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Multi-location support</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Custom integrations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Dedicated account manager</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Advanced security & compliance</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Onboarding & training</span>
                </li>
              </ul>

              <Link href="/dashboard" className="btn btn-outline w-full">
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Pricing Footer */}
          <div className="text-center mt-12">
            <p className="text-slate-600">
              All plans include HIPAA compliance, SSL encryption, and daily backups.
              <Link href="#" className="text-cyan-600 hover:text-cyan-700 font-semibold ml-1">
                Compare plans →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="container-elegant relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {tCTA('title')}
            </h2>
            <p className="text-xl text-cyan-100 mb-10 leading-relaxed">
              {tCTA('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="btn bg-white text-cyan-600 hover:bg-cyan-50 font-semibold btn-xl shadow-2xl group"
              >
                {tCTA('startTrial')}
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="btn btn-ghost text-white border-2 border-white hover:bg-white hover:text-cyan-600 font-semibold btn-xl"
              >
                {tCTA('scheduleDemo')}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-cyan-100">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container-elegant">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ClinicSaaS</span>
              </div>
              <p className="text-sm">Modern healthcare management for modern clinics.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-cyan-400 transition-colors">HIPAA</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ClinicSaaS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}