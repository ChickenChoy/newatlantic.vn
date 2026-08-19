import React from 'react';
import { Metadata } from 'next';
import DownloadCatalogClient from './DownloadCatalogClient';
import HolidayBanner from '@/components/HolidayBanner';
import { PageHero, Section, CTABand, ArrowButton } from '@/components/sections';

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHero
        eyebrow="Tài liệu kỹ thuật"
        title="Catalog sản phẩm"
        image="/images/place-holder/telescopic-mast-tower.jpg"
        intro="Tải về tài liệu kỹ thuật chi tiết, thông số và hướng dẫn sử dụng cho các dòng sản phẩm chính hãng Will-Burt, Hiab và SKYMARK."
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Catalog sản phẩm' }]}
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      <Section>
        <DownloadCatalogClient />
      </Section>

      <CTABand
        eyebrow="Chưa tìm được tài liệu?"
        title="Yêu cầu catalog theo cấu hình"
        intro="Gửi model hoặc mô tả nhu cầu — kỹ sư New Atlantic gửi lại tài liệu kỹ thuật và bản chào giá phù hợp trong 24 giờ làm việc."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ kỹ sư
            </ArrowButton>
            <ArrowButton href="/san-pham" variant="outline-light">
              Xem sản phẩm
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
