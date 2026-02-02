import { Metadata } from 'next';

// Website base configuration
export const siteConfig = {
  name: 'NEW ATLANTIC - Tân Đại Tây Dương',
  description: 'Nhà phân phối chính hãng WILL-BURT, HIAB, SKYMARK tại Việt Nam. Cung cấp cột tự nâng, thiết bị nâng hạ, máy móc công trình chất lượng cao.',
  url: 'https://newatlantic.vn',
  ogImage: 'https://newatlantic.vn/images/logo/android-chrome-512x512.png',
  locale: 'vi_VN',
  alternateLocale: 'en_US',
  companyName: 'Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương',
  phone: '+842838733686',
  email: 'info@newatlantic.vn',
  address: 'A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh',
  foundedYear: '2003',
};

// SEO Data Types (for reference, actual data fetching should use API)
interface SEOPage {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  noIndex: boolean;
}

interface SEOData {
  global: {
    siteName: string;
    siteDescription: string;
    siteKeywords: string;
    defaultOgImage: string;
    googleVerification: string;
    twitterHandle: string;
  };
  pages: Record<string, SEOPage>;
  openGraph: {
    siteName: string;
    locale: string;
  };
}

// Note: getSEOData and getPageSEO moved to lib/seo-server.ts for server-only usage
// Import from '@/lib/seo-server' if you need to read from file system

// Export types for external use
export type { SEOData, SEOPage };

// Generate metadata for pages
export function generateMetadata({
  title,
  description,
  image,
  path = '',
  noIndex = false,
  keywords,
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: fullTitle,
    description,
    keywords: keywords ? keywords.join(', ') : undefined,
    authors: [{ name: siteConfig.companyName }],
    creator: siteConfig.companyName,
    publisher: siteConfig.companyName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@newatlantic',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-site-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
}

// Generate dynamic metadata from CMS (uses fetch API for compatibility)
export async function generateDynamicMetadata(
  pageKey: string,
  fallback: { title: string; description: string; path?: string }
): Promise<Metadata> {
  let pageSEO: SEOPage | null = null;
  let defaultOgImage: string | undefined;

  try {
    // Fetch SEO data via API (works in both server and client contexts)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/seo`, {
      next: { revalidate: 60 } // Cache for 1 minute
    });
    if (response.ok) {
      const seoData = await response.json();
      pageSEO = seoData?.pages?.[pageKey] || null;
      defaultOgImage = seoData?.global?.defaultOgImage;
    }
  } catch {
    // Fail silently, use fallback
  }

  const title = pageSEO?.title || fallback.title;
  const description = pageSEO?.description || fallback.description;
  const keywords = pageSEO?.keywords?.split(',').map((k: string) => k.trim()) || [];
  const image = pageSEO?.ogImage || defaultOgImage;
  const noIndex = pageSEO?.noIndex || false;

  return generateMetadata({
    title,
    description,
    image: image ? `${siteConfig.url}${image}` : undefined,
    path: fallback.path,
    noIndex,
    keywords,
  });
}

// JSON-LD Structured Data Generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Corporation',
    name: siteConfig.companyName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: siteConfig.ogImage,
    image: siteConfig.ogImage,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    foundingDate: siteConfig.foundedYear,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'A60 Phú Thuận, Phường Phú Thuận',
      addressLocality: 'Quận 7',
      addressRegion: 'TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
    sameAs: [
      'https://www.facebook.com/newatlantic',
      'https://www.linkedin.com/company/newatlantic',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: ['vi', 'en'],
      },
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.companyName,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.ogImage,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/san-pham?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price?: string;
  brand: string;
  category: string;
  sku?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${siteConfig.url}${product.image}`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
  };

  if (product.sku) {
    schema.sku = product.sku;
  }

  if (product.price && product.price !== 'Liên hệ') {
    schema.offers = {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/san-pham/${product.category}/${product.name}`,
      seller: {
        '@type': 'Organization',
        name: siteConfig.companyName,
      },
    };
  } else {
    schema.offers = {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: `${siteConfig.url}/san-pham/${product.category}/${product.name}`,
      seller: {
        '@type': 'Organization',
        name: siteConfig.companyName,
      },
    };
  }

  return schema;
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: `${siteConfig.url}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || siteConfig.companyName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.companyName,
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.ogImage,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${article.url}`,
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: siteConfig.companyName,
    image: siteConfig.ogImage,
    '@id': siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'A60 Phú Thuận, Phường Phú Thuận',
      addressLocality: 'Quận 7',
      addressRegion: 'TP. Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 10.731304,
      longitude: 106.732851,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '17:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '08:00',
        closes: '12:00',
      },
    ],
    priceRange: '$$',
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
