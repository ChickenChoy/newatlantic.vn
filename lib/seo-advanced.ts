import { siteConfig } from './seo';

// ============================================
// ADVANCED SEO UTILITIES
// ============================================

/**
 * Generate comprehensive FAQ Schema for better rich snippets
 */
export function generateAdvancedFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'NEW ATLANTIC cung cấp những sản phẩm gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NEW ATLANTIC là nhà phân phối chính hãng các thương hiệu WILL-BURT, HIAB, SKYMARK tại Việt Nam. Chúng tôi cung cấp cột tự nâng, cẩu tự hành, xe nâng Moffett, máy móc công trình và thiết bị công nghiệp chất lượng cao.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thời gian bảo hành sản phẩm là bao lâu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thời gian bảo hành phụ thuộc vào từng loại sản phẩm. Thông thường, các sản phẩm được bảo hành từ 12-24 tháng. Chúng tôi cũng cung cấp dịch vụ bảo trì và sửa chữa 24/7.',
        },
      },
      {
        '@type': 'Question',
        name: 'NEW ATLANTIC có hỗ trợ vận chuyển toàn quốc không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Có, chúng tôi hỗ trợ vận chuyển toàn quốc trong vòng 24-48h. Đội ngũ kỹ thuật của chúng tôi cũng sẵn sàng hỗ trợ lắp đặt và hướng dẫn sử dụng tại địa điểm của khách hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Làm thế nào để liên hệ tư vấn sản phẩm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quý khách có thể liên hệ qua hotline: +842838733686, email: info@newatlantic.vn hoặc trực tiếp tại văn phòng: A60 Phú Thuận, Quận 7, TP. Hồ Chí Minh. Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ 24/7.',
        },
      },
      {
        '@type': 'Question',
        name: 'Sản phẩm có phải hàng chính hãng không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tất cả sản phẩm tại NEW ATLANTIC đều là hàng chính hãng 100% từ nhà sản xuất, có đầy đủ giấy tờ chứng nhận và tem bảo hành. Chúng tôi cam kết chất lượng và nguồn gốc xuất xứ rõ ràng.',
        },
      },
    ],
  };
}

/**
 * Generate Video Schema for product videos
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: `${siteConfig.url}${video.thumbnailUrl}`,
    uploadDate: video.uploadDate,
    duration: video.duration || 'PT1M',
    contentUrl: `${siteConfig.url}${video.contentUrl}`,
    embedUrl: `${siteConfig.url}${video.contentUrl}`,
  };
}

/**
 * Generate Review/Rating Schema
 */
export function generateReviewSchema(reviews: {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}) {
  return {
    '@type': 'AggregateRating',
    ratingValue: reviews.ratingValue,
    reviewCount: reviews.reviewCount,
    bestRating: reviews.bestRating || 5,
  };
}

/**
 * Generate Service Schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    areaServed: {
      '@type': 'Country',
      name: service.areaServed,
    },
  };
}

/**
 * Generate Offer Catalog Schema
 */
export function generateOfferCatalogSchema(products: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Danh mục sản phẩm NEW ATLANTIC',
    itemListElement: products.map((product, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: `${siteConfig.url}${product.image}`,
      },
    })),
  };
}

/**
 * Generate How-To Schema for installation guides
 */
export function generateHowToSchema(guide: {
  name: string;
  description: string;
  totalTime: string;
  steps: { name: string; text: string; image?: string }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.name,
    description: guide.description,
    totalTime: guide.totalTime,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image ? `${siteConfig.url}${step.image}` : undefined,
    })),
  };
}

/**
 * Generate ItemList Schema for product listings
 */
export function generateItemListSchema(items: any[], listName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteConfig.url}/san-pham/${item.categorySlug}/${item.slug}`,
      name: item.name,
    })),
  };
}

/**
 * Generate comprehensive meta tags for better social sharing
 */
export function generateSocialMetaTags(data: {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: string;
}) {
  return {
    // Open Graph
    'og:title': data.title,
    'og:description': data.description,
    'og:image': data.image,
    'og:url': data.url,
    'og:type': data.type || 'website',
    'og:site_name': siteConfig.name,
    'og:locale': 'vi_VN',
    
    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.image,
    'twitter:site': '@newatlantic',
    
    // Additional meta
    'article:publisher': siteConfig.url,
    'article:author': siteConfig.companyName,
  };
}

/**
 * Generate canonical URL with proper handling
 */
export function generateCanonicalUrl(path: string): string {
  // Remove trailing slash and ensure proper format
  const cleanPath = path.replace(/\/$/, '');
  return `${siteConfig.url}${cleanPath}`;
}

/**
 * Generate hreflang tags for multi-language support
 */
export function generateHreflangTags(path: string) {
  return [
    {
      rel: 'alternate',
      hreflang: 'vi',
      href: `${siteConfig.url}${path}`,
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: `${siteConfig.url}/en${path}`,
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${siteConfig.url}${path}`,
    },
  ];
}

/**
 * Generate keywords based on content
 */
export function generateKeywords(base: string[], additional: string[] = []): string[] {
  const commonKeywords = [
    'NEW ATLANTIC',
    'Tân Đại Tây Dương',
    'thiết bị công nghiệp',
    'máy móc công trình',
    'Việt Nam',
    'TP. Hồ Chí Minh',
    'Quận 7',
  ];
  
  return [...new Set([...base, ...additional, ...commonKeywords])];
}

/**
 * SEO-friendly URL slug generator
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate meta description with optimal length
 */
export function generateMetaDescription(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return truncated.substring(0, lastSpace) + '...';
}

