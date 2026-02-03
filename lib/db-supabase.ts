/**
 * Database functions using Supabase
 * Drop-in replacement for lib/db.ts
 */

import { createAdminClient } from './supabase';
import type {
    Product, Category, Post,
    SiteSettings, OfficeLocation, FooterLink,
    GalleryImage, Catalog, HeroSlide, HomepageStat, PartnerLogo, PostCategory,
    Testimonial, FAQ, Certification, HomepageService, MediaItem, MediaFolder, MediaUsage,
    HolidayEffect
} from '@/types';

// Get admin client for server-side operations
function getClient() {
    const client = createAdminClient();
    if (!client) {
        throw new Error('Supabase admin client not configured');
    }
    return client;
}

// Helper: Convert snake_case keys to camelCase
function snakeToCamel(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(snakeToCamel);
    if (typeof obj !== 'object') return obj;

    const result: any = {};
    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        result[camelKey] = snakeToCamel(obj[key]);
    }
    return result;
}

// Helper: Convert camelCase keys to snake_case (for saving to Supabase)
function camelToSnake(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(camelToSnake);
    if (typeof obj !== 'object') return obj;

    const result: any = {};
    for (const key in obj) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        result[snakeKey] = camelToSnake(obj[key]);
    }
    return result;
}

// ==================== Categories ====================

export async function getCategories(): Promise<Category[]> {
    const { data, error } = await getClient()
        .from('categories')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await getClient()
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return snakeToCamel(data);
}

export async function addCategory(category: Category): Promise<boolean> {
    const { error } = await getClient()
        .from('categories')
        .insert(category);

    if (error) {
        console.error('Error adding category:', error);
        return false;
    }
    return true;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<boolean> {
    const { error } = await getClient()
        .from('categories')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating category:', error);
        return false;
    }
    return true;
}

export async function deleteCategory(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting category:', error);
        return false;
    }
    return true;
}

// ==================== Products ====================

// Transform Supabase product to frontend Product type
function transformProduct(data: any): Product {
    return {
        ...data,
        image: data.thumbnail || data.image, // Map thumbnail to image for frontend
        categoryName: data.category_name,
        shortDescription: data.short_description,
        fullDescription: data.description,
    };
}

export async function getProducts(): Promise<Product[]> {
    const { data, error } = await getClient()
        .from('products')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }
    return (data || []).map(transformProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await getClient()
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return transformProduct(data);
}

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await getClient()
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return transformProduct(data);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const { data, error } = await getClient()
        .from('products')
        .select('*')
        .eq('category', categorySlug)
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
    return (data || []).map(transformProduct);
}

export async function addProduct(product: Product): Promise<boolean> {
    const { error } = await getClient()
        .from('products')
        .insert(product);

    if (error) {
        console.error('Error adding product:', error);
        return false;
    }
    return true;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    const { error } = await getClient()
        .from('products')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        return false;
    }
    return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return false;
    }
    return true;
}

export async function saveProducts(products: Product[]): Promise<boolean> {
    const { error } = await getClient()
        .from('products')
        .upsert(products, { onConflict: 'id' });

    if (error) {
        console.error('Error saving products:', error);
        return false;
    }
    return true;
}

// ==================== Posts ====================

// Transform Supabase post to frontend Post type
function transformPost(data: any): Post {
    return {
        ...data,
        image: data.featured_image || data.thumbnail || data.image, // Map featured_image to image
        date: data.published_at || data.created_at || data.date, // Map published_at to date
    };
}

export async function getPosts(): Promise<Post[]> {
    const { data, error } = await getClient()
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return (data || []).map(transformPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const { data, error } = await getClient()
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return transformPost(data);
}

export async function getPostById(id: string): Promise<Post | null> {
    const { data, error } = await getClient()
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return transformPost(data);
}

export async function addPost(post: Post): Promise<boolean> {
    const { error } = await getClient()
        .from('posts')
        .insert(post);

    if (error) {
        console.error('Error adding post:', error);
        return false;
    }
    return true;
}

export async function updatePost(id: string, updates: Partial<Post>): Promise<boolean> {
    const { error } = await getClient()
        .from('posts')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating post:', error);
        return false;
    }
    return true;
}

