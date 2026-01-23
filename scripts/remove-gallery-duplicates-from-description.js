/**
 * Script to remove images from fullDescription that duplicate gallery images
 * Run: node scripts/remove-gallery-duplicates-from-description.js
 */

const fs = require('fs');
const path = require('path');

// Read products.json
const productsPath = path.join(__dirname, '..', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

console.log(`\n📦 Total products: ${products.length}\n`);

// Normalize URL for comparison
function normalizeImageUrl(url) {
  return url.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1').toLowerCase();
}

// Check if image URL matches any gallery image
function isGalleryImage(imageUrl, galleryImages) {
  const normalizedUrl = normalizeImageUrl(imageUrl);
  const normalizedGallery = galleryImages.map(normalizeImageUrl);

  return normalizedGallery.some(
    galleryImg => galleryImg === normalizedUrl ||
      galleryImg.includes(path.basename(normalizedUrl)) ||
      normalizedUrl.includes(path.basename(galleryImg))
  );
}

// Remove img tags that match gallery images
function removeGalleryImagesFromHtml(html, galleryImages) {
  if (!html || !galleryImages || galleryImages.length === 0) {
    return { html, removedCount: 0 };
  }

  let removedCount = 0;
  let modifiedHtml = html;

  // Match img tags and check each one
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*\/?>/gi;

  modifiedHtml = html.replace(imgRegex, (match, src) => {
    if (isGalleryImage(src, galleryImages)) {
      removedCount++;
      console.log(`     Removed: ${src}`);
      return ''; // Remove the entire img tag
    }
    return match; // Keep non-gallery images
  });

  // Clean up empty paragraphs and extra whitespace left behind
  modifiedHtml = modifiedHtml
    .replace(/<p[^>]*>\s*<\/p>/gi, '') // Remove empty <p> tags
    .replace(/<td[^>]*>\s*<\/td>/gi, '<td></td>') // Clean empty table cells
    .replace(/\n\s*\n\s*\n/g, '\n\n'); // Remove excessive newlines

  return { html: modifiedHtml, removedCount };
}

function processProducts() {
  let totalRemoved = 0;
  let productsModified = 0;

  for (const product of products) {
    if (!product.fullDescription || !product.images || product.images.length === 0) {
      continue;
    }

    console.log(`\n📦 Processing: ${product.name}`);

    const { html, removedCount } = removeGalleryImagesFromHtml(
      product.fullDescription,
      product.images
    );

    if (removedCount > 0) {
      product.fullDescription = html;
      totalRemoved += removedCount;
      productsModified++;
      console.log(`   ✅ Removed ${removedCount} duplicate image(s)`);
    } else {
      console.log(`   ℹ️  No duplicates found`);
    }
  }

  return { totalRemoved, productsModified };
}

function main() {
  console.log('🔧 Removing gallery duplicate images from fullDescription...\n');

  const { totalRemoved, productsModified } = processProducts();

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS');
  console.log('='.repeat(80));
  console.log(`Products modified: ${productsModified}`);
  console.log(`Total images removed: ${totalRemoved}`);

  if (totalRemoved > 0) {
    // Backup original file
    const backupPath = path.join(__dirname, '..', 'data', 'products.backup.json');
    const originalData = fs.readFileSync(productsPath, 'utf-8');
    fs.writeFileSync(backupPath, originalData);
    console.log(`\n📁 Backup saved to: ${backupPath}`);

    // Save updated products
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log(`✅ Updated products.json saved!`);
  } else {
    console.log('\nℹ️  No changes needed.');
  }
}

main();
