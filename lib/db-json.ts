import fs from 'fs';
import path from 'path';
import { categories as defaultCategories, products as defaultProducts, posts as defaultPosts } from '@/lib/data';
import {
  Product, Category, Post,
  SiteSettings, SocialLink, OfficeLocation, FooterLink,
  GalleryImage, Catalog, HeroSlide, HomepageStat, PartnerLogo, PostCategory,
  Testimonial, FAQ, Certification, HomepageService,
  MediaItem, MediaFolder, MediaUsage, HolidayEffect, GlobalPartnerRegion, GlobalPartner,
  PageVisibility
} from '@/types';

const DATA_DIR = process.env.PERSISTENT_DATA_PATH
  ? path.resolve(process.env.PERSISTENT_DATA_PATH)
  : path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

let backupDataCache: Record<string, unknown> | null | undefined;

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function snakeToCamelKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function snakeToCamelValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(snakeToCamelValue);
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.entries(value).reduce<Record<string, unknown>>((result, [key, item]) => {
    result[snakeToCamelKey(key)] = snakeToCamelValue(item);
    return result;
  }, {});
}

function getBackupData(): Record<string, unknown> | null {
  if (backupDataCache !== undefined) return backupDataCache;

  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      backupDataCache = null;
      return backupDataCache;
    }

    const backupFiles = fs
      .readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-supabase-') && file.endsWith('.json'))
      .sort()
      .reverse();

    for (const file of backupFiles) {
      const raw = fs.readFileSync(path.join(BACKUP_DIR, file), 'utf-8');
      const parsed = JSON.parse(raw) as unknown;

      if (isRecord(parsed) && isRecord(parsed.data)) {
        backupDataCache = parsed.data;
        return backupDataCache;
      }
    }
  } catch (error) {
    console.error('Error reading Supabase backup:', error);
  }

  backupDataCache = null;
  return backupDataCache;
}

function getBackupRows(tableName: string): Record<string, unknown>[] {
  const table = getBackupData()?.[tableName];
  if (!Array.isArray(table)) return [];
  return table.filter(isRecord);
}

function getBackupCollection<T>(
  tableName: string,
  defaultValue: T[],
  transform: (row: Record<string, unknown>) => T = row => snakeToCamelValue(row) as T
): T[] {
  const rows = getBackupRows(tableName);
  if (rows.length === 0) return cloneJson(defaultValue);
  return rows.map(transform);
}

function getBackupSetting<T>(tableName: string, key: string, defaultValue: T): T {
  const row = getBackupRows(tableName).find(item => item.key === key);
  if (!row || row.value === undefined) return cloneJson(defaultValue);
  return { ...cloneJson(defaultValue), ...(row.value as Partial<T>) };
}

function getBackupKeyedValue<T>(tableName: string, keyField: string, key: string, valueField: string, defaultValue: T): T {
  const row = getBackupRows(tableName).find(item => item[keyField] === key);
  if (!row || row[valueField] === undefined) return cloneJson(defaultValue);
  return { ...cloneJson(defaultValue), ...(row[valueField] as Partial<T>) };
}

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
    return cloneJson(defaultValue);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return cloneJson(defaultValue);
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
  return readJsonCollection<Category>('categories.json', 'categories', defaultCategories);
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
export function getProducts(options?: {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
}): Product[] {
  let products = readJsonCollection<Product>('products.json', 'products', defaultProducts, transformProduct);

  if (options?.category) {
    products = products.filter(p => p.category === options.category);
  }

  if (options?.search) {
    const query = options.search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query) ||
      (p.description || '').toLowerCase().includes(query) ||
      (p.shortDescription || '').toLowerCase().includes(query) ||
      (p.fullDescription || '').toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.categoryName.toLowerCase().includes(query)
    );
  }

  if (options?.limit !== undefined) {
    const offset = options.offset || 0;
    products = products.slice(offset, offset + options.limit);
  }

  return products;
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
  return getProducts({ category: categorySlug });
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
  return readJsonCollection<Post>('posts.json', 'posts', defaultPosts, transformPost);
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
    return cloneJson(DEFAULT_ADMIN_SETTINGS);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { ...cloneJson(DEFAULT_ADMIN_SETTINGS), ...JSON.parse(data) };
  } catch {
    return cloneJson(DEFAULT_ADMIN_SETTINGS);
  }
}

