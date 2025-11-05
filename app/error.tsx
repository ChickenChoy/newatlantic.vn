'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    document.title = '500 - Lỗi máy chủ | NEW ATLANTIC';
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 flex items-center justify-center px-4 pt-20 pb-16">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse select-none">
            500
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 border-8 border-red-500/20 rounded-full animate-ping"></div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Đã xảy ra lỗi
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Rất tiếc, đã có lỗi xảy ra với máy chủ. Vui lòng thử lại sau hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-400 font-mono mt-2">
              Mã lỗi: {error.digest}
            </p>
          )}
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg
              className="w-64 h-64 md:w-80 md:h-80 text-red-500/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-500/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Thử lại
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <Link
            href="/"
            className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold border-2 border-red-600 hover:bg-red-600 hover:text-white transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </span>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Cần hỗ trợ? Liên hệ với chúng tôi:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="tel:+842838733686"
              className="px-4 py-2 bg-gray-100 hover:bg-[#5f7ab8] hover:text-white text-gray-700 rounded-lg text-sm font-medium transition-all"
            >
              📞 Hotline
            </a>
            <Link
              href="/lien-he"
              className="px-4 py-2 bg-gray-100 hover:bg-[#5f7ab8] hover:text-white text-gray-700 rounded-lg text-sm font-medium transition-all"
            >
              ✉️ Email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

