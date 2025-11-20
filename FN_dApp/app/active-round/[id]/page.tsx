'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { CountdownTimer } from '@/components/active-round/countdown-timer'

export default function ActiveRoundPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [roundData, setRoundData] = useState({
    id: params.id,
    participants: 42,
    maxParticipants: 50,
    prizePool: 4200,
    userEntered: true,
    timeRemaining: 1800, // 30 minutes
    status: 'active',
  })

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRoundData((prev) => {
        if (prev.timeRemaining <= 0) {
          return prev
        }
        return {
          ...prev,
          participants: Math.min(50, prev.participants + Math.random() > 0.7 ? 1 : 0),
          prizePool: prev.prizePool + (100 * Math.random()),
          timeRemaining: prev.timeRemaining - 1,
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="mx-auto max-w-2xl px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="text-slate-400 hover:text-white mb-8 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Main Card */}
        <Card className="card-elevated p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Round #{roundData.id}</h1>
            <p className="text-slate-400">You are entered ✓</p>
          </div>

          {/* Countdown */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-lg p-8 text-center">
            <p className="text-slate-400 text-sm mb-4">Time Remaining</p>
            <CountdownTimer seconds={roundData.timeRemaining} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border border-slate-700 p-4">
              <p className="text-slate-400 text-sm mb-2">Players</p>
              <p className="text-2xl font-bold text-white">
                {roundData.participants}/{roundData.maxParticipants}
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${(roundData.participants / roundData.maxParticipants) * 100}%` }}
                />
              </div>
            </Card>

            <Card className="bg-slate-800/50 border border-slate-700 p-4">
              <p className="text-slate-400 text-sm mb-2">Prize Pool</p>
              <p className="text-2xl font-bold text-emerald-400">
                {roundData.prizePool.toLocaleString()} USDC
              </p>
              <p className="text-slate-500 text-xs mt-3">Updating live...</p>
            </Card>
          </div>

          {/* Your Status */}
          <Card className="bg-emerald-500/10 border border-emerald-500/30 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 font-semibold">Entry Confirmed</p>
                <p className="text-slate-400 text-sm">You're in this round!</p>
              </div>
              <div className="text-3xl">✓</div>
            </div>
          </Card>

          {/* Info */}
          <p className="text-sm text-slate-400 text-center">
            When this round closes, a winner will be selected. Check back here to see results.
          </p>
        </Card>
      </main>
    </div>
  )
}
