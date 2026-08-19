'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cleanText } from '@/lib/textUtils';
import type { Product, Post, Category } from '@/types';

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  /** Lets a suggestion chip write back into the input that owns the query. */
  onQueryChange?: (value: string) => void;
  /** Positioning is left to the call site so the panel works docked or inline. */
  className?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  image?: string;
  url: string;
  href?: string;
  type: 'product' | 'post' | 'category';
  category?: string;
  price?: string;
  highlightedTitle?: string;
}

interface SearchSuggestion {
  text: string;
  type: 'brand' | 'category' | 'keyword';
}

const TYPE_LABEL: Record<SearchResult['type'], string> = {
  product: 'Sản phẩm',
  post: 'Tin tức',
  category: 'Danh mục',
};

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => HTML_ENTITIES[c]);
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Wraps query hits in <mark> without trusting either side: the title may come
 * from the CMS and the query is raw user input, so both are escaped and the
 * pattern is quoted before it reaches RegExp.
 */
const highlightText = (text: string, query: string): string => {
  const term = query.trim();
  if (!term) return escapeHtml(text);

  const pattern = new RegExp(`(${escapeRegExp(term)})`, 'gi');
  return text
    .split(pattern)
    .map((part, index) =>
      index % 2 === 1
        ? `<mark class="bg-accent/20 text-navy">${escapeHtml(part)}</mark>`
        : escapeHtml(part)
    )
    .join('');
};

function ResultIcon({ type }: { type: SearchResult['type'] }) {
  if (type === 'product') {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    );
  }
  if (type === 'post') {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    );
  }
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  );
}

export default function SearchResults({
  isOpen,
  onClose,
  query,
  onQueryChange,
  className = '',
}: SearchResultsProps) {
  const router = useRouter();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const resultsRef = useRef<HTMLDivElement>(null);

  // State for data from API
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, postsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/posts'),
          fetch('/api/categories')
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPosts(postsData);
        }
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching search data:', error);
      }
    };
    fetchData();
  }, []);

  // Generate search suggestions
  const generateSuggestions = useCallback((searchQuery: string): SearchSuggestion[] => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    const brands = ['WILL-BURT', 'HIAB', 'SKYMARK'];
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

    // Category suggestions - use dynamic categories
    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(query)) {
        suggestions.push({ text: cat.name, type: 'category' });
      }
    });

    // Keyword suggestions
    keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query)) {
        suggestions.push({ text: keyword, type: 'keyword' });
      }
    });

    return suggestions.slice(0, 5);
  }, [categories]);

  // Search function
  const searchItems = useCallback((searchQuery: string): SearchResult[] => {
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

    // Search categories - use dynamic categories from state
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(query)) {
        searchResults.push({
          id: category.slug,
          title: category.name,
          description: category.description || `Danh mục sản phẩm ${category.name}`,
          image: category.image,
          url: `/san-pham/${category.slug}`,
          href: category.href || '',
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
  }, [products, posts, categories]);

  // Update results when the query changes -- and again once the API data lands,
  // otherwise a query typed before the fetch resolves stays empty forever.
  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true);
      setShowSuggestions(query.length < 3); // Show suggestions for short queries

      const timer = setTimeout(() => {
        setResults(searchItems(query));
        setSuggestions(generateSuggestions(query));
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
  }, [query, searchItems, generateSuggestions]);

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
        case 'Enter': {
          const target = results[selectedIndex];
          if (!target) break;
          e.preventDefault();
          onClose();
          if (target.href) window.open(target.href, '_blank');
          router.push(target.url);
          break;
        }
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, router]);

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
    <div
      id="search-results"
      className={`overflow-hidden rounded-card border border-navy/14 bg-white shadow-xl ${className}`}
    >
      {/* Search Header */}
      <div className="flex items-center justify-between gap-3 border-b border-navy/14 bg-surface px-5 py-3">
        <span
          className="font-display text-[11px] uppercase leading-none tracking-display text-navy/60"
          aria-live="polite"
        >
          {isLoading ? 'Đang tìm kiếm' : `${results.length} kết quả`}
        </span>
        <button
          onClick={onClose}
          aria-label="Đóng kết quả tìm kiếm"
          className="text-navy/40 transition-colors duration-300 ease-brand hover:text-accent"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && results.length === 0 && !isLoading && (
        <div className="border-b border-navy/14 px-5 py-4">
          <p className="mb-3 font-display text-[11px] uppercase leading-none tracking-display text-navy/60">
            Gợi ý tìm kiếm
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${index}`}
                onClick={() => onQueryChange?.(suggestion.text)}
                className="rounded-pill border border-navy/14 bg-white px-3.5 py-1.5 text-xs font-medium text-navy transition-colors duration-300 ease-brand hover:border-accent hover:text-accent"
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div
        ref={resultsRef}
        role="listbox"
        aria-label="Kết quả tìm kiếm"
        className="max-h-96 overflow-y-auto scrollbar-thin"
      >
        {isLoading ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-ink">Đang tìm kiếm...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((result, index) => {
            const isSelected = index === selectedIndex;
            return (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.url}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onClose();
                  if (result.href) window.open(result.href, '_blank');
                }}
                className={`group relative block border-b border-navy/10 px-5 py-4 transition-colors duration-300 ease-brand last:border-b-0 hover:bg-surface ${
                  isSelected ? 'bg-surface' : ''
                }`}
              >
                {isSelected && (
                  <span className="absolute inset-y-0 left-0 w-[3px] bg-accent" aria-hidden="true" />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-card border border-navy/14 bg-white text-navy/60 transition-colors duration-300 ease-brand group-hover:border-accent group-hover:text-accent">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <ResultIcon type={result.type} />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h3
                        className="font-display text-[15px] uppercase leading-tight tracking-display text-navy transition-colors duration-300 ease-brand group-hover:text-accent"
                        dangerouslySetInnerHTML={{ __html: result.highlightedTitle || escapeHtml(result.title) }}
                      />
                      <span className="rounded-pill border border-navy/14 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy/60">
                        {TYPE_LABEL[result.type]}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-sm leading-[1.6] text-ink">
                      {result.description}
                    </p>

                    {(result.category || result.price) && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        {result.category && (
                          <span className="text-[11px] uppercase tracking-wide text-muted">
                            {result.category}
                          </span>
                        )}
                        {result.price && (
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                            {result.price}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Image */}
                  {result.image && (
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-card border border-navy/14 bg-surface">
                      <Image
                        src={result.image}
                        alt={result.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="px-5 py-14 text-center">
            <svg
              className="mx-auto mb-5 h-14 w-14 text-navy/14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="font-display text-d6 uppercase leading-display tracking-display text-navy">
              {query.trim() ? 'Không tìm thấy kết quả' : 'Bắt đầu tìm kiếm'}
            </p>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-[1.6] text-ink">
              {query.trim()
                ? 'Thử từ khóa khác hoặc chọn một gợi ý bên trên.'
                : 'Nhập tên sản phẩm, thương hiệu hoặc danh mục.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {results.length > 0 && (
        <div className="hidden border-t border-navy/14 bg-surface px-5 py-3 lg:block">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-navy/60">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-navy/14 bg-white px-1.5 py-0.5 font-sans">↑↓</kbd>
              Điều hướng
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-navy/14 bg-white px-1.5 py-0.5 font-sans">Enter</kbd>
              Chọn
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-navy/14 bg-white px-1.5 py-0.5 font-sans">Esc</kbd>
              Đóng
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
