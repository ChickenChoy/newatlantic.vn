'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import SearchResults from './SearchResults';
import MobileTouchMenu from './MobileTouchMenu';
import { WishlistManager } from '@/lib/wishlist';
import { Category } from '@/types';

interface NavItem {
  id: string;
  label: string;
  href: string;
  type: 'link' | 'dropdown' | 'button';
  target?: '_self' | '_blank';
  enabled: boolean;
  order: number;
  showInMobile: boolean;
  showInDesktop: boolean;
}

interface NavbarSettings {
  items: NavItem[];
  showSearch: boolean;
  showWishlist: boolean;
  showCatalogButton: boolean;
  showContactButton: boolean;
  catalogButtonText: string;
  catalogButtonUrl: string;
  contactButtonText: string;
  contactButtonUrl: string;
}

const DEFAULT_NAVBAR: NavbarSettings = {
  items: [
    { id: '1', label: 'Trang chủ', href: '/', type: 'link', enabled: true, order: 0, showInMobile: true, showInDesktop: true },
    { id: '2', label: 'Sản phẩm', href: '/san-pham', type: 'dropdown', enabled: true, order: 1, showInMobile: true, showInDesktop: true },
    { id: '3', label: 'Tin tức', href: '/tin-tuc', type: 'link', enabled: true, order: 2, showInMobile: true, showInDesktop: true },
    { id: '4', label: 'Thư viện hình ảnh', href: '/thu-vien-hinh-anh', type: 'link', enabled: true, order: 3, showInMobile: true, showInDesktop: true },
  ],
  showSearch: true,
  showWishlist: true,
  showCatalogButton: true,
  showContactButton: true,
  catalogButtonText: 'Xem catalog',
  catalogButtonUrl: '/page-download-catalog',
  contactButtonText: 'Liên hệ',
  contactButtonUrl: '/lien-he',
};

