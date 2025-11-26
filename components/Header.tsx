'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is home page
  const isHomePage = pathname === '/';
  
  // Check if current page is policy/terms page (should always show white navbar)
  const isPolicyPage = pathname === '/dieu-khoan-dich-vu' || pathname === '/chinh-sach-bao-mat';

  useEffect(() => {
    // Delay setting mounted to ensure hydration completes first
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        mounted && (scrolled || isPolicyPage)
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
      suppressHydrationWarning
    >
      {/* Empty header - navigation moved to HeaderBottom */}
    </header>
  );
}
