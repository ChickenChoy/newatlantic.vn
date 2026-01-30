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
  directionsUrl?: string; // Link chỉ đường tùy chỉnh
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

// Holiday Effects - Hiệu ứng ngày lễ
export interface HolidayEffect {
  id: string;
  name: string;           // Tên ngày lễ (VD: "Tết Nguyên Đán")
  slug: string;           // Slug (VD: "tet-nguyen-dan")
  enabled: boolean;       // Bật/tắt hiệu ứng
  startDate: string;      // Ngày bắt đầu (MM-DD hoặc YYYY-MM-DD)
  endDate: string;        // Ngày kết thúc
  effectTypes: string[];  // Loại hiệu ứng: 'banner', 'flowers', 'snow', 'fireworks', etc.
  description?: string;   // Mô tả
  primaryColor?: string;  // Màu chủ đạo
  secondaryColor?: string;// Màu phụ
}

// Page Visibility - Quản lý ẩn/hiện trang
export interface PageVisibility {
  id: string;
  path: string;           // Đường dẫn trang (VD: "/san-pham")
  name: string;           // Tên hiển thị (VD: "Sản phẩm")
  description?: string;   // Mô tả trang
  visible: boolean;       // true = hiển thị, false = ẩn
  order: number;          // Thứ tự sắp xếp
}

// Testimonials - Đánh giá khách hàng
export interface Testimonial {
  id: string;
  name: string;           // Tên khách hàng
  position: string;       // Chức vụ
  rating: number;         // Đánh giá (1-5 sao)
  text: string;           // Nội dung đánh giá
  image?: string;         // Ảnh đại diện
  enabled: boolean;       // Bật/tắt hiển thị
  order: number;          // Thứ tự
}

// FAQs - Câu hỏi thường gặp
export interface FAQ {
  id: string;
  question: string;       // Câu hỏi
  answer: string;         // Câu trả lời
  enabled: boolean;       // Bật/tắt hiển thị
  order: number;          // Thứ tự
}

// Certifications - Chứng nhận và giải thưởng
export interface Certification {
  id: string;
  title: string;          // Tiêu đề
  description: string;    // Mô tả
  icon: string;           // Icon type: 'check-circle', 'shield', 'document', 'star'
  enabled: boolean;       // Bật/tắt hiển thị
  order: number;          // Thứ tự
}
