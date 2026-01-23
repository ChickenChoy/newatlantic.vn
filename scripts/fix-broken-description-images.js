/**
 * Script to fix broken images in product descriptions
 * Maps broken WordPress URLs to existing local images
 * Run: node scripts/fix-broken-description-images.js
 */

const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Get all existing images in public/images/products
function getLocalImages() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'products');
  const images = {};

  function scanDir(dir, basePath = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        scanDir(filePath, path.join(basePath, file));
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
        const relativePath = `/images/products/${basePath ? basePath.replace(/\\/g, '/') + '/' : ''}${file}`;
        const folder = basePath.replace(/\\/g, '/');
        if (!images[folder]) {
          images[folder] = [];
        }
        images[folder].push({
          name: file,
          path: relativePath
        });
      }
    }
  }

  scanDir(imagesDir);
  return images;
}

// Product slug to folder mapping (for cases where folder name differs)
const slugToFolder = {
  'he-thong-nang-compact-elevation-system': 'he-thong-nang-compact-elevation-system',
  'cot-tru-nang-10mts-m7-2-2': 'cot-tru-nang-10mts-m7-2-2',
  'cot-tru-tu-nang-stilleto-al': 'cot-tru-tu-nang-stilleto-al',
  'xe-nang-dien-moffett-e5-nx': 'xe-nang-dien-moffett-e5-nx',
  'xe-nang-diesel-moffett-m2': 'xe-nang-diesel-moffett-m2',
  'xe-nang-gan-xe-tai-moffett-m4-nx': 'xe-nang-gan-xe-tai-moffett-m4-nx',
  'xe-nang-gan-xe-tai-moffett-m8-nx': 'xe-nang-gan-xe-tai-moffett-m8-nx',
  'xe-nang-gan-xe-tai-moffett-m9-nx': 'xe-nang-gan-xe-tai-moffett-m9-nx',
  'xe-nang-dien-moffett-e8-nx': 'xe-nang-dien-moffett-e8-nx',
  'xe-nang-gan-xe-tai-moffett-m5-nx': 'xe-nang-gan-xe-tai-moffett-m5-nx',
  'xe-nang-dien-moffett-e2': 'xe-nang-dien-moffett-e2',
  'xe-nang-dien-moffett-e4-nx': 'xe-nang-dien-moffett-e4-nx',
  'cot-nang-super-heavy-duty-non-locking-shdnl': 'cot-nang-super-heavy-duty-non-locking-shdnl',
  'cot-nang-type-pu': 'cot-nang-type-pu'
};

