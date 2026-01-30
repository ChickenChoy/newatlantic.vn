import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Lazy-loaded Supabase client for server-side
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
    if (supabase) return supabase;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn('Supabase credentials not configured. Page visibility features will be disabled.');
        return null;
    }

    supabase = createClient(supabaseUrl, supabaseServiceKey);
    return supabase;
}

const APP_DIR = path.join(process.cwd(), 'app');

// Routes to exclude from auto-detection
const EXCLUDED_ROUTES = [
    '/api',           // API routes
    '/admin',         // Admin pages
];

// Route name mappings (path -> friendly name)
const ROUTE_NAME_MAP: Record<string, { name: string; description: string }> = {
    '/': { name: 'Trang chủ', description: 'Trang chủ website' },
    '/san-pham': { name: 'Sản phẩm', description: 'Trang danh sách sản phẩm' },
    '/tin-tuc': { name: 'Tin tức', description: 'Trang tin tức & sự kiện' },
    '/thu-vien-hinh-anh': { name: 'Thư viện hình ảnh', description: 'Trang thư viện hình ảnh' },
    '/lien-he': { name: 'Liên hệ', description: 'Trang liên hệ' },
    '/yeu-thich': { name: 'Yêu thích', description: 'Trang sản phẩm yêu thích' },
    '/page-download-catalog': { name: 'Tải Catalog', description: 'Trang tải catalog sản phẩm' },
    '/chuong-trinh-goi-banh-chung': { name: 'Chương trình gói bánh chưng', description: 'Trang chương trình TẾT' },
    '/masttech': { name: 'MastTech', description: 'Trang MastTech' },
    '/chinh-sach-bao-mat': { name: 'Chính sách bảo mật', description: 'Trang chính sách bảo mật' },
    '/dieu-khoan-dich-vu': { name: 'Điều khoản dịch vụ', description: 'Trang điều khoản dịch vụ' },
};

// Scan app directory for routes (runs on server only)
function scanRoutes(): string[] {
    const routes: string[] = [];

    function scanDir(dir: string, basePath: string = '') {
        try {
            if (!fs.existsSync(dir)) return;
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    // Skip excluded directories
                    if (item.startsWith('_') || item.startsWith('.')) continue;

                    const routePath = basePath + '/' + item;

                    // Check if this is an excluded route
                    const isExcluded = EXCLUDED_ROUTES.some(excluded =>
                        routePath === excluded || routePath.startsWith(excluded + '/')
                    );
                    if (isExcluded) continue;

                    // Skip dynamic routes like [slug], [category]
                    if (item.startsWith('[') && item.endsWith(']')) continue;

                    // Check if directory has a page.tsx (is a valid route)
                    const hasPage = fs.existsSync(path.join(fullPath, 'page.tsx')) ||
                        fs.existsSync(path.join(fullPath, 'page.js'));

                    if (hasPage) {
                        routes.push(routePath);
                    }

                    // Recursively scan subdirectories
                    scanDir(fullPath, routePath);
                }
            }
        } catch (error) {
            console.error('Error scanning directory:', dir, error);
        }
    }

    // Check if root has page.tsx (home page)
    try {
        if (fs.existsSync(path.join(APP_DIR, 'page.tsx')) ||
            fs.existsSync(path.join(APP_DIR, 'page.js'))) {
            routes.push('/');
        }
        scanDir(APP_DIR);
    } catch (error) {
        console.error('Error scanning app directory:', error);
    }

    return routes;
}

