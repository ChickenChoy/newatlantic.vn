'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import SearchResults from './SearchResults';
import MobileTouchMenu from './MobileTouchMenu';
import { WishlistManager } from '@/lib/wishlist';
import { Category } from '@/types';

export default function HeaderBottom() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    // Load initial wishlist count
    setWishlistCount(WishlistManager.getWishlistCount());

    // Listen for wishlist updates
    const handleWishlistUpdate = () => {
      setWishlistCount(WishlistManager.getWishlistCount());
    };

    // Scroll detection for glass effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Initial check
    handleScroll();

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fetch categories from API
    fetch('/api/categories')
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Hide FloatingContactButtons when mobile menu is open
  useEffect(() => {
    const floatingContact = document.querySelector('[data-floating-contact="true"]');
    if (floatingContact) {
      if (mobileMenuOpen) {
        // Hide when menu opens
        (floatingContact as HTMLElement).style.opacity = '0';
        (floatingContact as HTMLElement).style.pointerEvents = 'none';
        (floatingContact as HTMLElement).style.transform = 'translateX(100%)';
        (floatingContact as HTMLElement).style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      } else {
        // Show when menu closes - reset to let component manage its own state
        (floatingContact as HTMLElement).style.opacity = '';
        (floatingContact as HTMLElement).style.pointerEvents = '';
        (floatingContact as HTMLElement).style.transform = '';
        (floatingContact as HTMLElement).style.transition = '';
      }
    }
  }, [mobileMenuOpen]);

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
    <>
      <div className={`fixed top-12 md:top-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none header-bottom transition-all duration-300 ${isScrolled ? 'top-2 md:top-3' : ''}`} data-header-bottom suppressHydrationWarning>
        <nav className="w-full max-w-7xl mx-auto pointer-events-auto">
          <div className={`transition-all duration-300 px-4 py-2 md:px-6 md:py-2.5 ${mobileMenuOpen ? 'rounded-2xl' : 'rounded-full'
            } ${isScrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border border-gray-200/60'
              : 'bg-white/90 backdrop-blur-md shadow-xl border border-gray-200/40'
            }`}>
            <div className="flex items-center justify-between gap-4">
              {/* Logo và Brand Name */}
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="relative w-7 h-7 md:w-8 md:h-8 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/images/logo/logo-color.png"
                    alt="NEW ATLANTIC"
                    fill
                    className="object-contain"
                  />
                </div>
                <div suppressHydrationWarning className="flex items-center gap-1.5">
                  <span className="text-sm md:text-base font-semibold text-gray-900 whitespace-nowrap group-hover:text-[#5f7ab8] transition-colors">
                    NEW ATLANTIC
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1 flex-1 justify-center" suppressHydrationWarning>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-[#5f7ab8] hover:bg-gray-50/80 transition-all duration-200 whitespace-nowrap"
                >
                  Trang chủ
                </Link>

                {/* Products Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown('products')}
                    onMouseEnter={() => setOpenDropdown('products')}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-[#5f7ab8] hover:bg-gray-50/80 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    Sản phẩm
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${mounted && openDropdown === 'products' ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute left-0 top-full mt-2 w-[700px] bg-white shadow-2xl rounded-xl transition-all duration-200 overflow-hidden border border-gray-100 ${mounted && openDropdown === 'products' ? 'opacity-100 visible' : 'opacity-0 invisible'
                      }`}
                  >
                    <div className="p-4 grid grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/san-pham/${cat.slug}`}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-start gap-4 px-4 py-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors group"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-1 border border-gray-100">
                            <img
                              src={cat.image || '/images/box-image/MAY.jpg'}
                              alt={cat.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1.5">{cat.name}</div>
                            <div className="text-sm opacity-75">{cat.description || ''}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/tin-tuc"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-[#5f7ab8] hover:bg-gray-50/80 transition-all duration-200 whitespace-nowrap"
                >
                  Tin tức
                </Link>
                <Link
                  href="/thu-vien-hinh-anh"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-[#5f7ab8] hover:bg-gray-50/80 transition-all duration-200 whitespace-nowrap"
                >
                  Thư viện hình ảnh
                </Link>
              </div>

              {/* Desktop Search Bar và Buttons - Right Side */}
              <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                {/* Wishlist Icon */}
                <Link
                  href="/yeu-thich"
                  className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-50/80 transition-all duration-200"
                  title="Sản phẩm yêu thích"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                        className="px-3 py-1.5 pr-8 rounded-lg text-xs bg-gray-50/80 text-gray-700 placeholder-gray-400 border border-gray-200/60 focus:bg-white focus:border-[#5f7ab8] focus:ring-1 focus:ring-[#5f7ab8]/30 transition-all duration-200 h-8"
                        style={{ width: searchOpen ? '240px' : '160px' }}
                      />
                      <button
                        onClick={handleSearchToggle}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors text-gray-400 hover:text-[#5f7ab8]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Call-to-Action Buttons */}
                <Link
                  href="/page-download-catalog"
                  className="px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-gray-300/80 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 whitespace-nowrap"
                >
                  Xem catalog
                </Link>
                <Link
                  href="/lien-he"
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] hover:from-[#4a6199] hover:to-[#3d4f7d] transition-all duration-200 shadow-md hover:shadow-xl whitespace-nowrap"
                >
                  Liên hệ
                </Link>
              </div>

              {/* Mobile menu button */}
              <MobileTouchMenu className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-button p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                  suppressHydrationWarning
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </MobileTouchMenu>
            </div>

            {/* Mobile Navigation - Dropdown */}
            <div
              className={`mobile-menu-container lg:hidden ${mobileMenuOpen
                ? 'opacity-100 visible'
                : 'opacity-0 invisible pointer-events-none'
                } transition-opacity duration-150 ease-out`}
              style={{
                display: mobileMenuOpen ? 'block' : 'none',
                marginTop: mobileMenuOpen ? '0.75rem' : '0',
                paddingBottom: mobileMenuOpen ? '0.75rem' : '0',
              }}
            >
              <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
                {/* Mobile Search */}
                <div className="search-container mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                      className="w-full px-3 py-2 pr-8 rounded-lg text-xs bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-200 focus:bg-white focus:border-[#5f7ab8] focus:ring-1 focus:ring-[#5f7ab8]/20 transition-all"
                    />
                    <button
                      onClick={handleSearchToggle}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors text-gray-400 hover:text-[#5f7ab8]"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-all duration-200"
                >
                  Trang chủ
                </Link>
                <Link
                  href="/yeu-thich"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span>Sản phẩm yêu thích</span>
                    {wishlistCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <div>
                  <div className="text-xs font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wider">SẢN PHẨM</div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/san-pham/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-all duration-200"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  href="/tin-tuc"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-all duration-200"
                >
                  Tin tức
                </Link>
                <Link
                  href="/page-download-catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-all duration-200"
                >
                  Catalog sản phẩm
                </Link>
                <Link
                  href="/thu-vien-hinh-anh"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-all duration-200"
                >
                  Thư viện hình ảnh
                </Link>
                <Link
                  href="/lien-he"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-3 text-sm bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white font-semibold text-center rounded-lg mt-2 hover:from-[#4a6199] hover:to-[#3d4f7d] transition-all duration-200 shadow-md"
                >
                  Liên hệ
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
