const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Helper to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Parse date DD/MM/YYYY to YYYY-MM-DD
function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return new Date().toISOString().split('T')[0];
}

// Download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// Fetch HTML
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHTML(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// Extract content from HTML
function extractContent(html) {
  // Find entry content
  const entryMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  if (!entryMatch) return { content: '', images: [] };
  
  let content = entryMatch[1];
  const images = [];
  
  // Extract all images
  const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    images.push(imgMatch[1]);
  }
  
  // Clean up content - remove scripts and styles
  content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  return { content, images };
}

// Main processing
async function processArticles(articlesData) {
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'news');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const processedArticles = [];

  for (let i = 0; i < articlesData.length; i++) {
    const article = articlesData[i];
    console.log(`\nProcessing ${i + 1}/${articlesData.length}: ${article.title}`);

    try {
      // Fetch full content
      const html = await fetchHTML(article.url);
      const { content, images } = extractContent(html);

      // Collect all images
      const allImages = [article.imgUrl, ...images].filter(Boolean);

      // Download images
      const downloadedImages = [];
      for (let j = 0; j < allImages.length; j++) {
        const imgUrl = allImages[j];
        if (!imgUrl || !imgUrl.startsWith('http')) continue;

        try {
          const urlPath = new URL(imgUrl).pathname;
          const ext = path.extname(urlPath) || '.jpg';
          const filename = `${generateSlug(article.title)}-${i}-${j}${ext}`;
          const filepath = path.join(imagesDir, filename);

          console.log(`  Downloading image ${j + 1}/${allImages.length}`);
          await downloadImage(imgUrl, filepath);
          downloadedImages.push(`/images/news/${filename}`);
          
          // Small delay
          await new Promise(r => setTimeout(r, 500));
        } catch (error) {
          console.error(`  Failed: ${imgUrl}`);
        }
      }

      const featuredImage = downloadedImages[0] || '/images/place-holder/placeholder.jpg';

      // Update content to use local image paths
      let updatedContent = content;
      for (let j = 0; j < images.length && j < downloadedImages.length; j++) {
        const originalUrl = images[j];
        const localPath = downloadedImages[j] || downloadedImages[0];
        if (originalUrl && localPath) {
          updatedContent = updatedContent.replace(
            new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
            localPath
          );
        }
      }

      processedArticles.push({
        id: `news-${i + 1}`,
        title: article.title,
        slug: generateSlug(article.title),
        excerpt: article.excerpt || article.title.substring(0, 200),
        content: updatedContent || article.excerpt || '',
        image: featuredImage,
        date: parseDate(article.date),
        author: article.author || 'Admin',
        category: 'Tin tức'
      });

      // Delay between articles
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      console.error(`Error processing ${article.title}:`, error.message);
    }
  }

  return processedArticles;
}

// Update data.ts
function updateDataFile(processedArticles) {
  const dataFilePath = path.join(__dirname, '..', 'lib', 'data.ts');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  const postsStart = dataContent.indexOf('export const posts: Post[] = [');
  const postsEnd = dataContent.indexOf('];', postsStart) + 2;

  const newPostsArray = `export const posts: Post[] = [\n${processedArticles.map(post => {
    return `  {\n    id: "${post.id}",\n    title: ${JSON.stringify(post.title)},\n    slug: "${post.slug}",\n    excerpt: ${JSON.stringify(post.excerpt)},\n    content: ${JSON.stringify(post.content)},\n    image: "${post.image}",\n    date: "${post.date}",\n    author: "${post.author}",\n    category: "${post.category}"\n  }`;
  }).join(',\n')}\n];`;

  dataContent = dataContent.substring(0, postsStart) + newPostsArray + dataContent.substring(postsEnd);
  fs.writeFileSync(dataFilePath, dataContent, 'utf8');
  console.log(`\n✅ Updated lib/data.ts with ${processedArticles.length} articles`);
}

// Read articles from JSON file
const articlesJsonPath = path.join(__dirname, 'articles-data.json');
if (!fs.existsSync(articlesJsonPath)) {
  console.error('Please create articles-data.json first with all article URLs');
  process.exit(1);
}

const articlesData = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));
console.log(`Found ${articlesData.length} articles to process`);

processArticles(articlesData)
  .then(processedArticles => {
    updateDataFile(processedArticles);
    console.log('\n✅ Done!');
  })
  .catch(console.error);

