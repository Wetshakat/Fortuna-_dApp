'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  seconds: number
}

export function CountdownTimer({ seconds: initialSeconds }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const secs = timeLeft % 60

  return (
    <div className="font-mono">
      <div className="text-5xl font-bold text-white mb-2">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>
      <p className="text-sm text-slate-400">Until round closes</p>
    </div>
  )
}
