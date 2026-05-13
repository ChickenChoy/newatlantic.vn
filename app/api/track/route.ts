import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

const DATA_DIR = path.join(process.cwd(), 'data');
const PAGE_VIEWS_FILE = path.join(DATA_DIR, 'page-views.json');
const MAX_STORED_VIEWS = 5000;

// ── In-memory cache for real-time active users ──
// We only keep recent sessions in memory for "who's online now"
interface RecentVisit {
    sessionId: string;
    timestamp: number;
    path: string;
}

interface StoredPageView {
    path: string;
    sessionId: string;
    userAgent: string;
    ip: string;
    referrer: string;
    createdAt: string;
}

const recentVisits: RecentVisit[] = [];

function cleanupRecent() {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    while (recentVisits.length > 0 && recentVisits[0].timestamp < fiveMinAgo) {
        recentVisits.shift();
    }
}

function readPageViews(): StoredPageView[] {
    try {
        if (!fs.existsSync(PAGE_VIEWS_FILE)) return [];
        return JSON.parse(fs.readFileSync(PAGE_VIEWS_FILE, 'utf-8')) as StoredPageView[];
    } catch {
        return [];
    }
}

function writePageViews(views: StoredPageView[]): void {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        fs.writeFileSync(PAGE_VIEWS_FILE, JSON.stringify(views.slice(-MAX_STORED_VIEWS), null, 2), 'utf-8');
    } catch (error) {
        console.error('Track write error:', error);
    }
}

// POST /api/track — Record a page visit
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const path = body.path || '/';
        const sessionId = body.sessionId || 'unknown';
        const userAgent = request.headers.get('user-agent') || '';
        const forwarded = request.headers.get('x-forwarded-for');
        const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
        const referrer = request.headers.get('referer') || '';

        // Add to in-memory recent for real-time
        recentVisits.push({ sessionId, timestamp: Date.now(), path });
        if (recentVisits.length > 500) cleanupRecent(); // keep memory bounded

        const views = readPageViews();
        views.push({ path, sessionId, userAgent, ip, referrer, createdAt: new Date().toISOString() });
        writePageViews(views);

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
}

// GET /api/track — Get site stats
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Real-time active users (from memory)
    cleanupRecent();
    const activeUsers = new Set(recentVisits.map(v => v.sessionId)).size;

    try {
        const views = readPageViews();
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const days = period === '30d' ? 30 : 7;
        const periodStart = new Date(now);
        periodStart.setDate(periodStart.getDate() - days);
        periodStart.setHours(0, 0, 0, 0);

        const todayViews = views.filter(view => new Date(view.createdAt) >= todayStart);
        const periodViews = views.filter(view => new Date(view.createdAt) >= periodStart);
        const todayVisitors = new Set(todayViews.map(view => view.sessionId)).size;
        const periodVisitors = new Set(periodViews.map(view => view.sessionId)).size;

        // Daily breakdown
        const dailyStats: { date: string; pageviews: number; visitors: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const dayViews = views.filter(view => {
                const createdAt = new Date(view.createdAt);
                return createdAt >= dayStart && createdAt < dayEnd;
            });

            dailyStats.push({
                date: dayStart.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                pageviews: dayViews.length,
                visitors: new Set(dayViews.map(view => view.sessionId)).size,
            });
        }

        // Top pages today
        const pageCount: Record<string, number> = {};
        todayViews.forEach(view => {
            pageCount[view.path] = (pageCount[view.path] || 0) + 1;
        });
        const topPages = Object.entries(pageCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, count]) => ({ path, count }));

        return NextResponse.json({
            activeUsers,
            today: {
                pageviews: todayViews.length,
                visitors: todayVisitors,
            },
            week: {
                pageviews: periodViews.length,
                visitors: periodVisitors,
            },
            daily: dailyStats,
            topPages,
        });
    } catch (error) {
        console.error('Track stats error:', error);
        return NextResponse.json({
            activeUsers,
            today: { pageviews: 0, visitors: 0 },
            week: { pageviews: 0, visitors: 0 },
            daily: [],
            topPages: [],
            error: 'Failed to fetch stats',
        });
    }
}
