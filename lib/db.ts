import fs from 'fs';
import path from 'path';
import {
  Product, Category, Post,
  SiteSettings, SocialLink, OfficeLocation, FooterLink,
  GalleryImage, Catalog, HeroSlide, HomepageStat, PartnerLogo, PostCategory
} from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Admin settings interface
export interface AdminSettings {
  totpEnabled: boolean;
  totpSecret: string | null;
  totpVerified: boolean;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Generic read/write functions
function readJsonFile<T>(filename: string, defaultValue: T[]): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T[]): boolean {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Categories
export function getCategories(): Category[] {
  return readJsonFile<Category>('categories.json', []);
}

export function saveCategories(categories: Category[]): boolean {
  return writeJsonFile('categories.json', categories);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const categories = getCategories();
  return categories.find(c => c.slug === slug);
}

export function addCategory(category: Category): boolean {
  const categories = getCategories();
  categories.push(category);
  return saveCategories(categories);
}

export function updateCategory(id: string, updates: Partial<Category>): boolean {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return false;

  categories[index] = { ...categories[index], ...updates };
  return saveCategories(categories);
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;

  return saveCategories(filtered);
}

// Products
export function getProducts(): Product[] {
  return readJsonFile<Product>('products.json', []);
}

export function saveProducts(products: Product[]): boolean {
  return writeJsonFile('products.json', products);
}

export function getProductBySlug(slug: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const products = getProducts();
  return products.filter(p => p.category === categorySlug);
}

export function addProduct(product: Product): boolean {
  const products = getProducts();
  products.push(product);
  return saveProducts(products);
}

export function updateProduct(id: string, updates: Partial<Product>): boolean {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return false;

  products[index] = { ...products[index], ...updates };
  return saveProducts(products);
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;

  return saveProducts(filtered);
}

// Posts
export function getPosts(): Post[] {
  return readJsonFile<Post>('posts.json', []);
}

export function savePosts(posts: Post[]): boolean {
  return writeJsonFile('posts.json', posts);
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = getPosts();
  return posts.find(p => p.slug === slug);
}

export function getPostById(id: string): Post | undefined {
  const posts = getPosts();
  return posts.find(p => p.id === id);
}

export function addPost(post: Post): boolean {
  const posts = getPosts();
  posts.push(post);
  return savePosts(posts);
}

export function updatePost(id: string, updates: Partial<Post>): boolean {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return false;

  posts[index] = { ...posts[index], ...updates };
  return savePosts(posts);
}

export function deletePost(id: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) return false;

  return savePosts(filtered);
}

// Admin Settings
const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  totpEnabled: false,
  totpSecret: null,
  totpVerified: false,
};

export function getAdminSettings(): AdminSettings {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, 'admin-settings.json');

  if (!fs.existsSync(filePath)) {
    return { ...DEFAULT_ADMIN_SETTINGS };
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(data) };
  } catch {
    return { ...DEFAULT_ADMIN_SETTINGS };
  }
}

export function saveAdminSettings(settings: AdminSettings): boolean {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, 'admin-settings.json');

  try {
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing admin settings:', error);
    return false;
  }
}

// Initialize data from lib/data.ts if JSON files don't exist
export async function initializeDataIfNeeded() {
  ensureDataDir();

  const categoriesPath = path.join(DATA_DIR, 'categories.json');
  const productsPath = path.join(DATA_DIR, 'products.json');
  const postsPath = path.join(DATA_DIR, 'posts.json');

  // Check if any file is missing
  if (!fs.existsSync(categoriesPath) || !fs.existsSync(productsPath) || !fs.existsSync(postsPath)) {
    // Import from static data
    const { categories, products, posts } = await import('@/lib/data');

    if (!fs.existsSync(categoriesPath)) {
      writeJsonFile('categories.json', categories);
    }
    if (!fs.existsSync(productsPath)) {
      writeJsonFile('products.json', products);
    }
    if (!fs.existsSync(postsPath)) {
      writeJsonFile('posts.json', posts);
    }
  }
}

// ==================== CMS Data Functions ====================

// Generic read/write for single objects
function readJsonObject<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return defaultValue;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { ...defaultValue, ...JSON.parse(data) };
  } catch {
    return defaultValue;
  }
}

