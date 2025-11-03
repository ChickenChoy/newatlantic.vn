const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Import products data
const dataPath = path.join(__dirname, '../lib/data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf-8');

// Extract all image URLs from data.ts
function extractImageUrls() {
  const imageUrls = new Map(); // Map<productSlug, Set<imageUrl>>
  
  // Match product objects
  const productMatches = dataContent.matchAll(/{\s*id:\s*"(\d+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?images:\s*\[([\s\S]*?)\]/g);
  
  for (const match of productMatches) {
    const productId = match[1];
    const productSlug = match[2];
    const imagesStr = match[3];
    
    // Extract image paths
    const imagePaths = imagesStr.match(/["']([^"']+)["']/g);
    if (imagePaths) {
      const urls = new Set();
      imagePaths.forEach(p => {
        const cleanPath = p.replace(/["']/g, '');
        if (cleanPath.startsWith('/images/')) {
          urls.add(cleanPath);
        }
      });
      
      if (urls.size > 0) {
        imageUrls.set(productSlug, urls);
      }
    }
  }
  
  return imageUrls;
}

// Check if URL exists (HEAD request)
function checkUrlExists(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;

    const options = new URL(url);
    options.method = 'HEAD';

    const req = protocol.request(options, (response) => {
      resolve(response.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const file = fs.createWriteStream(filepath);
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Main function
async function main() {
  console.log('🚀 Starting image download...\n');
  
  const imageUrls = extractImageUrls();
  console.log(`📊 Found ${imageUrls.size} products with images\n`);
  
  let totalImages = 0;
  let downloadedImages = 0;
  let skippedImages = 0;
  let failedImages = 0;
  
  // Count total images
  for (const [slug, urls] of imageUrls) {
    totalImages += urls.size;
  }
  
  console.log(`📦 Total images to process: ${totalImages}\n`);
  
  // WordPress base URL
  const WORDPRESS_URL = 'https://newatlantic.vn';

  // Try to fetch actual image URLs from WordPress
  console.log('🔍 Attempting to find actual image URLs from WordPress...\n');

  for (const [productSlug, urls] of imageUrls) {
    console.log(`\n📁 Processing product: ${productSlug}`);
    console.log(`   Images: ${urls.size}`);

    // Create product folder
    const productFolder = path.join(__dirname, '../public/images/products', productSlug);
    if (!fs.existsSync(productFolder)) {
      fs.mkdirSync(productFolder, { recursive: true });
      console.log(`   ✅ Created folder: ${productFolder}`);
    }

    for (const imagePath of urls) {
      const filename = path.basename(imagePath);
      const localPath = path.join(productFolder, filename);

      // Check if file already exists
      if (fs.existsSync(localPath)) {
        console.log(`   ⏭️  Skipped (exists): ${filename}`);
        skippedImages++;
        continue;
      }

      // Try multiple possible URLs - check all months in 2024 and 2025
      const possibleUrls = [
        `${WORDPRESS_URL}${imagePath}`, // Original path
      ];

      // Add all possible year/month combinations
      const years = ['2025', '2024', '2023'];
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

      for (const year of years) {
        for (const month of months) {
          possibleUrls.push(`${WORDPRESS_URL}/wp-content/uploads/${year}/${month}/${filename}`);
        }
      }

      // Also try without month
      possibleUrls.push(`${WORDPRESS_URL}/wp-content/uploads/${filename}`);

      let downloaded = false;
      for (const imageUrl of possibleUrls) {
        // Check if URL exists first
        const exists = await checkUrlExists(imageUrl);
        if (!exists) {
          continue;
        }

        try {
          await downloadImage(imageUrl, localPath);
          console.log(`   ✅ Downloaded: ${filename}`);
          downloadedImages++;
          downloaded = true;

          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 50));
          break;
        } catch (error) {
          // Try next URL
          continue;
        }
      }

      if (!downloaded) {
        console.log(`   ❌ Failed: ${filename} - Not found in any location`);
        failedImages++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 DOWNLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images:      ${totalImages}`);
  console.log(`✅ Downloaded:     ${downloadedImages}`);
  console.log(`⏭️  Skipped:        ${skippedImages}`);
  console.log(`❌ Failed:         ${failedImages}`);
  console.log('='.repeat(60));
  
  if (failedImages > 0) {
    console.log('\n⚠️  Some images failed to download. Please check the URLs.');
  }
  
  console.log('\n✨ Done!');
}

main().catch(console.error);

