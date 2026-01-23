/**
 * Script to fix broken images in product descriptions
 * Uses existing local images to replace broken WordPress URLs
 * Run: node scripts/fix-broken-images.js
 */

const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Read the broken images report
const reportPath = path.join(__dirname, 'broken-images-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

// Scan available local images
const publicImagesPath = path.join(__dirname, '..', 'public', 'images', 'products');

function getLocalImages(productSlug) {
  const productPath = path.join(publicImagesPath, productSlug);
  if (!fs.existsSync(productPath)) {
    return [];
  }
  return fs.readdirSync(productPath)
    .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
    .map(file => `/images/products/${productSlug}/${file}`);
}

// Map product slugs to their local images
const localImagesMap = {};
if (fs.existsSync(publicImagesPath)) {
  const productDirs = fs.readdirSync(publicImagesPath);
  for (const dir of productDirs) {
    const dirPath = path.join(publicImagesPath, dir);
    if (fs.statSync(dirPath).isDirectory()) {
      localImagesMap[dir] = getLocalImages(dir);
    }
  }
}

console.log('📁 Available product image folders:', Object.keys(localImagesMap).length);

// Products with broken images and their mappings
const brokenProducts = report.brokenImages;

console.log('\n🔧 Processing broken images...\n');

let fixedCount = 0;
let removedCount = 0;

for (const brokenProduct of brokenProducts) {
  const productIndex = products.findIndex(p => p.id === brokenProduct.id);
  if (productIndex === -1) {
    console.log(`❌ Product not found: ${brokenProduct.name}`);
    continue;
  }

  const product = products[productIndex];
  const slug = product.slug;
  const localImages = localImagesMap[slug] || [];

  console.log(`\n📦 ${product.name}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Local images available: ${localImages.length}`);

  // Get description and fullDescription
  let description = product.description || '';
  let fullDescription = product.fullDescription || '';

  // Track changes
  let descChanged = false;
  let fullDescChanged = false;

  for (const brokenImg of brokenProduct.brokenImages) {
    const brokenUrl = brokenImg.url;
    console.log(`   🔍 Broken: ${brokenUrl}`);

    // Try to find a matching local image based on filename
    const brokenFilename = path.basename(brokenUrl).toLowerCase();
    const baseName = brokenFilename.replace(/-\d+x\d+/g, '').replace(/\.[^.]+$/, '');

    // Look for a similar image in local images
    let replacement = null;

    for (const localImg of localImages) {
      const localFilename = path.basename(localImg).toLowerCase();
      const localBaseName = localFilename.replace(/\.[^.]+$/, '');

      // Check for exact match or similar name
      if (localFilename === brokenFilename ||
          localBaseName.includes(baseName) ||
          baseName.includes(localBaseName)) {
        replacement = localImg;
        break;
      }
    }

    // If no match found, use first available local image as replacement
    // Or remove the img tag if no local images available
    if (!replacement && localImages.length > 0) {
      // Use first available image that hasn't been used yet
      replacement = localImages[0];
      console.log(`   ⚠️  No exact match, using: ${replacement}`);
    }

    if (replacement) {
      // Replace the broken URL with local path
      if (description.includes(brokenUrl)) {
        description = description.replace(new RegExp(escapeRegExp(brokenUrl), 'g'), replacement);
        descChanged = true;
        console.log(`   ✅ Replaced in description with: ${replacement}`);
        fixedCount++;
      }
      if (fullDescription.includes(brokenUrl)) {
        fullDescription = fullDescription.replace(new RegExp(escapeRegExp(brokenUrl), 'g'), replacement);
        fullDescChanged = true;
        console.log(`   ✅ Replaced in fullDescription with: ${replacement}`);
        fixedCount++;
      }
    } else {
      // Remove the entire img tag if no replacement available
      console.log(`   🗑️  No local images available, removing img tag`);

      const imgTagRegex = new RegExp(`<img[^>]*src=["']${escapeRegExp(brokenUrl)}["'][^>]*>`, 'gi');

      if (description.match(imgTagRegex)) {
        description = description.replace(imgTagRegex, '');
        descChanged = true;
        removedCount++;
        console.log(`   🗑️  Removed from description`);
      }
      if (fullDescription.match(imgTagRegex)) {
        fullDescription = fullDescription.replace(imgTagRegex, '');
        fullDescChanged = true;
        removedCount++;
        console.log(`   🗑️  Removed from fullDescription`);
      }
    }
  }

  // Update product if changes were made
  if (descChanged) {
    products[productIndex].description = description;
  }
  if (fullDescChanged) {
    products[productIndex].fullDescription = fullDescription;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Save updated products.json
const backupPath = path.join(__dirname, '..', 'data', 'products.backup.json');
fs.copyFileSync(productsPath, backupPath);
console.log(`\n💾 Backup saved to: ${backupPath}`);

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`✅ Updated products.json saved`);

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`Total products processed: ${brokenProducts.length}`);
console.log(`Images replaced: ${fixedCount}`);
console.log(`Img tags removed (no replacement): ${removedCount}`);
console.log('\n✅ Done! Run the check script again to verify.');
