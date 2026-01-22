import fs from 'fs';
import path from 'path';
import { Product, Category, Post } from '@/types';

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
