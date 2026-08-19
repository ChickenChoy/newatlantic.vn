'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Helper function to build URL with preserved query params
  const buildPageUrl = (pageNum: number): string => {
    try {
      const params = new URLSearchParams(searchParams?.toString() || '');
      if (pageNum === 1) {
        params.delete('page');
      } else {
        params.set('page', pageNum.toString());
      }
      const queryString = params.toString();
      return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    } catch (error) {
      // Fallback if searchParams is not available
      return pageNum === 1 ? baseUrl : `${baseUrl}?page=${pageNum}`;
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfWindow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfWindow);
    let endPage = Math.min(totalPages, currentPage + halfWindow);

    if (endPage - startPage < maxPagesToShow - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      {/* Page Info */}
      <p className="text-sm text-muted">
        Hiển thị <span className="font-semibold text-navy">{startItem}</span> đến{' '}
        <span className="font-semibold text-navy">{endItem}</span> của{' '}
        <span className="font-semibold text-navy">{totalItems}</span> sản phẩm
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={buildPageUrl(currentPage - 1)}
            scroll={true}
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-pill border border-navy/14 bg-surface px-5 py-3 text-sm font-medium text-navy transition-colors duration-300 ease-brand hover:border-navy hover:bg-navy hover:text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trước
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-pill border border-navy/14 px-5 py-3 text-sm text-navy/30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trước
          </button>
        )}

        {/* Page Numbers */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-muted">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return pageNum === currentPage ? (
            <button
              key={pageNum}
              disabled
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-accent text-sm font-semibold text-white"
            >
              {pageNum}
            </button>
          ) : (
            <Link
              key={pageNum}
              href={buildPageUrl(pageNum)}
              scroll={true}
              prefetch={true}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-navy/14 bg-surface text-sm font-medium text-navy transition-colors duration-300 ease-brand hover:border-navy hover:bg-navy hover:text-white"
            >
              {pageNum}
            </Link>
          );
        })}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={buildPageUrl(currentPage + 1)}
            scroll={true}
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-pill border border-navy/14 bg-surface px-5 py-3 text-sm font-medium text-navy transition-colors duration-300 ease-brand hover:border-navy hover:bg-navy hover:text-white"
          >
            Tiếp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-pill border border-navy/14 px-5 py-3 text-sm text-navy/30"
          >
            Tiếp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
