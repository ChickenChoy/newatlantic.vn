import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

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
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
      {/* Background decorative elements - Subtle green accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Main Content */}
      <main className="pt-20 md:pt-24 relative z-10">


        {/* Header Section */}
        <div className="relative z-10 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Tài liệu kỹ thuật
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Catalog <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Sản Phẩm</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                Tải về tài liệu kỹ thuật chi tiết, thông số và hướng dẫn sử dụng cho các dòng sản phẩm chính hãng.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

          {/* Will-Burt Catalog Section */}
          <section className="mb-20">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-8 py-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/images/partner/WillBurt.png"
                        alt="Will-Burt Logo"
                        width={140}
                        height={70}
                        className="object-contain h-12 w-auto"
                        priority
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">WILL-BURT</h2>
                      <p className="text-green-100 font-medium text-lg">Giải pháp cột tự nâng hàng đầu thế giới</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      title: "Military elevation solution and tactical trailers",
                      link: "https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view",
                      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    },
                    {
                      title: "Telecommunication elevation solutions",
                      link: "https://drive.google.com/file/d/1AQdNA8nPMgUg3_t5QLA1pdWoRDebq7Ho/view",
                      icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    },
                    {
                      title: "Military elevation solut. & tactical trailers 2",
                      link: "https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view",
                      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        <div className="mt-auto pt-4 w-full">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 font-bold group-hover:shadow-lg"
                          >
                            <span className="mr-2">TẢI VỀ</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Hiab Catalog Section */}
          <section className="mb-16">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/images/partner/hiab.png"
                        alt="Hiab Logo"
                        width={140}
                        height={70}
                        className="object-contain h-12 w-auto"
                        priority
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">HIAB</h2>
                      <p className="text-gray-300 font-medium text-lg">Thiết bị nâng hạ chuyên nghiệp</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    {
                      title: "All-electric Moffet E-Series nx",
                      link: "https://drive.google.com/file/d/14Sa2lMixNqNVUUfrxO_3IDcQ9BqG9G4_/view"
                    },
                    {
                      title: "Deliver More HIAB MOFFET",
                      link: "https://drive.google.com/file/d/1meoPLNJcUQEtn4TKctweJLNR4Plzdt96/view"
                    },
                    {
                      title: "The New MOFFET 4 NX",
                      link: "https://drive.google.com/file/d/1IYD6hloU8_dalTgkSZXHuCNGjqJMrBXN/view"
                    },
                    {
                      title: "Xe nâng gắn xe tải MOFFET",
                      link: "https://publuu.com/flip-book/180051/1141767"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300 shadow-sm">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        <div className="mt-auto pt-4 w-full">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-full px-6 py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-300 font-bold group-hover:shadow-lg"
                          >
                            <span className="mr-2">TẢI VỀ</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