function writeJsonObject<T>(filename: string, data: T): boolean {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// ==================== Site Settings ====================

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'site-settings',
  companyName: 'NEW ATLANTIC',
  companySlogan: 'Tân Đại Tây Dương',
  companyDescription: 'Nhà phân phối hàng đầu các thương hiệu thiết bị công nghiệp: WILL-BURT, HIAB, SKYMARK tại Việt Nam',
  logo: '/images/logo/logo.png',
  phone: '+84 2838 733 686',
  email: 'info@newatlantic.vn',
  hotline: '',
  copyright: '© 2026 newatlantic.vn - Bản quyền thuộc về Công ty CP TM QT Tân Đại Tây Dương',
  socialLinks: [
    { id: 'fb', platform: 'facebook', url: 'https://www.facebook.com/aittandaitayduong', enabled: true }
  ]
};

export function getSiteSettings(): SiteSettings {
  return readJsonObject('site-settings.json', DEFAULT_SITE_SETTINGS);
}

export function saveSiteSettings(settings: SiteSettings): boolean {
  return writeJsonObject('site-settings.json', settings);
}

// ==================== Office Locations ====================

export function getOfficeLocations(): OfficeLocation[] {
  return readJsonFile<OfficeLocation>('office-locations.json', []);
}

export function saveOfficeLocations(locations: OfficeLocation[]): boolean {
  return writeJsonFile('office-locations.json', locations);
}

export function addOfficeLocation(location: OfficeLocation): boolean {
  const locations = getOfficeLocations();
  locations.push(location);
  return saveOfficeLocations(locations);
}

export function updateOfficeLocation(id: string, updates: Partial<OfficeLocation>): boolean {
  const locations = getOfficeLocations();
  const index = locations.findIndex(l => l.id === id);
  if (index === -1) return false;

  locations[index] = { ...locations[index], ...updates };
  return saveOfficeLocations(locations);
}

export function deleteOfficeLocation(id: string): boolean {
  const locations = getOfficeLocations();
  const filtered = locations.filter(l => l.id !== id);
  if (filtered.length === locations.length) return false;

  return saveOfficeLocations(filtered);
}

// ==================== Footer Links ====================

export function getFooterLinks(): FooterLink[] {
  return readJsonFile<FooterLink>('footer-links.json', []);
}

export function saveFooterLinks(links: FooterLink[]): boolean {
  return writeJsonFile('footer-links.json', links);
}

export function addFooterLink(link: FooterLink): boolean {
  const links = getFooterLinks();
  links.push(link);
  return saveFooterLinks(links);
}

export function updateFooterLink(id: string, updates: Partial<FooterLink>): boolean {
  const links = getFooterLinks();
  const index = links.findIndex(l => l.id === id);
  if (index === -1) return false;

  links[index] = { ...links[index], ...updates };
  return saveFooterLinks(links);
}

export function deleteFooterLink(id: string): boolean {
  const links = getFooterLinks();
  const filtered = links.filter(l => l.id !== id);
  if (filtered.length === links.length) return false;

  return saveFooterLinks(filtered);
}

// ==================== Gallery Images ====================

export function getGalleryImages(): GalleryImage[] {
  return readJsonFile<GalleryImage>('gallery-images.json', []);
}

export function saveGalleryImages(images: GalleryImage[]): boolean {
  return writeJsonFile('gallery-images.json', images);
}

export function addGalleryImage(image: GalleryImage): boolean {
  const images = getGalleryImages();
  images.push(image);
  return saveGalleryImages(images);
}

export function updateGalleryImage(id: string, updates: Partial<GalleryImage>): boolean {
  const images = getGalleryImages();
  const index = images.findIndex(i => i.id === id);
  if (index === -1) return false;

  images[index] = { ...images[index], ...updates };
  return saveGalleryImages(images);
}

export function deleteGalleryImage(id: string): boolean {
  const images = getGalleryImages();
  const filtered = images.filter(i => i.id !== id);
  if (filtered.length === images.length) return false;

  return saveGalleryImages(filtered);
}

// ==================== Catalogs ====================

export function getCatalogs(): Catalog[] {
  return readJsonFile<Catalog>('catalogs.json', []);
}

