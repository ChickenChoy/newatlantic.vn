import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// ─── API routes that are ALWAYS admin-only (all methods) ───────────────
const ADMIN_ONLY_ROUTES = [
    '/api/system-health',
    '/api/analytics',
    '/api/activity-logs',
    '/api/database',
    '/api/init',
    '/api/users',
    '/api/media',
    '/api/video-upload',
    '/api/seo',
    '/api/totp',
];

// ─── API routes that allow PUBLIC reads but require auth for writes ────
const PUBLIC_READ_ROUTES = [
    '/api/products',
    '/api/categories',
    '/api/posts',
    '/api/post-categories',
    '/api/gallery',
    '/api/hero-slides',
    '/api/partner-logos',
    '/api/global-partners',
    '/api/certifications',
    '/api/testimonials',
    '/api/faqs',
    '/api/footer-links',
    '/api/homepage-services',
    '/api/homepage-stats',
    '/api/catalogs',
    '/api/navbar-settings',
    '/api/office-locations',
    '/api/site-settings',
    '/api/page-visibility',
    '/api/holiday-effects',
    '/api/video',
];

// ─── Special rules ────────────────────────────────────────────────────
// POST /api/track  → public (SiteTracker pings)
// GET  /api/track  → admin-only (stats dashboard)

function isAdminOnlyRoute(pathname: string): boolean {
    return ADMIN_ONLY_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
    );
}

function isPublicReadRoute(pathname: string): boolean {
    return PUBLIC_READ_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(route + '/')
    );
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only apply to /api routes
    if (!pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // ── Special case: /api/track ──────────────────────────────────────
    if (pathname === '/api/track') {
        if (request.method === 'POST') {
            return NextResponse.next(); // public – SiteTracker
        }
        // GET → requires auth (falls through to auth check below)
    }

    // ── Determine if this request needs auth ──────────────────────────
    const needsAuth =
        isAdminOnlyRoute(pathname) ||
        (isPublicReadRoute(pathname) && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) ||
        pathname === '/api/track'; // GET /api/track

    if (!needsAuth) {
        return NextResponse.next();
    }

    // ── Verify Supabase session ──────────────────────────────────
    let response = NextResponse.next({ request });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // If Supabase is not configured, block admin routes entirely
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                request.cookies.set({ name, value, ...options });
                response = NextResponse.next({ request });
                response.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
                request.cookies.set({ name, value: '', ...options });
                response = NextResponse.next({ request });
                response.cookies.set({ name, value: '', ...options });
            },
        },
    });

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized – admin login required' },
            { status: 401 }
        );
    }

    return response;
}

export const config = {
    matcher: ['/api/:path*'],
};
