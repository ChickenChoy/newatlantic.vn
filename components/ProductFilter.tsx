'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Category } from '@/types';

interface ProductFilterProps {
  totalProducts: number;
  currentCategory?: string;
  onFilterChange?: () => void;
  categories?: Category[];
}

export default function ProductFilter({
  totalProducts,
  currentCategory,
  onFilterChange,
  categories = []
}: ProductFilterProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        if (window.innerWidth < 1024) {
          setIsFilterOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update URL with filters
  const updateFilters = (updates: { q?: string; sort?: string; page?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.q !== undefined) {
      if (updates.q) {
        params.set('q', updates.q);
      } else {
        params.delete('q');
      }
    }

    if (updates.sort !== undefined) {
      if (updates.sort && updates.sort !== 'newest') {
        params.set('sort', updates.sort);
      } else {
        params.delete('sort');
      }
    }

    if (updates.page !== undefined) {
      if (updates.page && updates.page !== '1') {
        params.set('page', updates.page);
      } else {
        params.delete('page');
      }
    }

    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });

    if (onFilterChange) {
      onFilterChange();
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    updateFilters({ q: value, page: '1' });
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    updateFilters({ sort: value, page: '1' });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortOption('newest');
    router.push(pathname, { scroll: false });
    if (onFilterChange) {
      onFilterChange();
    }
  };

  const hasActiveFilters = searchQuery || (sortOption && sortOption !== 'newest');
  const activeFilterCount = [searchQuery && '1', sortOption !== 'newest' && '1'].filter(Boolean).length;

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' },
  ];

  /** One row in the category list / sort list. */
  const rowClass = (isActive: boolean) =>
    `group flex w-full items-center justify-between gap-3 rounded-card px-4 py-3 text-left text-sm transition-colors duration-300 ease-brand ${
      isActive ? 'bg-navy font-semibold text-white' : 'text-ink hover:bg-navy/[0.06] hover:text-navy'
    }`;

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="mb-4 lg:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-expanded={isFilterOpen}
          className="flex w-full items-center justify-between rounded-pill border border-navy/14 bg-surface px-6 py-4 transition-colors duration-300 ease-brand hover:border-navy"
        >
          <span className="flex items-center gap-3 text-sm font-semibold text-navy">
            <svg className="h-5 w-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Bộ lọc & sắp xếp
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-pill bg-accent text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </span>
          <svg
            className={`h-5 w-5 text-navy transition-transform duration-300 ease-brand ${isFilterOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        ref={filterRef}
        className={`${isFilterOpen ? 'block' : 'hidden'} rounded-card border border-navy/14 bg-surface p-6 lg:sticky lg:top-28 lg:block`}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-navy/14 pb-6">
          <h3 className="font-display text-d6 uppercase leading-display tracking-display text-navy">
            Bộ lọc
          </h3>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-pill border border-navy/14 bg-background px-3 py-1.5 text-xs font-medium text-navy transition-colors duration-300 ease-brand hover:border-accent hover:text-accent"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa lọc
            </button>
          ) : (
            <span className="text-xs text-muted">{totalProducts} sản phẩm</span>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="group relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              aria-label="Tìm kiếm sản phẩm"
              className="w-full rounded-pill border border-navy/14 bg-background py-3 pl-11 pr-10 text-sm text-navy outline-none transition-colors duration-300 ease-brand placeholder:text-muted focus:border-accent"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-colors duration-300 ease-brand group-focus-within:text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-300 ease-brand hover:text-accent"
                aria-label="Xóa từ khóa"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Danh mục sản phẩm
          </h4>
          <div className="space-y-1">
            <Link href="/san-pham" className={rowClass(pathname === '/san-pham')}>
              <span>Tất cả</span>
              {pathname === '/san-pham' && (
                <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Link>
            {categories.map((category) => {
              const isActive = currentCategory === category.slug || pathname === `/san-pham/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={`/san-pham/${category.slug}`}
                  onClick={() => { if (category.href) window.open(category.href, '_blank'); }}
                  className={rowClass(isActive)}
                >
                  <span>{category.name}</span>
                  {isActive && (
                    <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Sắp xếp theo
          </h4>
          <div className="space-y-1">
            {sortOptions.map((option) => {
              const isActive = sortOption === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  aria-pressed={isActive}
                  className={rowClass(isActive)}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-pill border transition-colors duration-300 ease-brand ${
                        isActive ? 'border-accent bg-accent' : 'border-navy/30'
                      }`}
                    >
                      {isActive && <span className="h-1.5 w-1.5 rounded-pill bg-white" />}
                    </span>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