function readJsonCollection<T>(
  filename: string,
  backupTable: string,
  defaultValue: T[],
  transform?: (row: Record<string, unknown>) => T
): T[] {
  const rows = readJsonFile<unknown>(filename, getBackupCollection(backupTable, defaultValue, transform));
  if (!transform) return rows as T[];

  return rows.map(row => isRecord(row) ? transform(row) : row as T);
}

function getMediaVariants(variants: unknown, fallbackUrl: string): MediaItem['variants'] {
  const source = isRecord(variants) ? variants : {};
  const thumbnail = typeof source.thumbnail === 'string' ? source.thumbnail : '';
  const medium = typeof source.medium === 'string' ? source.medium : '';
  const full = typeof source.full === 'string' ? source.full : '';
  const fallback = fallbackUrl || full || medium || thumbnail;

  return {
    thumbnail: thumbnail || medium || full || fallback,
    medium: medium || full || thumbnail || fallback,
    full: full || medium || thumbnail || fallback,
  };
}

function transformProduct(row: Record<string, unknown>): Product {
  const product = snakeToCamelValue(row) as Partial<Product> & {
    thumbnail?: string | null;
    isFeatured?: boolean | null;
    price?: string | number | null;
  };

  return {
    ...product,
    image: product.image || product.thumbnail || '',
    categoryName: product.categoryName || '',
    categorySlug: product.categorySlug || product.category || '',
    shortDescription: product.shortDescription || '',
    fullDescription: product.fullDescription || product.description || '',
    featured: product.featured ?? product.isFeatured ?? false,
    price: product.price != null ? String(product.price) : 'Liên hệ',
  } as Product;
}

function transformPost(row: Record<string, unknown>): Post {
  const post = snakeToCamelValue(row) as Partial<Post> & {
    featuredImage?: string | null;
    thumbnail?: string | null;
    publishedAt?: string | null;
    createdAt?: string | null;
  };

  return {
    ...post,
    image: post.image || post.featuredImage || post.thumbnail || '',
    date: post.date || post.publishedAt || post.createdAt || '',
  } as Post;
}

function transformMedia(row: Record<string, unknown>): MediaItem {
  const media = snakeToCamelValue(row) as Partial<MediaItem> & {
    storageUrl?: string | null;
    altText?: string | null;
    usage?: MediaUsage[] | MediaUsage | null;
  };
  const fallbackUrl = media.storageUrl || '';
  const usage = Array.isArray(media.usage) ? media.usage : media.usage ? [media.usage] : [];

  return {
    id: media.id || '',
    filename: media.filename || '',
    originalName: media.originalName || media.filename || '',
    folder: media.folder || 'general',
    mimeType: media.mimeType || 'image/jpeg',
    size: media.size || 0,
    dimensions: media.dimensions || { width: 0, height: 0 },
    variants: getMediaVariants(media.variants, fallbackUrl),
    alt: media.alt || media.altText || '',
    caption: media.caption || '',
    tags: media.tags || [],
    usedIn: media.usedIn || usage,
    createdAt: media.createdAt || new Date().toISOString(),
    updatedAt: media.updatedAt || new Date().toISOString(),
  };
}

function transformPageVisibility(row: Record<string, unknown>): PageVisibility {
  const page = snakeToCamelValue(row) as Partial<PageVisibility> & { orderIndex?: number };

  return {
    id: page.id || '',
    path: page.path || '/',
    name: page.name || '',
    description: page.description || '',
    visible: page.visible ?? true,
    order: page.order ?? page.orderIndex ?? 0,
  };
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
    if (!fs.existsSync(categoriesPath)) {
      writeJsonFile('categories.json', defaultCategories);
    }
    if (!fs.existsSync(productsPath)) {
      writeJsonFile('products.json', defaultProducts);
    }
    if (!fs.existsSync(postsPath)) {
      writeJsonFile('posts.json', defaultPosts);
    }
  }
}

// ==================== CMS Data Functions ====================

// Generic read/write for single objects
function readJsonObject<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return cloneJson(defaultValue);
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return { ...cloneJson(defaultValue), ...JSON.parse(data) };
  } catch {
    return cloneJson(defaultValue);
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
  return readJsonObject('site-settings.json', getBackupSetting('site_settings', 'main', DEFAULT_SITE_SETTINGS));
}

export function saveSiteSettings(settings: SiteSettings): boolean {
  return writeJsonObject('site-settings.json', settings);
}

// ==================== Office Locations ====================

