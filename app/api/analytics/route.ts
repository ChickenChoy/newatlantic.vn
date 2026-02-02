import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Initialize the Google Analytics Data API client
// Requires GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON
// Or GOOGLE_ANALYTICS_CREDENTIALS env var with JSON string of credentials
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient(): BetaAnalyticsDataClient | null {
    if (analyticsDataClient) return analyticsDataClient;

    try {
        // Option 1: Use GOOGLE_ANALYTICS_CREDENTIALS as JSON string
        const credentialsJson = process.env.GOOGLE_ANALYTICS_CREDENTIALS;
        if (credentialsJson) {
            const credentials = JSON.parse(credentialsJson);
            analyticsDataClient = new BetaAnalyticsDataClient({ credentials });
            return analyticsDataClient;
        }

        // Option 2: Use GOOGLE_APPLICATION_CREDENTIALS file path
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            analyticsDataClient = new BetaAnalyticsDataClient();
            return analyticsDataClient;
        }

        return null;
    } catch (error) {
        console.error('Failed to initialize GA4 client:', error);
        return null;
    }
}

// GET /api/analytics - Get traffic data from Google Analytics 4
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const propertyId = process.env.GA4_PROPERTY_ID;

    // Check if GA4 is configured
    if (!propertyId) {
        return NextResponse.json({
            configured: false,
            error: 'GA4_PROPERTY_ID not configured',
            message: 'Cần cấu hình Google Analytics 4. Xem hướng dẫn tại /admin?tab=traffic',
            simulated: true,
            data: generateSimulatedData(period),
        });
    }

    const client = getAnalyticsClient();
    if (!client) {
        return NextResponse.json({
            configured: false,
            error: 'Analytics credentials not configured',
            message: 'Cần cấu hình Google Analytics credentials',
            simulated: true,
            data: generateSimulatedData(period),
        });
    }

    try {
        const days = period === '30d' ? 30 : 7;
        const startDate = `${days}daysAgo`;

        // Fetch traffic data
        const [trafficResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'totalUsers' },
                { name: 'sessions' },
            ],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
        });

        // Fetch device data
        const [deviceResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'sessions' }],
        });

        // Fetch browser data
        const [browserResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'browser' }],
            metrics: [{ name: 'totalUsers' }],
            orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
            limit: 5,
        });

        // Fetch real-time data
        const [realtimeResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            metrics: [{ name: 'activeUsers' }],
        });

        // Process traffic data
        const trafficData = trafficResponse.rows?.map(row => ({
            date: formatDate(row.dimensionValues?.[0]?.value || ''),
            pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
            visitors: parseInt(row.metricValues?.[1]?.value || '0'),
            sessions: parseInt(row.metricValues?.[2]?.value || '0'),
        })) || [];

        // Process device data
        const totalDeviceSessions = deviceResponse.rows?.reduce((sum, row) =>
            sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

        const deviceData = deviceResponse.rows?.map(row => {
            const sessions = parseInt(row.metricValues?.[0]?.value || '0');
            const deviceName = row.dimensionValues?.[0]?.value || 'Unknown';
            return {
                device: formatDeviceName(deviceName),
                sessions,
                percentage: Math.round((sessions / totalDeviceSessions) * 100),
            };
        }) || [];

        // Process browser data
        const totalBrowserUsers = browserResponse.rows?.reduce((sum, row) =>
            sum + parseInt(row.metricValues?.[0]?.value || '0'), 0) || 1;

        const browserData = browserResponse.rows?.map(row => {
            const users = parseInt(row.metricValues?.[0]?.value || '0');
            const browserName = row.dimensionValues?.[0]?.value || 'Unknown';
            return {
                browser: browserName,
                users,
                percentage: Math.round((users / totalBrowserUsers) * 100),
            };
        }) || [];

        // Real-time active users
        const activeUsers = parseInt(realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0');

        return NextResponse.json({
            configured: true,
            simulated: false,
            data: {
                traffic: trafficData,
                devices: deviceData,
                browsers: browserData,
                realtime: {
                    activeUsers,
                },
                totals: {
                    pageviews: trafficData.reduce((sum, d) => sum + d.pageviews, 0),
                    visitors: trafficData.reduce((sum, d) => sum + d.visitors, 0),
                    sessions: trafficData.reduce((sum, d) => sum + d.sessions, 0),
                },
            },
        });

    } catch (error) {
        console.error('GA4 API Error:', error);
        return NextResponse.json({
            configured: true,
            error: 'Failed to fetch analytics data',
            message: error instanceof Error ? error.message : 'Unknown error',
            simulated: true,
            data: generateSimulatedData(period),
        });
    }
}

// Helper: Format date from YYYYMMDD to DD/MM
function formatDate(dateStr: string): string {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${day}/${month}`;
}

// Helper: Format device name to Vietnamese
function formatDeviceName(name: string): string {
    const deviceMap: Record<string, string> = {
        'desktop': 'Desktop',
        'mobile': 'Mobile',
        'tablet': 'Tablet',
    };
    return deviceMap[name.toLowerCase()] || name;
}

// Generate simulated data when GA4 is not configured
function generateSimulatedData(period: string) {
    const days = period === '30d' ? 30 : 7;
    const traffic = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const baseMultiplier = isWeekend ? 0.6 : 1;
        const randomFactor = 0.7 + Math.random() * 0.6;

        const visitors = Math.floor(50 + 100 * baseMultiplier * randomFactor);
        const sessions = Math.floor(visitors * (1.2 + Math.random() * 0.3));
        const pageviews = Math.floor(sessions * (2 + Math.random() * 2));

        traffic.push({
            date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            pageviews,
            visitors,
            sessions,
        });
    }

    return {
        traffic,
        devices: [
            { device: 'Desktop', percentage: 52, sessions: 520 },
            { device: 'Mobile', percentage: 38, sessions: 380 },
            { device: 'Tablet', percentage: 10, sessions: 100 },
        ],
        browsers: [
            { browser: 'Chrome', percentage: 60, users: 600 },
            { browser: 'Safari', percentage: 20, users: 200 },
            { browser: 'Firefox', percentage: 10, users: 100 },
            { browser: 'Edge', percentage: 7, users: 70 },
            { browser: 'Other', percentage: 3, users: 30 },
        ],
        realtime: {
            activeUsers: Math.floor(Math.random() * 10) + 1,
        },
        totals: {
            pageviews: traffic.reduce((sum, d) => sum + d.pageviews, 0),
            visitors: traffic.reduce((sum, d) => sum + d.visitors, 0),
            sessions: traffic.reduce((sum, d) => sum + d.sessions, 0),
        },
    };
}
