import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// ── In-memory cache for real-time active users ──
// We only keep recent sessions in memory for "who's online now"
interface RecentVisit {
    sessionId: string;
    timestamp: number;
    path: string;
}

const recentVisits: RecentVisit[] = [];

function cleanupRecent() {
    const fiveMinAgo = Date.now() - 5 * 60 * 1000;
    while (recentVisits.length > 0 && recentVisits[0].timestamp < fiveMinAgo) {
        recentVisits.shift();
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

        // Save to Supabase (async, don't block response)
        const supabase = createAdminClient();
        if (supabase) {
            supabase
                .from('page_views')
                .insert({ path, session_id: sessionId, user_agent: userAgent, ip, referrer })
                .then(({ error }) => {
                    if (error) console.error('Track insert error:', error.message);
                });
        }

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

    const supabase = createAdminClient();
    if (!supabase) {
        return NextResponse.json({
            activeUsers,
            today: { pageviews: 0, visitors: 0 },
            week: { pageviews: 0, visitors: 0 },
            daily: [],
            topPages: [],
            error: 'Supabase not configured',
        });
    }

    try {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        const days = period === '30d' ? 30 : 7;
        const periodStart = new Date(now);
        periodStart.setDate(periodStart.getDate() - days);
        periodStart.setHours(0, 0, 0, 0);

        // Today's stats
        const { count: todayPageviews } = await supabase
            .from('page_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayStart.toISOString());

        const { data: todaySessionsData } = await supabase
            .from('page_views')
            .select('session_id')
            .gte('created_at', todayStart.toISOString());

        const todayVisitors = new Set(todaySessionsData?.map(r => r.session_id) || []).size;

        // Period stats
        const { count: periodPageviews } = await supabase
            .from('page_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', periodStart.toISOString());

        const { data: periodSessionsData } = await supabase
            .from('page_views')
            .select('session_id')
            .gte('created_at', periodStart.toISOString());

        const periodVisitors = new Set(periodSessionsData?.map(r => r.session_id) || []).size;

        // Daily breakdown
        const dailyStats: { date: string; pageviews: number; visitors: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            const { count: dayPV } = await supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', dayStart.toISOString())
                .lt('created_at', dayEnd.toISOString());

            const { data: daySessions } = await supabase
                .from('page_views')
                .select('session_id')
                .gte('created_at', dayStart.toISOString())
                .lt('created_at', dayEnd.toISOString());

            dailyStats.push({
                date: dayStart.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                pageviews: dayPV || 0,
                visitors: new Set(daySessions?.map(r => r.session_id) || []).size,
            });
        }

        // Top pages today
        const { data: topPagesData } = await supabase
            .from('page_views')
            .select('path')
            .gte('created_at', todayStart.toISOString());

        const pageCount: Record<string, number> = {};
        topPagesData?.forEach(r => {
            pageCount[r.path] = (pageCount[r.path] || 0) + 1;
        });
        const topPages = Object.entries(pageCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([path, count]) => ({ path, count }));

        return NextResponse.json({
            activeUsers,
            today: {
                pageviews: todayPageviews || 0,
                visitors: todayVisitors,
            },
            week: {
                pageviews: periodPageviews || 0,
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