export function getOfficeLocations(): OfficeLocation[] {
  return readJsonCollection<OfficeLocation>('office-locations.json', 'office_locations', []);
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
  return readJsonCollection<FooterLink>('footer-links.json', 'footer_links', []);
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
  return readJsonCollection<GalleryImage>('gallery-images.json', 'gallery_images', []);
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
  return readJsonCollection<Catalog>('catalogs.json', 'catalogs', []);
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
  return readJsonCollection<HeroSlide>('hero-slides.json', 'hero_slides', []);
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
  return readJsonCollection<HomepageStat>('homepage-stats.json', 'homepage_stats', []);
}

export function saveHomepageStats(stats: HomepageStat[]): boolean {
  return writeJsonFile('homepage-stats.json', stats);
}

// ==================== Partner Logos ====================

export function getPartnerLogos(): PartnerLogo[] {
  return readJsonCollection<PartnerLogo>('partner-logos.json', 'partner_logos', []);
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
  return readJsonCollection<PostCategory>('post-categories.json', 'post_categories', []);
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

// ==================== Testimonials ====================

export function getTestimonials(): Testimonial[] {
  return readJsonCollection<Testimonial>('testimonials.json', 'testimonials', []);
}

export function saveTestimonials(testimonials: Testimonial[]): boolean {
  return writeJsonFile('testimonials.json', testimonials);
}

export function addTestimonial(testimonial: Testimonial): boolean {
  const testimonials = getTestimonials();
  testimonials.push(testimonial);
  return saveTestimonials(testimonials);
}

export function updateTestimonial(id: string, updates: Partial<Testimonial>): boolean {
  const testimonials = getTestimonials();
  const index = testimonials.findIndex(t => t.id === id);
  if (index === -1) return false;

  testimonials[index] = { ...testimonials[index], ...updates };
  return saveTestimonials(testimonials);
}

export function deleteTestimonial(id: string): boolean {
  const testimonials = getTestimonials();
  const filtered = testimonials.filter(t => t.id !== id);
  if (filtered.length === testimonials.length) return false;

  return saveTestimonials(filtered);
}

// ==================== FAQs ====================

export function getFAQs(): FAQ[] {
  return readJsonCollection<FAQ>('faqs.json', 'faqs', []);
}

export function saveFAQs(faqs: FAQ[]): boolean {
  return writeJsonFile('faqs.json', faqs);
}

export function addFAQ(faq: FAQ): boolean {
  const faqs = getFAQs();
  faqs.push(faq);
  return saveFAQs(faqs);
}

export function updateFAQ(id: string, updates: Partial<FAQ>): boolean {
  const faqs = getFAQs();
  const index = faqs.findIndex(f => f.id === id);
  if (index === -1) return false;

  faqs[index] = { ...faqs[index], ...updates };
  return saveFAQs(faqs);
}

export function deleteFAQ(id: string): boolean {
  const faqs = getFAQs();
  const filtered = faqs.filter(f => f.id !== id);
  if (filtered.length === faqs.length) return false;

  return saveFAQs(filtered);
}

// ==================== Certifications ====================

export function getCertifications(): Certification[] {
  return readJsonCollection<Certification>('certifications.json', 'certifications', []);
}

export function saveCertifications(certifications: Certification[]): boolean {
  return writeJsonFile('certifications.json', certifications);
}

export function addCertification(certification: Certification): boolean {
  const certifications = getCertifications();
  certifications.push(certification);
  return saveCertifications(certifications);
}

export function updateCertification(id: string, updates: Partial<Certification>): boolean {
  const certifications = getCertifications();
  const index = certifications.findIndex(c => c.id === id);
  if (index === -1) return false;

  certifications[index] = { ...certifications[index], ...updates };
  return saveCertifications(certifications);
}

export function deleteCertification(id: string): boolean {
  const certifications = getCertifications();
  const filtered = certifications.filter(c => c.id !== id);
  if (filtered.length === certifications.length) return false;

  return saveCertifications(filtered);
}

// ==================== Thư viện Media ====================

export function getMediaItems(): MediaItem[] {
  return readJsonCollection<MediaItem>('media.json', 'media', [], transformMedia);
}

export function saveMediaItems(items: MediaItem[]): boolean {
  return writeJsonFile('media.json', items);
}

export function getMediaById(id: string): MediaItem | undefined {
  const items = getMediaItems();
  return items.find(m => m.id === id);
}

export function getMediaByFolder(folder: MediaFolder): MediaItem[] {
  const items = getMediaItems();
  return items.filter(m => m.folder === folder);
}

export function searchMedia(query: string): MediaItem[] {
  const items = getMediaItems();
  const lowerQuery = query.toLowerCase();
  return items.filter(m =>
    m.filename.toLowerCase().includes(lowerQuery) ||
    m.alt.toLowerCase().includes(lowerQuery) ||
    m.tags.some(t => t.toLowerCase().includes(lowerQuery))
  );
}

export function addMediaItem(item: MediaItem): boolean {
  const items = getMediaItems();
  items.push(item);
  return saveMediaItems(items);
}

export function updateMediaItem(id: string, updates: Partial<MediaItem>): boolean {
  const items = getMediaItems();
  const index = items.findIndex(m => m.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
  return saveMediaItems(items);
}

export function deleteMediaItem(id: string): boolean {
  const items = getMediaItems();
  const item = items.find(m => m.id === id);

  // Check if media is being used
  if (item && item.usedIn.length > 0) {
    return false; // Cannot delete media in use
  }

  const filtered = items.filter(m => m.id !== id);
  if (filtered.length === items.length) return false;

  return saveMediaItems(filtered);
}

export function addMediaUsage(mediaId: string, usage: MediaUsage): boolean {
  const items = getMediaItems();
  const index = items.findIndex(m => m.id === mediaId);
  if (index === -1) return false;

  // Check if usage already exists
  const existingUsage = items[index].usedIn.find(
    u => u.type === usage.type && u.id === usage.id && u.field === usage.field
  );
  if (existingUsage) return true; // Already tracked

  items[index].usedIn.push(usage);
  items[index].updatedAt = new Date().toISOString();
  return saveMediaItems(items);
}

export function removeMediaUsage(mediaId: string, usage: MediaUsage): boolean {
  const items = getMediaItems();
  const index = items.findIndex(m => m.id === mediaId);
  if (index === -1) return false;

  items[index].usedIn = items[index].usedIn.filter(
    u => !(u.type === usage.type && u.id === usage.id && u.field === usage.field)
  );
  items[index].updatedAt = new Date().toISOString();
  return saveMediaItems(items);
}

export function getUnusedMedia(): MediaItem[] {
  const items = getMediaItems();
  return items.filter(m => m.usedIn.length === 0);
}

export function getMediaStats(): { total: number; byFolder: Record<string, number>; totalSize: number } {
  const items = getMediaItems();
  const byFolder: Record<string, number> = {};
  let totalSize = 0;

  items.forEach(item => {
    byFolder[item.folder] = (byFolder[item.folder] || 0) + 1;
    totalSize += item.size;
  });

  return {
    total: items.length,
    byFolder,
    totalSize
  };
}

// ==================== Homepage Services ====================

export function getHomepageServices(): HomepageService[] {
  return readJsonCollection<HomepageService>('homepage-services.json', 'homepage_services', []);
}

export function saveHomepageServices(services: HomepageService[]): boolean {
  return writeJsonFile('homepage-services.json', services);
}

export function addHomepageService(service: HomepageService): boolean {
  const services = getHomepageServices();
  services.push(service);
  return saveHomepageServices(services);
}

export function updateHomepageService(id: string, updates: Partial<HomepageService>): boolean {
  const services = getHomepageServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return false;

  services[index] = { ...services[index], ...updates };
  return saveHomepageServices(services);
}

export function deleteHomepageService(id: string): boolean {
  const services = getHomepageServices();
  const filtered = services.filter(s => s.id !== id);
  if (filtered.length === services.length) return false;

  return saveHomepageServices(filtered);
}

// ==================== Holiday Effects ====================

type HolidayEffectInput = Partial<HolidayEffect> & {
  start_date?: string;
  end_date?: string;
  effect_types?: string[];
  primary_color?: string;
  secondary_color?: string;
};

function normalizeHolidayEffect(effect: HolidayEffectInput): HolidayEffect {
  return {
    id: effect.id || String(Date.now()),
    name: effect.name || '',
    slug: effect.slug || '',
    enabled: effect.enabled ?? false,
    startDate: effect.start_date ?? effect.startDate ?? '',
    endDate: effect.end_date ?? effect.endDate ?? '',
    effectTypes: effect.effect_types ?? effect.effectTypes ?? [],
    description: effect.description || '',
    primaryColor: effect.primary_color ?? effect.primaryColor ?? '#dc2626',
    secondaryColor: effect.secondary_color ?? effect.secondaryColor ?? '#ffd700',
  };
}

export function getHolidayEffects(): HolidayEffect[] {
  return readJsonCollection<HolidayEffect>('holiday-effects.json', 'holiday_effects', []).map(normalizeHolidayEffect);
}

export function getHolidayEffectById(id: string): HolidayEffect | undefined {
  return getHolidayEffects().find(effect => effect.id === id);
}

export function getActiveHolidayEffects(): HolidayEffect[] {
  return getHolidayEffects().filter(effect => effect.enabled);
}

export function addHolidayEffect(effect: HolidayEffectInput): boolean {
  const effects = getHolidayEffects();
  effects.push(normalizeHolidayEffect(effect));
  return writeJsonFile('holiday-effects.json', effects);
}

export function updateHolidayEffect(id: string, updates: HolidayEffectInput): boolean {
  const effects = getHolidayEffects();
  const index = effects.findIndex(effect => effect.id === id);
  if (index === -1) return false;

  effects[index] = normalizeHolidayEffect({ ...effects[index], ...updates });
  return writeJsonFile('holiday-effects.json', effects);
}

export function deleteHolidayEffect(id: string): boolean {
  const effects = getHolidayEffects();
  const filtered = effects.filter(effect => effect.id !== id);
  if (filtered.length === effects.length) return false;

  return writeJsonFile('holiday-effects.json', filtered);
}

// ==================== SEO Settings ====================

const DEFAULT_SEO = {
  global: {
    siteName: 'NEW ATLANTIC - Tân Đại Tây Dương',
    siteDescription: '',
    siteKeywords: '',
    defaultOgImage: '/images/logo/og-image.jpg',
    googleVerification: '',
    bingVerification: '',
    yandexVerification: '',
    facebookAppId: '',
    twitterHandle: '',
  },
  pages: {},
  robots: {
    allowAll: true,
    disallowPaths: ['/api/', '/admin/', '/_next/'],
    crawlDelay: 0,
    customRules: '',
  },
  sitemap: {
    enabled: true,
    changeFrequency: { home: 'daily', products: 'weekly', posts: 'monthly' },
    priority: { home: 1.0, products: 0.8, posts: 0.6 },
    excludePaths: [],
  },
  openGraph: {
    defaultType: 'website',
    siteName: 'NEW ATLANTIC',
    locale: 'vi_VN',
    facebookPageUrl: '',
  },
  updatedAt: new Date().toISOString(),
};

export function getSEOSettings(): typeof DEFAULT_SEO {
  return readJsonObject('seo-settings.json', getBackupSetting('seo_settings', 'main', DEFAULT_SEO));
}

export function saveSEOSettings(settings: typeof DEFAULT_SEO): boolean {
  return writeJsonObject('seo-settings.json', {
    ...settings,
    updatedAt: new Date().toISOString(),
  });
}

// ==================== Global Partners ====================

const DEFAULT_GLOBAL_REGIONS: GlobalPartnerRegion[] = [
  { id: 'north-america', name: 'North America', nameVi: 'Bắc Mỹ', order: 0, enabled: true },
  { id: 'europe', name: 'Europe', nameVi: 'Châu Âu', order: 1, enabled: true },
  { id: 'middle-east', name: 'Middle East', nameVi: 'Trung Đông', order: 2, enabled: true },
  { id: 'asia', name: 'Asia', nameVi: 'Châu Á', order: 3, enabled: true },
  { id: 'southeast-asia', name: 'Southeast Asia', nameVi: 'Đông Nam Á', order: 4, enabled: true },
];

const DEFAULT_GLOBAL_PARTNERS: GlobalPartner[] = [
  { id: 'willburt', regionId: 'north-america', name: 'WILL-BURT (USA)', country: 'USA', order: 0, enabled: true },
  { id: 'moffett', regionId: 'north-america', name: 'Moffett (USA)', country: 'USA', order: 1, enabled: true },
  { id: 'hiab', regionId: 'europe', name: 'HIAB (Sweden)', country: 'Sweden', order: 0, enabled: true },
  { id: 'effer', regionId: 'europe', name: 'EFFER (Italy)', country: 'Italy', order: 1, enabled: true },
  { id: 'clarkmasts', regionId: 'europe', name: 'Clark Masts (UK)', country: 'UK', order: 2, enabled: true },
  { id: 'petronas', regionId: 'middle-east', name: 'Petronas', country: 'Malaysia', order: 0, enabled: true },
  { id: 'skymark', regionId: 'asia', name: 'SKYMARK', country: 'South Korea', order: 0, enabled: true },
  { id: 'lovol', regionId: 'asia', name: 'LOVOL (China)', country: 'China', order: 1, enabled: true },
  { id: 'eldis', regionId: 'asia', name: 'Eldis (Czech)', country: 'Czech Republic', order: 2, enabled: true },
  { id: 'stairborne', regionId: 'asia', name: 'ST Airborne', country: 'Singapore', order: 3, enabled: true },
  { id: 'newatlantic', regionId: 'southeast-asia', name: 'NEW ATLANTIC (Vietnam)', country: 'Vietnam', order: 0, enabled: true },
];

export function getGlobalPartnerRegions(): GlobalPartnerRegion[] {
  const regions = readJsonCollection<GlobalPartnerRegion>('global-partner-regions.json', 'global_partner_regions', DEFAULT_GLOBAL_REGIONS);
  return (regions.length > 0 ? regions : cloneJson(DEFAULT_GLOBAL_REGIONS)).sort((a, b) => a.order - b.order);
}

export function saveGlobalPartnerRegions(regions: GlobalPartnerRegion[]): boolean {
  return writeJsonFile('global-partner-regions.json', regions);
}

export function addGlobalPartnerRegion(region: GlobalPartnerRegion): boolean {
  const regions = getGlobalPartnerRegions();
  regions.push(region);
  return saveGlobalPartnerRegions(regions);
}

export function updateGlobalPartnerRegion(id: string, updates: Partial<GlobalPartnerRegion>): boolean {
  const regions = getGlobalPartnerRegions();
  const index = regions.findIndex(region => region.id === id);
  if (index === -1) return false;

  regions[index] = { ...regions[index], ...updates };
  return saveGlobalPartnerRegions(regions);
}

export function deleteGlobalPartnerRegion(id: string): boolean {
  const regions = getGlobalPartnerRegions();
  const filteredRegions = regions.filter(region => region.id !== id);
  if (filteredRegions.length === regions.length) return false;

  const partners = getGlobalPartners().filter(partner => partner.regionId !== id);
  saveGlobalPartners(partners);
  return saveGlobalPartnerRegions(filteredRegions);
}

export function getGlobalPartners(): GlobalPartner[] {
  const partners = readJsonCollection<GlobalPartner>('global-partners.json', 'global_partners', DEFAULT_GLOBAL_PARTNERS);
  return (partners.length > 0 ? partners : cloneJson(DEFAULT_GLOBAL_PARTNERS)).sort((a, b) => a.order - b.order);
}

export function getGlobalPartnersByRegion(regionId: string): GlobalPartner[] {
  return getGlobalPartners().filter(partner => partner.regionId === regionId);
}

export function saveGlobalPartners(partners: GlobalPartner[]): boolean {
  return writeJsonFile('global-partners.json', partners);
}

export function addGlobalPartner(partner: GlobalPartner): boolean {
  const partners = getGlobalPartners();
  partners.push(partner);
  return saveGlobalPartners(partners);
}

export function updateGlobalPartner(id: string, updates: Partial<GlobalPartner>): boolean {
  const partners = getGlobalPartners();
  const index = partners.findIndex(partner => partner.id === id);
  if (index === -1) return false;

  partners[index] = { ...partners[index], ...updates };
  return saveGlobalPartners(partners);
}

export function deleteGlobalPartner(id: string): boolean {
  const partners = getGlobalPartners();
  const filtered = partners.filter(partner => partner.id !== id);
  if (filtered.length === partners.length) return false;

  return saveGlobalPartners(filtered);
}

// ==================== Navbar, Popup, Page Visibility ====================

export function getNavbarSettings<T>(defaultValue: T): T {
  return readJsonObject(
    'navbar-settings.json',
    getBackupKeyedValue('navbar_settings', 'id', 'navbar', 'settings', defaultValue)
  );
}

export function saveNavbarSettings<T>(settings: T): boolean {
  return writeJsonObject('navbar-settings.json', settings);
}

export function getPopupSettings<T>(defaultValue: T): T {
  return readJsonObject('popup-settings.json', getBackupSetting('site_settings', 'popup-settings', defaultValue));
}

export function savePopupSettings<T>(settings: T): boolean {
  return writeJsonObject('popup-settings.json', settings);
}

export function getPageVisibility(): PageVisibility[] {
  return readJsonCollection<PageVisibility>('page-visibility.json', 'page_visibility', [], transformPageVisibility);
}

export function savePageVisibility(pages: PageVisibility[]): boolean {
  return writeJsonFile('page-visibility.json', pages);
}
