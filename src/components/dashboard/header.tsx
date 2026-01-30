'use client'

import { signOut, useSession } from 'next-auth/react'
import { Bell, Menu, LogOut } from 'lucide-react'

interface HeaderProps {
  session: any
}

export default function Header({ session }: HeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/90 backdrop-blur-sm border-b border-slate-200/60 shadow-sm">
      <button
        type="button"
        className="border-r border-gray-200 px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden transition-all duration-200"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="w-full flex md:ml-0">
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none"></div>
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <button
            type="button"
            className="btn bg-slate-100 text-slate-700 hover:bg-transparent hover:text-cyan-600 hover:ring-2 hover:ring-cyan-200 focus:ring-cyan-500 shadow-sm hover:shadow-none"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="btn bg-slate-100 text-slate-700 hover:bg-transparent hover:text-red-600 hover:ring-2 hover:ring-red-200 focus:ring-cyan-500 shadow-sm hover:shadow-none"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}