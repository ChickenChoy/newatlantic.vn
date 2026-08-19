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
    <div className="fixed inset-x-0 top-0 z-[9999] h-[3px] bg-transparent">
      <div className="animate-route-progress h-full bg-accent" />
    </div>
  );
}
