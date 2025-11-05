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
      <p className="text-sm text-gray-600">
        Hiển thị <span className="font-semibold text-gray-900">{startItem}</span> đến{' '}
        <span className="font-semibold text-gray-900">{endItem}</span> của{' '}
        <span className="font-semibold text-gray-900">{totalItems}</span> sản phẩm
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={buildPageUrl(currentPage - 1)}
            scroll={true}
            prefetch={true}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#5f7ab8] transition-all font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Trước
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm"
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
              <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return pageNum === currentPage ? (
            <button
              key={pageNum}
              disabled
              className="inline-flex items-center justify-center w-10 h-10 bg-[#5f7ab8] text-white rounded-lg font-semibold text-sm shadow-sm"
            >
              {pageNum}
            </button>
          ) : (
            <Link
              key={pageNum}
              href={buildPageUrl(pageNum)}
              scroll={true}
              prefetch={true}
              className="inline-flex items-center justify-center w-10 h-10 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#5f7ab8] hover:text-[#5f7ab8] transition-all font-medium text-sm"
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-[#5f7ab8] transition-all font-medium text-sm"
          >
            Tiếp
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <button
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm"
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
