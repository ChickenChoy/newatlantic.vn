// Types cho sản phẩm
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  description?: string;
  fullDescription?: string; // HTML content for detail page
  shortDescription?: string; // Plain text
  image: string;
  images?: string[];
  price?: string;
  specifications?: Record<string, string>;
  featured?: boolean;
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