export async function deletePost(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post:', error);
        return false;
    }
    return true;
}

export async function savePosts(posts: Post[]): Promise<boolean> {
    const { error } = await getClient()
        .from('posts')
        .upsert(posts, { onConflict: 'id' });

    if (error) {
        console.error('Error saving posts:', error);
        return false;
    }
    return true;
}

// ==================== Post Categories ====================

export async function getPostCategories(): Promise<PostCategory[]> {
    const { data, error } = await getClient()
        .from('post_categories')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching post categories:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function getPostCategoryBySlug(slug: string): Promise<PostCategory | null> {
    const { data, error } = await getClient()
        .from('post_categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) return null;
    return snakeToCamel(data);
}

export async function addPostCategory(category: PostCategory): Promise<boolean> {
    const { error } = await getClient()
        .from('post_categories')
        .insert(category);

    if (error) {
        console.error('Error adding post category:', error);
        return false;
    }
    return true;
}

export async function updatePostCategory(id: string, updates: Partial<PostCategory>): Promise<boolean> {
    const { error } = await getClient()
        .from('post_categories')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating post category:', error);
        return false;
    }
    return true;
}

export async function deletePostCategory(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('post_categories')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting post category:', error);
        return false;
    }
    return true;
}

export async function savePostCategories(categories: PostCategory[]): Promise<boolean> {
    const { error } = await getClient()
        .from('post_categories')
        .upsert(categories, { onConflict: 'id' });

    if (error) {
        console.error('Error saving post categories:', error);
        return false;
    }
    return true;
}

// ==================== Site Settings ====================

const DEFAULT_SITE_SETTINGS: SiteSettings = {
    id: 'site-settings',
    companyName: 'NEW ATLANTIC',
    companySlogan: 'Tân Đại Tây Dương',
    companyDescription: 'Nhà phân phối hàng đầu các thương hiệu thiết bị công nghiệp',
    logo: '/images/logo/logo.png',
    phone: '+84 2838 733 686',
    email: 'info@newatlantic.vn',
    hotline: '',
    copyright: '© 2026 newatlantic.vn',
    socialLinks: []
};

export async function getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = await getClient()
        .from('site_settings')
        .select('*')
        .eq('key', 'main')
        .single();

    if (error || !data) return DEFAULT_SITE_SETTINGS;
    return data.value as SiteSettings;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<boolean> {
    const { error } = await getClient()
        .from('site_settings')
        .upsert({ key: 'main', value: settings }, { onConflict: 'key' });

    if (error) {
        console.error('Error saving site settings:', error);
        return false;
    }
    return true;
}

// ==================== Hero Slides ====================

export async function getHeroSlides(): Promise<HeroSlide[]> {
    const { data, error } = await getClient()
        .from('hero_slides')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching hero slides:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addHeroSlide(slide: HeroSlide): Promise<boolean> {
    const { error } = await getClient()
        .from('hero_slides')
        .insert(slide);

    if (error) {
        console.error('Error adding hero slide:', error);
        return false;
    }
    return true;
}

export async function updateHeroSlide(id: string, updates: Partial<HeroSlide>): Promise<boolean> {
    const { error } = await getClient()
        .from('hero_slides')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating hero slide:', error);
        return false;
    }
    return true;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('hero_slides')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting hero slide:', error);
        return false;
    }
    return true;
}

export async function saveHeroSlides(slides: HeroSlide[]): Promise<boolean> {
    const { error } = await getClient()
        .from('hero_slides')
        .upsert(slides, { onConflict: 'id' });

    if (error) {
        console.error('Error saving hero slides:', error);
        return false;
    }
    return true;
}

// ==================== Gallery Images ====================

