const fs = require('fs');
const path = require('path');

// Read full products data
const productsPath = path.join(__dirname, 'products-full.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

console.log(`🚀 Generating data.ts with ${products.length} products...\n`);

// Category mapping
const categoryMapping = {
  'CỘT (TRỤ) TỰ NÂNG WILL-BURT': {
    id: '1',
    name: 'Cột (Trụ) Tự Nâng WILL-BURT',
    slug: 'cot-tu-nang-will-burt',
    description: 'Cột tự nâng chất lượng cao từ thương hiệu WILL-BURT hơn 100 năm lịch sử'
  },
  'THIẾT BỊ NÂNG HẠ HIAB': {
    id: '2',
    name: 'Thiết Bị Nâng Hạ HIAB',
    slug: 'thiet-bi-nang-ha-hiab',
    description: 'Thiết bị nâng hạ, cẩu tự hành và xe nâng Moffett từ HIAB'
  },
  'THIẾT BỊ CƠ GIỚI LOVOL': {
    id: '3',
    name: 'Thiết Bị Công Trình LOVOL',
    slug: 'thiet-bi-cong-trinh-lovol',
    description: 'Máy móc thiết bị công trình LOVOL chất lượng cao'
  },
  'THIẾT BỊ CƠ GIỚI SKYMARK': {
    id: '4',
    name: 'Thiết Bị Hàng Không SKYMARK',
    slug: 'thiet-bi-cong-trinh-SKYMARK',
    description: 'Máy móc Thiết Bị Hàng Không SKYMARK'
  }
};

// Helper functions
function cleanHTML(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getImages(imageString) {
  if (!imageString) return ['/images/products/placeholder.jpg'];
  
  const images = imageString
    .split(',')
    .map(img => img.trim())
    .filter(img => img)
    .map(img => {
      if (img.includes('newatlantic.vn/wp-content/uploads/')) {
        const filename = img.split('/').pop();
        return `/images/products/${filename}`;
      }
      return '/images/products/placeholder.jpg';
    });
  
  return images.length > 0 ? images : ['/images/products/placeholder.jpg'];
}

// Convert products
const convertedProducts = products.map((p, index) => {
  const categoryInfo = categoryMapping[p.category];
  const images = getImages(p.images);

  return {
    id: (index + 1).toString(),
    name: p.name,
    slug: generateSlug(p.name),
    category: categoryInfo.slug,
    categoryName: categoryInfo.name,
    description: cleanHTML(p.shortDescription) || cleanHTML(p.description).substring(0, 300) || 'Sản phẩm chất lượng cao',
    fullDescription: p.description, // Keep HTML for detail page
    shortDescription: cleanHTML(p.shortDescription),
    image: images[0],
    images: images,
    price: 'Liên hệ',
    featured: index < 8,
    specifications: {
      'Thương hiệu': categoryInfo.name.split(' ').pop(),
      'Xuất xứ': 'Nhập khẩu chính hãng',
      'Bảo hành': '12 tháng',
      'Tình trạng': 'Còn hàng'
    }
  };
});

console.log(`✅ Converted ${convertedProducts.length} products\n`);

// Generate TypeScript code
let tsCode = `// Auto-generated from WordPress CSV export
// Generated: ${new Date().toISOString()}
// Total products: ${convertedProducts.length}

import { Product, Category, Post, Service, Partner } from '@/types';

// Categories
export const categories: Category[] = [
`;

Object.values(categoryMapping).forEach((cat, index) => {
  tsCode += `  {
    id: "${cat.id}",
    name: "${cat.name}",
    slug: "${cat.slug}",
    description: "${cat.description}"
  }${index < Object.keys(categoryMapping).length - 1 ? ',' : ''}
`;
});

tsCode += `];

// Products
export const products: Product[] = [
`;

convertedProducts.forEach((p, index) => {
  const imagesStr = p.images.map(img => `"${img}"`).join(', ');
  const thuongHieu = p.specifications['Thương hiệu'];
  const xuatXu = p.specifications['Xuất xứ'];
  const baoHanh = p.specifications['Bảo hành'];
  const tinhTrang = p.specifications['Tình trạng'];

  tsCode += `  {
    id: "${p.id}",
    name: "${escapeString(p.name)}",
    slug: "${p.slug}",
    category: "${p.category}",
    categoryName: "${p.categoryName}",
    description: "${escapeString(p.description)}",
    fullDescription: \`${p.fullDescription}\`,
    shortDescription: "${escapeString(p.shortDescription)}",
    image: "${p.image}",
    images: [${imagesStr}],
    price: "${p.price}",
    featured: ${p.featured},
    specifications: {
      "Thương hiệu": "${thuongHieu}",
      "Xuất xứ": "${xuatXu}",
      "Bảo hành": "${baoHanh}",
      "Tình trạng": "${tinhTrang}"
    }
  }${index < convertedProducts.length - 1 ? ',' : ''}
`;
});

tsCode += `];

// Helper functions
export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

// Posts
export const posts: Post[] = [
  {
    id: "1",
    title: "Thương Hiệu Cột Nâng Hơn 100 Năm Lịch Sử",
    slug: "thuong-hieu-cot-nang-hon-100-nam-lich-su",
    excerpt: "Khám phá lịch sử hơn 100 năm của thương hiệu cột nâng WILL-BURT",
    content: "WILL-BURT là công ty hàng đầu thế giới trong lĩnh vực sản xuất cột tự nâng...",
    image: "/images/blog/willburt-history.jpg",
    category: "Tin tức",
    author: "Admin",
    date: "2024-05-20"
  }
];

// Services
export const services: Service[] = [
  {
    id: '1',
    title: 'Thiết Bị Vật Tư PCCC',
    slug: 'thiet-bi-vat-tu-pccc',
    description: 'Cung cấp và thi công hệ thống PCCC chuyên nghiệp',
  }
];

// Partners
export const partners: Partner[] = [
  { id: '1', name: 'WILL-BURT', logo: '/logos/willburt.png' },
  { id: '2', name: 'HIAB', logo: '/logos/hiab.png' },
  { id: '3', name: 'LOVOL', logo: '/logos/lovol.png' },
  { id: '4', name: 'SKYMARK', logo: '/logos/SKYMARK.png' },
];
`;

// Save to file
const outputPath = path.join(__dirname, '../lib/data.ts');
fs.writeFileSync(outputPath, tsCode);

console.log(`✅ Generated: lib/data.ts`);
console.log(`\n📊 Summary:`);
console.log(`   Total products: ${convertedProducts.length}`);
console.log(`   WILL-BURT: ${convertedProducts.filter(p => p.category === 'cot-tu-nang-will-burt').length}`);
console.log(`   HIAB: ${convertedProducts.filter(p => p.category === 'thiet-bi-nang-ha-hiab').length}`);
console.log(`   LOVOL: ${convertedProducts.filter(p => p.category === 'thiet-bi-cong-trinh-lovol').length}`);
console.log(`   SKYMARK: ${convertedProducts.filter(p => p.category === 'thiet-bi-cong-trinh-SKYMARK').length}`);

// Save detailed products with full HTML for reference
fs.writeFileSync(
  path.join(__dirname, 'products-detailed.json'),
  JSON.stringify(convertedProducts, null, 2)
);

console.log(`\n💾 Detailed data saved to: scripts/products-detailed.json`);
console.log(`\n✨ Done! Check lib/data.ts`);

