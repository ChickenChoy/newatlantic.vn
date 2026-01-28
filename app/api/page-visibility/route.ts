import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'page-visibility.json');
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
    '/chuong-trinh-goi-banh-trung': { name: 'Chương trình gói bánh chưng', description: 'Trang chương trình Tết' },
    '/masttech': { name: 'MastTech', description: 'Trang MastTech' },
    '/chinh-sach-bao-mat': { name: 'Chính sách bảo mật', description: 'Trang chính sách bảo mật' },
    '/dieu-khoan-dich-vu': { name: 'Điều khoản dịch vụ', description: 'Trang điều khoản dịch vụ' },
};

// Helper to read saved visibility data
function readSavedData(): Record<string, { visible: boolean; order?: number }> {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            const pages = JSON.parse(data);
            const map: Record<string, { visible: boolean; order?: number }> = {};
            for (const page of pages) {
                map[page.path] = { visible: page.visible, order: page.order };
            }
            return map;
        }
        return {};
    } catch (error) {
        console.error('Error reading page visibility data:', error);
        return {};
    }
}

// Helper to write data
function writeData(data: unknown) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error writing page visibility data:', error);
        return false;
    }
}

// Scan app directory for routes
function scanRoutes(): string[] {
    const routes: string[] = [];

    function scanDir(dir: string, basePath: string = '') {
        try {
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
    if (fs.existsSync(path.join(APP_DIR, 'page.tsx')) ||
        fs.existsSync(path.join(APP_DIR, 'page.js'))) {
        routes.push('/');
    }

    scanDir(APP_DIR);

    return routes;
}

// Generate page info from path
function generatePageInfo(routePath: string, savedData: Record<string, { visible: boolean; order?: number }>, index: number) {
    const mapping = ROUTE_NAME_MAP[routePath];
    const saved = savedData[routePath];

    // Generate ID from path
    const id = routePath === '/' ? 'home' : routePath.replace(/\//g, '-').replace(/^-/, '');

    return {
        id,
        path: routePath,
        name: mapping?.name || formatRouteName(routePath),
        description: mapping?.description || '',
        visible: saved?.visible ?? true, // Default to visible if not saved
        order: saved?.order ?? index + 1,
        isAutoDetected: !mapping // Flag to show if it was auto-detected without mapping
    };
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

// GET - Get all page visibility settings with auto-detection
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const pagePath = searchParams.get('path');

        // Get saved visibility data
        const savedData = readSavedData();

        // Scan routes from app directory
        const detectedRoutes = scanRoutes();

        // Generate page list
        const pages = detectedRoutes.map((route, index) =>
            generatePageInfo(route, savedData, index)
        );

        // Sort by order
        pages.sort((a, b) => a.order - b.order);

        // If path is provided, check if that specific page is visible
        if (pagePath) {
            const page = pages.find(p =>
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

        return NextResponse.json(pages);
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

        // Read existing data
        let pages: Array<{ id: string; path: string; visible: boolean; order: number; name: string; description: string }> = [];
        try {
            if (fs.existsSync(DATA_FILE)) {
                pages = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            }
        } catch {
            pages = [];
        }

        // Find the page to update
        const targetPath = pagePath || '/' + id.replace(/-/g, '/').replace(/^\//, '');
        let pageIndex = pages.findIndex(p => p.id === id || p.path === targetPath);

        if (pageIndex === -1) {
            // Add new entry if not found
            const mapping = ROUTE_NAME_MAP[targetPath];
            pages.push({
                id: id || targetPath.replace(/\//g, '-').replace(/^-/, ''),
                path: targetPath,
                name: mapping?.name || formatRouteName(targetPath),
                description: mapping?.description || '',
                visible: visible ?? true,
                order: pages.length + 1
            });
            pageIndex = pages.length - 1;
        } else {
            // Update existing
            if (typeof visible === 'boolean') {
                pages[pageIndex].visible = visible;
            }
        }

        if (!writeData(pages)) {
            return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
        }

        return NextResponse.json(pages[pageIndex]);
    } catch (error) {
        console.error('Error in PUT /api/page-visibility:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