export function saveCatalogs(catalogs: Catalog[]): boolean {
  return writeJsonFile('catalogs.json', catalogs);
}

export function getCatalogsByBrand(brand: string): Catalog[] {
  const catalogs = getCatalogs();
  return catalogs.filter(c => c.brand === brand && c.enabled);
}

export function addCatalog(catalog: Catalog): boolean {
  const catalogs = getCatalogs();
  catalogs.push(catalog);
  return saveCatalogs(catalogs);
}

export function updateCatalog(id: string, updates: Partial<Catalog>): boolean {
  const catalogs = getCatalogs();
  const index = catalogs.findIndex(c => c.id === id);
  if (index === -1) return false;

  catalogs[index] = { ...catalogs[index], ...updates };
  return saveCatalogs(catalogs);
}

export function deleteCatalog(id: string): boolean {
  const catalogs = getCatalogs();
  const filtered = catalogs.filter(c => c.id !== id);
  if (filtered.length === catalogs.length) return false;

  return saveCatalogs(filtered);
}

// ==================== Hero Slides ====================

export function getHeroSlides(): HeroSlide[] {
  return readJsonFile<HeroSlide>('hero-slides.json', []);
}

export function saveHeroSlides(slides: HeroSlide[]): boolean {
  return writeJsonFile('hero-slides.json', slides);
}

export function addHeroSlide(slide: HeroSlide): boolean {
  const slides = getHeroSlides();
  slides.push(slide);
  return saveHeroSlides(slides);
}

export function updateHeroSlide(id: string, updates: Partial<HeroSlide>): boolean {
  const slides = getHeroSlides();
  const index = slides.findIndex(s => s.id === id);
  if (index === -1) return false;

  slides[index] = { ...slides[index], ...updates };
  return saveHeroSlides(slides);
}

export function deleteHeroSlide(id: string): boolean {
  const slides = getHeroSlides();
  const filtered = slides.filter(s => s.id !== id);
  if (filtered.length === slides.length) return false;

  return saveHeroSlides(filtered);
}

// ==================== Homepage Stats ====================

export function getHomepageStats(): HomepageStat[] {
  return readJsonFile<HomepageStat>('homepage-stats.json', []);
}

export function saveHomepageStats(stats: HomepageStat[]): boolean {
  return writeJsonFile('homepage-stats.json', stats);
}

// ==================== Partner Logos ====================

export function getPartnerLogos(): PartnerLogo[] {
  return readJsonFile<PartnerLogo>('partner-logos.json', []);
}

export function savePartnerLogos(logos: PartnerLogo[]): boolean {
  return writeJsonFile('partner-logos.json', logos);
}

export function addPartnerLogo(logo: PartnerLogo): boolean {
  const logos = getPartnerLogos();
  logos.push(logo);
  return savePartnerLogos(logos);
}

export function updatePartnerLogo(id: string, updates: Partial<PartnerLogo>): boolean {
  const logos = getPartnerLogos();
  const index = logos.findIndex(l => l.id === id);
  if (index === -1) return false;

  logos[index] = { ...logos[index], ...updates };
  return savePartnerLogos(logos);
}

export function deletePartnerLogo(id: string): boolean {
  const logos = getPartnerLogos();
  const filtered = logos.filter(l => l.id !== id);
  if (filtered.length === logos.length) return false;

  return savePartnerLogos(filtered);
}

// ==================== Post Categories ====================

export function getPostCategories(): PostCategory[] {
  return readJsonFile<PostCategory>('post-categories.json', []);
}

export function savePostCategories(categories: PostCategory[]): boolean {
  return writeJsonFile('post-categories.json', categories);
}

export function getPostCategoryBySlug(slug: string): PostCategory | undefined {
  const categories = getPostCategories();
  return categories.find(c => c.slug === slug);
}

export function addPostCategory(category: PostCategory): boolean {
  const categories = getPostCategories();
  categories.push(category);
  return savePostCategories(categories);
}

export function updatePostCategory(id: string, updates: Partial<PostCategory>): boolean {
  const categories = getPostCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return false;

  categories[index] = { ...categories[index], ...updates };
  return savePostCategories(categories);
}

export function deletePostCategory(id: string): boolean {
  const categories = getPostCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;

  return savePostCategories(filtered);
}
