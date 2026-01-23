/**
 * Script to find images in product descriptions that don't match the product
 * Run: node scripts/find-mismatched-images.js
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

// Get expected folder name for a product
function getExpectedFolder(product) {
  // The folder should be based on the product slug
  return product.slug;
}

// Check if an image URL matches the expected product folder
function doesImageMatchProduct(imageUrl, product) {
  const expectedFolder = getExpectedFolder(product);

  // External URLs don't match local product folders
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return { matches: false, reason: 'external_url', url: imageUrl };
  }

  // Data URLs are always valid
  if (imageUrl.startsWith('data:')) {
    return { matches: true, reason: 'data_url' };
  }

  // Check if local path contains the product's folder
  if (imageUrl.includes(`/images/products/${expectedFolder}/`)) {
    return { matches: true, reason: 'correct_folder' };
  }

  // Check by category slug as fallback
  if (product.categorySlug && imageUrl.includes(`/images/products/${product.categorySlug}/`)) {
    return { matches: false, reason: 'category_folder_not_product', url: imageUrl };
  }

  // Image is in a different product's folder
  const folderMatch = imageUrl.match(/\/images\/products\/([^/]+)\//);
  if (folderMatch) {
    return {
      matches: false,
      reason: 'different_product_folder',
      url: imageUrl,
      foundFolder: folderMatch[1],
      expectedFolder
    };
  }

  // Unknown path structure
  return { matches: false, reason: 'unknown_structure', url: imageUrl };
}

function analyzeProducts() {
  const results = {
    productsWithMismatchedImages: [],
    productsWithExternalImages: [],
    summary: {
      totalProducts: products.length,
      productsWithMismatches: 0,
      productsWithExternalUrls: 0,
      totalMismatchedImages: 0,
      totalExternalImages: 0
    }
  };

  for (const product of products) {
    const fullDescription = product.fullDescription || '';
    const description = product.description || '';

    // Extract all images from descriptions
    const fullDescImages = extractImageUrls(fullDescription);
    const descImages = extractImageUrls(description);
    const allImages = [...new Set([...fullDescImages, ...descImages])];

    if (allImages.length === 0) continue;

    const mismatched = [];
    const external = [];

    for (const imageUrl of allImages) {
      const result = doesImageMatchProduct(imageUrl, product);

      if (!result.matches) {
        if (result.reason === 'external_url') {
          external.push({
            url: imageUrl,
            reason: result.reason
          });
        } else {
          mismatched.push({
            url: imageUrl,
            reason: result.reason,
            foundFolder: result.foundFolder,
            expectedFolder: result.expectedFolder
          });
        }
      }
    }

    if (mismatched.length > 0) {
      results.productsWithMismatchedImages.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        categorySlug: product.categorySlug,
        expectedFolder: getExpectedFolder(product),
        pageUrl: `/san-pham/${product.categorySlug}/${product.slug}`,
        totalImagesInDesc: allImages.length,
        mismatchedImages: mismatched
      });
      results.summary.productsWithMismatches++;
      results.summary.totalMismatchedImages += mismatched.length;
    }

    if (external.length > 0) {
      results.productsWithExternalImages.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        pageUrl: `/san-pham/${product.categorySlug}/${product.slug}`,
        externalImages: external
      });
      results.summary.productsWithExternalUrls++;
      results.summary.totalExternalImages += external.length;
    }
  }

  return results;
}

function main() {
  console.log('🔍 Analyzing product descriptions for mismatched images...\n');

  const results = analyzeProducts();

  console.log('='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total products: ${results.summary.totalProducts}`);
  console.log(`Products with mismatched images: ${results.summary.productsWithMismatches}`);
  console.log(`Products with external URLs: ${results.summary.productsWithExternalUrls}`);
  console.log(`Total mismatched images: ${results.summary.totalMismatchedImages}`);
  console.log(`Total external images: ${results.summary.totalExternalImages}`);

  if (results.productsWithMismatchedImages.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('❌ PRODUCTS WITH MISMATCHED IMAGES (images from other products):');
    console.log('='.repeat(80));

    for (const product of results.productsWithMismatchedImages) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Expected folder: ${product.expectedFolder}`);
      console.log(`   Page URL: ${product.pageUrl}`);
      console.log(`   Mismatched images (${product.mismatchedImages.length}):`);

      for (const img of product.mismatchedImages) {
        console.log(`     - ${img.url}`);
        if (img.foundFolder) {
          console.log(`       Found in folder: ${img.foundFolder}`);
          console.log(`       Expected folder: ${img.expectedFolder}`);
        }
        console.log(`       Reason: ${img.reason}`);
      }
    }
  }

  if (results.productsWithExternalImages.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('🌐 PRODUCTS WITH EXTERNAL IMAGE URLs:');
    console.log('='.repeat(80));

    for (const product of results.productsWithExternalImages) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Page URL: ${product.pageUrl}`);
      console.log(`   External images (${product.externalImages.length}):`);

      for (const img of product.externalImages) {
        console.log(`     - ${img.url}`);
      }
    }
  }

  // Save report
  const reportPath = path.join(__dirname, 'mismatched-images-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Full report saved to: ${reportPath}`);

  if (results.summary.productsWithMismatches > 0 || results.summary.productsWithExternalUrls > 0) {
    console.log('\n⚠️  Action needed: Review and fix the images listed above');
    console.log('   Options:');
    console.log('   1. Remove images from description (show only gallery images)');
    console.log('   2. Replace with correct product images');
    console.log('   3. Download external images and update URLs to local paths');
  } else {
    console.log('\n✅ All images in product descriptions match their products!');
  }
}

main();
