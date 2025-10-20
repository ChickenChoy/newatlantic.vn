import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalog Sản Phẩm | NewAtlantic - Thiết Bị Công Nghiệp Chính Hãng',
  description: 'Tải về catalog chi tiết các sản phẩm Will-Burt, Hiab, Lovol, Liugong. Cột tự nâng, thiết bị nâng hạ, máy móc công trình chính hãng tại Việt Nam.',
  keywords: [
    'catalog sản phẩm',
    'Will-Burt catalog',
    'Hiab catalog', 
    'Lovol catalog',
    'Liugong catalog',
    'cột tự nâng',
    'thiết bị nâng hạ',
    'máy móc công trình',
    'NewAtlantic',
    'Tân Đại Tây Dương'
  ],
  openGraph: {
    title: 'Catalog Sản Phẩm | NewAtlantic',
    description: 'Tải về catalog chi tiết các sản phẩm thiết bị công nghiệp chính hãng Will-Burt, Hiab, Lovol, Liugong',
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
    "description": "Tải về catalog chi tiết các sản phẩm thiết bị công nghiệp chính hãng Will-Burt, Hiab, Lovol, Liugong",
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
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Main Content */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slide-in-left">
              CHỌN CATALOG BẠN CẦN
            </h1>
            <p className="text-lg text-gray-600 animate-slide-in-right">
              Nhấn vào đường link để xem trước
            </p>
          </div>

        {/* Will-Burt Catalog Section */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg mr-6 transform hover:scale-105 transition-transform duration-200">
                    <Image
                      src="/images/partner/WillBurt.png"
                      alt="Will-Burt Logo - Cột tự nâng chuyên nghiệp"
                      width={120}
                      height={60}
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100px, 120px"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">CATALOG WILL-BURT</h2>
                    <p className="text-blue-100 text-sm">Cột tự nâng chuyên nghiệp</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Military elevation solution and tactical trailers
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Telecommunication elevation solutions
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1AQdNA8nPMgUg3_t5QLA1pdWoRDebq7Ho/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Military elevation solut. & tactical trailers 2
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hiab Catalog Section */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg mr-6 transform hover:scale-105 transition-transform duration-200">
                    <Image
                      src="/images/partner/hiab.png"
                      alt="Hiab Logo - Thiết bị nâng hạ chuyên nghiệp"
                      width={120}
                      height={60}
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100px, 120px"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">CATALOG HIAB</h2>
                    <p className="text-blue-100 text-sm">Thiết bị nâng hạ chuyên nghiệp</p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    All-electric Moffet E-Series nx
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/14Sa2lMixNqNVUUfrxO_3IDcQ9BqG9G4_/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Deliver More HIAB MOFFET
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1meoPLNJcUQEtn4TKctweJLNR4Plzdt96/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    The New MOFFET 4 <br /> NX
                  </h3>
                    <a 
                      href="https://drive.google.com/file/d/1IYD6hloU8_dalTgkSZXHuCNGjqJMrBXN/view" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>

                <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-[#5f7ab8]/30 transition-all duration-300 bg-gray-50/50 flex flex-col items-center text-center hover:bg-white hover:scale-105 transform">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-[#5f7ab8] transition-colors">
                    Xe nâng gắn xe tải MOFFET
                  </h3>
                    <a 
                      href="https://publuu.com/flip-book/180051/1141767" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 font-medium"
                    >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    TẢI VỀ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
