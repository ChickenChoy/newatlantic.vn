'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SearchResults from './SearchResults';
import MobileTouchMenu from './MobileTouchMenu';
import { WishlistManager } from '@/lib/wishlist';
import { EASE_BRAND } from './motion/ease';
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

/**
 * Routes whose hero is a full-bleed dark image, so the bar sits on top of it
 * in the light-on-dark variant until the user scrolls away.
 */
const DARK_HERO_ROUTES = new Set(['/']);

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-6-6m6 6l-6 6" />
    </svg>
  );
}

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
  const pathname = usePathname() ?? '';
  const prefersReducedMotion = useReducedMotion();

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

    // Scroll detection: swaps the bar from transparent to solid
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

  // Close the panel on route change so a nav click never leaves it hanging open
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
      // Close search when clicking outside
      if (searchOpen && !target.closest('.search-container')) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (openDropdown || searchOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdown, searchOpen]);

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

  // A suggestion chip has to write back through here -- the panel does not own the query.
  const handleSuggestionPick = useCallback((value: string) => {
    setSearchQuery(value);
    setSearchOpen(true);
  }, []);

  // Memoize mobile menu categories to prevent re-render
  const mobileCategoryItems = useMemo(() => categories, [categories]);

  // Close mobile menu callback
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const desktopItems = useMemo(
    () => navSettings.items
      .filter(item => item.enabled && item.showInDesktop)
      .sort((a, b) => a.order - b.order),
    [navSettings.items]
  );
  const mobileItems = useMemo(
    () => navSettings.items
      .filter(item => item.enabled && item.showInMobile)
      .sort((a, b) => a.order - b.order),
    [navSettings.items]
  );

  // Tighten the pill when the CMS adds more than the template's five slots
  const isCompact = desktopItems.length > 4;

  // The bar rides on top of a dark hero until the first scroll; everywhere else
  // it is the template's light variant.
  const onDark = mounted && !isScrolled && DARK_HERO_ROUTES.has(pathname);
  const solid = !onDark;

  const isActive = useCallback(
    (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href),
    [pathname]
  );

  return (
    <>
      <header
        className={`header-bottom fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ease-brand ${
          solid
            ? 'bg-white/95 backdrop-blur-md border-b border-navy/14'
            : 'bg-transparent border-b border-transparent'
        }`}
        data-header-bottom
        suppressHydrationWarning
      >
        <div className="mx-auto flex max-w-site items-center gap-3 px-5 py-4 md:px-[30px] md:py-6">
          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div className="relative h-8 w-8 transition-transform duration-300 ease-brand group-hover:scale-105 md:h-[34px] md:w-[34px]">
              <Image src={logo} alt="NEW ATLANTIC" fill className="object-contain" />
            </div>
            <span
              suppressHydrationWarning
              className={`font-display whitespace-nowrap text-lg uppercase leading-none tracking-wide transition-colors duration-300 ease-brand md:text-xl ${
                solid ? 'text-navy' : 'text-white'
              }`}
            >
              New Atlantic
            </span>
          </Link>

          {/* Desktop menu — the template's bordered pill */}
          <nav className="hidden flex-1 justify-center lg:flex" aria-label="Điều hướng chính">
            <div
              suppressHydrationWarning
              className={`flex items-center rounded-pill border px-6 py-[18px] transition-colors duration-300 ease-brand ${
                isCompact ? 'gap-6' : 'gap-8 xl:gap-10'
              } ${solid ? 'border-navy/14 bg-surface' : 'border-white/14 bg-white/10 backdrop-blur-sm'}`}
            >
              {desktopItems.map(item => {
                if (item.type === 'dropdown' && item.href === '/san-pham') {
                  return (
                    <div key={item.id} className="dropdown-container relative">
                      <button
                        onClick={() => toggleDropdown('products')}
                        onMouseEnter={() => setOpenDropdown('products')}
                        aria-expanded={mounted && openDropdown === 'products'}
                        className={`flex items-center gap-1 whitespace-nowrap text-base font-medium leading-none transition-colors duration-300 ease-brand hover:text-accent ${
                          solid ? 'text-navy' : 'text-white'
                        }`}
                      >
                        {item.label}
                        <svg
                          className={`h-3.5 w-3.5 transition-transform duration-300 ease-brand ${mounted && openDropdown === 'products' ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Category panel */}
                      <div
                        className={`absolute left-1/2 top-full mt-6 w-[700px] -translate-x-1/2 overflow-hidden rounded-card border border-navy/14 bg-white shadow-2xl transition-all duration-300 ease-brand ${
                          mounted && openDropdown === 'products'
                            ? 'visible translate-y-0 opacity-100'
                            : 'invisible -translate-y-2 opacity-0'
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-3 p-4">
                          {categories.map(cat => (
                            <Link
                              key={cat.id}
                              href={`/san-pham/${cat.slug}`}
                              onClick={() => {
                                setOpenDropdown(null);
                                if (cat.href) window.open(cat.href, '_blank');
                              }}
                              className="group flex items-start gap-4 rounded-card px-4 py-4 transition-colors duration-300 ease-brand hover:bg-navy"
                            >
                              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-card border border-navy/14 bg-surface p-1">
                                <img
                                  src={cat.image || '/images/box-image/MAY.jpg'}
                                  alt={`${cat.name} - ${cat.description || 'Thiết bị công nghiệp'}`}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="font-display mb-1.5 text-lg uppercase leading-tight tracking-wide text-navy transition-colors duration-300 ease-brand group-hover:text-white">
                                  {cat.name}
                                </div>
                                <div className="text-sm text-ink transition-colors duration-300 ease-brand group-hover:text-white/80">
                                  {cat.description || ''}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.target || '_self'}
                    className={`whitespace-nowrap text-base font-medium leading-none transition-colors duration-300 ease-brand hover:text-accent ${
                      isActive(item.href) ? 'text-accent' : solid ? 'text-navy' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Desktop actions */}
          <div className="hidden flex-shrink-0 items-center gap-3 lg:flex">
            {navSettings.showSearch && (
              <div className="search-container relative">
                <label htmlFor="search-desktop" className="sr-only">
                  Tìm kiếm sản phẩm
                </label>
                <input
                  id="search-desktop"
                  type="search"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.trim().length >= 2 && setSearchOpen(true)}
                  autoComplete="off"
                  aria-label="Tìm kiếm sản phẩm"
                  aria-autocomplete="list"
                  aria-controls="search-results"
                  aria-expanded={searchOpen}
                  className={`h-10 rounded-pill border py-2 pl-4 pr-9 text-sm transition-all duration-300 ease-brand focus:outline-none ${
                    solid
                      ? 'border-navy/14 bg-surface text-navy placeholder-muted focus:border-accent'
                      : 'border-white/14 bg-white/10 text-white placeholder-white/60 focus:border-white/60'
                  }`}
                  style={{ width: searchOpen ? (isCompact ? '190px' : '220px') : (isCompact ? '130px' : '160px') }}
                />
                <button
                  onClick={handleSearchToggle}
                  aria-label="Thực hiện tìm kiếm"
                  title="Tìm kiếm"
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ease-brand hover:text-accent ${
                    solid ? 'text-navy/60' : 'text-white/60'
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <div className={`absolute left-4 top-full mt-1 text-[10px] ${solid ? 'text-muted' : 'text-white/60'}`}>
                    Nhập thêm {2 - searchQuery.length} ký tự
                  </div>
                )}

                <SearchResults
                  isOpen={searchOpen}
                  onClose={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  query={searchQuery}
                  onQueryChange={handleSuggestionPick}
                  className="absolute left-0 right-0 top-full z-50 mt-2 w-full min-w-80 lg:left-auto lg:w-[28rem]"
                />
              </div>
            )}

            {navSettings.showWishlist && (
              <Link
                href="/yeu-thich"
                className={`relative flex h-10 w-10 items-center justify-center rounded-pill border transition-colors duration-300 ease-brand ${
                  solid
                    ? 'border-navy/14 bg-surface text-navy hover:border-accent hover:text-accent'
                    : 'border-white/14 bg-white/10 text-white hover:border-white/60'
                }`}
                aria-label={wishlistCount > 0 ? `Sản phẩm yêu thích (${wishlistCount})` : 'Sản phẩm yêu thích'}
                title="Sản phẩm yêu thích"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlistCount > 0 && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-pill bg-accent px-1 text-[10px] font-bold text-white"
                    aria-label={`${wishlistCount} sản phẩm`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {navSettings.showCatalogButton && (
              <Link
                href={navSettings.catalogButtonUrl}
                className={`whitespace-nowrap rounded-pill border px-5 py-[11px] text-sm font-medium leading-none transition-colors duration-300 ease-brand ${
                  solid
                    ? 'border-navy/14 bg-transparent text-navy hover:border-navy hover:bg-navy hover:text-white'
                    : 'border-white/14 bg-transparent text-white hover:bg-white/10'
                }`}
              >
                {navSettings.catalogButtonText}
              </Link>
            )}

            {navSettings.showContactButton && (
              <Link
                href={navSettings.contactButtonUrl}
                className={`group relative inline-flex items-center gap-6 whitespace-nowrap rounded-pill py-[13px] pl-[19px] pr-[13px] text-sm font-semibold leading-none transition-colors duration-300 ease-brand ${
                  solid ? 'bg-navy text-white' : 'bg-white text-navy'
                }`}
              >
                <span className="relative z-10">{navSettings.contactButtonText}</span>
                <span className="relative z-10 flex h-6 w-6 items-center justify-center text-white">
                  <ArrowIcon className="h-4 w-4" />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-[5px] top-1/2 z-0 h-10 w-10 -translate-y-1/2 rounded-pill bg-accent transition-transform duration-300 ease-brand group-hover:scale-105"
                />
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <div className="ml-auto lg:hidden">
            <MobileTouchMenu>
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className={`mobile-menu-button flex h-10 w-10 items-center justify-center rounded-pill border transition-colors duration-300 ease-brand ${
                  solid ? 'border-navy/14 bg-surface text-navy' : 'border-white/14 bg-white/10 text-white'
                }`}
                aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                suppressHydrationWarning
              >
                <span className="relative block h-4 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 block h-[2px] w-5 rounded-pill bg-current transition-all duration-300 ease-brand ${
                      mobileMenuOpen ? 'top-[7px] rotate-45' : 'top-0'
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-pill bg-current transition-opacity duration-300 ease-brand ${
                      mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`absolute left-0 block h-[2px] w-5 rounded-pill bg-current transition-all duration-300 ease-brand ${
                      mobileMenuOpen ? 'top-[7px] -rotate-45' : 'top-[14px]'
                    }`}
                  />
                </span>
              </button>
            </MobileTouchMenu>
          </div>
        </div>
      </header>

      {/* Mobile panel — the template's full-screen close/open sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-panel"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: EASE_BRAND }}
            className="mobile-menu-container fixed inset-0 z-50 flex flex-col bg-navy lg:hidden"
          >
            {/* Panel head mirrors the bar so the logo never jumps */}
            <div className="flex flex-shrink-0 items-center justify-between px-5 py-4">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5">
                <div className="relative h-8 w-8">
                  <Image src={logo} alt="NEW ATLANTIC" fill className="object-contain" />
                </div>
                <span className="font-display text-lg uppercase leading-none tracking-wide text-white">
                  New Atlantic
                </span>
              </Link>
              <button
                onClick={closeMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white"
                aria-label="Đóng menu"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8">
              {navSettings.showSearch && (
                <div className="search-container mb-8">
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
                      aria-autocomplete="list"
                      aria-controls="search-results"
                      aria-expanded={searchOpen}
                      className="h-12 w-full rounded-pill border border-white/14 bg-white/10 py-2 pl-5 pr-11 text-sm text-white placeholder-white/60 transition-colors duration-300 ease-brand focus:border-white/60 focus:outline-none"
                    />
                    <button
                      onClick={handleSearchToggle}
                      aria-label="Thực hiện tìm kiếm"
                      title="Tìm kiếm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors duration-300 ease-brand hover:text-accent"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>

                  {searchOpen && (
                    <div className="mt-3">
                      <SearchResults
                        isOpen={searchOpen}
                        onClose={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        query={searchQuery}
                        onQueryChange={handleSuggestionPick}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Oversized display links, staggered in on the brand curve */}
              <nav aria-label="Điều hướng di động">
                <ul className="divide-y divide-white/14 border-y border-white/14">
                  {mobileItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE_BRAND, delay: 0.06 * index }}
                    >
                      <Link
                        href={item.href}
                        target={item.target || '_self'}
                        onClick={closeMobileMenu}
                        className={`font-display flex items-center justify-between py-4 text-3xl uppercase leading-none tracking-wide transition-colors duration-300 ease-brand ${
                          isActive(item.href) ? 'text-accent' : 'text-white hover:text-accent'
                        }`}
                      >
                        {item.label}
                        <ArrowIcon className="h-5 w-5 text-accent" />
                      </Link>

                      {item.type === 'dropdown' && item.href === '/san-pham' && mobileCategoryItems.length > 0 && (
                        <ul className="pb-5">
                          <li className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                            Danh mục
                          </li>
                          {mobileCategoryItems.map(cat => (
                            <li key={cat.id}>
                              <Link
                                href={`/san-pham/${cat.slug}`}
                                onClick={() => {
                                  closeMobileMenu();
                                  if (cat.href) window.open(cat.href, '_blank');
                                }}
                                className="block py-2 text-base text-white/80 transition-colors duration-300 ease-brand hover:text-accent"
                              >
                                {cat.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.li>
                  ))}

                  {navSettings.showWishlist && (
                    <li>
                      <Link
                        href="/yeu-thich"
                        onClick={closeMobileMenu}
                        className="font-display flex items-center justify-between py-4 text-3xl uppercase leading-none tracking-wide text-white transition-colors duration-300 ease-brand hover:text-accent"
                      >
                        Yêu thích
                        {wishlistCount > 0 ? (
                          <span className="flex h-7 min-w-7 items-center justify-center rounded-pill bg-accent px-2 text-sm font-bold text-white">
                            {wishlistCount}
                          </span>
                        ) : (
                          <ArrowIcon className="h-5 w-5 text-accent" />
                        )}
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                {navSettings.showCatalogButton && (
                  <Link
                    href={navSettings.catalogButtonUrl}
                    onClick={closeMobileMenu}
                    className="rounded-pill border border-white/14 py-4 text-center text-sm font-medium text-white transition-colors duration-300 ease-brand hover:bg-white/10"
                  >
                    {navSettings.catalogButtonText}
                  </Link>
                )}
                {navSettings.showContactButton && (
                  <Link
                    href={navSettings.contactButtonUrl}
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-3 rounded-pill bg-accent py-4 text-center text-sm font-semibold text-white transition-colors duration-300 ease-brand hover:bg-accent-dark"
                  >
                    {navSettings.contactButtonText}
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
