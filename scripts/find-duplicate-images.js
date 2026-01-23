/**
 * Script to find duplicate images used across multiple products
 * Run: node scripts/find-duplicate-images.js
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

function findDuplicates() {
  // Map: image URL -> list of products using it
  const imageUsage = new Map();

  for (const product of products) {
    const fullDescription = product.fullDescription || '';
    const description = product.description || '';

    // Get images from description
    const descImages = extractImageUrls(fullDescription);
    const shortDescImages = extractImageUrls(description);

    // Also check gallery images
    const galleryImages = product.images || [];

    const allImages = [...new Set([...descImages, ...shortDescImages, ...galleryImages])];

    for (const imageUrl of allImages) {
      // Normalize the URL
      const normalizedUrl = imageUrl.trim();

      if (!imageUsage.has(normalizedUrl)) {
        imageUsage.set(normalizedUrl, []);
      }
      imageUsage.get(normalizedUrl).push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        pageUrl: `/san-pham/${product.categorySlug}/${product.slug}`
      });
    }
  }

  // Find duplicates (images used by more than one product)
  const duplicates = [];
  for (const [imageUrl, products] of imageUsage.entries()) {
    if (products.length > 1) {
      duplicates.push({
        imageUrl,
        usedByCount: products.length,
        products
      });
    }
  }

  // Sort by usage count (most duplicated first)
  duplicates.sort((a, b) => b.usedByCount - a.usedByCount);

  return duplicates;
}

function main() {
  console.log('🔍 Finding duplicate images used across multiple products...\n');

  const duplicates = findDuplicates();

  console.log('='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total duplicate images found: ${duplicates.length}`);

  if (duplicates.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('🔄 DUPLICATE IMAGES:');
    console.log('='.repeat(80));

    for (const dup of duplicates) {
      console.log(`\n🖼️  Image: ${dup.imageUrl}`);
      console.log(`   Used by ${dup.usedByCount} products:`);

      for (const product of dup.products) {
        console.log(`     - [${product.id}] ${product.name}`);
        console.log(`       ${product.pageUrl}`);
      }
    }

    console.log('\n⚠️  Action needed: Each product should have unique images!');
    console.log('   Review the products listed above and replace duplicate images.');
  } else {
    console.log('\n✅ No duplicate images found - each product has unique images!');
  }

  // Save report
  const reportPath = path.join(__dirname, 'duplicate-images-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(duplicates, null, 2));
  console.log(`\n📁 Report saved to: ${reportPath}`);
}

main();
