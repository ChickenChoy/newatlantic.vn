'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FloatingContactButtons() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is NOT home page
  const isNotHomePage = pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      data-floating-contact="true"
      className={`fixed right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 md:gap-4 transition-all duration-500 ${
        scrolled || isNotHomePage
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-24 opacity-0 pointer-events-none'
      }`}
    >
      {/* Facebook Messenger */}
      <Link
        href="https://www.facebook.com/aittandaitayduong"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 md:w-14 md:h-14 bg-[#0084FF] hover:bg-[#0073E6] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        title="Chat qua Messenger"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.912 1.45 5.51 3.717 7.197V22l3.472-1.906c.927.256 1.91.393 2.928.393 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.535l-2.558-2.73-4.991 2.73 5.489-5.823 2.62 2.73 4.93-2.73-5.49 5.823z"/>
        </svg>
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat Messenger
        </span>
      </Link>

      {/* Google Maps */}
      <Link
        href="https://maps.app.goo.gl/ASNcY5HwYP4tVM9a9"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-12 h-12 md:w-14 md:h-14 bg-white hover:bg-gray-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        title="Xem vị trí trên Google Maps"
      >
        <img 
          src="/images/googlemaps-icon.png" 
          alt="Google Maps" 
          className="w-7 h-7 md:w-8 md:h-8 object-contain"
        />
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Xem trên Maps
        </span>
      </Link>

      {/* Phone Call */}
      <Link
        href="tel:+842838733686"
        className="group relative w-12 h-12 md:w-14 md:h-14 bg-[#1e3a5f] hover:bg-[#2d4a6f] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        title="Gọi điện thoại"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
        </svg>
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-gray-900 text-white text-xs md:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Gọi ngay
        </span>
      </Link>
    </div>
  );
}