export default function HeaderBottom() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logo, setLogo] = useState('/images/logo/logo-color.png');
  const [navSettings, setNavSettings] = useState<NavbarSettings>(DEFAULT_NAVBAR);
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

    // Fetch site settings for logo
    fetch('/api/site-settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.logo) setLogo(data.logo);
      })
      .catch(() => { });

    // Fetch navbar settings
    const fetchNavbarSettings = () => {
      fetch('/api/navbar-settings')
        .then(res => res.ok ? res.json() : DEFAULT_NAVBAR)
        .then(data => setNavSettings(data))
        .catch(() => setNavSettings(DEFAULT_NAVBAR));
    };
    fetchNavbarSettings();

    // Auto-refresh navbar when admin saves settings (custom event)
    const handleNavbarUpdate = () => fetchNavbarSettings();
    window.addEventListener('navbarSettingsUpdated', handleNavbarUpdate);

    // Also re-fetch when user switches back to this tab (e.g. from admin tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNavbarSettings();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('navbarSettingsUpdated', handleNavbarUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Hide FloatingContactButtons and lock body scroll when mobile menu is open
  useEffect(() => {
    const floatingContact = document.querySelector('[data-floating-contact="true"]');
    if (mobileMenuOpen) {
      // Hide floating contact
      if (floatingContact) {
        (floatingContact as HTMLElement).style.opacity = '0';
        (floatingContact as HTMLElement).style.pointerEvents = 'none';
      }
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // Show floating contact
      if (floatingContact) {
        (floatingContact as HTMLElement).style.opacity = '';
        (floatingContact as HTMLElement).style.pointerEvents = '';
      }
      // Unlock body scroll
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
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

  const toggleDropdown = useCallback((dropdownName: string) => {
    setOpenDropdown(prev => prev === dropdownName ? null : dropdownName);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setSearchOpen(prev => {
      if (prev) setSearchQuery('');
      return !prev;
    });
  }, []);

  // Debounced search to reduce unnecessary renders and API calls
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (value.trim().length >= 2) {
      setSearchOpen(true);
    } else if (value.trim().length === 0) {
      setSearchOpen(false);
    }
  }, 300);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Memoize mobile menu categories to prevent re-render
  const mobileCategoryItems = useMemo(() => categories, [categories]);

  // Close mobile menu callback
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Count active desktop items for responsive sizing
  const desktopItemCount = useMemo(() =>
    navSettings.items.filter(item => item.enabled && item.showInDesktop).length,
    [navSettings.items]
  );
  const isCompact = desktopItemCount > 4;

  return (
    <>
      <div className={`fixed top-12 md:top-8 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none header-bottom ${isScrolled ? 'top-2 md:top-3' : ''}`} data-header-bottom suppressHydrationWarning>
        <nav className="w-full max-w-7xl mx-auto pointer-events-auto">
          <div className={`px-4 py-2 md:px-6 md:py-2.5 ${mobileMenuOpen ? 'rounded-2xl' : 'rounded-full'
            } ${isScrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border border-gray-200/60'
              : 'bg-white/90 backdrop-blur-md shadow-xl border border-gray-200/40'
            }`}>
            <div className={`flex items-center justify-between ${isCompact ? 'gap-2' : 'gap-4'}`}>
              {/* Logo và Brand Name */}
              <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="relative w-7 h-7 md:w-8 md:h-8 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src={logo}
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

              {/* Desktop Navigation - Dynamic from navbar settings */}
              <div className={`hidden lg:flex items-center flex-1 justify-center ${isCompact ? 'gap-0' : 'gap-1'}`} suppressHydrationWarning>
                {navSettings.items
                  .filter(item => item.enabled && item.showInDesktop)
                  .sort((a, b) => a.order - b.order)
                  .map(item => {
                    if (item.type === 'dropdown' && item.href === '/san-pham') {
                      // Products Dropdown - maintains existing category dropdown behavior
                      return (
                        <div key={item.id} className="relative dropdown-container">
                          <button
                            onClick={() => toggleDropdown('products')}
                            onMouseEnter={() => setOpenDropdown('products')}
                            className={`${isCompact ? 'px-2.5' : 'px-4'} py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-[#5f7ab8] hover:bg-gray-50/80 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap`}
                          >
                            {item.label}
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
                            className={`absolute left-0 top-full mt-2 w-[700px] bg-white shadow-2xl rounded-xl transition-all duration-200 overflow-hidden border border-gray-100 ${mounted && openDropdown === 'products' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                          >
                            <div className="p-4 grid grid-cols-2 gap-4">
                              {categories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/san-pham/${cat.slug}`}
                                  onClick={(e) => {
                                    setOpenDropdown(null);
                                    if (cat.href) window.open(cat.href, '_blank');
                                  }}
                                  className="flex items-start gap-4 px-4 py-4 text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg transition-colors group"
                                >
                                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-1 border border-gray-100">
                                    <img
                                      src={cat.image || '/images/box-image/MAY.jpg'}
                                      alt={`${cat.name} - ${cat.description || 'Thiết bị công nghiệp'}`}
                                      className="w-full h-full object-contain"
                                      loading="lazy"
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
                      );
                    }
                    // Regular link items
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        target={item.target || '_self'}
                        className={`${isCompact ? 'px-2.5' : 'px-4'} py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-[#5f7ab8] hover:bg-gray-50/80 transition-all duration-200 whitespace-nowrap`}
                      >
                        {item.label}
                      </Link>
                    );
                  })
                }
              </div>

              {/* Desktop Search Bar và Buttons - Right Side */}
              <div className={`hidden lg:flex items-center ${isCompact ? 'gap-2' : 'gap-3'} flex-shrink-0`}>
                {/* Wishlist Icon - controlled by navSettings */}
                {navSettings.showWishlist && (
                  <Link
                    href="/yeu-thich"
                    className="relative p-2 rounded-lg text-gray-700 hover:bg-gray-50/80 transition-all duration-200"
                    aria-label={wishlistCount > 0 ? `Sản phẩm yêu thích (${wishlistCount})` : 'Sản phẩm yêu thích'}
                    title="Sản phẩm yêu thích"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {wishlistCount > 0 && (
                      <span
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        aria-label={`${wishlistCount} sản phẩm`}
                      >
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Search Container - controlled by navSettings */}
                {navSettings.showSearch && (
                  <div className="relative search-container">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <label htmlFor="search-desktop" className="sr-only">
                          Tìm kiếm sản phẩm
                        </label>
                        <input
                          id="search-desktop"
                          type="search"
                          placeholder="Tìm kiếm sản phẩm..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => searchQuery.trim().length >= 2 && setSearchOpen(true)}
                          autoComplete="off"
                          aria-label="Tìm kiếm sản phẩm"
                          role="searchbox"
                          aria-autocomplete="list"
                          aria-controls="search-results"
                          aria-expanded={searchOpen}
                          className={`px-3 py-1.5 pr-8 rounded-lg text-xs bg-gray-50/80 text-gray-700 placeholder-gray-400 border border-gray-200/60 focus:bg-white focus:border-[#5f7ab8] focus:ring-1 focus:ring-[#5f7ab8]/30 transition-all duration-200 h-8`}
                          style={{ width: searchOpen ? (isCompact ? '200px' : '240px') : (isCompact ? '120px' : '160px') }}
                        />
                        <button
                          onClick={handleSearchToggle}
                          aria-label="Thực hiện tìm kiếm"
                          title="Tìm kiếm"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors text-gray-400 hover:text-[#5f7ab8]"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                      {/* Character count feedback */}
                      {searchQuery.length > 0 && searchQuery.length < 2 && (
                        <div className="text-[10px] text-gray-400 mt-1 absolute top-full left-0">
                          Nhập thêm {2 - searchQuery.length} ký tự
                        </div>
                      )}
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
                )}

                {/* CTA Buttons - controlled by navSettings */}
                {navSettings.showCatalogButton && (
                  <Link
                    href={navSettings.catalogButtonUrl}
                    className="px-4 py-2 rounded-full text-xs font-medium text-gray-800 border border-gray-300/80 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 whitespace-nowrap"
                  >
                    {navSettings.catalogButtonText}
                  </Link>
                )}
                {navSettings.showContactButton && (
                  <Link
                    href={navSettings.contactButtonUrl}
                    className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] hover:from-[#4a6199] hover:to-[#3d4f7d] transition-all duration-200 shadow-md hover:shadow-xl whitespace-nowrap"
                  >
                    {navSettings.contactButtonText}
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <MobileTouchMenu className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-button p-2 rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
                  aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  suppressHydrationWarning
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
            {mobileMenuOpen && (
              <div id="mobile-menu" className="mobile-menu-container lg:hidden mt-3 pb-3">
                <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] overscroll-contain">
                  {/* Mobile Search - controlled by navSettings */}
                  {navSettings.showSearch && (
                    <div className="search-container mb-3">
                      <div className="relative">
                        <label htmlFor="search-mobile" className="sr-only">
                          Tìm kiếm sản phẩm
                        </label>
                        <input
                          id="search-mobile"
                          type="search"
                          placeholder="Tìm kiếm sản phẩm..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => searchQuery.trim().length >= 2 && setSearchOpen(true)}
                          autoComplete="off"
                          aria-label="Tìm kiếm sản phẩm"
                          role="searchbox"
                          aria-autocomplete="list"
                          aria-controls="search-results"
                          aria-expanded={searchOpen}
                          className="w-full px-3 py-2 pr-8 rounded-lg text-xs bg-gray-50 text-gray-700 placeholder-gray-500 border border-gray-200 focus:bg-white focus:border-[#5f7ab8] focus:ring-1 focus:ring-[#5f7ab8]/20 transition-all"
                        />
                        <button
                          onClick={handleSearchToggle}
                          aria-label="Thực hiện tìm kiếm"
                          title="Tìm kiếm"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors text-gray-400 hover:text-[#5f7ab8]"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                  )}

                  {/* Dynamic mobile nav items from settings */}
                  {navSettings.items
                    .filter(item => item.enabled && item.showInMobile)
                    .sort((a, b) => a.order - b.order)
                    .map(item => {
                      if (item.type === 'dropdown' && item.href === '/san-pham') {
                        // Special rendering for product dropdown in mobile
                        return (
                          <div key={item.id}>
                            <Link
                              href={item.href}
                              onClick={closeMobileMenu}
                              className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg"
                            >
                              {item.label}
                            </Link>
                            <div className="ml-3">
                              <div className="text-xs font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wider">DANH MỤC</div>
                              {mobileCategoryItems.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/san-pham/${cat.slug}`}
                                  onClick={(e) => {
                                    closeMobileMenu();
                                    if (cat.href) window.open(cat.href, '_blank');
                                  }}
                                  className="block py-2.5 px-3 text-sm text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg"
                                >
                                  {cat.name}
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-gray-200 my-2"></div>
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          target={item.target || '_self'}
                          onClick={closeMobileMenu}
                          className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg"
                        >
                          {item.label}
                        </Link>
                      );
                    })
                  }

                  {/* Wishlist in mobile - controlled by navSettings */}
                  {navSettings.showWishlist && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <Link
                        href="/yeu-thich"
                        onClick={closeMobileMenu}
                        className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg"
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
                    </>
                  )}

                  {/* CTA Buttons in mobile - controlled by navSettings */}
                  <div className="border-t border-gray-200 my-2"></div>
                  {navSettings.showCatalogButton && (
                    <Link
                      href={navSettings.catalogButtonUrl}
                      onClick={closeMobileMenu}
                      className="block py-2.5 px-3 text-sm font-medium text-gray-700 hover:bg-[#5f7ab8] hover:text-white rounded-lg"
                    >
                      {navSettings.catalogButtonText}
                    </Link>
                  )}
                  {navSettings.showContactButton && (
                    <Link
                      href={navSettings.contactButtonUrl}
                      onClick={closeMobileMenu}
                      className="block py-3 px-3 text-sm bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white font-semibold text-center rounded-lg mt-2 hover:from-[#4a6199] hover:to-[#3d4f7d] shadow-md"
                    >
                      {navSettings.contactButtonText}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
