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
  enabled?: boolean;
  createdAt?: string;
}

// Types cho danh mục sản phẩm
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  href?: string;
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
  footerLogo?: string;
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

// Partner Logos - Logo đối tác (homepage banner)
export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
  url?: string;
  order: number;
  enabled: boolean;
}

// Global Partner Regions - Đối tác đa quốc gia (bản đồ thế giới)
export interface GlobalPartnerRegion {
  id: string;
  name: string;           // English name (e.g., "North America")
  nameVi: string;         // Vietnamese name (e.g., "Bắc Mỹ")
  order: number;          // Display order
  enabled: boolean;       // Show/hide this region
}

// Global Partners - Đối tác trong từng vùng
export interface GlobalPartner {
  id: string;
  regionId: string;       // Reference to GlobalPartnerRegion.id
  name: string;           // Partner name (e.g., "WILL-BURT (USA)")
  country?: string;       // Country name
  logo?: string;          // Optional partner logo URL
  url?: string;           // Optional website URL
  order: number;          // Display order within region
  enabled: boolean;       // Show/hide this partner
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
  name: string;           // Tên ngày lễ (VD: "TẾT Nguyên Đán")
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

// Thư viện Media - Thư viện media tập trung
export interface MediaItem {
  id: string;
  filename: string;           // Tên file (vd: hiab-x-series.webp)
  originalName: string;       // Tên file gốc
  folder: 'products' | 'posts' | 'gallery' | 'partners' | 'slides' | 'seo' | 'general';
  mimeType: string;           // image/webp, image/jpeg, etc.
  size: number;               // Kích thước bytes
  dimensions: {
    width: number;
    height: number;
  };
  variants: {
    thumbnail: string;        // Base64 - 150x150
    medium: string;           // Base64 - 800x auto
    full: string;             // Base64 - Original size (max 1200px)
  };
  alt: string;                // Alt text cho SEO
  caption?: string;           // Caption/mô tả
  tags: string[];             // Tags để tìm kiếm
  usedIn: MediaUsage[];       // Tracking sử dụng
  createdAt: string;
  updatedAt: string;
}

export interface MediaUsage {
  type: 'product' | 'post' | 'gallery' | 'partner' | 'slide' | 'setting';
  id: string;
  field: string;              // Tên field đang sử dụng (vd: 'image', 'thumbnail')
}

export type MediaFolder = MediaItem['folder'];

// Homepage Services - Dịch vụ trang chủ
export interface HomepageService {
  id: string;
  title: string;           // Tiêu đề dịch vụ (VD: "Cẩu tự hành")
  description: string;     // Mô tả dịch vụ
  color: string;           // Màu border (hex color, VD: "#5f7ab8")
  order: number;           // Thứ tự hiển thị
  enabled: boolean;        // Bật/tắt hiển thị
}

// Activity Log - Nhật ký hoạt động (Audit Trail)
export interface ActivityLog {
  id: string;
  timestamp: string;       // ISO timestamp
  action: ActivityAction;  // Loại hành động
  entity: ActivityEntity;  // Loại đối tượng
  entityId?: string;       // ID của đối tượng (nếu có)
  entityName?: string;     // Tên đối tượng (để hiển thị)
  user: string;            // Người thực hiện (mặc định: "Admin")
  details?: string;        // Chi tiết bổ sung
  changes?: ActivityChange[]; // Các thay đổi cụ thể
  ipAddress?: string;      // IP address (nếu có)
}

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'import'
  | 'backup'
  | 'restore'
  | 'upload'
  | 'toggle';

export type ActivityEntity =
  | 'product'
  | 'post'
  | 'category'
  | 'post-category'
  | 'gallery'
  | 'catalog'
  | 'partner'
  | 'global-partner'
  | 'testimonial'
  | 'faq'
  | 'certification'
  | 'holiday-effect'
  | 'page-visibility'
  | 'hero-slide'
  | 'homepage-stat'
  | 'homepage-service'
  | 'footer-link'
  | 'site-settings'
  | 'office-location'
  | 'seo'
  | 'media'
  | 'navbar-settings'
  | 'database'
  | 'auth';

export interface ActivityChange {
  field: string;           // Tên field thay đổi
  oldValue?: string;       // Giá trị cũ
  newValue?: string;       // Giá trị mới
}

// ==================== Multi-user Management ====================

// User Roles - Phân quyền người dùng
export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer';

// Permissions - Các quyền hạn trong hệ thống
export type Permission =
  | 'manage_users'        // Quản lý người dùng
  | 'manage_security'     // Quản lý bảo mật (2FA, settings)
  | 'manage_settings'     // Quản lý cài đặt website
  | 'manage_content'      // Tạo/sửa/xóa nội dung (products, posts, etc.)
  | 'manage_media'        // Upload/xóa media
  | 'manage_seo'          // Quản lý SEO
  | 'manage_appearance'   // Quản lý giao diện (holiday effects, page visibility)
  | 'export_data'         // Export dữ liệu
  | 'import_data'         // Import dữ liệu
  | 'backup_restore'      // Backup/Restore database
  | 'view_analytics'      // Xem analytics
  | 'view_activity_logs'  // Xem nhật ký hoạt động
  | 'view_dashboard';     // Xem dashboard

// Permission Matrix - Ma trận quyền hạn theo role
export const PERMISSION_MATRIX: Record<UserRole, Permission[]> = {
  super_admin: [
    'manage_users',
    'manage_security',
    'manage_settings',
    'manage_content',
    'manage_media',
    'manage_seo',
    'manage_appearance',
    'export_data',
    'import_data',
    'backup_restore',
    'view_analytics',
    'view_activity_logs',
    'view_dashboard',
  ],
  admin: [
    'manage_security',
    'manage_settings',
    'manage_content',
    'manage_media',
    'manage_seo',
    'manage_appearance',
    'export_data',
    'import_data',
    'backup_restore',
    'view_analytics',
    'view_activity_logs',
    'view_dashboard',
  ],
  editor: [
    'manage_content',
    'manage_media',
    'view_analytics',
    'view_dashboard',
  ],
  viewer: [
    'view_analytics',
    'view_dashboard',
  ],
};

// Admin User - Người dùng admin
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  totpEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  invitedBy?: string;        // ID của người mời
  invitedAt?: string;        // Thời gian mời
  supabaseId?: string;       // ID trong Supabase Auth
}

// Internal shape persisted to data/admin-users.json (contains password hash)
export interface StoredAdminUser extends AdminUser {
  passwordHash?: string;
}

// Helper function to check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false;
}

// Role Display Names - Tên hiển thị của role
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Quản trị viên',
  editor: 'Biên tập viên',
  viewer: 'Người xem',
};

// Role Descriptions - Mô tả role
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  super_admin: 'Toàn quyền quản lý hệ thống và người dùng',
  admin: 'Quản lý nội dung, cài đặt và backup',
  editor: 'Tạo và chỉnh sửa nội dung',
  viewer: 'Chỉ có quyền xem',
};

