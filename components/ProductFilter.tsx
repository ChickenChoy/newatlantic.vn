'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/data';

interface ProductFilterProps {
  totalProducts: number;
  currentCategory?: string;
  onFilterChange?: () => void;
}

export default function ProductFilter({ 
  totalProducts, 
  currentCategory,
  onFilterChange 
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
      <div className="lg:hidden mb-3">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm"
        >
          <span className="flex items-center gap-2 font-medium text-gray-700">
            Bộ lọc & Sắp xếp
            {hasActiveFilters && (
              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {[searchQuery && '1', sortOption !== 'newest' && '1'].filter(Boolean).length}
              </span>
            )}
          </span>
          <span className={`text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        ref={filterRef}
        className={`
          ${isFilterOpen ? 'block' : 'hidden'} 
          lg:block
          bg-white rounded-lg shadow border border-gray-200 p-6 mb-4
          transition-all duration-300
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Bộ lọc
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-8 flex flex-wrap gap-1.5">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                "{searchQuery}"
                <button
                  onClick={() => handleSearch('')}
                  className="hover:text-blue-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {sortOption && sortOption !== 'newest' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {sortOptions.find(opt => opt.value === sortOption)?.label}
                <button
                  onClick={() => handleSortChange('newest')}
                  className="hover:text-blue-900 transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        {/* Search Input */}
        <div className="mb-8">
          <label className="block text-xs font-medium text-gray-700 mb-3">
            Tìm kiếm
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="w-full px-3 py-2.5 pr-8 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Sort Options */}
        <div className="mb-8">
          <label className="block text-xs font-medium text-gray-700 mb-3">
            Sắp xếp
          </label>
          <div className="space-y-3">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5 text-sm rounded border transition-all
                  ${sortOption === option.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                <span>{option.label}</span>
                {sortOption === option.value && (
                  <span className="text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-3">
            Danh mục
          </label>
          <div className="space-y-3">
            <Link
              href="/san-pham"
              className={`
                flex items-center justify-between px-4 py-2.5 text-sm rounded border transition-all
                ${pathname === '/san-pham'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }
              `}
            >
              <span>Tất cả</span>
              {pathname === '/san-pham' && (
                <span className="text-blue-600">✓</span>
              )}
            </Link>
            {categories.map((category) => {
              const isActive = currentCategory === category.slug || pathname === `/san-pham/${category.slug}`;
              return (
                <Link
                  key={category.id}
                  href={`/san-pham/${category.slug}`}
                  className={`
                    flex items-center justify-between px-4 py-2.5 text-sm rounded border transition-all
                    ${isActive
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <span>{category.name}</span>
                  {isActive && (
                    <span className="text-blue-600">✓</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
}

