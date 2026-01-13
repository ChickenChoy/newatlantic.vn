'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products, posts } from '@/lib/data';
import { cleanText } from '@/lib/textUtils';

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
  price?: string;
  highlightedTitle?: string;
}

interface SearchSuggestion {
  text: string;
  type: 'brand' | 'category' | 'keyword';
}

export default function SearchResults({ isOpen, onClose, query }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Highlight matching text
  const highlightText = (text: string, query: string): string => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-gray-900 font-medium">$1</mark>');
  };

  // Generate search suggestions
  const generateSuggestions = (searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    const brands = ['WILL-BURT', 'HIAB', 'LOVOL', 'SKYMARK'];
    const categories = [
      'Cột Tự Nâng',
      'Thiết Bị Nâng Hạ',
      'Thiết Bị Công Trình',
      'Máy Móc'
    ];
    const keywords = [
      'cột nâng',
      'cẩu tự hành',
      'xe nâng',
      'máy đào',
      'máy ủi',
      'máy xúc'
    ];

    // Brand suggestions
    brands.forEach(brand => {
      if (brand.toLowerCase().includes(query)) {
        suggestions.push({ text: brand, type: 'brand' });
      }
    });

    // Category suggestions
    categories.forEach(category => {
      if (category.toLowerCase().includes(query)) {
        suggestions.push({ text: category, type: 'category' });
      }
    });

    // Keyword suggestions
    keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query)) {
        suggestions.push({ text: keyword, type: 'keyword' });
      }
    });

    return suggestions.slice(0, 5);
  };

  // Search function
  const searchItems = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search products
    products.forEach(product => {
      // Search on raw description (including HTML/shortcodes) but display cleaned version
      const rawDescription = product.description || '';
      const cleanedDescription = rawDescription ? cleanText(rawDescription) : '';
      
      const matches = 
        product.name.toLowerCase().includes(query) ||
        (rawDescription && rawDescription.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query) ||
        Object.values(product.specifications || {}).some(spec => 
          spec.toString().toLowerCase().includes(query)
        );

      if (matches) {
        searchResults.push({
          id: product.id,
          title: product.name,
          description: cleanedDescription,
          image: product.image,
          url: `/san-pham/${product.categorySlug}/${product.slug}`,
          type: 'product',
          category: product.category,
          price: product.price,
          highlightedTitle: highlightText(product.name, query)
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
          type: 'post',
          highlightedTitle: highlightText(post.title, query)
        });
      }
    });

    // Search categories
    const categories = [
      { name: 'Cột Tự Nâng WILL-BURT', slug: 'cot-tu-nang-will-burt' },
      { name: 'Thiết Bị HIAB', slug: 'thiet-bi-nang-ha-hiab' },
      { name: 'Thiết Bị LOVOL', slug: 'thiet-bi-cong-trinh-lovol' },
      { name: 'THIẾT BỊ HÀNG KHÔNG SKYMARK', slug: 'thiet-bi-cong-trinh-SKYMARK' }
    ];

    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        searchResults.push({
          id: category.slug,
          title: category.name,
          description: `Danh mục sản phẩm ${category.name}`,
          url: `/san-pham/${category.slug}`,
          type: 'category',
          highlightedTitle: highlightText(category.name, query)
        });
      }
    });

    // Sort by relevance (exact matches first)
    searchResults.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query;
      const bExact = b.title.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aStarts = a.title.toLowerCase().startsWith(query);
      const bStarts = b.title.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      
      return 0;
    });

    return searchResults.slice(0, 8); // Limit to 8 results
  };

  // Update results when query changes
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      setShowSuggestions(query.length < 3); // Show suggestions for short queries
      
      const timer = setTimeout(() => {
        const searchResults = searchItems(query);
        const searchSuggestions = generateSuggestions(query);
        setResults(searchResults);
        setSuggestions(searchSuggestions);
        setSelectedIndex(0);
        setIsLoading(false);
      }, 300); // Debounce search with 300ms

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setSuggestions([]);
      setSelectedIndex(0);
      setShowSuggestions(true);
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
    <div className="absolute top-full right-0 lg:right-0 lg:left-auto left-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-[32rem] overflow-hidden z-50 min-w-80 lg:min-w-[28rem] w-full lg:w-auto animate-slideDown">
      {/* Search Header */}
      <div className="px-5 py-3.5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            {isLoading ? 'Đang tìm kiếm...' : `${results.length} kết quả tìm kiếm`}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full p-1 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && results.length === 0 && !isLoading && (
        <div className="p-5 border-b border-gray-200 bg-blue-50/30">
          <p className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">💡 Gợi Ý Tìm Kiếm</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (input) {
                    input.value = suggestion.text;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-md transform hover:scale-105 ${
                  suggestion.type === 'brand'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                    : suggestion.type === 'category'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                }`}
              >
                {suggestion.type === 'brand' && '🏢 '}
                {suggestion.type === 'category' && '📁 '}
                {suggestion.type === 'keyword' && '🔍 '}
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div ref={resultsRef} className="max-h-96 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-3 border-[#5f7ab8] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-sm font-medium">Đang tìm kiếm...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <Link
              key={result.id}
              href={result.url}
              onClick={onClose}
              className={`block p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200 border-b border-gray-100 last:border-0 group ${
                index === selectedIndex ? 'bg-gradient-to-r from-[#5f7ab8]/10 to-blue-50 border-l-4 border-l-[#5f7ab8] shadow-sm' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-1 transition-all group-hover:scale-110 ${
                  result.type === 'product' 
                    ? 'bg-blue-100 text-blue-600' 
                    : result.type === 'post'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {result.type === 'product' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  ) : result.type === 'post' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 
                      className="font-bold text-gray-900 text-base group-hover:text-[#5f7ab8] transition-colors"
                      dangerouslySetInnerHTML={{ __html: result.highlightedTitle || result.title }}
                    />
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm ${
                      result.type === 'product' 
                        ? 'bg-blue-500 text-white' 
                        : result.type === 'post'
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-500 text-white'
                    }`}>
                      {result.type === 'product' ? 'Sản phẩm' : 
                       result.type === 'post' ? 'Tin tức' : 'Danh mục'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {result.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {result.category && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                        📁 {result.category}
                      </span>
                    )}
                    {result.price && (
                      <span className="text-xs font-bold text-[#5f7ab8] bg-blue-50 px-2.5 py-1 rounded-lg">
                        💰 {result.price}
                      </span>
                    )}
                  </div>
                </div>

                {/* Image */}
                {result.image && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : query.trim() ? (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-base font-semibold mb-1">Không tìm thấy kết quả nào</p>
            <p className="text-sm text-gray-400">Thử từ khóa khác hoặc chọn gợi ý bên trên</p>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-base font-bold mb-1">Bắt đầu tìm kiếm</p>
            <p className="text-sm text-gray-400">Nhập tên sản phẩm, thương hiệu hoặc danh mục</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-gray-300">↑↓</kbd>
              <span>Điều hướng</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-gray-300">Enter</kbd>
              <span>Chọn</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded shadow-sm border border-gray-300">Esc</kbd>
              <span>Đóng</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
