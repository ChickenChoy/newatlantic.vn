import { promises as fs } from 'fs';
import path from 'path';
import { ActivityLog, ActivityAction, ActivityEntity, ActivityChange } from '@/types';

const LOGS_FILE = path.join(process.cwd(), 'data', 'activity-logs.json');
const MAX_LOGS = 1000; // Giữ tối đa 1000 logs gần nhất

/**
 * Đọc danh sách activity logs
 */
export async function getActivityLogs(): Promise<ActivityLog[]> {
    try {
        const content = await fs.readFile(LOGS_FILE, 'utf-8');
        return JSON.parse(content);
    } catch {
        // File chưa tồn tại, trả về mảng rỗng
        return [];
    }
}

/**
 * Lưu activity logs vào file
 */
async function saveActivityLogs(logs: ActivityLog[]): Promise<void> {
    // Chỉ giữ MAX_LOGS logs gần nhất
    const trimmedLogs = logs.slice(0, MAX_LOGS);
    await fs.writeFile(LOGS_FILE, JSON.stringify(trimmedLogs, null, 2), 'utf-8');
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
}): Promise<ActivityLog> {
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

    const log: ActivityLog = {
        id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

    // Đọc logs hiện tại
    const logs = await getActivityLogs();

    // Thêm log mới vào đầu danh sách
    logs.unshift(log);

    // Lưu lại
    await saveActivityLogs(logs);

    return log;
}

/**
 * Xóa tất cả logs (cho mục đích dọn dẹp)
 */
export async function clearActivityLogs(): Promise<void> {
    await saveActivityLogs([]);
}

/**
 * Lấy logs với filter
 */
export async function getFilteredLogs(params: {
    action?: ActivityAction;
    entity?: ActivityEntity;
    startDate?: string;
    endDate?: string;
    limit?: number;
}): Promise<ActivityLog[]> {
    const { action, entity, startDate, endDate, limit = 100 } = params;

    let logs = await getActivityLogs();

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
        logs = logs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }

    return logs.slice(0, limit);
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
    ipAddress?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'auth',
        details: action === 'login' ? 'Đăng nhập thành công' : 'Đăng xuất',
        ipAddress,
    });
}

export async function logDatabaseAction(
    action: 'export' | 'import' | 'backup' | 'restore',
    details?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'database',
        details,
    });
}

export async function logMediaAction(
    action: 'upload' | 'delete',
    filename: string,
    folder?: string
): Promise<void> {
    await logActivity({
        action,
        entity: 'media',
        entityName: filename,
        details: folder ? `Folder: ${folder}` : undefined,
    });
}