export async function getGalleryImages(): Promise<GalleryImage[]> {
    const { data, error } = await getClient()
        .from('gallery_images')
        .select('*')
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching gallery images:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addGalleryImage(image: GalleryImage): Promise<boolean> {
    const { error } = await getClient()
        .from('gallery_images')
        .insert(image);

    if (error) {
        console.error('Error adding gallery image:', error);
        return false;
    }
    return true;
}

export async function updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<boolean> {
    const { error } = await getClient()
        .from('gallery_images')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating gallery image:', error);
        return false;
    }
    return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('gallery_images')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting gallery image:', error);
        return false;
    }
    return true;
}

export async function saveGalleryImages(images: GalleryImage[]): Promise<boolean> {
    const { error } = await getClient()
        .from('gallery_images')
        .upsert(images, { onConflict: 'id' });

    if (error) {
        console.error('Error saving gallery images:', error);
        return false;
    }
    return true;
}

// ==================== Office Locations ====================

export async function getOfficeLocations(): Promise<OfficeLocation[]> {
    const { data, error } = await getClient()
        .from('office_locations')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching office locations:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addOfficeLocation(location: OfficeLocation): Promise<boolean> {
    const { error } = await getClient()
        .from('office_locations')
        .insert(location);

    if (error) {
        console.error('Error adding office location:', error);
        return false;
    }
    return true;
}

export async function updateOfficeLocation(id: string, updates: Partial<OfficeLocation>): Promise<boolean> {
    const { error } = await getClient()
        .from('office_locations')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating office location:', error);
        return false;
    }
    return true;
}

export async function deleteOfficeLocation(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('office_locations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting office location:', error);
        return false;
    }
    return true;
}

export async function saveOfficeLocations(locations: OfficeLocation[]): Promise<boolean> {
    const { error } = await getClient()
        .from('office_locations')
        .upsert(locations, { onConflict: 'id' });

    if (error) {
        console.error('Error saving office locations:', error);
        return false;
    }
    return true;
}

// ==================== Footer Links ====================

export async function getFooterLinks(): Promise<FooterLink[]> {
    const { data, error } = await getClient()
        .from('footer_links')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching footer links:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addFooterLink(link: FooterLink): Promise<boolean> {
    const { error } = await getClient()
        .from('footer_links')
        .insert(link);

    if (error) {
        console.error('Error adding footer link:', error);
        return false;
    }
    return true;
}

export async function updateFooterLink(id: string, updates: Partial<FooterLink>): Promise<boolean> {
    const { error } = await getClient()
        .from('footer_links')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating footer link:', error);
        return false;
    }
    return true;
}

export async function deleteFooterLink(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('footer_links')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting footer link:', error);
        return false;
    }
    return true;
}

export async function saveFooterLinks(links: FooterLink[]): Promise<boolean> {
    const { error } = await getClient()
        .from('footer_links')
        .upsert(links, { onConflict: 'id' });

    if (error) {
        console.error('Error saving footer links:', error);
        return false;
    }
    return true;
}

// ==================== Catalogs ====================

export async function getCatalogs(): Promise<Catalog[]> {
    const { data, error } = await getClient()
        .from('catalogs')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching catalogs:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function getCatalogsByBrand(brand: string): Promise<Catalog[]> {
    const { data, error } = await getClient()
        .from('catalogs')
        .select('*')
        .eq('brand', brand)
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching catalogs by brand:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addCatalog(catalog: Catalog): Promise<boolean> {
    const { error } = await getClient()
        .from('catalogs')
        .insert(catalog);

    if (error) {
        console.error('Error adding catalog:', error);
        return false;
    }
    return true;
}

export async function updateCatalog(id: string, updates: Partial<Catalog>): Promise<boolean> {
    const { error } = await getClient()
        .from('catalogs')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating catalog:', error);
        return false;
    }
    return true;
}

export async function deleteCatalog(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('catalogs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting catalog:', error);
        return false;
    }
    return true;
}

export async function saveCatalogs(catalogs: Catalog[]): Promise<boolean> {
    const { error } = await getClient()
        .from('catalogs')
        .upsert(catalogs, { onConflict: 'id' });

    if (error) {
        console.error('Error saving catalogs:', error);
        return false;
    }
    return true;
}

// ==================== Homepage Stats ====================

