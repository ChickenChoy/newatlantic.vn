import { NextResponse } from 'next/server';

// Track server start time for uptime calculation
const SERVER_START_TIME = Date.now();

export async function GET() {
    const now = Date.now();
    const uptimeMs = now - SERVER_START_TIME;

    // Calculate uptime components
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    // Memory usage (Node.js process)
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);

    // Build uptime string
    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days}d `;
    uptimeStr += `${hours}h ${minutes}m`;

    return NextResponse.json({
        status: 'healthy',
        uptime: {
            ms: uptimeMs,
            formatted: uptimeStr.trim(),
            days,
            hours,
            minutes,
        },
        memory: {
            heapUsed: heapUsedMB,
            heapTotal: heapTotalMB,
            rss: rssMB,
            percentage: Math.round((heapUsedMB / heapTotalMB) * 100),
        },
        node: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
    });
}
