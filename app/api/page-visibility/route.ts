import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getPageVisibility, savePageVisibility } from '@/lib/db';
import type { PageVisibility } from '@/types';

interface PageVisibilityApiItem {
    id: string;
    path: string;
    name: string;
    description: string;
    visible: boolean;
    order: number;
    order_index: number;
    updated_at?: string;
    isAutoDetected?: boolean;
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

function toApiPage(page: PageVisibility): PageVisibilityApiItem {
    return {
        ...page,
        description: page.description || '',
        order: page.order ?? 0,
        order_index: page.order ?? 0,
    };
}

function getPagesWithDetectedRoutes(): PageVisibility[] {
    const detectedRoutes = scanRoutes();
    const pages = getPageVisibility();
    const existingPaths = new Set(pages.map(page => page.path));
    const maxOrder = pages.reduce((max, page) => Math.max(max, page.order || 0), 0);
    const newPages = detectedRoutes
        .filter(route => !existingPaths.has(route))
        .map((route, index) => generatePageInfo(route, maxOrder + index));

    const mergedPages = [...pages, ...newPages].sort((a, b) => (a.order || 0) - (b.order || 0));

    if (newPages.length > 0) {
        savePageVisibility(mergedPages);
    }

    return mergedPages;
}

// GET - Get all page visibility settings
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pagePath = searchParams.get('path');
        const pages = getPagesWithDetectedRoutes();

        // If path is provided, check if that specific page is visible
        if (pagePath) {
            const page = pages.find((p: PageVisibility) =>
                pagePath === p.path || pagePath.startsWith(p.path + '/')
            );

            if (page) {
                const apiPage = toApiPage(page);
                return NextResponse.json({
                    visible: apiPage.visible,
                    page: apiPage
                });
            }

            // If page not found in config, default to visible
            return NextResponse.json({ visible: true, page: null });
        }

        // Mark pages as auto-detected if not in ROUTE_NAME_MAP
        const pagesWithDetection = pages.map((page: PageVisibility) => ({
            ...toApiPage(page),
            isAutoDetected: !ROUTE_NAME_MAP[page.path]
        }));

        return NextResponse.json(pagesWithDetection);
    } catch (error) {
        console.error('Error in GET /api/page-visibility:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update page visibility
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, visible, path: pagePath } = body;

        if (!id && !pagePath) {
            return NextResponse.json({ error: 'ID or path is required' }, { status: 400 });
        }

        const pages = getPagesWithDetectedRoutes();
        const index = pages.findIndex(page => id ? page.id === id : page.path === pagePath);

        if (index === -1) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        pages[index] = { ...pages[index], visible };

        if (!savePageVisibility(pages)) {
            return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
        }

        return NextResponse.json(toApiPage(pages[index]));
    } catch (error) {
        console.error('Error in PUT /api/page-visibility:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