export async function getHomepageStats(): Promise<HomepageStat[]> {
    const { data, error } = await getClient()
        .from('homepage_stats')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching homepage stats:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function saveHomepageStats(stats: HomepageStat[]): Promise<boolean> {
    const { error } = await getClient()
        .from('homepage_stats')
        .upsert(stats, { onConflict: 'id' });

    if (error) {
        console.error('Error saving homepage stats:', error);
        return false;
    }
    return true;
}

// ==================== Homepage Services ====================

export async function getHomepageServices(): Promise<HomepageService[]> {
    const { data, error } = await getClient()
        .from('homepage_services')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching homepage services:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addHomepageService(service: HomepageService): Promise<boolean> {
    const { error } = await getClient()
        .from('homepage_services')
        .insert(service);

    if (error) {
        console.error('Error adding homepage service:', error);
        return false;
    }
    return true;
}

export async function updateHomepageService(id: string, updates: Partial<HomepageService>): Promise<boolean> {
    const { error } = await getClient()
        .from('homepage_services')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating homepage service:', error);
        return false;
    }
    return true;
}

export async function deleteHomepageService(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('homepage_services')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting homepage service:', error);
        return false;
    }
    return true;
}

export async function saveHomepageServices(services: HomepageService[]): Promise<boolean> {
    const { error } = await getClient()
        .from('homepage_services')
        .upsert(services, { onConflict: 'id' });

    if (error) {
        console.error('Error saving homepage services:', error);
        return false;
    }
    return true;
}

// ==================== Partner Logos ====================

export async function getPartnerLogos(): Promise<PartnerLogo[]> {
    const { data, error } = await getClient()
        .from('partner_logos')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching partner logos:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addPartnerLogo(logo: PartnerLogo): Promise<boolean> {
    const { error } = await getClient()
        .from('partner_logos')
        .insert(logo);

    if (error) {
        console.error('Error adding partner logo:', error);
        return false;
    }
    return true;
}

export async function updatePartnerLogo(id: string, updates: Partial<PartnerLogo>): Promise<boolean> {
    const { error } = await getClient()
        .from('partner_logos')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating partner logo:', error);
        return false;
    }
    return true;
}

export async function deletePartnerLogo(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('partner_logos')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting partner logo:', error);
        return false;
    }
    return true;
}

export async function savePartnerLogos(logos: PartnerLogo[]): Promise<boolean> {
    const { error } = await getClient()
        .from('partner_logos')
        .upsert(logos, { onConflict: 'id' });

    if (error) {
        console.error('Error saving partner logos:', error);
        return false;
    }
    return true;
}

// ==================== Testimonials ====================

export async function getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await getClient()
        .from('testimonials')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addTestimonial(testimonial: Testimonial): Promise<boolean> {
    const { error } = await getClient()
        .from('testimonials')
        .insert(testimonial);

    if (error) {
        console.error('Error adding testimonial:', error);
        return false;
    }
    return true;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<boolean> {
    const { error } = await getClient()
        .from('testimonials')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating testimonial:', error);
        return false;
    }
    return true;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('testimonials')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting testimonial:', error);
        return false;
    }
    return true;
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<boolean> {
    const { error } = await getClient()
        .from('testimonials')
        .upsert(testimonials, { onConflict: 'id' });

    if (error) {
        console.error('Error saving testimonials:', error);
        return false;
    }
    return true;
}

// ==================== FAQs ====================

export async function getFAQs(): Promise<FAQ[]> {
    const { data, error } = await getClient()
        .from('faqs')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addFAQ(faq: FAQ): Promise<boolean> {
    const { error } = await getClient()
        .from('faqs')
        .insert(faq);

    if (error) {
        console.error('Error adding FAQ:', error);
        return false;
    }
    return true;
}

export async function updateFAQ(id: string, updates: Partial<FAQ>): Promise<boolean> {
    const { error } = await getClient()
        .from('faqs')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating FAQ:', error);
        return false;
    }
    return true;
}

export async function deleteFAQ(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('faqs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting FAQ:', error);
        return false;
    }
    return true;
}

