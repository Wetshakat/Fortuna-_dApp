'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Zap, Trophy } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-emerald-500/10 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/Fortuna.png" alt="Fortuna Logo" width={40} height={40} />
            <span className="text-xl font-bold text-white">Fortuna</span>
          </div>
          <Button
            onClick={() => router.push('/login')}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
          >
            Enter App
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Play Fair.
              <span className="block text-emerald-400">Win Big.</span>
              <span className="block text-slate-400">Anytime.</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Experience the future of digital lotteries. Fair, transparent, and powered by blockchain.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/login')}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-8"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur p-6 hover:border-emerald-500/40 transition-colors">
            <Lock className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Fair & Transparent</h3>
            <p className="text-slate-400">Every winner selected with cryptographic fairness. No hidden mechanics.</p>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur p-6 hover:border-emerald-500/40 transition-colors">
            <Zap className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Gasless Transactions</h3>
            <p className="text-slate-400">Join rounds and claim rewards without worrying about gas fees.</p>
          </Card>

          <Card className="border-emerald-500/20 bg-slate-900/50 backdrop-blur p-6 hover:border-emerald-500/40 transition-colors">
            <Trophy className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Continuous Rounds</h3>
            <p className="text-slate-400">New rounds automatically created. Play whenever you're ready.</p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { num: '1', title: 'Sign In', desc: 'Create account with Privy' },
            { num: '2', title: 'Join Round', desc: 'Pay entry fee instantly' },
            { num: '3', title: 'Wait', desc: 'Round fills or timer ends' },
            { num: '4', title: 'Win', desc: 'Claim prize automatically' },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-slate-400">
          <p>© 2025 Fortuna. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
