const fs = require('fs');
const path = require('path');

// Read the data.ts file
const dataPath = path.join(__dirname, '../lib/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf-8');

console.log('🚀 Starting image path update...\n');

// Extract all products and update their image paths
const productMatches = [...dataContent.matchAll(/{\s*id:\s*"(\d+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?images:\s*\[([\s\S]*?)\]/g)];

let updatedCount = 0;
let skippedCount = 0;

for (const match of productMatches) {
  const productId = match[1];
  const productSlug = match[2];
  const currentMainImage = match[3];
  const currentImagesStr = match[4];
  
  // Extract current image filenames
  const currentImages = currentImagesStr.match(/["']([^"']+)["']/g);
  if (!currentImages) continue;
  
  const imageFilenames = currentImages.map(p => {
    const cleanPath = p.replace(/["']/g, '');
    return path.basename(cleanPath);
  });
  
  // Build new image paths
  const newMainImage = `/images/products/${productSlug}/${imageFilenames[0]}`;
  const newImages = imageFilenames.map(filename => `/images/products/${productSlug}/${filename}`);
  
  // Replace in content
  const oldImageLine = `image: "${currentMainImage}"`;
  const newImageLine = `image: "${newMainImage}"`;
  
  const oldImagesLine = `images: [${currentImagesStr}]`;
  const newImagesLine = `images: [${newImages.map(p => `"${p}"`).join(', ')}]`;
  
  if (dataContent.includes(oldImageLine)) {
    dataContent = dataContent.replace(oldImageLine, newImageLine);
    dataContent = dataContent.replace(oldImagesLine, newImagesLine);
    console.log(`✅ Updated: ${productSlug}`);
    updatedCount++;
  } else {
    console.log(`⏭️  Skipped: ${productSlug} (already updated or not found)`);
    skippedCount++;
  }
}

// Write back to file
fs.writeFileSync(dataPath, dataContent, 'utf-8');

console.log('\n' + '='.repeat(60));
console.log('📊 UPDATE SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Updated:     ${updatedCount}`);
console.log(`⏭️  Skipped:     ${skippedCount}`);
console.log('='.repeat(60));
console.log('\n✨ Done! Image paths have been updated in lib/data.ts');