export async function saveFAQs(faqs: FAQ[]): Promise<boolean> {
    const { error } = await getClient()
        .from('faqs')
        .upsert(faqs, { onConflict: 'id' });

    if (error) {
        console.error('Error saving FAQs:', error);
        return false;
    }
    return true;
}

// ==================== Certifications ====================

export async function getCertifications(): Promise<Certification[]> {
    const { data, error } = await getClient()
        .from('certifications')
        .select('*')
        .eq('enabled', true)
        .order('order_index', { ascending: true });

    if (error) {
        console.error('Error fetching certifications:', error);
        return [];
    }
    return (data || []).map(snakeToCamel);
}

export async function addCertification(cert: Certification): Promise<boolean> {
    const { error } = await getClient()
        .from('certifications')
        .insert(cert);

    if (error) {
        console.error('Error adding certification:', error);
        return false;
    }
    return true;
}

export async function updateCertification(id: string, updates: Partial<Certification>): Promise<boolean> {
    const { error } = await getClient()
        .from('certifications')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating certification:', error);
        return false;
    }
    return true;
}

export async function deleteCertification(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('certifications')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting certification:', error);
        return false;
    }
    return true;
}

export async function saveCertifications(certs: Certification[]): Promise<boolean> {
    const { error } = await getClient()
        .from('certifications')
        .upsert(certs, { onConflict: 'id' });

    if (error) {
        console.error('Error saving certifications:', error);
        return false;
    }
    return true;
}

// ==================== Media Library ====================

// Transform Supabase media to frontend MediaItem type
function transformMedia(data: any): MediaItem {
    // Check if variants has actual content
    const hasValidVariants = data.variants &&
        (data.variants.full || data.variants.medium || data.variants.thumbnail);

    const fallbackUrl = data.storage_url || '';

    return {
        id: data.id,
        filename: data.filename,
        originalName: data.original_name || data.originalName || data.filename,
        folder: data.folder || 'general',
        mimeType: data.mime_type || data.mimeType || 'image/jpeg',
        size: data.size || 0,
        dimensions: data.dimensions || { width: 0, height: 0 },
        variants: hasValidVariants ? data.variants : {
            thumbnail: fallbackUrl,
            medium: fallbackUrl,
            full: fallbackUrl
        },
        alt: data.alt_text || data.alt || '',
        caption: data.caption || '',
        tags: data.tags || [],
        usedIn: data.usage ? [data.usage] : [],
        createdAt: data.created_at || data.createdAt || new Date().toISOString(),
        updatedAt: data.updated_at || data.updatedAt || new Date().toISOString()
    };
}

export async function getMediaItems(): Promise<MediaItem[]> {
    const { data, error } = await getClient()
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching media items:', error);
        return [];
    }
    return (data || []).map(transformMedia);
}

export async function getMediaById(id: string): Promise<MediaItem | null> {
    const { data, error } = await getClient()
        .from('media')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return transformMedia(data);
}

export async function getMediaByFolder(folder: MediaFolder): Promise<MediaItem[]> {
    const { data, error } = await getClient()
        .from('media')
        .select('*')
        .eq('folder', folder)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching media by folder:', error);
        return [];
    }
    return (data || []).map(transformMedia);
}

export async function addMediaItem(item: MediaItem): Promise<boolean> {
    // Convert camelCase to snake_case for Supabase
    const snakeItem = {
        id: item.id || `media_${Date.now()}`,
        filename: item.filename,
        original_name: item.originalName,
        folder: item.folder,
        mime_type: item.mimeType,
        size: item.size,
        dimensions: item.dimensions,
        variants: item.variants,
        alt_text: item.alt,
        caption: item.caption,
        tags: item.tags,
        usage: item.usedIn?.[0] || null,
        storage_url: item.variants?.full || '',
        created_at: item.createdAt || new Date().toISOString(),
        updated_at: item.updatedAt || new Date().toISOString()
    };

    const { error } = await getClient()
        .from('media')
        .insert(snakeItem);

    if (error) {
        console.error('Error adding media item:', error);
        return false;
    }
    return true;
}

