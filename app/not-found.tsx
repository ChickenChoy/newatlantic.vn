'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - Trang không tìm thấy | NEW ATLANTIC';
  }, []);

  return (
    <div className="min-h-screen bg-[#050c3a] flex items-center justify-center px-4 pt-32 md:pt-28 pb-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-pulse select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-48 md:h-48 border-8 border-blue-400/20 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Trang không tìm thấy
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        {/* Animated Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg
              className="w-64 h-64 md:w-80 md:h-80 text-blue-400/20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-400/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Về trang chủ
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white/20 hover:bg-blue-600 hover:border-blue-600 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-400 mb-4">Bạn có thể tìm kiếm:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/san-pham" className="px-4 py-2 bg-white/10 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all">
              Sản phẩm
            </Link>
            <Link href="/tin-tuc" className="px-4 py-2 bg-white/10 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all">
              Tin tức
            </Link>
            <Link href="/lien-he" className="px-4 py-2 bg-white/10 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all">
              Liên hệ
            </Link>
            <Link href="/thu-vien-hinh-anh" className="px-4 py-2 bg-white/10 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-all">
              Thư viện hình ảnh
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
