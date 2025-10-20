'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products, posts } from '@/lib/data';

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  type: 'product' | 'post' | 'category';
  category?: string;
}

export default function SearchResults({ isOpen, onClose, query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search function
  const searchItems = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search products
    products.forEach(product => {
      const matches = 
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query) ||
        Object.values(product.specifications || {}).some(spec => 
          spec.toString().toLowerCase().includes(query)
        );

      if (matches) {
        searchResults.push({
          id: product.id,
          title: product.name,
          description: product.description || '',
          image: product.image,
          url: `/san-pham/${product.categorySlug}/${product.slug}`,
          type: 'product',
          category: product.category
        });
      }
    });

    // Search posts
    posts.forEach(post => {
      const matches = 
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query);

      if (matches) {
        searchResults.push({
          id: post.id,
          title: post.title,
          description: post.excerpt || post.title,
          image: post.image,
          url: `/tin-tuc/${post.slug}`,
          type: 'post'
        });
      }
    });

    // Search categories
    const categories = [
      { name: 'Cột Tự Nâng WILL-BURT', slug: 'cot-tu-nang-will-burt' },
      { name: 'Thiết Bị HIAB', slug: 'thiet-bi-nang-ha-hiab' },
      { name: 'Thiết Bị LOVOL', slug: 'thiet-bi-cong-trinh-lovol' },
      { name: 'Thiết Bị LIUGONG', slug: 'thiet-bi-cong-trinh-liugong' }
    ];

    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        searchResults.push({
          id: category.slug,
          title: category.name,
          description: `Danh mục sản phẩm ${category.name}`,
          url: `/san-pham/${category.slug}`,
          type: 'category'
        });
      }
    });

    return searchResults.slice(0, 8); // Limit to 8 results
  };

  // Update results when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const searchResults = searchItems(query);
        setResults(searchResults);
        setSelectedIndex(0);
        setIsLoading(false);
      }, 150); // Debounce search

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSelectedIndex(0);
    }
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = results[selectedIndex].url;
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedItem = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 lg:right-0 lg:left-auto left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-hidden z-50 min-w-80 lg:min-w-80 w-full lg:w-auto">
      {/* Search Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {isLoading ? 'Đang tìm kiếm...' : `${results.length} kết quả`}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results */}
      <div ref={resultsRef} className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin w-6 h-6 border-2 border-[#5f7ab8] border-t-transparent rounded-full mx-auto mb-2"></div>
            Đang tìm kiếm...
          </div>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <Link
              key={result.id}
              href={result.url}
              onClick={onClose}
              className={`block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${
                index === selectedIndex ? 'bg-[#5f7ab8]/5 border-l-4 border-l-[#5f7ab8]' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                  {result.type === 'product' ? (
                    <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  ) : result.type === 'post' ? (
                    <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#5f7ab8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {result.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      result.type === 'product' 
                        ? 'bg-blue-100 text-blue-700' 
                        : result.type === 'post'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {result.type === 'product' ? 'Sản phẩm' : 
                       result.type === 'post' ? 'Tin tức' : 'Danh mục'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {result.description}
                  </p>
                  {result.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      Danh mục: {result.category}
                    </p>
                  )}
                </div>

                {/* Image */}
                {result.image && (
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : query.trim() ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm">Không tìm thấy kết quả nào</p>
            <p className="text-xs text-gray-400 mt-1">Thử từ khóa khác</p>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">Nhập từ khóa để tìm kiếm</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>↑↓ để điều hướng</span>
            <span>Enter để chọn</span>
            <span>Esc để đóng</span>
          </div>
        </div>
      )}
    </div>
  );
}
