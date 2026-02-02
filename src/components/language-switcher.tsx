'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function LanguageSwitcher() {
    const router = useRouter()
    const pathname = usePathname()

    const switchLanguage = (locale: string) => {
        // Basic logic: replace the first segment if it is a locale
        const segments = pathname.split('/')
        // segments[0] is empty, segments[1] is locale
        if (segments.length > 1 && ['en', 'id'].includes(segments[1])) {
            segments[1] = locale
            router.push(segments.join('/'))
        } else {
            // If no locale in path (e.g. root treated as default), prepend
            router.push(`/${locale}${pathname}`)
        }
    }

    return (
        <div className="flex gap-2 text-sm font-medium">
            <button
                onClick={() => switchLanguage('en')}
                className="text-slate-600 hover:text-cyan-600 transition-colors"
            >
                EN
            </button>
            <span className="text-slate-300">|</span>
            <button
                onClick={() => switchLanguage('id')}
                className="text-slate-600 hover:text-cyan-600 transition-colors"
            >
                ID
            </button>
        </div>
    )
}
