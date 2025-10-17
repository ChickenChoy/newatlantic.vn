'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is NOT home page (all pages except home should have white background)
  const isNotHomePage = pathname !== '/';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
      // Close mobile menu when clicking outside
      if (mobileMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    if (openDropdown || mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown, mobileMenuOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isNotHomePage
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 group-hover:scale-105 transition-transform" suppressHydrationWarning>
              <Image
                src="/images/logo/logo-color.png"
                alt="NEW ATLANTIC"
                fill
                className="object-contain"
                suppressHydrationWarning
              />
            </div>
            <div suppressHydrationWarning>
              <div className={`text-xl font-bold transition-all ${
                scrolled || isNotHomePage
                  ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent'
                  : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
              }`}>
                NEW ATLANTIC
              </div>
              <div className={`text-xs transition-colors ${
                scrolled || isNotHomePage
                  ? 'text-gray-600'
                  : 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              }`}>
                Tân Đại Tây Dương
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" suppressHydrationWarning>
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                scrolled || isNotHomePage
                  ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
              suppressHydrationWarning
            >
              Trang chủ
            </Link>

            {/* Products Dropdown */}
            <div className="relative dropdown-container" suppressHydrationWarning>
              <button 
                onClick={() => toggleDropdown('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  scrolled || isNotHomePage
                    ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                    : 'text-white hover:text-white hover:bg-white/20'
                }`}
                suppressHydrationWarning
              >
                Sản phẩm
                <svg 
                  className={`w-4 h-4 transition-transform ${mounted && openDropdown === 'products' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  suppressHydrationWarning
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`absolute left-0 top-full mt-2 w-72 bg-white shadow-2xl rounded-xl transition-all duration-200 overflow-hidden border border-gray-100 ${
                  mounted && openDropdown === 'products' ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                suppressHydrationWarning
              >
                <div className="p-2">
                  <Link 
                    href="/san-pham/cot-tu-nang-will-burt"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Cột Tự Nâng WILL-BURT</div>
                    <div className="text-xs opacity-75">Cột nâng chuyên nghiệp</div>
                  </Link>
                  <Link 
                    href="/san-pham/thiet-bi-nang-ha-hiab"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Thiết Bị HIAB</div>
                    <div className="text-xs opacity-75">Cẩu & xe nâng</div>
                  </Link>
                  <Link 
                    href="/san-pham/thiet-bi-cong-trinh-lovol"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Thiết Bị LOVOL</div>
                    <div className="text-xs opacity-75">Máy móc công trình</div>
                  </Link>
                  <Link 
                    href="/san-pham/thiet-bi-cong-trinh-liugong"
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Thiết Bị LIUGONG</div>
                    <div className="text-xs opacity-75">Máy xúc, máy ủi</div>
                  </Link>
                </div>
              </div>
            </div>

            <Link 
              href="/tin-tuc" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                scrolled || isNotHomePage
                  ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                  : 'text-white hover:text-white hover:bg-white/20'
              }`}
              suppressHydrationWarning
            >
              Tin tức
            </Link>
            <Link 
              href="/lien-he" 
              className={`ml-4 px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all ${
                scrolled || isNotHomePage
                  ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white'
                  : 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
              }`}
              suppressHydrationWarning
            >
              Liên hệ
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`mobile-menu-button lg:hidden p-2 rounded-lg transition-colors ${
              scrolled || isNotHomePage
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/20'
            }`}
            suppressHydrationWarning
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              suppressHydrationWarning
            >
              {mounted && mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mounted && mobileMenuOpen && (
          <div className="mobile-menu-container lg:hidden mt-4 pb-4 space-y-2 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Trang chủ
            </Link>
            <div className="border-t pt-2">
              <div className="text-xs font-semibold text-gray-400 px-4 mb-2">SẢN PHẨM</div>
              <Link href="/san-pham/cot-tu-nang-will-burt" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Cột Tự Nâng WILL-BURT
              </Link>
              <Link href="/san-pham/thiet-bi-nang-ha-hiab" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Thiết Bị HIAB
              </Link>
              <Link href="/san-pham/thiet-bi-cong-trinh-lovol" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Thiết Bị LOVOL
              </Link>
              <Link href="/san-pham/thiet-bi-cong-trinh-liugong" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Thiết Bị LIUGONG
              </Link>
            </div>
            <Link href="/tin-tuc" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Tin tức
            </Link>
            <Link href="/lien-he" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white font-semibold rounded-lg text-center mt-2">
              Liên hệ
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
