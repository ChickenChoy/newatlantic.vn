/**
 * Script to remove backgrounds from product images using Replicate API
 * https://replicate.com/cjwbw/rembg
 */

const Replicate = require('replicate');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Download file from URL
 */
async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(outputPath);
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(outputPath);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

/**
 * Remove background from image
 */
async function removeBackground(imagePath) {
  try {
    console.log(`Processing: ${imagePath}`);
    
    // Read file as buffer
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Run the model - Replicate accepts buffers, file paths, or URLs
    const output = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      {
        input: {
          image: imageBuffer
        }
      }
    );
    
    console.log(`✓ Background removed successfully`);
    return output;
    
  } catch (error) {
    console.error(`✗ Error processing ${imagePath}:`, error.message);
    throw error;
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(inputDir, outputDir) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Get all image files
  const files = fs.readdirSync(inputDir)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
  
  console.log(`Found ${files.length} images to process\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const file of files) {
    try {
      const inputPath = path.join(inputDir, file);
      const outputFileName = file.replace(/\.(jpg|jpeg|webp)$/i, '.png');
      const outputPath = path.join(outputDir, outputFileName);
      
      // Skip if already processed
      if (fs.existsSync(outputPath)) {
        console.log(`⊙ Skipping ${file} (already processed)\n`);
        continue;
      }
      
      // Remove background
      const outputUrl = await removeBackground(inputPath);
      
      // Download the result
      console.log(`↓ Downloading result...`);
      await downloadFile(outputUrl, outputPath);
      console.log(`✓ Saved to: ${outputPath}\n`);
      
      successCount++;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`✗ Failed to process ${file}\n`);
      failCount++;
    }
  }
  
  console.log(`\n========== Summary ==========`);
  console.log(`Total: ${files.length}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`=============================\n`);
}

/**
 * Process a single image
 */
async function processSingleImage(inputPath, outputPath) {
  try {
    console.log(`Processing single image: ${inputPath}\n`);
    
    // Remove background
    const outputUrl = await removeBackground(inputPath);
    
    // Download the result
    console.log(`↓ Downloading result...`);
    await downloadFile(outputUrl, outputPath);
    console.log(`✓ Saved to: ${outputPath}\n`);
    
  } catch (error) {
    console.error(`✗ Failed to process image:`, error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  // Check for API token
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error('❌ Error: REPLICATE_API_TOKEN environment variable is not set');
    console.error('');
    console.error('Get your API token from: https://replicate.com/account/api-tokens');
    console.error('Then set it: export REPLICATE_API_TOKEN=your_token_here');
    console.error('');
    process.exit(1);
  }
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  Process directory: node scripts/remove-backgrounds.js <input-dir> [output-dir]');
    console.log('  Process single file: node scripts/remove-backgrounds.js <input-file> <output-file>');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/remove-backgrounds.js public/images/products public/images/products-nobg');
    console.log('  node scripts/remove-backgrounds.js public/images/product.jpg public/images/product-nobg.png');
    console.log('');
    process.exit(1);
  }
  
  const inputPath = args[0];
  const outputPath = args[1] || inputPath + '-nobg';
  
  // Check if input is directory or file
  if (fs.existsSync(inputPath) && fs.statSync(inputPath).isDirectory()) {
    await processDirectory(inputPath, outputPath);
  } else if (fs.existsSync(inputPath) && fs.statSync(inputPath).isFile()) {
    await processSingleImage(inputPath, outputPath);
  } else {
    console.error(`❌ Error: Input path does not exist: ${inputPath}`);
    process.exit(1);
  }
}

// Run
main().catch(console.error);

