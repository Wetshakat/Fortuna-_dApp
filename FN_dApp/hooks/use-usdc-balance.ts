import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { ethers } from 'ethers';

// USDC ABI (simplified to only include the balanceOf function)
const USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

// Get USDC address from environment variable
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS;

export function useUSDCBalance() {
  const { user } = usePrivy();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance() {
      if (!user || !user.wallet || !USDC_ADDRESS) {
        setBalance(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Privy provides an Ethers.js provider
        const provider = new ethers.BrowserProvider(await user.wallet.getEthersProvider());
        const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);

        const walletAddress = user.wallet.address;
        const rawBalance = await usdcContract.balanceOf(walletAddress);

        // USDC has 6 decimal places
        const formattedBalance = ethers.formatUnits(rawBalance, 6);
        setBalance(formattedBalance);
      } catch (err) {
        console.error("Failed to fetch USDC balance:", err);
        setError("Failed to fetch balance.");
        setBalance(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, [user]); // Re-fetch when user object changes

  return { balance, loading, error };
}
