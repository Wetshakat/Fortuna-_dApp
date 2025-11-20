'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Settings, History, Sparkles, Copy } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { ActiveRoundCard } from '@/components/dashboard/active-round-card'
import { BalanceCard } from '@/components/dashboard/balance-card'
import { usePrivy } from '@privy-io/react-auth'
import { useToast } from '@/components/ui/use-toast' // Import useToast

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const { user, ready } = usePrivy()
  const { toast } = useToast() // Initialize useToast

  console.log("Privy User Object:", user); // Add this line for debugging

  useEffect(() => {
    if (ready && !user) {
      router.push('/login');
    }
  }, [ready, user, router]);

  if (!ready || !user) {
    return null; // Or a loading spinner
  }

  const walletAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B';

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        toast({
          title: "Address Copied!",
          description: "Wallet address copied to clipboard.",
        });
      } catch (err) {
        console.error("Failed to copy address:", err);
        toast({
          title: "Copy Failed",
          description: "Could not copy address to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.linkedAccounts[0]?.name || user?.email?.address?.split('@')[0] || 'User'}</h1>
          {walletAddress ? (
            <div className="flex items-center gap-2">
              <p className="text-slate-400">{walletAddress}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyAddress}
                className="text-slate-400 hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <p className="text-red-400">No wallet connected. Please connect a wallet in your Privy settings.</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <BalanceCard />
          <Card className="card-elevated p-6">
            <p className="text-slate-400 text-sm mb-2">Total Won</p>
            <p className="text-3xl font-bold text-white">2,500 USDC</p>
            <p className="text-emerald-400 text-sm mt-2">3 rounds won</p>
          </Card>
          <Card className="card-elevated p-6">
            <p className="text-slate-400 text-sm mb-2">Join Streak</p>
            <p className="text-3xl font-bold text-white">7</p>
            <p className="text-slate-400 text-sm mt-2">consecutive rounds</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Active Rounds
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <ActiveRoundCard />
            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Join a Round</h3>
              <p className="text-slate-400 mb-6">
                Current round has 12/50 players. Join now to compete for the prize pool.
              </p>
              <Button
                onClick={() => router.push('/join-round')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold h-12"
              >
                Join Round
              </Button>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Game History</h3>
              <Button
                onClick={() => router.push('/history')}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-semibold h-12"
              >
                View Full History
              </Button>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            <Card className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Export Recovery Key</span>
                  <Button variant="outline" size="sm" className="border-emerald-500/50">
                    Export
                  </Button>
                </div>
                <div className="border-t border-slate-800" />
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold h-10 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
