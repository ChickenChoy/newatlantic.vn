/**
 * Seed Supabase from JSON files
 * Run: npx ts-node scripts/seed-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

const DATA_DIR = path.join(process.cwd(), 'data');

function readJsonFile(filename: string): any[] {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️ File not found: ${filename}`);
        return [];
    }
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`  ❌ Error reading ${filename}:`, error);
        return [];
    }
}

async function seedTable(tableName: string, filename: string, transform?: (data: any[]) => any[]) {
    console.log(`\n📦 Seeding ${tableName}...`);

    let data = readJsonFile(filename);
    if (data.length === 0) {
        console.log(`  ⚠️ No data to seed for ${tableName}`);
        return;
    }

    if (transform) {
        data = transform(data);
    }

    // Delete existing data first
    const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
        console.log(`  ⚠️ Could not clear ${tableName}:`, deleteError.message);
    }

    // Insert new data in batches of 100
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const { error } = await supabase
            .from(tableName)
            .upsert(batch, { onConflict: 'id' });

        if (error) {
            console.error(`  ❌ Error inserting batch:`, error.message);
        } else {
            inserted += batch.length;
        }
    }

    console.log(`  ✅ Inserted ${inserted}/${data.length} records`);
}

// Transform product data to match Supabase schema
function transformProducts(products: any[]): any[] {
    return products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        category_name: p.categoryName,
        description: p.description || p.fullDescription || '',
        short_description: p.shortDescription || '',
        price: null,
        images: p.images || [],
        thumbnail: p.image || p.thumbnail,
        specifications: p.specifications || {},
        features: p.features || [],
        brand: p.brand,
        sku: p.sku,
        in_stock: true,
        is_featured: p.featured || false,
        is_new: p.isNew || false,
        is_bestseller: p.isBestseller || false,
        meta_title: p.metaTitle,
        meta_description: p.metaDescription,
        order_index: p.order || 0,
        enabled: true
    }));
}

// Transform post data
function transformPosts(posts: any[]): any[] {
    return posts.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        featured_image: p.image || p.featuredImage,
        thumbnail: p.thumbnail,
        category: p.category,
        category_name: p.categoryName,
        tags: p.tags || [],
        author: p.author,
        author_name: p.authorName,
        status: p.status || 'published',
        views: p.views || 0,
        is_featured: p.featured || false,
        order_index: p.order || 0,
        published_at: p.date || p.publishedAt
    }));
}

// Transform hero slides
function transformHeroSlides(slides: any[]): any[] {
    return slides.map((s, index) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        label: s.label,
        description: s.description,
        image: s.image,
        video: s.video,
        link: s.link,
        link_text: s.linkText,
        order_index: s.order ?? index,
        enabled: s.enabled !== false
    }));
}

// Transform post categories
function transformPostCategories(cats: any[]): any[] {
    return cats.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        order_index: c.order ?? 0,
        enabled: c.enabled !== false
    }));
}

// Transform homepage stats
function transformHomepageStats(stats: any[]): any[] {
    return stats.map((s, i) => ({
        id: s.id,
        label: s.label,
        value: s.value,
        suffix: s.suffix,
        icon: s.icon,
        order_index: s.order ?? i,
        enabled: s.enabled !== false
    }));
}

// Transform homepage services  
function transformHomepageServices(services: any[]): any[] {
    return services.map((s, i) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        color: s.color,
        link: s.link,
        order_index: s.order ?? i,
        enabled: s.enabled !== false
    }));
}

// Transform partner logos
function transformPartnerLogos(logos: any[]): any[] {
    return logos.map((l, i) => ({
        id: l.id,
        name: l.name,
        logo: l.logo,
        url: l.url,
        order_index: l.order ?? i,
        enabled: l.enabled !== false
    }));
}

// Transform testimonials
function transformTestimonials(items: any[]): any[] {
    return items.map((t, i) => ({
        id: t.id,
        name: t.name,
        position: t.position,
        company: t.company,
        text: t.text,
        rating: t.rating ?? 5,
        image: t.image,
        order_index: t.order ?? i,
        enabled: t.enabled !== false
    }));
}

// Transform gallery images
function transformGalleryImages(images: any[]): any[] {
    return images.map((img, i) => ({
        id: img.id,
        src: img.src,
        alt: img.alt,
        title: img.title,
        description: img.description,
        category: img.category,
        tags: img.tags || [],
        featured: img.featured || false,
        order_index: img.order ?? i
    }));
}

// Transform catalogs
function transformCatalogs(catalogs: any[]): any[] {
    return catalogs.map((c, i) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        brand: c.brand,
        download_url: c.downloadUrl,
        thumbnail: c.thumbnail,
        file_size: c.fileSize,
        order_index: c.order ?? i,
        enabled: c.enabled !== false
    }));
}

// Transform FAQs
function transformFAQs(faqs: any[]): any[] {
    return faqs.map((f, i) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        order_index: f.order ?? i,
        enabled: f.enabled !== false
    }));
}

// Transform certifications
function transformCertifications(certs: any[]): any[] {
    return certs.map((c, i) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        icon: c.icon,
        image: c.image,
        order_index: c.order ?? i,
        enabled: c.enabled !== false
    }));
}

// Transform office locations
function transformOfficeLocations(locations: any[]): any[] {
    return locations.map((l, i) => ({
        id: l.id,
        name: l.name,
        type: l.type || 'branch',
        region: l.region,
        address: l.address,
        phone: l.phone,
        email: l.email,
        google_maps_url: l.googleMapsUrl,
        directions_url: l.directionsUrl,
        latitude: l.latitude,
        longitude: l.longitude,
        order_index: l.order ?? i,
        enabled: l.enabled !== false
    }));
}

// Transform footer links
function transformFooterLinks(links: any[]): any[] {
    return links.map((l, i) => ({
        id: l.id,
        label: l.label,
        href: l.href,
        section: l.section,
        is_external: l.isExternal || false,
        order_index: l.order ?? i,
        enabled: l.enabled !== false
    }));
}

// Transform holiday effects data
function transformHolidayEffects(effects: any[]): any[] {
    return effects.map(e => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        enabled: e.enabled || false,
        start_date: e.startDate,
        end_date: e.endDate,
        effect_types: e.effectTypes || [],
        description: e.description || '',
        primary_color: e.primaryColor || '#3b82f6',
        secondary_color: e.secondaryColor || '#fbbf24'
    }));
}

// Extract all images from products to media table
function extractMediaFromProducts(products: any[]): any[] {
    const mediaItems: any[] = [];
    const seenUrls = new Set<string>();

    products.forEach(product => {
        // Add main image
        if (product.image && !seenUrls.has(product.image)) {
            seenUrls.add(product.image);
            const filename = product.image.split('/').pop() || 'unknown.jpg';
            mediaItems.push({
                id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                filename: filename,
                original_name: filename,
                folder: 'products',
                mime_type: getMimeType(filename),
                size: 0, // Unknown size
                dimensions: null,
                variants: {},
                alt_text: product.name,
                caption: product.shortDescription?.substring(0, 200) || '',
                tags: [product.category, product.categoryName].filter(Boolean),
                usage: { type: 'product', productId: product.id },
                storage_url: product.image,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        // Add additional images
        if (product.images && Array.isArray(product.images)) {
            product.images.forEach((imgUrl: string) => {
                if (imgUrl && !seenUrls.has(imgUrl)) {
                    seenUrls.add(imgUrl);
                    const filename = imgUrl.split('/').pop() || 'unknown.jpg';
                    mediaItems.push({
                        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        filename: filename,
                        original_name: filename,
                        folder: 'products',
                        mime_type: getMimeType(filename),
                        size: 0,
                        dimensions: null,
                        variants: {},
                        alt_text: product.name,
                        caption: '',
                        tags: [product.category, product.categoryName].filter(Boolean),
                        usage: { type: 'product', productId: product.id },
                        storage_url: imgUrl,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                }
            });
        }
    });

    return mediaItems;
}

// Helper to get MIME type from filename
function getMimeType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'bmp': 'image/bmp'
    };
    return mimeTypes[ext || ''] || 'image/jpeg';
}

async function main() {
    console.log('🚀 Starting Supabase seed from JSON files...\n');
    console.log(`Supabase URL: ${supabaseUrl}`);

    try {
        // Core content
        await seedTable('categories', 'categories.json');
        await seedTable('products', 'products.json', transformProducts);
        await seedTable('posts', 'posts.json', transformPosts);
        await seedTable('post_categories', 'post-categories.json', transformPostCategories);

        // Homepage content
        await seedTable('hero_slides', 'hero-slides.json', transformHeroSlides);
        await seedTable('homepage_stats', 'homepage-stats.json', transformHomepageStats);
        await seedTable('homepage_services', 'homepage-services.json', transformHomepageServices);
        await seedTable('partner_logos', 'partner-logos.json', transformPartnerLogos);
        await seedTable('testimonials', 'testimonials.json', transformTestimonials);

        // Other content
        await seedTable('gallery_images', 'gallery-images.json', transformGalleryImages);
        await seedTable('catalogs', 'catalogs.json', transformCatalogs);
        await seedTable('faqs', 'faqs.json', transformFAQs);
        await seedTable('certifications', 'certifications.json', transformCertifications);
        await seedTable('office_locations', 'office-locations.json', transformOfficeLocations);
        await seedTable('footer_links', 'footer-links.json', transformFooterLinks);

        // Holiday effects
        await seedTable('holiday_effects', 'holiday-effects.json', transformHolidayEffects);

        // Extract and seed media from products
        console.log('\n📦 Seeding media from products...');
        const products = readJsonFile('products.json');
        if (products && products.length > 0) {
            const mediaItems = extractMediaFromProducts(products);
            if (mediaItems.length > 0) {
                // Clear existing product media first
                await supabase
                    .from('media')
                    .delete()
                    .eq('folder', 'products');

                // Insert new media items in batches
                const batchSize = 50;
                let insertedCount = 0;
                for (let i = 0; i < mediaItems.length; i += batchSize) {
                    const batch = mediaItems.slice(i, i + batchSize);
                    const { error } = await supabase
                        .from('media')
                        .insert(batch);

                    if (error) {
                        console.error(`  ⚠️ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
                    } else {
                        insertedCount += batch.length;
                    }
                }
                console.log(`  ✅ Inserted ${insertedCount}/${mediaItems.length} media items from products`);
            }
        }

        // Settings
        const siteSettings = readJsonFile('site-settings.json');
        if (siteSettings && Object.keys(siteSettings).length > 0) {
            console.log('\n📦 Seeding site_settings...');
            const { error } = await supabase
                .from('site_settings')
                .upsert({ key: 'main', value: siteSettings }, { onConflict: 'key' });

            if (error) {
                console.error('  ❌ Error:', error.message);
            } else {
                console.log('  ✅ Site settings saved');
            }
        }

        console.log('\n✨ Seed completed successfully!');

    } catch (error) {
        console.error('\n❌ Seed failed:', error);
        process.exit(1);
    }
}

main();

