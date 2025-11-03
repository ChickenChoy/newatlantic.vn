const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Helper function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Helper function to fetch HTML
async function fetchHTML(url) {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

// Helper function to extract text content from HTML (simple regex)
function extractTextFromHTML(html, selector) {
  // Simple extraction - in production use cheerio or similar
  const regex = new RegExp(`<${selector}[^>]*>([\\s\\S]*?)</${selector}>`, 'i');
  const match = html.match(regex);
  if (match) {
    return match[1].replace(/<[^>]+>/g, '').trim();
  }
  return '';
}

// Helper function to generate slug from Vietnamese text
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to parse date from DD/MM/YYYY format
function parseDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const [day, month, year] = dateStr.split('/');
  if (day && month && year) {
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return new Date().toISOString().split('T')[0];
}

// Main scraping function
async function scrapeAllNews() {
  const baseUrl = 'https://newatlantic.vn/tin-tuc-su-kien/';
  const allArticles = [];
  let page = 1;
  let hasMore = true;

  console.log('Starting to scrape news articles...');

  while (hasMore) {
    const url = page === 1 ? baseUrl : `${baseUrl}page/${page}/`;
    console.log(`Scraping page ${page}: ${url}`);

    try {
      const html = await fetchHTML(url);
      
      // Extract article links using regex (simple approach)
      const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/gi;
      const titleRegex = /<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>\s*<\/h2>/i;
      const dateRegex = /<time[^>]*>(.*?)<\/time>/i;
      const excerptRegex = /<p[^>]*>(.*?)<\/p>/i;
      const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/i;
      const authorRegex = /<a[^>]*href="[^"]*\/author\/[^"]*"[^>]*>(.*?)<\/a>/i;

      let match;
      let foundArticles = false;

      while ((match = articleRegex.exec(html)) !== null) {
        const articleHTML = match[1];
        const titleMatch = articleHTML.match(titleRegex);
        const dateMatch = articleHTML.match(dateRegex);
        const excerptMatch = articleHTML.match(excerptRegex);
        const imgMatch = articleHTML.match(imgRegex);
        const authorMatch = articleHTML.match(authorRegex);

        if (titleMatch && titleMatch[2]) {
          foundArticles = true;
          const articleUrl = titleMatch[1].startsWith('http') 
            ? titleMatch[1] 
            : `https://newatlantic.vn${titleMatch[1]}`;
          
          allArticles.push({
            title: titleMatch[2].trim().replace(/<[^>]+>/g, ''),
            url: articleUrl,
            date: dateMatch ? dateMatch[1].trim() : '',
            excerpt: excerptMatch ? excerptMatch[1].trim().replace(/<[^>]+>/g, '') : '',
            image: imgMatch ? imgMatch[1] : '',
            author: authorMatch ? authorMatch[1].trim() : ''
          });
        }
      }

      // Check for next page
      const nextPageRegex = /<a[^>]*href="([^"]*\/page\/\d+\/)"[^>]*>.*?<\/a>/gi;
      const nextPageMatches = [...html.matchAll(nextPageRegex)];
      const nextPageNum = nextPageMatches.length > 0 
        ? Math.max(...nextPageMatches.map(m => {
            const numMatch = m[1].match(/\/page\/(\d+)\//);
            return numMatch ? parseInt(numMatch[1]) : 0;
          }))
        : 0;

      hasMore = foundArticles && nextPageNum > page;
      page++;

      if (!foundArticles) {
        hasMore = false;
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error scraping page ${page}:`, error.message);
      hasMore = false;
    }
  }

  console.log(`Found ${allArticles.length} articles total`);
  return allArticles;
}

// Fetch full content for each article
async function fetchArticleContent(url) {
  try {
    const html = await fetchHTML(url);
    
    // Extract main content
    const contentRegex = /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i;
    const match = html.match(contentRegex);
    
    if (match) {
      let content = match[1];
      // Extract all images from content
      const imgRegex = /<img[^>]*src="([^"]+)"[^>]*>/gi;
      const images = [];
      let imgMatch;
      while ((imgMatch = imgRegex.exec(content)) !== null) {
        images.push(imgMatch[1]);
      }
      
      return { content, images };
    }
    
    return { content: '', images: [] };
  } catch (error) {
    console.error(`Error fetching content for ${url}:`, error.message);
    return { content: '', images: [] };
  }
}

// Main execution
async function main() {
  // Create images directory if it doesn't exist
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'news');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Scrape all articles
  const articles = await scrapeAllNews();

  // Process each article
  const processedArticles = [];
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`\nProcessing article ${i + 1}/${articles.length}: ${article.title}`);
    
    // Fetch full content
    const { content, images } = await fetchArticleContent(article.url);
    
    // Collect all images (featured + content images)
    const allImages = [];
    if (article.image) {
      allImages.push(article.image);
    }
    allImages.push(...images);

    // Download images
    const downloadedImages = [];
    for (let j = 0; j < allImages.length; j++) {
      const imgUrl = allImages[j];
      if (!imgUrl || !imgUrl.startsWith('http')) continue;

      try {
        const urlPath = new URL(imgUrl).pathname;
        const filename = path.basename(urlPath) || `image-${Date.now()}-${j}.jpg`;
        const filepath = path.join(imagesDir, filename);
        
        console.log(`  Downloading image ${j + 1}/${allImages.length}: ${filename}`);
        await downloadImage(imgUrl, filepath);
        downloadedImages.push(`/images/news/${filename}`);
      } catch (error) {
        console.error(`  Failed to download image: ${imgUrl}`, error.message);
      }
    }

    // Use first downloaded image as featured image
    const featuredImage = downloadedImages[0] || article.image || '/images/place-holder/placeholder.jpg';

    // Generate slug and ID
    const slug = generateSlug(article.title);
    const id = `news-${i + 1}`;

    // Update content images to use local paths
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
      id,
      title: article.title,
      slug,
      excerpt: article.excerpt.substring(0, 200) || article.title.substring(0, 200),
      content: updatedContent || article.excerpt || '',
      image: featuredImage,
      date: parseDate(article.date),
      author: article.author || 'Admin',
      category: 'Tin tức'
    });

    // Delay between articles
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Read existing data.ts
  const dataFilePath = path.join(__dirname, '..', 'lib', 'data.ts');
  let dataContent = fs.readFileSync(dataFilePath, 'utf8');

  // Find posts array and replace it
  const postsStart = dataContent.indexOf('export const posts: Post[] = [');
  const postsEnd = dataContent.indexOf('];', postsStart) + 2;

  // Generate new posts array
  const newPostsArray = `export const posts: Post[] = [\n${processedArticles.map(post => {
    const content = post.content.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/"/g, '\\"');
    return `  {\n    id: "${post.id}",\n    title: ${JSON.stringify(post.title)},\n    slug: "${post.slug}",\n    excerpt: ${JSON.stringify(post.excerpt)},\n    content: ${JSON.stringify(post.content)},\n    image: "${post.image}",\n    date: "${post.date}",\n    author: "${post.author}",\n    category: "${post.category}"\n  }`;
  }).join(',\n')}\n];`;

  // Replace posts array
  dataContent = dataContent.substring(0, postsStart) + newPostsArray + dataContent.substring(postsEnd);

  // Write back to file
  fs.writeFileSync(dataFilePath, dataContent, 'utf8');
  console.log(`\n✅ Successfully updated ${processedArticles.length} articles in lib/data.ts`);
  console.log(`📁 Images saved to public/images/news/`);
}

main().catch(console.error);

