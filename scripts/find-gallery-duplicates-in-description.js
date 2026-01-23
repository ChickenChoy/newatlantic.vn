/**
 * Script to find images in fullDescription that duplicate the product gallery
 * Run: node scripts/find-gallery-duplicates-in-description.js
 */

const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

console.log(`\n📦 Total products: ${products.length}\n`);

// Extract image URLs from HTML content
function extractImageUrls(html) {
  if (!html) return [];

  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const urls = [];
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

// Normalize URL for comparison (remove size variations, etc.)
function normalizeImageUrl(url) {
  // Remove WordPress size suffixes like -300x300, -150x150, etc.
  return url.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1').toLowerCase();
}

function findDuplicates() {
  const results = {
    productsWithDuplicates: [],
    productsWithDescriptionImages: [],
    summary: {
      totalProducts: products.length,
      productsWithDuplicateImages: 0,
      productsWithAnyDescImages: 0,
      totalDuplicateImages: 0,
      totalDescriptionImages: 0
    }
  };

  for (const product of products) {
    const fullDescription = product.fullDescription || '';
    const galleryImages = product.images || [];

    // Extract images from fullDescription
    const descImages = extractImageUrls(fullDescription);

    if (descImages.length === 0) continue;

    results.summary.productsWithAnyDescImages++;
    results.summary.totalDescriptionImages += descImages.length;

    // Normalize gallery images for comparison
    const normalizedGallery = galleryImages.map(normalizeImageUrl);

    // Find duplicates
    const duplicates = [];
    const uniqueDescImages = [];

    for (const descImg of descImages) {
      const normalizedDesc = normalizeImageUrl(descImg);

      // Check if this image (or a variation) is in the gallery
      const isDuplicate = normalizedGallery.some(
        galleryImg => galleryImg === normalizedDesc ||
          galleryImg.includes(path.basename(normalizedDesc)) ||
          normalizedDesc.includes(path.basename(galleryImg))
      );

      if (isDuplicate) {
        duplicates.push(descImg);
      } else {
        uniqueDescImages.push(descImg);
      }
    }

    results.productsWithDescriptionImages.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      pageUrl: `/san-pham/${product.categorySlug}/${product.slug}`,
      galleryCount: galleryImages.length,
      descImageCount: descImages.length,
      duplicateCount: duplicates.length,
      uniqueCount: uniqueDescImages.length,
      descImages,
      galleryImages,
      duplicates,
      uniqueDescImages
    });

    if (duplicates.length > 0) {
      results.productsWithDuplicates.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        pageUrl: `/san-pham/${product.categorySlug}/${product.slug}`,
        duplicates,
        galleryImages
      });
      results.summary.productsWithDuplicateImages++;
      results.summary.totalDuplicateImages += duplicates.length;
    }
  }

  return results;
}

function main() {
  console.log('🔍 Finding images in fullDescription that duplicate gallery images...\n');

  const results = findDuplicates();

  console.log('='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total products: ${results.summary.totalProducts}`);
  console.log(`Products with images in description: ${results.summary.productsWithAnyDescImages}`);
  console.log(`Products with DUPLICATE images: ${results.summary.productsWithDuplicateImages}`);
  console.log(`Total description images: ${results.summary.totalDescriptionImages}`);
  console.log(`Total duplicate images: ${results.summary.totalDuplicateImages}`);

  if (results.productsWithDescriptionImages.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('📝 ALL PRODUCTS WITH IMAGES IN DESCRIPTION:');
    console.log('='.repeat(80));

    for (const product of results.productsWithDescriptionImages) {
      console.log(`\n📦 [${product.id}] ${product.name}`);
      console.log(`   Page: ${product.pageUrl}`);
      console.log(`   Gallery images: ${product.galleryCount}`);
      console.log(`   Description images: ${product.descImageCount}`);
      console.log(`   - Duplicates of gallery: ${product.duplicateCount}`);
      console.log(`   - Unique to description: ${product.uniqueCount}`);

      if (product.duplicates.length > 0) {
        console.log(`   ⚠️  DUPLICATE images:`);
        for (const img of product.duplicates) {
          console.log(`      - ${img}`);
        }
      }

      if (product.uniqueDescImages.length > 0) {
        console.log(`   ✅ Unique description images:`);
        for (const img of product.uniqueDescImages) {
          console.log(`      - ${img}`);
        }
      }
    }
  }

  // Save report
  const reportPath = path.join(__dirname, 'gallery-duplicates-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📁 Report saved to: ${reportPath}`);

  if (results.summary.productsWithDuplicateImages > 0) {
    console.log('\n⚠️  Action: Run "node scripts/remove-gallery-duplicates-from-description.js" to remove duplicate images');
  }
}

main();
