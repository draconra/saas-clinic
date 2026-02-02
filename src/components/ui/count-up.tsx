'use client'

import { useEffect, useState, useRef } from 'react'

interface CountUpProps {
    end: number
    duration?: number
    delay?: number
    decimals?: number
    suffix?: string
    prefix?: string
}

export default function CountUp({
    end,
    duration = 2000,
    delay = 0,
    decimals = 0,
    suffix = '',
    prefix = ''
}: CountUpProps) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let timeoutId: NodeJS.Timeout

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp
            const progress = timestamp - startTimeRef.current

            const percentage = Math.min(progress / duration, 1)
            const easeOutQuart = 1 - Math.pow(1 - percentage, 4)

            const currentCount = easeOutQuart * end

            if (percentage < 1) {
                setCount(currentCount)
                requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        timeoutId = setTimeout(() => {
            requestAnimationFrame(animate)
        }, delay)

        return () => clearTimeout(timeoutId)
    }, [end, duration, delay, isVisible])

    return (
        <span ref={elementRef}>
            {prefix}
            {count.toLocaleString('en-US', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            })}
            {suffix}
        </span>
    )
}