export async function updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<boolean> {
    // Convert camelCase to snake_case for Supabase
    const snakeUpdates: any = {};
    if (updates.filename) snakeUpdates.filename = updates.filename;
    if (updates.originalName) snakeUpdates.original_name = updates.originalName;
    if (updates.folder) snakeUpdates.folder = updates.folder;
    if (updates.mimeType) snakeUpdates.mime_type = updates.mimeType;
    if (updates.size !== undefined) snakeUpdates.size = updates.size;
    if (updates.dimensions) snakeUpdates.dimensions = updates.dimensions;
    if (updates.variants) snakeUpdates.variants = updates.variants;
    if (updates.alt) snakeUpdates.alt_text = updates.alt;
    if (updates.caption) snakeUpdates.caption = updates.caption;
    if (updates.tags) snakeUpdates.tags = updates.tags;
    snakeUpdates.updated_at = new Date().toISOString();

    const { error } = await getClient()
        .from('media')
        .update(snakeUpdates)
        .eq('id', id);

    if (error) {
        console.error('Error updating media item:', error);
        return false;
    }
    return true;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('media')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting media item:', error);
        return false;
    }
    return true;
}

export async function saveMediaItems(items: MediaItem[]): Promise<boolean> {
    const { error } = await getClient()
        .from('media')
        .upsert(items, { onConflict: 'id' });

    if (error) {
        console.error('Error saving media items:', error);
        return false;
    }
    return true;
}

export async function searchMedia(query: string): Promise<MediaItem[]> {
    const { data, error } = await getClient()
        .from('media')
        .select('*')
        .or(`filename.ilike.%${query}%,original_name.ilike.%${query}%,alt_text.ilike.%${query}%`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error searching media:', error);
        return [];
    }
    return (data || []).map(transformMedia);
}

export async function getMediaStats(): Promise<{ total: number; byFolder: Record<string, number>; totalSize: number }> {
    const items = await getMediaItems();

    const byFolder: Record<string, number> = {};
    let totalSize = 0;

    items.forEach((item: any) => {
        const folder = item.folder || 'general';
        byFolder[folder] = (byFolder[folder] || 0) + 1;
        totalSize += item.size || 0;
    });

    return {
        total: items.length,
        byFolder,
        totalSize
    };
}

// ==================== Holiday Effects ====================

// Transform Supabase holiday effect to frontend type
function transformHolidayEffect(data: any): HolidayEffect {
    return {
        ...data,
        effectTypes: data.effect_types || [],
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        primaryColor: data.primary_color || '#dc2626',
        secondaryColor: data.secondary_color || '#ffd700',
    };
}

export async function getHolidayEffects(): Promise<HolidayEffect[]> {
    const { data, error } = await getClient()
        .from('holiday_effects')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching holiday effects:', error);
        return [];
    }
    return (data || []).map(transformHolidayEffect);
}

export async function getHolidayEffectById(id: string): Promise<HolidayEffect | null> {
    const { data, error } = await getClient()
        .from('holiday_effects')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return transformHolidayEffect(data);
}

export async function getActiveHolidayEffects(): Promise<HolidayEffect[]> {
    const { data, error } = await getClient()
        .from('holiday_effects')
        .select('*')
        .eq('enabled', true);

    if (error) {
        console.error('Error fetching active holiday effects:', error);
        return [];
    }
    return (data || []).map(transformHolidayEffect);
}

export async function addHolidayEffect(effect: any): Promise<boolean> {
    const { error } = await getClient()
        .from('holiday_effects')
        .insert(effect);

    if (error) {
        console.error('Error adding holiday effect:', error);
        return false;
    }
    return true;
}

export async function updateHolidayEffect(id: string, updates: any): Promise<boolean> {
    const { error } = await getClient()
        .from('holiday_effects')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating holiday effect:', error);
        return false;
    }
    return true;
}

export async function deleteHolidayEffect(id: string): Promise<boolean> {
    const { error } = await getClient()
        .from('holiday_effects')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting holiday effect:', error);
        return false;
    }
    return true;
}

