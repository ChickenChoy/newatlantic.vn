import React from 'react';
import { Metadata } from 'next';
import DownloadCatalogClient from './DownloadCatalogClient';
import HolidayBanner from '@/components/HolidayBanner';

export const metadata: Metadata = {
  title: 'Catalog Sản Phẩm | NewAtlantic - Thiết Bị Công Nghiệp Chính Hãng',
  description: 'Tải về catalog chi tiết các sản phẩm Will-Burt, Hiab, SKYMARK. Cột tự nâng, thiết bị nâng hạ, máy móc công trình chính hãng tại Việt Nam.',
  keywords: [
    'catalog sản phẩm',
    'Will-Burt catalog',
    'Hiab catalog',
    'SKYMARK catalog',
    'cột tự nâng',
    'thiết bị nâng hạ',
    'máy móc công trình',
    'NewAtlantic',
    'Tân Đại Tây Dương'
  ],
  openGraph: {
    title: 'Catalog Sản Phẩm | NewAtlantic',
    description: 'Tải về catalog chi tiết các sản phẩm thiết bị công nghiệp chính hãng Will-Burt, Hiab, SKYMARK',
    type: 'website',
    images: [
      {
        url: '/images/logo/logo-color.png',
        width: 1200,
        height: 630,
        alt: 'NewAtlantic Catalog Sản Phẩm'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catalog Sản Phẩm | NEW ATLANTIC',
    description: 'Tải về catalog chi tiết các sản phẩm thiết bị công nghiệp chính hãng',
    images: ['/images/logo/logo-color.png']
  },
  alternates: {
    canonical: 'https://newatlantic.vn/page-download-catalog'
  }
};

export default function DownloadCatalogPage() {
  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Catalog Sản Phẩm | NewAtlantic",
    "description": "Tải về catalog chi tiết các sản phẩm thiết bị công nghiệp chính hãng Will-Burt, Hiab, SKYMARK",
    "url": "https://newatlantic.vn/page-download-catalog",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Danh sách Catalog Sản Phẩm",
      "itemListElement": [
        {
          "@type": "Product",
          "name": "Will-Burt Military Elevation Solutions",
          "description": "Cột tự nâng quân sự và xe kéo chiến thuật",
          "brand": "Will-Burt",
          "category": "Thiết bị nâng hạ"
        },
        {
          "@type": "Product",
          "name": "Hiab Moffet E-Series",
          "description": "Xe nâng điện và thiết bị nâng hạ chuyên nghiệp",
          "brand": "Hiab",
          "category": "Thiết bị nâng hạ"
        }
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "NewAtlantic",
      "url": "https://newatlantic.vn",
      "logo": "https://newatlantic.vn/images/logo/logo-color.png"
    }
  };

  return (
    <div className="min-h-screen bg-[#050c3a] relative overflow-hidden">
      {/* Background decorative elements - Subtle green accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Content */}
      <main className="pt-24 sm:pt-28 md:pt-32 relative z-10">


        {/* Header Section */}
        <div className="relative z-10 border-b border-white/10">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Tài liệu kỹ thuật
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Catalog <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Sản Phẩm</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                Tải về tài liệu kỹ thuật chi tiết, thông số và hướng dẫn sử dụng cho các dòng sản phẩm chính hãng.
              </p>

              {/* Holiday Banner - Centered Minimal */}
              <div className="flex justify-center">
                <HolidayBanner variant="minimal" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <DownloadCatalogClient />
        </div>
      </main>
    </div>
  );
}
