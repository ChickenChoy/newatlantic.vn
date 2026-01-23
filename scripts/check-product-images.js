/**
 * Script to check for missing or broken images in product descriptions
 * Run: node scripts/check-product-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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

// Check if URL is accessible
function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === 'https:' ? https : http;

      const req = protocol.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400
        });
      });

      req.on('error', (err) => {
        resolve({
          url,
          status: 0,
          ok: false,
          error: err.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url,
          status: 0,
          ok: false,
          error: 'Timeout'
        });
      });

      req.end();
    } catch (err) {
      resolve({
        url,
        status: 0,
        ok: false,
        error: err.message
      });
    }
  });
}

// Check local file exists
function checkLocalFile(url) {
  // Handle relative URLs starting with /
  if (url.startsWith('/')) {
    const localPath = path.join(__dirname, '..', 'public', url);
    const exists = fs.existsSync(localPath);
    return {
      url,
      status: exists ? 200 : 404,
      ok: exists,
      error: exists ? null : 'File not found locally'
    };
  }
  return null;
}

async function analyzeProducts() {
  const results = {
    noImagesInDescription: [],
    brokenImages: [],
    validImages: [],
    noDescription: []
  };

  let processedCount = 0;

  for (const product of products) {
    processedCount++;

    // Check if product has description or fullDescription
    const description = product.description || '';
    const fullDescription = product.fullDescription || '';

    if (!description && !fullDescription) {
      results.noDescription.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category
      });
      continue;
    }

    // Extract image URLs from both descriptions
    const descImages = extractImageUrls(description);
    const fullDescImages = extractImageUrls(fullDescription);
    const allImages = [...new Set([...descImages, ...fullDescImages])];

    if (allImages.length === 0) {
      // No images found in description - this is normal for many products
      continue;
    }

    // Check each image URL
    const brokenForProduct = [];

    for (const imgUrl of allImages) {
      // Check if it's a local file
      const localCheck = checkLocalFile(imgUrl);

      if (localCheck) {
        if (!localCheck.ok) {
          brokenForProduct.push(localCheck);
        }
      } else if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
        // Check remote URL
        const result = await checkUrl(imgUrl);
        if (!result.ok) {
          brokenForProduct.push(result);
        }
      } else if (imgUrl.startsWith('data:')) {
        // Data URL - always valid
        continue;
      } else {
        // Invalid URL format
        brokenForProduct.push({
          url: imgUrl,
          status: 0,
          ok: false,
          error: 'Invalid URL format'
        });
      }
    }

    if (brokenForProduct.length > 0) {
      results.brokenImages.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        categorySlug: product.categorySlug,
        totalImages: allImages.length,
        brokenImages: brokenForProduct
      });
    }

    // Progress indicator
    if (processedCount % 50 === 0) {
      console.log(`Processed ${processedCount}/${products.length} products...`);
    }
  }

  return results;
}

async function main() {
  console.log('🔍 Analyzing product descriptions for broken images...\n');

  const results = await analyzeProducts();

  console.log('\n' + '='.repeat(80));
  console.log('📊 ANALYSIS RESULTS');
  console.log('='.repeat(80));

  console.log(`\n📦 Total products analyzed: ${products.length}`);
  console.log(`❌ Products with broken images: ${results.brokenImages.length}`);
  console.log(`📝 Products without any description: ${results.noDescription.length}`);

  if (results.brokenImages.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('❌ PRODUCTS WITH BROKEN/MISSING IMAGES IN DESCRIPTION:');
    console.log('='.repeat(80));

    for (const product of results.brokenImages) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   URL: /san-pham/${product.categorySlug}/${product.slug}`);
      console.log(`   Total images in description: ${product.totalImages}`);
      console.log(`   Broken images (${product.brokenImages.length}):`);

      for (const img of product.brokenImages) {
        console.log(`     - ${img.url}`);
        console.log(`       Status: ${img.status}, Error: ${img.error || 'N/A'}`);
      }
    }
  }

  if (results.noDescription.length > 0 && results.noDescription.length <= 20) {
    console.log('\n' + '='.repeat(80));
    console.log('📝 PRODUCTS WITHOUT DESCRIPTION:');
    console.log('='.repeat(80));

    for (const product of results.noDescription) {
      console.log(`\n📦 ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Category: ${product.category}`);
    }
  }

  // Save results to JSON file
  const reportPath = path.join(__dirname, 'broken-images-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Full report saved to: ${reportPath}`);

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📋 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total products: ${products.length}`);
  console.log(`Products with broken images: ${results.brokenImages.length}`);
  console.log(`Products without description: ${results.noDescription.length}`);

  if (results.brokenImages.length > 0) {
    console.log('\n⚠️  Action needed: Fix the broken image URLs listed above');
  } else {
    console.log('\n✅ All images in product descriptions are valid!');
  }
}

main().catch(console.error);
