import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { ActivityLog, ActivityAction, ActivityEntity, ActivityChange } from '@/types';

const TABLE_NAME = 'activity_logs';

// Helper to convert DB row to ActivityLog
function rowToActivityLog(row: Record<string, unknown>): ActivityLog {
    return {
        id: row.id as string,
        timestamp: row.timestamp as string,
        action: row.action as ActivityAction,
        entity: row.entity as ActivityEntity,
        entityId: row.entity_id as string | undefined,
        entityName: row.entity_name as string | undefined,
        user: (row.user_email as string) || 'Admin',
        details: row.details as string | undefined,
        changes: row.changes as ActivityChange[] | undefined,
        ipAddress: row.ip_address as string | undefined,
    };
}

// GET - Lấy danh sách logs với filter
export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient();
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const searchParams = request.nextUrl.searchParams;
        const action = searchParams.get('action') as ActivityAction | null;
        const entity = searchParams.get('entity') as ActivityEntity | null;
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;

        // Build query
        let query = supabase
            .from(TABLE_NAME)
            .select('*', { count: 'exact' });

        if (action) {
            query = query.eq('action', action);
        }

        if (entity) {
            query = query.eq('entity', entity);
        }

        if (startDate) {
            query = query.gte('timestamp', startDate);
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query = query.lte('timestamp', end.toISOString());
        }

        query = query
            .order('timestamp', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching activity logs:', error);
            return NextResponse.json({ error: 'Failed to read activity logs' }, { status: 500 });
        }

        const total = count || 0;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            logs: (data || []).map(rowToActivityLog),
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
        const supabase = createAdminClient();
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

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

        const logData = {
            action,
            entity,
            entity_id: entityId,
            entity_name: entityName,
            user_email: user || 'Admin',
            details,
            changes: changes || null,
            ip_address: ipAddress,
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(logData)
            .select()
            .single();

        if (error) {
            console.error('Error creating activity log:', error);
            return NextResponse.json({ error: 'Failed to create activity log' }, { status: 500 });
        }

        return NextResponse.json({ success: true, log: data ? rowToActivityLog(data) : null });
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
        const supabase = createAdminClient();
        if (!supabase) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
        }

        const searchParams = request.nextUrl.searchParams;
        const clearAll = searchParams.get('clearAll') === 'true';
        const olderThan = searchParams.get('olderThan'); // Số ngày

        if (clearAll) {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .neq('id', ''); // Delete all rows

            if (error) {
                console.error('Error clearing logs:', error);
                return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
            }

            return NextResponse.json({ success: true, message: 'All logs cleared' });
        }

        if (olderThan) {
            const days = parseInt(olderThan);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const { data: deletedData, error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .lt('timestamp', cutoffDate.toISOString())
                .select('id');

            if (error) {
                console.error('Error deleting old logs:', error);
                return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 });
            }

            const deletedCount = deletedData?.length || 0;
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
