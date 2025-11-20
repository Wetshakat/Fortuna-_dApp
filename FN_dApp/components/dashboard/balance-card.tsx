'use client'

import { Card } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { useUSDCBalance } from '@/hooks/use-usdc-balance'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button' // Import Button
// import { WithdrawModal } from './withdraw-modal' // Import WithdrawModal
// import { useState } from 'react' // Import useState

export function BalanceCard() {
  const { balance, loading, error } = useUSDCBalance()
  // const [isModalOpen, setIsModalOpen] = useState(false) // State to control modal visibility

  return (
    <Card className="card-elevated p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">Balance</p>
          {loading ? (
            <Skeleton className="h-9 w-36 bg-slate-700" />
          ) : error ? (
            <p className="text-red-400 text-xl">Error</p>
          ) : (
            <p className="text-3xl font-bold text-white">{balance} USDC</p>
          )}
          <p className="text-emerald-400 text-sm mt-2">+234.50 this week</p>
        </div>
        <Wallet className="w-8 h-8 text-emerald-400/50" />
      </div>
      {/* <Button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold" onClick={() => setIsModalOpen(true)}>
        Withdraw
      </Button>

      <WithdrawModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </Card>
  )
}
