'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { usePrivy } from '@privy-io/react-auth'
import { ethers } from 'ethers'
import { fortunaCoreAddress, fortunaCoreABI } from '@/lib/contracts'

export default function AdminPage() {
  const router = useRouter()
  const { user, ready, authenticated } = usePrivy()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [entryFee, setEntryFee] = useState('0')
  const [platformFee, setPlatformFee] = useState('2') // Assuming 2%
  const [platformBalance, setPlatformBalance] = useState('0')

  console.log('AdminPage: Component rendered');
  console.log('AdminPage: Initial user state:', user);
  console.log('AdminPage: Privy ready:', ready);
  console.log('AdminPage: Privy authenticated:', authenticated);

  useEffect(() => {
    console.log('AdminPage: useEffect triggered. Current user:', user);
    console.log('AdminPage: useEffect triggered. Privy ready:', ready);
    console.log('AdminPage: useEffect triggered. Privy authenticated:', authenticated);

    async function fetchAdminData() {
      console.log('AdminPage: fetchAdminData called');
      if (!ready || !authenticated || !user || !user.wallet) {
        console.log('AdminPage: Privy not ready, not authenticated, or user/wallet not available. Returning from fetchAdminData.');
        // If not ready/authenticated, we should still set isFetching to false
        // to avoid infinite loader if the user is genuinely not logged in.
        // However, the component's initial `isFetching` state handles the initial load.
        // If the user is not authenticated, they shouldn't see the admin page anyway.
        // For now, let's keep the loader if not ready/authenticated, as it implies waiting.
        // If the user is not authenticated, they should be redirected or shown an error.
        // For this specific issue (infinite loader), we need to ensure data fetching only happens when conditions are met.
        setIsFetching(false); // Set to false if conditions aren't met to avoid infinite spinner
        return
      }
      try {
        setIsFetching(true)
        console.log('AdminPage: Attempting to get Ethers provider and contract');
        const provider = new ethers.BrowserProvider(await user.wallet.getEthersProvider())
        const contract = new ethers.Contract(fortunaCoreAddress, fortunaCoreABI, provider)
        
        const fee = await contract.getEntryFee()
        setEntryFee(ethers.formatUnits(fee, 6))
        console.log('AdminPage: Fetched entry fee:', ethers.formatUnits(fee, 6));
        
        const balance = await contract.getPlatformBalance()
        setPlatformBalance(ethers.formatUnits(balance, 6))
        console.log('AdminPage: Fetched platform balance:', ethers.formatUnits(balance, 6));
      } catch (error) {
        console.error('AdminPage: Error fetching admin data:', error)
      } finally {
        setIsFetching(false)
        console.log('AdminPage: fetchAdminData finished. isFetching set to false.');
      }
    }
    fetchAdminData()
  }, [user, ready, authenticated])

  const handleUpdateFees = async () => {
    if (!user || !user.wallet) return
    setIsUpdating(true)
    try {
      const provider = new ethers.BrowserProvider(await user.wallet.getEthersProvider())
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(fortunaCoreAddress, fortunaCoreABI, signer)
      
      const tx = await contract.setEntryFee(ethers.parseUnits(entryFee, 6))
      await tx.wait()
      // You might want to add a success toast here
    } catch (error) {
      console.error('Error updating fees:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleWithdrawFees = async () => {
    if (!user || !user.wallet) return
    setIsUpdating(true)
    try {
      const provider = new ethers.BrowserProvider(await user.wallet.getEthersProvider())
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(fortunaCoreAddress, fortunaCoreABI, signer)
      
      const tx = await contract.withdrawPlatformFees(user.wallet.address)
      await tx.wait()
      // You might want to add a success toast here
    } catch (error) {
      console.error('Error withdrawing fees:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePause = async () => {
    if (!user || !user.wallet) return
    setIsUpdating(true)
    try {
      const provider = new ethers.BrowserProvider(await user.wallet.getEthersProvider())
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(fortunaCoreAddress, fortunaCoreABI, signer)
      
      const tx = await contract.pause()
      await tx.wait()
      // You might want to add a success toast here
    } catch (error) {
      console.error('Error pausing system:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateRound = async () => {
    if (!user || !user.wallet) return
    setIsUpdating(true)
    try {
      const provider = new ethers.BrowserProvider(await user.wallet.getEthersProvider())
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(fortunaCoreAddress, fortunaCoreABI, signer)
      
      const tx = await contract.createNewRound()
      await tx.wait()
      // You might want to add a success toast here
    } catch (error) {
      console.error('Error creating new round:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="text-slate-400 hover:text-white mb-8 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage platform settings and fees</p>
        </div>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900 border border-slate-800">
            <TabsTrigger value="stats" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="fees" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Fee Settings
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-elevated p-6">
                <p className="text-slate-400 text-sm mb-2">Platform Earnings</p>
                <p className="text-3xl font-bold text-emerald-400">{platformBalance} USDC</p>
                <p className="text-slate-500 text-xs mt-2">All-time accumulated fees</p>
              </Card>
              {/* Other stats would need more contract functions */}
            </div>
          </TabsContent>

          <TabsContent value="fees" className="space-y-6 mt-6">
            <Card className="card-elevated p-6 space-y-6">
              <div>
                <label className="block text-white font-semibold mb-4">Entry Fee (USDC)</label>
                <input
                  type="number"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:border-emerald-500"
                  step="1"
                  min="0"
                />
                <p className="text-slate-400 text-sm mt-2">Current: {entryFee} USDC</p>
              </div>

              <Button
                onClick={handleUpdateFees}
                disabled={isUpdating}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold h-12"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Entry Fee'
                )}
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6 mt-6">
            <Card className="card-elevated p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Withdraw Platform Fees</h3>
                <p className="text-slate-400 mb-4">Transfer accumulated fees to your account</p>
                <Button
                  onClick={handleWithdrawFees}
                  disabled={isUpdating}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold h-12"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    `Withdraw ${platformBalance} USDC`
                  )}
                </Button>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-2">System Controls</h3>
                <p className="text-slate-400 text-sm mb-4">Pause or restart the platform</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={handlePause} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                    Pause System
                  </Button>
                  <Button onClick={handleCreateRound} variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                    Create Round
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
