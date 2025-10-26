'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import MobileTouchMenu from './MobileTouchMenu';
import { WishlistManager } from '@/lib/wishlist';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();
  
  // Check if current page is home page
  const isHomePage = pathname === '/';

  useEffect(() => {
    setMounted(true);
    
    // Load initial wishlist count
    setWishlistCount(WishlistManager.getWishlistCount());
    
    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setWishlistCount(WishlistManager.getWishlistCount());
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
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
      // Close search when clicking outside
      if (searchOpen && !target.closest('.search-container')) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (openDropdown || mobileMenuOpen || searchOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown, mobileMenuOpen, searchOpen]);

  // Close dropdown on ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setSearchQuery('');
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

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setSearchOpen(true);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
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
                (isHomePage && !scrolled)
                  ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                  : 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] bg-clip-text text-transparent'
              }`}>
                NEW ATLANTIC
              </div>
              <div className={`text-xs transition-colors ${
                (isHomePage && !scrolled)
                  ? 'text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                  : 'text-gray-600'
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
                (isHomePage && !scrolled)
                  ? 'text-white hover:text-white hover:bg-white/20'
                  : 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
              }`}
              suppressHydrationWarning
            >
              Trang chủ
            </Link>

            {/* Products Dropdown */}
            <div className="relative dropdown-container" suppressHydrationWarning>
              <button 
                onClick={() => toggleDropdown('products')}
                onMouseEnter={() => setOpenDropdown('products')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  (isHomePage && !scrolled)
                    ? 'text-white hover:text-white hover:bg-white/20'
                    : 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
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
                (isHomePage && !scrolled)
                  ? 'text-white hover:text-white hover:bg-white/20'
                  : 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
              }`}
              suppressHydrationWarning
            >
              Tin tức
            </Link>
            <Link 
              href="/page-download-catalog" 
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                (isHomePage && !scrolled)
                  ? 'text-white hover:text-white hover:bg-white/20'
                  : 'text-gray-700 hover:text-[#5f7ab8] hover:bg-gray-50'
              }`}
              suppressHydrationWarning
            >
              Catalog sản phẩm
            </Link>
            <Link 
              href="/lien-he" 
              className={`ml-4 px-6 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all ${
                (isHomePage && !scrolled)
                  ? 'border-2 border-white text-white hover:bg-white hover:text-gray-900'
                  : 'bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white'
              }`}
              suppressHydrationWarning
            >
              Liên hệ
            </Link>
          </div>

          {/* Desktop Search Bar - Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Wishlist Icon */}
            <Link 
              href="/yeu-thich"
              className={`relative p-2 rounded-lg transition-all ${
                (isHomePage && !scrolled)
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              title="Sản phẩm yêu thích"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Search Container */}
            <div className="relative search-container">
              <div className="flex items-center">
                <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                  className={`px-4 py-2 pr-10 rounded-lg text-sm transition-all ${
                    (isHomePage && !scrolled)
                      ? 'bg-white/20 text-white placeholder-white/70 border border-white/30 focus:bg-white/30 focus:border-white/50'
                      : 'bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-200 focus:bg-white focus:border-[#5f7ab8] focus:ring-2 focus:ring-[#5f7ab8]/20'
                  }`}
                  style={{ width: searchOpen ? '280px' : '200px' }}
                />
                <button
                  onClick={handleSearchToggle}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
                    (isHomePage && !scrolled)
                      ? 'text-white/70 hover:text-white'
                      : 'text-gray-400 hover:text-[#5f7ab8]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Search Results */}
            <SearchResults 
              isOpen={searchOpen} 
              onClose={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }} 
              query={searchQuery} 
            />
            </div>
          </div>

          {/* Mobile menu button */}
          <MobileTouchMenu className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`mobile-menu-button p-2 rounded-lg transition-colors ${
                (isHomePage && !scrolled)
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-700 hover:bg-gray-100'
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
          </MobileTouchMenu>
        </div>

        {/* Mobile Navigation */}
        {mounted && mobileMenuOpen && (
          <div className="mobile-menu-container lg:hidden mt-4 pb-4 space-y-2 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
            {/* Mobile Search */}
            <div className="search-container mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                  className="w-full px-4 py-3 pr-10 rounded-lg text-sm bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-200 focus:bg-white focus:border-[#5f7ab8] focus:ring-2 focus:ring-[#5f7ab8]/20"
                />
                <button
                  onClick={handleSearchToggle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors text-gray-400 hover:text-[#5f7ab8]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile Search Results */}
              {searchOpen && (
                <div className="mt-2">
                  <SearchResults 
                    isOpen={searchOpen} 
                    onClose={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }} 
                    query={searchQuery} 
                  />
                </div>
              )}
            </div>

            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Trang chủ
            </Link>
            <Link href="/yeu-thich" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors relative">
              <div className="flex items-center justify-between">
                <span>Sản phẩm yêu thích</span>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </div>
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
            <Link href="/page-download-catalog" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors">
              Catalog sản phẩm
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
