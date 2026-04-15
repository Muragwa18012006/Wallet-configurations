'use client';

import { useState } from 'react';
import { piSDK } from '@/lib/pi-sdk';
import { cn } from '@/lib/utils';

interface PiShareProps {
  title?: string;
  message?: string;
  className?: string;
  buttonText?: string;
}

export function PiShare({
  title = 'Check out this Pi App!',
  message = 'I found this amazing app on Pi Network. Join me!',
  className,
  buttonText = 'Share on Pi',
}: PiShareProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await piSDK.init();
      window.Pi.openShareDialog(title, message);
    } catch (error) {
      console.error('Share error:', error);
      // Fallback to native share if available
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text: message,
            url: window.location.href,
          });
        } catch (shareError) {
          console.error('Native share failed:', shareError);
        }
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium",
        "bg-blue-500 hover:bg-blue-600 text-white transition-colors",
        isSharing && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {isSharing ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
      )}
      {buttonText}
    </button>
  );
}
