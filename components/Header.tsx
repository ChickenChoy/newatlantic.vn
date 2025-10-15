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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isNotHomePage
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur-md shadow-md'
      }`}
    >
      {/* Top bar - Only visible when not scrolled and on home page */}
      {!scrolled && !isNotHomePage && (
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-sky-50 text-gray-800 py-3.5 hidden md:block border-b border-blue-100 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center">
              {/* Left: Contact Info */}
              <div className="flex items-center gap-8">
                <a 
                  href="mailto:info@newatlantic.vn" 
                  className="group flex items-center gap-2.5 hover:text-blue-600 transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">info@newatlantic.vn</span>
                </a>
                
                <div className="h-6 w-px bg-blue-200"></div>
                
                <a 
                  href="tel:+842838733686" 
                  className="group flex items-center gap-2.5 hover:text-emerald-600 transition-all duration-300"
                >
                  <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">+84 2838 733 686</span>
                </a>
              </div>

              {/* Right: Brand Partners */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-100 px-5 py-2 rounded-full shadow-sm border border-amber-200">
                <span className="text-xs font-semibold tracking-wider text-gray-800">
                  <span className="text-amber-700 font-bold">WILL-BURT</span>
                  <span className="mx-1.5 text-gray-400">|</span>
                  <span className="text-amber-700 font-bold">HIAB</span>
                  <span className="mx-1.5 text-gray-400">|</span>
                  <span className="text-amber-700 font-bold">LOVOL</span>
                  <span className="mx-1.5 text-gray-400">|</span>
                  <span className="text-amber-700 font-bold">LIUGONG</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="text-xl font-bold bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent">
                NEW ATLANTIC
              </div>
              <div className="text-xs text-gray-600">
                Tân Đại Tây Dương
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" suppressHydrationWarning>
            <Link 
              href="/" 
              className="px-4 py-2 rounded-lg font-medium transition-all text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50"
              suppressHydrationWarning
            >
              Trang chủ
            </Link>

            {/* Products Dropdown */}
            <div className="relative dropdown-container" suppressHydrationWarning>
              <button 
                onClick={() => toggleDropdown('products')}
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50"
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
              className="px-4 py-2 rounded-lg font-medium transition-all text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50"
              suppressHydrationWarning
            >
              Tin tức
            </Link>
            <Link 
              href="/lien-he" 
              className="ml-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all"
              suppressHydrationWarning
            >
              Liên hệ
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button lg:hidden p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
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
