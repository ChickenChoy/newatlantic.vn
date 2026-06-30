import { createAdminClient } from './supabase';
import { ActivityLog, ActivityAction, ActivityEntity, ActivityChange } from '@/types';
import fs from 'fs';
import path from 'path';

const TABLE_NAME = 'activity_logs';
const MAX_LOGS = 1000; // Giữ tối đa 1000 logs gần nhất
const DATA_DIR = process.env.PERSISTENT_DATA_PATH
  ? path.resolve(process.env.PERSISTENT_DATA_PATH)
  : path.join(process.cwd(), 'data');
const LOGS_FILE = path.join(DATA_DIR, 'activity-logs.json');

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

function readLocalLogs(): ActivityLog[] {
    try {
        if (!fs.existsSync(LOGS_FILE)) return [];
        return JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8')) as ActivityLog[];
    } catch {
        return [];
    }
}

function writeLocalLogs(logs: ActivityLog[]): void {
    ensureDataDir();
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs.slice(0, MAX_LOGS), null, 2), 'utf-8');
}

// Get Supabase admin client (with error handling)
function getSupabaseAdmin() {
    const client = createAdminClient();
    if (!client) {
        return null;
    }
    return client;
}

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

/**
 * Đọc danh sách activity logs
 */
export async function getActivityLogs(): Promise<ActivityLog[]> {
    const supabase = getSupabaseAdmin();
    if (!supabase) return readLocalLogs().slice(0, MAX_LOGS);

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(MAX_LOGS);

        if (error) {
            console.error('Error fetching activity logs:', error);
            return [];
        }

        return (data || []).map(rowToActivityLog);
    } catch (err) {
        console.error('Exception fetching activity logs:', err);
        return [];
    }
}

/**
 * Ghi một activity log mới
 */
export async function logActivity(params: {
    action: ActivityAction;
    entity: ActivityEntity;
    entityId?: string;
    entityName?: string;
    user?: string;
    details?: string;
    changes?: ActivityChange[];
    ipAddress?: string;
}): Promise<ActivityLog | null> {
    const supabase = getSupabaseAdmin();
    const {
        action,
        entity,
        entityId,
        entityName,
        user = 'Admin',
        details,
        changes,
        ipAddress,
    } = params;

    if (!supabase) {
        const localLog: ActivityLog = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: new Date().toISOString(),
            action,
            entity,
            entityId,
            entityName,
            user,
            details,
            changes,
            ipAddress,
        };

        writeLocalLogs([localLog, ...readLocalLogs()]);
        return localLog;
    }

    const logData = {
        action,
        entity,
        entity_id: entityId,
        entity_name: entityName,
        user_email: user,
        details,
        ip_address: ipAddress,
    };

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(logData)
            .select()
            .single();

        if (error) {
            console.error('Error inserting activity log:', error);
            return null;
        }

        return data ? rowToActivityLog(data) : null;
    } catch (err) {
        console.error('Exception inserting activity log:', err);
        return null;
    }
}

/**
 * Xóa tất cả logs (cho mục đích dọn dẹp)
 */
export async function clearActivityLogs(): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        writeLocalLogs([]);
        return;
    }

    try {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .neq('id', ''); // Delete all rows

        if (error) {
            console.error('Error clearing activity logs:', error);
        }
    } catch (err) {
        console.error('Exception clearing activity logs:', err);
    }
}

/**
 * Lấy logs với filter và pagination
 */
export async function getFilteredLogs(params: {
    action?: ActivityAction;
    entity?: ActivityEntity;
    startDate?: string;
    endDate?: string;
    limit?: number;
    page?: number;
}): Promise<{ logs: ActivityLog[]; total: number }> {
    const supabase = getSupabaseAdmin();
    const { action, entity, startDate, endDate, limit = 20, page = 1 } = params;
    const offset = (page - 1) * limit;

    if (!supabase) {
        let logs = readLocalLogs();

        if (action) logs = logs.filter(log => log.action === action);
        if (entity) logs = logs.filter(log => log.entity === entity);
        if (startDate) logs = logs.filter(log => log.timestamp >= startDate);
        if (endDate) logs = logs.filter(log => log.timestamp <= endDate);

        const total = logs.length;
        return { logs: logs.slice(offset, offset + limit), total };
    }

    try {
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
            query = query.lte('timestamp', endDate);
        }

        query = query
            .order('timestamp', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching filtered logs:', error);
            return { logs: [], total: 0 };
        }

        return {
            logs: (data || []).map(rowToActivityLog),
            total: count || 0,
        };
    } catch (err) {
        console.error('Exception fetching filtered logs:', err);
        return { logs: [], total: 0 };
    }
}

// ==================== Helper functions cho các entity cụ thể ====================

export async function logProductAction(
    action: ActivityAction,
    productId: string,
    productName: string,
    changes?: ActivityChange[]
): Promise<void> {
    await logActivity({
        action,
        entity: 'product',
        entityId: productId,
        entityName: productName,
        changes,
    });
}

export async function logPostAction(
    action: ActivityAction,
    postId: string,
    postTitle: string,
    changes?: ActivityChange[]
): Promise<void> {
    await logActivity({
        action,
        entity: 'post',
        entityId: postId,
        entityName: postTitle,
        changes,
    });
}

export async function logGalleryAction(
    action: ActivityAction,
    imageId?: string,
    imageName?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'gallery',
        entityId: imageId,
        entityName: imageName,
    });
}

export async function logAuthAction(
    action: 'login' | 'logout',
    user?: string,
    ipAddress?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'auth',
        user,
        details: action === 'login' ? 'Đăng nhập thành công' : 'Đăng xuất',
        ipAddress,
    });
}

export async function logDatabaseAction(
    action: 'export' | 'import' | 'backup' | 'restore',
    details?: string,
    user?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'database',
        details,
        user,
    });
}

export async function logMediaAction(
    action: 'upload' | 'delete',
    filename: string,
    folder?: string,
    user?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'media',
        entityName: filename,
        details: folder ? `Folder: ${folder}` : undefined,
        user,
    });
}
