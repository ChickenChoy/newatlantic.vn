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
export const products: Product[] = [
  {
    "id": "4",
    "name": "Cột (Trụ) Nâng Pneumatic Non-Locking",
    "slug": "cot-tru-nang-pneumatic-non-locking",
    "category": "Cột (Trụ) Tự Nâng WILL-BURT",
    "categorySlug": "cot-tu-nang-will-burt",
    "description": "Cột nâng khí nén không khóa với khả năng nâng nhanh và chính xác",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Chiều cao nâng": "Lên đến 15m",
      "Tải trọng": "150kg",
      "Vật liệu": "Thép không gỉ",
      "Điều khiển": "Khí nén"
    }
  },
  {
    "id": "5",
    "name": "Cột (Trụ) Nâng SPM Spindle Mast",
    "slug": "cot-tru-nang-spm-spindle-mast",
    "category": "Cột (Trụ) Tự Nâng WILL-BURT",
    "categorySlug": "cot-tu-nang-will-burt",
    "description": "Cột nâng SPM Spindle Mast với thiết kế đặc biệt cho ứng dụng chuyên nghiệp",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Chiều cao nâng": "Lên đến 18m",
      "Tải trọng": "250kg",
      "Vật liệu": "Thép không gỉ",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "6",
    "name": "Cột (Trụ) Nâng Thu Gọn Stiletto",
    "slug": "cot-tru-nang-thu-gon-stiletto",
    "category": "Cột (Trụ) Tự Nâng WILL-BURT",
    "categorySlug": "cot-tu-nang-will-burt",
    "description": "Cột nâng thu gọn Stiletto với thiết kế gọn nhẹ và dễ vận chuyển",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "featured": true,
    "specifications": {
      "Chiều cao nâng": "Lên đến 12m",
      "Tải trọng": "100kg",
      "Vật liệu": "Thép không gỉ",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "7",
    "name": "Cột Nâng Quick Erecting Antenna Mast (QEAM)",
    "slug": "cot-nang-quick-erecting-antenna-mast-qeam",
    "category": "Cột (Trụ) Tự Nâng WILL-BURT",
    "categorySlug": "cot-tu-nang-will-burt",
    "description": "Cột nâng QEAM với khả năng dựng nhanh cho ứng dụng ăng-ten",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Chiều cao nâng": "Lên đến 22m",
      "Tải trọng": "180kg",
      "Vật liệu": "Thép không gỉ",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "8",
    "name": "Hệ Thống Nâng Rapid Deployment Mobile",
    "slug": "he-thong-nang-rapid-deployment-mobile",
    "category": "Cột (Trụ) Tự Nâng WILL-BURT",
    "categorySlug": "cot-tu-nang-will-burt",
    "description": "Hệ thống nâng di động với khả năng triển khai nhanh chóng",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Chiều cao nâng": "Lên đến 35m",
      "Tải trọng": "400kg",
      "Vật liệu": "Thép không gỉ",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "9",
    "name": "Cột Tự Nâng ClarkMasts",
    "slug": "cot-tu-nang-clarkmasts",
    "category": "Cột (Trụ) Tự Nâng WILL-BURT",
    "categorySlug": "cot-tu-nang-will-burt",
    "description": "Cột tự nâng ClarkMasts thuộc thương hiệu Will-Burt với chất lượng cao",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Chiều cao nâng": "Lên đến 28m",
      "Tải trọng": "350kg",
      "Vật liệu": "Thép không gỉ",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "10",
    "name": "Cẩu Gập Robot 8 Tấn HIAB XCL-8",
    "slug": "cau-gap-robot-8-tan-hiab-xcl-8",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Cẩu gập robot HIAB XCL-8 tải trọng 8 tấn với công nghệ tiên tiến",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "featured": true,
    "specifications": {
      "Tải trọng": "8 tấn",
      "Tầm với": "Lên đến 12m",
      "Động cơ": "Diesel",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "11",
    "name": "EFFER 35",
    "slug": "effer-35",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Cẩu EFFER 35 với khả năng nâng hạ mạnh mẽ và ổn định",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "3.5 tấn",
      "Tầm với": "Lên đến 8m",
      "Động cơ": "Diesel",
      "Điều khiển": "Thủy lực"
    }
  },
  {
    "id": "12",
    "name": "EFFER IQ.1200 HP",
    "slug": "effer-iq-1200-hp",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Cẩu EFFER IQ.1200 HP với công nghệ thông minh và hiệu suất cao",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "12 tấn",
      "Tầm với": "Lên đến 15m",
      "Động cơ": "Diesel",
      "Điều khiển": "Thủy lực"
    }
  },
  {
    "id": "13",
    "name": "EFFER IX.195 HP",
    "slug": "effer-ix-195-hp",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Cẩu EFFER IX.195 HP với khả năng nâng hạ chuyên nghiệp",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "19.5 tấn",
      "Tầm với": "Lên đến 18m",
      "Động cơ": "Diesel",
      "Điều khiển": "Thủy lực"
    }
  },
  {
    "id": "14",
    "name": "EFFER IX.355 HP",
    "slug": "effer-ix-355-hp",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Cẩu EFFER IX.355 HP với tải trọng lớn và độ tin cậy cao",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "35.5 tấn",
      "Tầm với": "Lên đến 22m",
      "Động cơ": "Diesel",
      "Điều khiển": "Thủy lực"
    }
  },
  {
    "id": "15",
    "name": "Xe Nâng Điện MOFFETT E2",
    "slug": "xe-nang-dien-moffett-e2",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Xe nâng điện MOFFETT E2 thân thiện với môi trường",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "2 tấn",
      "Chiều cao nâng": "Lên đến 6m",
      "Động cơ": "Điện",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "16",
    "name": "Xe Nâng Điện MOFFETT E4 NX",
    "slug": "xe-nang-dien-moffett-e4-nx",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Xe nâng điện MOFFETT E4 NX với công nghệ tiên tiến",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "4 tấn",
      "Chiều cao nâng": "Lên đến 8m",
      "Động cơ": "Điện",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "17",
    "name": "Xe Nâng Điện MOFFETT E5 NX",
    "slug": "xe-nang-dien-moffett-e5-nx",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Xe nâng điện MOFFETT E5 NX với hiệu suất cao",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "5 tấn",
      "Chiều cao nâng": "Lên đến 10m",
      "Động cơ": "Điện",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "18",
    "name": "Xe Nâng Điện MOFFETT E8 NX",
    "slug": "xe-nang-dien-moffett-e8-nx",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Xe nâng điện MOFFETT E8 NX với tải trọng lớn",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "8 tấn",
      "Chiều cao nâng": "Lên đến 12m",
      "Động cơ": "Điện",
      "Điều khiển": "Tự động"
    }
  },
  {
    "id": "19",
    "name": "Xe Nâng Diesel MOFFETT M2",
    "slug": "xe-nang-diesel-moffett-m2",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Xe nâng diesel MOFFETT M2 gắn trên xe tải",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "2 tấn",
      "Chiều cao nâng": "Lên đến 6m",
      "Động cơ": "Diesel",
      "Điều khiển": "Thủy lực"
    }
  },
  {
    "id": "20",
    "name": "Xe Nâng Gắn Xe Tải MOFFETT M4 NX",
    "slug": "xe-nang-gan-xe-tai-moffett-m4-nx",
    "category": "Thiết Bị Nâng Hạ HIAB",
    "categorySlug": "thiet-bi-nang-ha-hiab",
    "description": "Xe nâng gắn xe tải MOFFETT M4 NX với khả năng di chuyển linh hoạt",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "4 tấn",
      "Chiều cao nâng": "Lên đến 8m",
      "Động cơ": "Diesel",
      "Điều khiển": "Thủy lực"
    }
  },
  {
    "id": "21",
    "name": "Máy Đào Bánh Lốp 0.3 Khối – WEICHAI LOVOL FP 80W",
    "slug": "may-dao-banh-lop-0-3-khoi-weichai-lovol-fp-80w",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Máy đào bánh lốp WEICHAI LOVOL FP 80W dung tích gầu 0.3 khối",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "featured": true,
    "specifications": {
      "Dung tích gầu": "0.3 khối",
      "Trọng lượng": "8 tấn",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "22",
    "name": "Máy Đào Bánh Lốp 1.0 Khối – WEICHAI LOVOL FP215W",
    "slug": "may-dao-banh-lop-1-0-khoi-weichai-lovol-fp215w",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Máy đào bánh lốp WEICHAI LOVOL FP215W dung tích gầu 1.0 khối",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Dung tích gầu": "1.0 khối",
      "Trọng lượng": "21.5 tấn",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "23",
    "name": "Máy Đào Bánh Xích 1 Khối, Weichai Lovol, Model FR220D",
    "slug": "may-dao-banh-xich-1-khoi-weichai-lovol-fr220d",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Máy đào bánh xích WEICHAI LOVOL FR220D dung tích gầu 1 khối",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Dung tích gầu": "1.0 khối",
      "Trọng lượng": "22 tấn",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh xích"
    }
  },
  {
    "id": "24",
    "name": "Máy Đào Bánh Xích Mini 0.04 Khối – WEICHAI LOVOL FR18E2-u",
    "slug": "may-dao-banh-xich-mini-0-04-khoi-weichai-lovol-fr18e2-u",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Máy đào bánh xích mini WEICHAI LOVOL FR18E2-u dung tích gầu 0.04 khối",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Dung tích gầu": "0.04 khối",
      "Trọng lượng": "1.8 tấn",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh xích"
    }
  },
  {
    "id": "25",
    "name": "Máy Xúc Đào Liên Hợp FLB468-II",
    "slug": "may-xuc-dao-lien-hop-flb468-ii",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Máy xúc đào liên hợp LOVOL FLB468-II với khả năng đa năng",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Dung tích gầu": "0.6 khối",
      "Trọng lượng": "4.68 tấn",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "26",
    "name": "Xe Lu 12 Tấn – WEICHAI LOVOL FY12S",
    "slug": "xe-lu-12-tan-weichai-lovol-fy12s",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Xe lu WEICHAI LOVOL FY12S trọng lượng 12 tấn",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Trọng lượng": "12 tấn",
      "Chiều rộng lu": "2.13m",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "27",
    "name": "Xe Nâng FF30D",
    "slug": "xe-nang-ff30d",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Xe nâng LOVOL FF30D với khả năng nâng hạ mạnh mẽ",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Tải trọng": "3 tấn",
      "Chiều cao nâng": "Lên đến 6m",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "28",
    "name": "Xe Ủi Bánh Xích 25 Tấn – WEICHAI LOVOL FD220",
    "slug": "xe-ui-banh-xich-25-tan-weichai-lovol-fd220",
    "category": "Thiết Bị Công Trình LOVOL",
    "categorySlug": "thiet-bi-cong-trinh-lovol",
    "description": "Xe ủi bánh xích WEICHAI LOVOL FD220 trọng lượng 25 tấn",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Trọng lượng": "25 tấn",
      "Chiều rộng lưỡi ủi": "3.2m",
      "Động cơ": "WEICHAI",
      "Loại bánh": "Bánh xích"
    }
  },
  {
    "id": "29",
    "name": "Máy Xúc Đào LiuGong CLG906E",
    "slug": "may-xuc-dao-liugong-clg906e",
    "category": "Thiết Bị Công Trình LIUGONG",
    "categorySlug": "thiet-bi-cong-trinh-liugong",
    "description": "Máy xúc đào LiuGong CLG906E, dung tích gầu 1 khối",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "featured": true,
    "specifications": {
      "Dung tích gầu": "1.0 khối",
      "Trọng lượng": "6 tấn",
      "Động cơ": "LIUGONG",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "30",
    "name": "Máy Ủi B160CR",
    "slug": "may-ui-b160cr",
    "category": "Thiết Bị Công Trình LIUGONG",
    "categorySlug": "thiet-bi-cong-trinh-liugong",
    "description": "Máy ủi LiuGong B160CR công suất mạnh mẽ",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Trọng lượng": "16 tấn",
      "Chiều rộng lưỡi ủi": "3.1m",
      "Động cơ": "LIUGONG",
      "Loại bánh": "Bánh xích"
    }
  },
  {
    "id": "31",
    "name": "Máy Xúc Đào LiuGong CLG922E",
    "slug": "may-xuc-dao-liugong-clg922e",
    "category": "Thiết Bị Công Trình LIUGONG",
    "categorySlug": "thiet-bi-cong-trinh-liugong",
    "description": "Máy xúc đào LiuGong CLG922E với hiệu suất cao",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Dung tích gầu": "1.2 khối",
      "Trọng lượng": "22 tấn",
      "Động cơ": "LIUGONG",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "32",
    "name": "Máy Xúc Đào LiuGong CLG936E",
    "slug": "may-xuc-dao-liugong-clg936e",
    "category": "Thiết Bị Công Trình LIUGONG",
    "categorySlug": "thiet-bi-cong-trinh-liugong",
    "description": "Máy xúc đào LiuGong CLG936E với tải trọng lớn",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Dung tích gầu": "1.6 khối",
      "Trọng lượng": "36 tấn",
      "Động cơ": "LIUGONG",
      "Loại bánh": "Bánh lốp"
    }
  },
  {
    "id": "33",
    "name": "Máy Ủi LiuGong B230CR",
    "slug": "may-ui-liugong-b230cr",
    "category": "Thiết Bị Công Trình LIUGONG",
    "categorySlug": "thiet-bi-cong-trinh-liugong",
    "description": "Máy ủi LiuGong B230CR với công suất mạnh mẽ",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Trọng lượng": "23 tấn",
      "Chiều rộng lưỡi ủi": "3.3m",
      "Động cơ": "LIUGONG",
      "Loại bánh": "Bánh xích"
    }
  },
  {
    "id": "34",
    "name": "Xe Lu LiuGong CLG612H",
    "slug": "xe-lu-liugong-clg612h",
    "category": "Thiết Bị Công Trình LIUGONG",
    "categorySlug": "thiet-bi-cong-trinh-liugong",
    "description": "Xe lu LiuGong CLG612H với khả năng lu lèn hiệu quả",
    "image": "/images/box-image/MAY.jpg",
    "images": [
      "/images/box-image/MAY.jpg",
      "/images/box-image/MAY2.jpg",
      "/images/box-image/hiab.jpg",
      "/images/box-image/lovol.jpg",
      "/images/box-image/liugong.jpg"
    ],
    "price": "Liên hệ",
    "specifications": {
      "Trọng lượng": "12 tấn",
      "Chiều rộng lu": "2.13m",
      "Động cơ": "LIUGONG",
      "Loại bánh": "Bánh lốp"
    }
  }
];

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
