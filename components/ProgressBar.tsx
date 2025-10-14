'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ProgressBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Match với duration của PageTransition

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-[#5f7ab8] via-[#4a6199] to-[#5f7ab8] animate-progress"
        style={{
          animation: 'progress 0.3s ease-in-out forwards',
        }}
      />
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

