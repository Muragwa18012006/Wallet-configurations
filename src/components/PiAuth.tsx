'use client';

import { useState, useEffect } from 'react';
import { piSDK } from '@/lib/pi-sdk';
import { AuthResult, PiUser } from '@/types/pi-sdk';
import { cn, isPiBrowser } from '@/lib/utils';

interface PiAuthProps {
  onAuthSuccess?: (result: AuthResult) => void;
  onAuthError?: (error: Error) => void;
  className?: string;
}

export function PiAuth({ onAuthSuccess, onAuthError, className }: PiAuthProps) {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPiEnv, setIsPiEnv] = useState(false);

  useEffect(() => {
    setIsPiEnv(isPiBrowser());
  }, []);

  const handleAuthenticate = async () => {
    setIsLoading(true);
    try {
      const result = await piSDK.authenticate(['username', 'payments']);
      setUser(result.user);
      onAuthSuccess?.(result);
    } catch (error) {
      console.error('Authentication error:', error);
      onAuthError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return (
      <div className={cn("flex items-center gap-3 p-4 bg-white rounded-lg shadow-md", className)}>
        <div className="w-10 h-10 bg-pi-purple rounded-full flex items-center justify-center text-white font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{user.username}</p>
          <p className="text-sm text-gray-500">Pi Network User</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className={cn("p-6 bg-white rounded-lg shadow-md", className)}>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Connect with Pi</h2>
      <p className="text-gray-600 mb-6">
        Sign in with your Pi Network account to access exclusive features.
      </p>
      
      {!isPiEnv && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            For the best experience, please open this app in the Pi Browser.
          </p>
        </div>
      )}

      <button
        onClick={handleAuthenticate}
        disabled={isLoading}
        className={cn(
          "w-full py-3 px-6 rounded-lg font-semibold text-white transition-all",
          "bg-pi-purple hover:bg-purple-700",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Connecting...
          </span>
        ) : (
          'Sign in with Pi'
        )}
      </button>
    </div>
  );
}
