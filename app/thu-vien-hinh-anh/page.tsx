'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { generateBreadcrumbSchema } from '@/lib/seo';

export default function GalleryPage() {
  // Update page title
  useEffect(() => {
    document.title = 'Thư viện hình ảnh | NEW ATLANTIC - Tân Đại Tây Dương';
  }, []);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Trang chủ', url: '/' },
    { name: 'Thư viện hình ảnh', url: '/thu-vien-hinh-anh' },
  ]);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 min-h-screen pt-16">
        {/* Breadcrumb */}
        <div className="bg-gray-50 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#5f7ab8] transition">
                Trang chủ
              </Link>
              <span>/</span>
              <span className="text-[#5f7ab8] font-medium">Thư viện hình ảnh</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Thư Viện Hình Ảnh
            </h1>
            <p className="text-sm text-gray-600">
              Khám phá bộ sưu tập hình ảnh thiết bị và dự án của chúng tôi
            </p>
          </div>

          {/* Main Content - Để trống theo yêu cầu */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 min-h-[400px]">
            {/* Nội dung thư viện hình ảnh sẽ được thêm vào đây */}
          </div>
        </div>
      </div>
    </>
  );
}


