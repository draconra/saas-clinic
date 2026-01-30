import './globals.css'
import { Inter } from 'next/font/google'
import { SessionProviderWrapper } from '@/components/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClinicSaaS - Health Clinic Management System',
  description: 'Comprehensive SaaS platform for small health clinics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}