const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Đọc file data.ts hiện tại
const dataPath = path.join(__dirname, '../lib/data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract products array từ data.ts
const productsMatch = dataContent.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);
if (!productsMatch) {
  console.error('❌ Không tìm thấy products array trong data.ts');
  process.exit(1);
}

const products = eval(productsMatch[1]);
console.log(`✅ Tìm thấy ${products.length} sản phẩm`);

// Function to download image and convert to base64
function downloadImageAsBase64(url) {
  return new Promise((resolve, reject) => {
    if (!url || url === '/placeholder.jpg') {
      resolve(null);
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`❌ Lỗi tải ảnh ${url}: ${response.statusCode}`);
        resolve(null);
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers['content-type'] || 'image/jpeg';
        const dataUrl = `data:${mimeType};base64,${base64}`;
        resolve(dataUrl);
      });
    }).on('error', (err) => {
      console.error(`❌ Lỗi tải ảnh ${url}:`, err.message);
      resolve(null);
    });
  });
}

// Function to process all products
async function processAllProducts() {
  console.log('\n🚀 Bắt đầu tải và chuyển đổi hình ảnh...\n');
  
  const updatedProducts = [];
  let totalImages = 0;
  let successImages = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] Xử lý: ${product.name}`);
    
    const updatedProduct = { ...product };
    
    // Download main image
    if (product.image && product.image !== '/placeholder.jpg') {
      totalImages++;
      console.log(`  📥 Tải ảnh chính: ${product.image}`);
      const base64Image = await downloadImageAsBase64(product.image);
      if (base64Image) {
        updatedProduct.image = base64Image;
        successImages++;
        console.log(`  ✅ Chuyển đổi thành công (${Math.round(base64Image.length / 1024)}KB)`);
      } else {
        console.log(`  ⚠️  Giữ nguyên URL gốc`);
      }
    }

    // Download all images in images array
    if (product.images && product.images.length > 0) {
      const base64Images = [];
      for (let j = 0; j < product.images.length; j++) {
        const imageUrl = product.images[j];
        if (imageUrl && imageUrl !== '/placeholder.jpg') {
          totalImages++;
          console.log(`  📥 Tải ảnh ${j + 1}/${product.images.length}: ${imageUrl}`);
          const base64Image = await downloadImageAsBase64(imageUrl);
          if (base64Image) {
            base64Images.push(base64Image);
            successImages++;
            console.log(`  ✅ Chuyển đổi thành công (${Math.round(base64Image.length / 1024)}KB)`);
          } else {
            base64Images.push(imageUrl); // Keep original URL if failed
            console.log(`  ⚠️  Giữ nguyên URL gốc`);
          }
        } else {
          base64Images.push(imageUrl);
        }
      }
      updatedProduct.images = base64Images;
    }

    updatedProducts.push(updatedProduct);
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n\n📊 Tổng kết:`);
  console.log(`  - Tổng số ảnh: ${totalImages}`);
  console.log(`  - Thành công: ${successImages}`);
  console.log(`  - Thất bại: ${totalImages - successImages}`);

  return updatedProducts;
}

// Function to generate new data.ts content
function generateDataTsContent(products) {
  const productsJson = JSON.stringify(products, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Remove quotes from keys
    .replace(/: "data:image/g, ': `data:image') // Use backticks for base64
    .replace(/base64,([^"]+)"/g, 'base64,$1`'); // Close backticks

  return `import { Product, Category } from '@/types';

export const products: Product[] = ${productsJson};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Cột Nâng WILL-BURT',
    slug: 'cot-nang-will-burt',
    description: 'Cột nâng chuyên dụng WILL-BURT chất lượng cao',
    image: '/images/categories/will-burt.jpg',
  },
  {
    id: '2',
    name: 'Cẩu HIAB',
    slug: 'cau-hiab',
    description: 'Cẩu HIAB nhập khẩu chính hãng',
    image: '/images/categories/hiab.jpg',
  },
  {
    id: '3',
    name: 'Thiết Bị Công Trình LOVOL',
    slug: 'thiet-bi-cong-trinh-lovol',
    description: 'Thiết bị công trình LOVOL hiện đại',
    image: '/images/categories/lovol.jpg',
  },
  {
    id: '4',
    name: 'Thiết Bị Công Trình LIUGONG',
    slug: 'thiet-bi-cong-trinh-liugong',
    description: 'Thiết bị công trình LIUGONG chất lượng',
    image: '/images/categories/liugong.jpg',
  },
];
`;
}

// Main execution
(async () => {
  try {
    const updatedProducts = await processAllProducts();
    
    console.log('\n💾 Đang lưu vào data.ts...');
    const newContent = generateDataTsContent(updatedProducts);
    fs.writeFileSync(dataPath, newContent, 'utf8');
    
    console.log('✅ Hoàn thành! File data.ts đã được cập nhật với base64 images.');
    console.log(`📁 File: ${dataPath}`);
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
})();

