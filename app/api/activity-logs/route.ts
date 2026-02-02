import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ActivityLog, ActivityAction, ActivityEntity } from '@/types';

const LOGS_FILE = path.join(process.cwd(), 'data', 'activity-logs.json');
const MAX_LOGS = 1000;

// Đọc logs từ file
async function readLogs(): Promise<ActivityLog[]> {
    try {
        const content = await fs.readFile(LOGS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch {
        return [];
    }
}

// Ghi logs vào file
async function writeLogs(logs: ActivityLog[]): Promise<void> {
    const trimmed = logs.slice(0, MAX_LOGS);
    await fs.writeFile(LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
}

// GET - Lấy danh sách logs với filter
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get('action') as ActivityAction | null;
        const entity = searchParams.get('entity') as ActivityEntity | null;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = parseInt(searchParams.get('limit') || '100');
        const page = parseInt(searchParams.get('page') || '1');

        let logs = await readLogs();

        // Apply filters
        if (action) {
            logs = logs.filter(log => log.action === action);
        }

        if (entity) {
            logs = logs.filter(log => log.entity === entity);
        }

        if (startDate) {
            logs = logs.filter(log => new Date(log.timestamp) >= new Date(startDate));
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            logs = logs.filter(log => new Date(log.timestamp) <= end);
        }

        // Pagination
        const total = logs.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedLogs = logs.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            logs: paginatedLogs,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            }
        });
    } catch (error) {
        console.error('Error reading activity logs:', error);
        return NextResponse.json(
            { error: 'Failed to read activity logs' },
            { status: 500 }
        );
    }
}

// POST - Tạo log mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, entity, entityId, entityName, user, details, changes } = body;

        if (!action || !entity) {
            return NextResponse.json(
                { error: 'Action and entity are required' },
                { status: 400 }
            );
        }

        // Lấy IP từ headers
        const forwardedFor = request.headers.get('x-forwarded-for');
        const realIp = request.headers.get('x-real-ip');
        const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

        const log: ActivityLog = {
            id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            action,
            entity,
            entityId,
            entityName,
            user: user || 'Admin',
            details,
            changes,
            ipAddress,
        };

        const logs = await readLogs();
        logs.unshift(log);
        await writeLogs(logs);

        return NextResponse.json({ success: true, log });
    } catch (error) {
        console.error('Error creating activity log:', error);
        return NextResponse.json(
            { error: 'Failed to create activity log' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa logs (có thể xóa tất cả hoặc theo điều kiện)
export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const clearAll = searchParams.get('clearAll') === 'true';
        const olderThan = searchParams.get('olderThan'); // Số ngày

        if (clearAll) {
            await writeLogs([]);
            return NextResponse.json({ success: true, message: 'All logs cleared' });
        }

        if (olderThan) {
            const days = parseInt(olderThan);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            let logs = await readLogs();
            const originalCount = logs.length;
            logs = logs.filter(log => new Date(log.timestamp) > cutoffDate);
            await writeLogs(logs);

            const deletedCount = originalCount - logs.length;
            return NextResponse.json({
                success: true,
                message: `Deleted ${deletedCount} logs older than ${days} days`
            });
        }

        return NextResponse.json(
            { error: 'Specify clearAll=true or olderThan=<days>' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Error deleting activity logs:', error);
        return NextResponse.json(
            { error: 'Failed to delete activity logs' },
            { status: 500 }
        );
    }
}
