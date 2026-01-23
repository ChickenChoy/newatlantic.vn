 // Types cho sản phẩm
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // Category slug
  categorySlug?: string; // Alias for category (same value)
  categoryName: string;
  description?: string;
  fullDescription?: string; // HTML content for detail page
  shortDescription?: string; // Plain text
  image: string;
  images?: string[];
  price?: string;
  specifications?: Record<string, string>;
  featured?: boolean;
  createdAt?: string;
}

// Types cho danh mục sản phẩm
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Types cho bài viết/tin tức
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image: string;
  date: string;
  author?: string;
  category?: string;
}

// Types cho dịch vụ
export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string;
}

// Types cho đối tác
export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

// ==================== CMS Types ====================

// Site Settings - Cài đặt website
export interface SiteSettings {
  id: string;
  companyName: string;
  companySlogan: string;
  companyDescription: string;
  logo: string;
  phone: string;
  email: string;
  hotline?: string;
  copyright: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'youtube' | 'linkedin' | 'zalo' | 'instagram';
  url: string;
  enabled: boolean;
}

// Office Locations - Địa chỉ văn phòng
export interface OfficeLocation {
  id: string;
  name: string;
  type: 'headquarters' | 'branch';
  region: string;
  address: string;
  phone?: string;
  email?: string;
  googleMapsUrl?: string;
  order: number;
}

// Footer Links - Links trong footer
export interface FooterLink {
  id: string;
  label: string;
  href: string;
  section: 'quick' | 'service' | 'policy';
  isExternal: boolean;
  order: number;
}

// Gallery Images - Thư viện hình ảnh
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category: string;
  tags: string[];
  featured: boolean;
  order: number;
}

// Catalogs - Catalog sản phẩm
export interface Catalog {
  id: string;
  title: string;
  description?: string;
  brand: string;
  downloadUrl: string;
  thumbnail?: string;
  order: number;
  enabled: boolean;
}

// Hero Slides - Slider trang chủ
export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  label?: string;
  description: string;
  image: string;
  video?: string;
  link: string;
  linkText: string;
  order: number;
  enabled: boolean;
}

// Homepage Stats - Số liệu trang chủ
export interface HomepageStat {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  order: number;
}

// Partner Logos - Logo đối tác
export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
  enabled: boolean;
}

// Post Categories - Danh mục tin tức & sự kiện
export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  enabled: boolean;
}

