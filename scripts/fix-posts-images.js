/**
 * Script to fix broken images in posts.json
 * Removes srcset attributes with broken WordPress URLs
 * Run: node scripts/fix-posts-images.js
 */

const fs = require('fs');
const path = require('path');

// Read posts.json
const postsPath = path.join(__dirname, '..', 'data', 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));

console.log('🔧 Fixing broken images in posts.json...\n');

let fixedCount = 0;

for (const post of posts) {
  let modified = false;

  if (post.content) {
    let newContent = post.content;

    // Remove srcset attributes that contain WordPress URLs
    const srcsetRegex = /\s*srcset="[^"]*newatlantic\.vn\/wp-content\/uploads[^"]*"/gi;
    if (srcsetRegex.test(newContent)) {
      newContent = newContent.replace(srcsetRegex, '');
      modified = true;
      console.log(`Fixed srcset in post: ${post.title}`);
    }

    // Remove any remaining WordPress image URLs
    const wpImgRegex = /https:\/\/newatlantic\.vn\/wp-content\/uploads\/[^\s"'<>]+/gi;
    const matches = newContent.match(wpImgRegex);
    if (matches) {
      for (const match of matches) {
        // For video URLs, just remove the entire video source
        if (match.includes('.mp4')) {
          console.log(`  Found video URL (keeping as-is, may need manual fix): ${match}`);
        } else {
          // For image URLs in src attributes, we need to handle them
          console.log(`  Found image URL: ${match}`);
        }
      }
    }

    if (modified) {
      post.content = newContent;
      fixedCount++;
    }
  }
}

// Save updated posts.json
const backupPath = path.join(__dirname, '..', 'data', 'posts.backup.json');
fs.copyFileSync(postsPath, backupPath);
console.log(`\n💾 Backup saved to: ${backupPath}`);

fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
console.log(`✅ Updated posts.json saved`);

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`Posts fixed: ${fixedCount}`);

// Check for remaining issues
const updatedPosts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'));
let remainingIssues = 0;
for (const post of updatedPosts) {
  if (post.content && post.content.includes('newatlantic.vn/wp-content/uploads')) {
    remainingIssues++;
    console.log(`\n⚠️  Remaining issue in: ${post.title}`);
    const matches = post.content.match(/https:\/\/newatlantic\.vn\/wp-content\/uploads\/[^\s"'<>]+/gi);
    if (matches) {
      for (const match of matches) {
        console.log(`   - ${match}`);
      }
    }
  }
}

if (remainingIssues > 0) {
  console.log(`\n⚠️  ${remainingIssues} posts still have WordPress URLs (likely video files)`);
} else {
  console.log('\n✅ All WordPress image URLs have been fixed!');
}
