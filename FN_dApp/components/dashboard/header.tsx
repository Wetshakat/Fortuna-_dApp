'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Settings, BarChart3, LogOut, Wallet } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'

export function Header() {
  const router = useRouter()
  const { user, linkWallet } = usePrivy()
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  const handleLogout = () => {
    // Clear auth state and redirect to login
    localStorage.removeItem('userAuth')
    router.push('/login')
  }

  return (
    <header className="border-b border-emerald-500/10 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
          <Image src="/Fortuna.png" alt="Fortuna Logo" width={40} height={40} />
          <span className="text-xl font-bold text-white">Fortuna</span>
        </div>

        <div className="flex items-center gap-3">
          {user && !user.wallet && (
            <Button
              variant="ghost"
              onClick={linkWallet}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin')}
            className="text-slate-400 hover:text-white"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </Button>

            {/* Dropdown Menu */}
            {showSettingsMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-slate-300 hover:text-white hover:bg-slate-700/50 flex items-center gap-2 transition-colors rounded-lg m-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
