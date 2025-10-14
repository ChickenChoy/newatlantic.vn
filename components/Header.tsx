'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is detail page (product or post detail)
  const isDetailPage = (pathname?.includes('/san-pham/') && pathname?.split('/').length > 3) 
    || (pathname?.includes('/tin-tuc/') && pathname?.split('/').length > 2);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      {/* Top bar - Only visible when not scrolled */}
      {!scrolled && (
        <div className="bg-[#5f7ab8] text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <a href="mailto:info@newatlantic.vn" className="hover:text-gray-200 transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@newatlantic.vn
              </a>
              <a href="tel:+842838733686" className="hover:text-gray-200 transition flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +84 2838 733 686
              </a>
            </div>
            <div className="hidden md:block text-xs">
              Nhà phân phối chính thức WILL-BURT | HIAB | LOVOL | LIUGONG
            </div>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 group-hover:scale-105 transition-transform" suppressHydrationWarning>
              <Image
                src={isDetailPage ? "/images/logo/logo-color.png" : (scrolled ? "/images/logo/logo-color.png" : "/images/logo/logo.png")}
                alt="NEW ATLANTIC"
                fill
                className="object-contain"
                suppressHydrationWarning
              />
            </div>
            <div suppressHydrationWarning>
              <div className={`text-xl font-bold transition-colors ${
                isDetailPage 
                  ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent'
                  : (scrolled 
                      ? 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent'
                      : 'text-white')
              }`}>
                NEW ATLANTIC
              </div>
              <div className={`text-xs transition-colors ${
                isDetailPage ? 'text-gray-500' : (scrolled ? 'text-gray-500' : 'text-gray-200')
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
                isDetailPage
                  ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                  : (scrolled 
                      ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10')
              }`}
              suppressHydrationWarning
            >
              Trang chủ
            </Link>

            {/* Products Dropdown */}
            <div className="relative group">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  isDetailPage
                    ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                    : (scrolled 
                        ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50' 
                        : 'text-white hover:bg-white/10')
                }`}
                suppressHydrationWarning
              >
                Sản phẩm
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full mt-2 w-72 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden border border-gray-100">
                <div className="p-2">
                  <Link 
                    href="/san-pham/cot-tu-nang-will-burt" 
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Cột Tự Nâng WILL-BURT</div>
                    <div className="text-xs opacity-75">Cột nâng chuyên nghiệp</div>
                  </Link>
                  <Link 
                    href="/san-pham/thiet-bi-nang-ha-hiab" 
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Thiết Bị HIAB</div>
                    <div className="text-xs opacity-75">Cẩu & xe nâng</div>
                  </Link>
                  <Link 
                    href="/san-pham/thiet-bi-cong-trinh-lovol" 
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Thiết Bị LOVOL</div>
                    <div className="text-xs opacity-75">Máy móc công trình</div>
                  </Link>
                  <Link 
                    href="/san-pham/thiet-bi-cong-trinh-liugong" 
                    className="block px-4 py-3 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors"
                  >
                    <div className="font-semibold">Thiết Bị LIUGONG</div>
                    <div className="text-xs opacity-75">Máy xúc, máy ủi</div>
                  </Link>
                </div>
              </div>
            </div>

            <Link 
              href="/dich-vu" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDetailPage
                  ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                  : (scrolled 
                      ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10')
              }`}
              suppressHydrationWarning
            >
              Dịch vụ
            </Link>
            <Link 
              href="/gioi-thieu" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDetailPage
                  ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                  : (scrolled 
                      ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10')
              }`}
              suppressHydrationWarning
            >
              Giới thiệu
            </Link>
            <Link 
              href="/tin-tuc" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDetailPage
                  ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
                  : (scrolled 
                      ? 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50' 
                      : 'text-white hover:bg-white/10')
              }`}
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
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDetailPage 
                ? 'text-gray-700 hover:bg-gray-100'
                : (scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10')
            }`}
            suppressHydrationWarning
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
            <Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Trang chủ
            </Link>
            <div className="border-t pt-2">
              <div className="text-xs font-semibold text-gray-400 px-4 mb-2">SẢN PHẨM</div>
              <Link href="/san-pham/cot-tu-nang-will-burt" className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Cột Tự Nâng WILL-BURT
              </Link>
              <Link href="/san-pham/thiet-bi-nang-ha-hiab" className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Thiết Bị HIAB
              </Link>
              <Link href="/san-pham/thiet-bi-cong-trinh-lovol" className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Thiết Bị LOVOL
              </Link>
              <Link href="/san-pham/thiet-bi-cong-trinh-liugong" className="block py-2 px-4 text-gray-600 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
                Thiết Bị LIUGONG
              </Link>
            </div>
            <Link href="/dich-vu" className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Dịch vụ
            </Link>
            <Link href="/gioi-thieu" className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Giới thiệu
            </Link>
            <Link href="/tin-tuc" className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Tin tức
            </Link>
            <Link href="/lien-he" className="block py-2 px-4 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white font-semibold rounded-lg text-center mt-2">
              Liên hệ
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
