import { Product, Category, Post, Service, Partner } from '@/types';

// Danh mục sản phẩm
export const categories: Category[] = [
  {
    "id": "1",
    "name": "Cột (Trụ) Tự Nâng WILL-BURT",
    "slug": "cot-tu-nang-will-burt",
    "description": "Cột tự nâng chất lượng cao từ thương hiệu WILL-BURT"
  },
  {
    "id": "2",
    "name": "Thiết Bị Nâng Hạ HIAB",
    "slug": "thiet-bi-nang-ha-hiab",
    "description": "Thiết bị nâng hạ và cẩu tự hành HIAB"
  },
  {
    "id": "3",
    "name": "Thiết Bị Công Trình LOVOL",
    "slug": "thiet-bi-cong-trinh-lovol",
    "description": "Máy móc thiết bị công trình LOVOL"
  },
  {
    "id": "4",
    "name": "Thiết Bị Công Trình LIUGONG",
    "slug": "thiet-bi-cong-trinh-liugong",
    "description": "Máy móc thiết bị công trình LIUGONG"
  }
];

// Sản phẩm
export const products: Product[] = [];

// Bài viết tin tức
export const posts: Post[] = [
  {
    "id": "1",
    "title": "Thương Hiệu Cột Nâng Hơn 100 Năm Lịch Sử 2",
    "slug": "thuong-hieu-cot-nang-hon-100-nam-lich-su-2",
    "excerpt": "Khám phá lịch sử hơn 100 năm của thương hiệu cột nâng WILL-BURT",
    "content": "Nội dung bài viết...",
    "image": "/images/place-holder/placeholder.jpg",
    "date": "2024-05-14"
  },
  {
    "id": "2",
    "title": "Xe Nâng Là Gì? Ứng Dụng và Cấu Tạo Xe Nâng",
    "slug": "xe-nang-la-gi-ung-dung-va-cau-tao",
    "excerpt": "Tìm hiểu về xe nâng, ứng dụng và cấu tạo chi tiết",
    "content": "Nội dung bài viết...",
    "image": "/images/place-holder/placeholder.jpg",
    "date": "2024-05-22"
  },
  {
    "id": "3",
    "title": "Công ty NEW ATLANTIC tham gia Triển lãm Thương mại cột nâng ở Texas",
    "slug": "new-ait-trien-lam-texas",
    "excerpt": "NEW ATLANTIC tham gia triển lãm cột nâng tại Texas, Mỹ",
    "content": "Nội dung bài viết...",
    "image": "/images/place-holder/placeholder.jpg",
    "date": "2024-05-24"
  }
];

// Dịch vụ
export const services: Service[] = [
  {
    id: '1',
    title: 'Thiết Bị Vật Tư PCCC',
    slug: 'thiet-bi-vat-tu-pccc',
    description: 'Cung cấp và thi công hệ thống PCCC chuyên nghiệp',
  },
  {
    id: '2',
    title: 'Thiết Bị Chuyên Ngành',
    slug: 'thiet-bi-chuyen-nganh',
    description: 'Thiết bị chuyên dụng cho các ngành công nghiệp',
  },
  {
    id: '3',
    title: 'Thiết Bị Ngành Điện',
    slug: 'thiet-bi-nganh-dien',
    description: 'Cung ứng và tư vấn hệ thống điện công nghiệp',
  },
];

// Đối tác
export const partners: Partner[] = [
  { id: '1', name: 'WILL-BURT', logo: '/logos/willburt.png' },
  { id: '2', name: 'HIAB', logo: '/logos/hiab.png' },
  { id: '3', name: 'LOVOL', logo: '/logos/lovol.png' },
  { id: '4', name: 'LIUGONG', logo: '/logos/liugong.png' },
];
