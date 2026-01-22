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
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'name-asc', label: 'Tên A-Z' },
    { value: 'name-desc', label: 'Tên Z-A' },
  ];

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm hover:bg-white/20 transition-all active:scale-[0.99]"
        >
          <span className="flex items-center gap-2 font-semibold text-white">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Bộ lọc & Sắp xếp
            {hasActiveFilters && (
              <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                {[searchQuery && '1', sortOption !== 'newest' && '1'].filter(Boolean).length}
              </span>
            )}
          </span>
          <span className={`text-gray-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        ref={filterRef}
        className={`
          ${isFilterOpen ? 'block' : 'hidden'}
          lg:block
          bg-white/10 backdrop-blur-sm rounded-2xl p-6
          lg:sticky lg:top-24
          border border-white/20 shadow-lg
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Bộ lọc
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-full hover:bg-red-500/30"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa lọc
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white focus:bg-white/20 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all outline-none placeholder:text-gray-400"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">
            Danh mục sản phẩm
          </h4>
          <div className="space-y-1">
            <Link
              href="/san-pham"
              className={`
                group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                ${pathname === '/san-pham'
                  ? 'bg-blue-600/30 text-blue-300 font-semibold'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${pathname === '/san-pham' ? 'bg-blue-400' : 'bg-gray-500 group-hover:bg-blue-400'}`}></span>
                <span>Tất cả</span>
              </div>
              {pathname === '/san-pham' && (
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className={`
                    group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                    ${isActive
                      ? 'bg-blue-600/30 text-blue-300 font-semibold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-blue-400' : 'bg-gray-500 group-hover:bg-blue-400'}`}></span>
                    <span>{category.name}</span>
                  </div>
                  {isActive && (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">
            Sắp xếp theo
          </h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 text-left
                  ${sortOption === option.value
                    ? 'bg-blue-600/30 text-blue-300 font-medium ring-1 ring-blue-500/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <div className={`
                  w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                  ${sortOption === option.value
                    ? 'border-blue-400 bg-blue-600'
                    : 'border-gray-500 group-hover:border-blue-400'
                  }
                `}>
                  {sortOption === option.value && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