// Format route path to readable name
function formatRouteName(routePath: string): string {
    if (routePath === '/') return 'Trang chủ';

    // Remove leading slash and replace hyphens with spaces
    const name = routePath
        .replace(/^\//, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word

    return name;
}

// Generate page info from path
function generatePageInfo(routePath: string, index: number) {
    const mapping = ROUTE_NAME_MAP[routePath];
    const id = routePath === '/' ? 'home' : routePath.replace(/\//g, '-').replace(/^-/, '');

    return {
        id,
        path: routePath,
        name: mapping?.name || formatRouteName(routePath),
        description: mapping?.description || '',
        visible: true, // Default to visible
        order: index + 1,
        isAutoDetected: !mapping
    };
}

// Sync detected routes to Supabase (add new pages, don't remove existing)
async function syncRoutesToDatabase(detectedRoutes: string[]) {
    const client = getSupabaseClient();
    if (!client) return; // Supabase not configured, skip sync

    try {
        // Get existing pages from database
        const { data: existingPages, error: fetchError } = await client
            .from('page_visibility')
            .select('path');

        if (fetchError) {
            console.error('Error fetching existing pages:', fetchError);
            return;
        }

        const existingPaths = new Set(existingPages?.map(p => p.path) || []);

        // Find new routes that don't exist in database
        const newRoutes = detectedRoutes.filter(route => !existingPaths.has(route));

        if (newRoutes.length > 0) {
            // Get max order
            const { data: maxOrderData } = await client
                .from('page_visibility')
                .select('order')
                .order('order', { ascending: false })
                .limit(1);

            const maxOrder = maxOrderData?.[0]?.order || 0;

            // Insert new pages
            const newPages = newRoutes.map((route, index) => {
                const info = generatePageInfo(route, maxOrder + index);
                return {
                    id: info.id,
                    path: info.path,
                    name: info.name,
                    description: info.description,
                    visible: true,
                    order: maxOrder + index + 1
                };
            });

            const { error: insertError } = await client
                .from('page_visibility')
                .upsert(newPages, { onConflict: 'id' });

            if (insertError) {
                console.error('Error inserting new pages:', insertError);
            } else {
                console.log(`Synced ${newPages.length} new pages to database`);
            }
        }
    } catch (error) {
        console.error('Error syncing routes to database:', error);
    }
}

// GET - Get all page visibility settings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pagePath = searchParams.get('path');
        const client = getSupabaseClient();

        // Scan routes
        const detectedRoutes = scanRoutes();

        // If Supabase is not configured, return file-based routes
        if (!client) {
            const fallbackPages = detectedRoutes.map((route, index) => generatePageInfo(route, index));

            if (pagePath) {
                const page = fallbackPages.find(p => pagePath === p.path || pagePath.startsWith(p.path + '/'));
                return NextResponse.json({ visible: true, page: page || null });
            }

            return NextResponse.json(fallbackPages);
        }

        // Sync new routes to database
        await syncRoutesToDatabase(detectedRoutes);

        // Fetch all pages from database
        const { data: pages, error } = await client
            .from('page_visibility')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching pages from database:', error);
            return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
        }

        // If path is provided, check if that specific page is visible
        if (pagePath) {
            const page = pages?.find(p =>
                pagePath === p.path || pagePath.startsWith(p.path + '/')
            );

            if (page) {
                return NextResponse.json({
                    visible: page.visible,
                    page: page
                });
            }

            // If page not found in config, default to visible
            return NextResponse.json({ visible: true, page: null });
        }

        // Mark pages as auto-detected if not in ROUTE_NAME_MAP
        const pagesWithDetection = pages?.map(page => ({
            ...page,
            isAutoDetected: !ROUTE_NAME_MAP[page.path]
        })) || [];

        return NextResponse.json(pagesWithDetection);
    } catch (error) {
        console.error('Error in GET /api/page-visibility:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update page visibility
export async function PUT(request: NextRequest) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
        }

        const body = await request.json();
        const { id, visible, path: pagePath } = body;

        if (!id && !pagePath) {
            return NextResponse.json({ error: 'ID or path is required' }, { status: 400 });
        }

        // Update in database
        const { data, error } = await client
            .from('page_visibility')
            .update({
                visible: visible,
                updated_at: new Date().toISOString()
            })
            .eq(id ? 'id' : 'path', id || pagePath)
            .select()
            .single();

        if (error) {
            console.error('Error updating page visibility:', error);
            return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in PUT /api/page-visibility:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}