// Mapping of broken URLs to replacement local images
// Since we can't match exactly, we'll use product's existing gallery images
const brokenUrlReplacements = {
  // Product ID 3 - CES System - use existing gallery images
  'https://newatlantic.vn/wp-content/uploads/2024/04/4m-ces-trk-sal-2d-drawing-300x286.jpg': '/images/products/he-thong-nang-compact-elevation-system/Telecommunications-Elevation-Solutions_A4.jpg',
  'https://newatlantic.vn/wp-content/uploads/2024/04/6m-ces-trk-sal-customer-drawing-300x294.jpg': '/images/products/he-thong-nang-compact-elevation-system/Telecommunications-Elevation-Solutions_A5.jpg',
  'https://newatlantic.vn/wp-content/uploads/2024/04/4m-ces-trk-shdnl-customer-drawing-300x294.jpg': '/images/products/he-thong-nang-compact-elevation-system/Telecommunications-Elevation-Solutions_A6.jpg',
  'https://newatlantic.vn/wp-content/uploads/2024/04/6m-ces-trk-shdnl-customer-drawing-1-300x278.jpg': '/images/products/he-thong-nang-compact-elevation-system/ces-trk-truck-bed-225x300-2.jpg',

  // Product ID 8 - 10MTS-M7-2.2
  'https://newatlantic.vn/wp-content/uploads/2024/04/TV_QEAM-MTS-10MTS-M7-2.2-HH_TV-.png': '/images/products/cot-tru-nang-10mts-m7-2-2/TV_QEAM-MTS-10MTS-M7-2.jpg',

  // Product ID 14 - Stilleto AL
  'https://newatlantic.vn/wp-content/uploads/2024/05/z5400897885365_87cc921d59d1f8face0f0dd22e46ce5a-300x106.jpg': '/images/products/cot-tru-tu-nang-stilleto-al/Capture.png',

  // Product ID 16 - E5 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/1222-300x126.png': '/images/products/xe-nang-dien-moffett-e5-nx/Capture-4.png',

  // Product ID 17 - M2
  'https://newatlantic.vn/wp-content/uploads/2024/05/1111-300x263.png': '/images/products/xe-nang-diesel-moffett-m2/Capture-5.png',

  // Product ID 18 - M4 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/414.png': '/images/products/xe-nang-gan-xe-tai-moffett-m4-nx/Capture-6.png',

  // Product ID 19 - M8 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/1111-1.png': '/images/products/xe-nang-gan-xe-tai-moffett-m8-nx/21.png',

  // Product ID 20 - M9 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/2-4.png': '/images/products/xe-nang-gan-xe-tai-moffett-m9-nx/35.png',
  'https://newatlantic.vn/wp-content/uploads/2024/05/33.png': '/images/products/xe-nang-gan-xe-tai-moffett-m9-nx/4-1.png',
  'https://newatlantic.vn/wp-content/uploads/2024/05/12-1.png': '/images/products/xe-nang-gan-xe-tai-moffett-m9-nx/35.png',
  'https://newatlantic.vn/wp-content/uploads/2024/05/1-5.png': '/images/products/xe-nang-gan-xe-tai-moffett-m9-nx/4-1.png',

  // Product ID 21 - E8 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/Capture-8.png': '/images/products/xe-nang-dien-moffett-e8-nx/1406220.jpg',

  // Product ID 22 - M5 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/11.png': '/images/products/xe-nang-gan-xe-tai-moffett-m5-nx/1009262.jpg',

  // Product ID 23 - E2
  'https://newatlantic.vn/wp-content/uploads/2024/05/11-1.png': '/images/products/xe-nang-dien-moffett-e2/1406255.jpg',

  // Product ID 24 - E4 NX
  'https://newatlantic.vn/wp-content/uploads/2024/05/Capture-10.png': '/images/products/xe-nang-dien-moffett-e4-nx/1209545.jpg',

  // Product ID 25 - SHDNL
  'https://newatlantic.vn/wp-content/uploads/2024/05/3-2.png': '/images/products/cot-nang-super-heavy-duty-non-locking-shdnl/1-7.png',
  'https://newatlantic.vn/wp-content/uploads/2024/05/2-6.png': '/images/products/cot-nang-super-heavy-duty-non-locking-shdnl/1-7.png',
  'https://newatlantic.vn/wp-content/uploads/2024/05/4-3.png': '/images/products/cot-nang-super-heavy-duty-non-locking-shdnl/1-7.png',

  // Product ID 26 - Type PU
  'https://newatlantic.vn/wp-content/uploads/2024/05/A.png': '/images/products/cot-nang-type-pu/11-2.png'
};

function fixProductDescriptions() {
  let fixedCount = 0;
  let totalBroken = 0;

  for (const product of products) {
    let modified = false;

    // Fix fullDescription
    if (product.fullDescription) {
      let newFullDesc = product.fullDescription;

      for (const [brokenUrl, localPath] of Object.entries(brokenUrlReplacements)) {
        if (newFullDesc.includes(brokenUrl)) {
          newFullDesc = newFullDesc.split(brokenUrl).join(localPath);
          totalBroken++;
          modified = true;
          console.log(`Fixed in product "${product.name}": ${brokenUrl} -> ${localPath}`);
        }
      }

      if (modified) {
        product.fullDescription = newFullDesc;
        fixedCount++;
      }
    }

    // Fix description (short)
    if (product.description) {
      let newDesc = product.description;

      for (const [brokenUrl, localPath] of Object.entries(brokenUrlReplacements)) {
        if (newDesc.includes(brokenUrl)) {
          newDesc = newDesc.split(brokenUrl).join(localPath);
          totalBroken++;
          modified = true;
        }
      }

      if (modified) {
        product.description = newDesc;
      }
    }
  }

  return { fixedCount, totalBroken };
}

function main() {
  console.log('🔧 Fixing broken images in product descriptions...\n');

  // Get existing local images for reference
  const localImages = getLocalImages();
  console.log('📁 Found local image folders:');
  for (const [folder, images] of Object.entries(localImages)) {
    console.log(`   - ${folder}: ${images.length} images`);
  }
  console.log('');

  // Fix products
  const { fixedCount, totalBroken } = fixProductDescriptions();

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESULTS');
  console.log('='.repeat(60));
  console.log(`Products fixed: ${fixedCount}`);
  console.log(`Broken URLs replaced: ${totalBroken}`);

  // Save updated products.json
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`\n✅ Updated products.json saved!`);

  console.log('\n🔍 Run check-product-images.js again to verify all images are fixed.');
}

main();
