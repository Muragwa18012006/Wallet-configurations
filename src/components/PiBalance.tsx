'use client';

import { useState, useEffect } from 'react';
import { piBlockchain } from '@/lib/pi-blockchain';
import { cn, formatPiAmount } from '@/lib/utils';

interface PiBalanceProps {
  walletAddress?: string;
  className?: string;
  refreshInterval?: number;
}

export function PiBalance({
  walletAddress,
  className,
  refreshInterval = 30000,
}: PiBalanceProps) {
  const [balance, setBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Note: This is a server-side operation
      // In production, you should fetch this from your backend API
      const service = piBlockchain();
      const bal = await service.getBalance(walletAddress);
      setBalance(bal);
    } catch (err) {
      setError('Failed to fetch balance');
      console.error('Balance fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    
    if (refreshInterval > 0) {
      const interval = setInterval(fetchBalance, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [walletAddress, refreshInterval]);

  return (
    <div className={cn("p-4 bg-white rounded-lg shadow-md", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Pi Balance</p>
          <div className="flex items-baseline gap-1">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              <>
                <span className="text-2xl font-bold text-gray-800">
                  {formatPiAmount(parseFloat(balance))}
                </span>
                <span className="text-lg text-gray-500">π</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={fetchBalance}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-pi-purple transition-colors"
        >
          <svg
            className={cn("w-5 h-5", isLoading && "animate-spin")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
