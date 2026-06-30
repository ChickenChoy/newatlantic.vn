import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { logActivity } from '@/lib/activity-logs';
import { createAdminClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const DATA_DIR = process.env.PERSISTENT_DATA_PATH
  ? path.resolve(process.env.PERSISTENT_DATA_PATH)
  : path.join(process.cwd(), 'data');

const DATABASE_TABLES = [
    'categories',
    'products',
    'posts',
    'post_categories',
    'hero_slides',
    'gallery_images',
    'office_locations',
    'footer_links',
    'catalogs',
    'homepage_stats',
    'homepage_services',
    'partner_logos',
    'testimonials',
    'faqs',
    'certifications',
    'media',
    'holiday_effects',
    'site_settings',
    'seo_settings',
    'page_visibility',
    'navbar_settings',
    'admin_users',
    'activity_logs',
    'page_views',
];

const COLLECTION_FILES: Record<string, string> = {
    categories: 'categories.json',
    products: 'products.json',
    posts: 'posts.json',
    post_categories: 'post-categories.json',
    hero_slides: 'hero-slides.json',
    gallery_images: 'gallery-images.json',
    office_locations: 'office-locations.json',
    footer_links: 'footer-links.json',
    catalogs: 'catalogs.json',
    homepage_stats: 'homepage-stats.json',
    homepage_services: 'homepage-services.json',
    partner_logos: 'partner-logos.json',
    testimonials: 'testimonials.json',
    faqs: 'faqs.json',
    certifications: 'certifications.json',
    media: 'media.json',
    holiday_effects: 'holiday-effects.json',
    page_visibility: 'page-visibility.json',
    admin_users: 'admin-users.json',
    activity_logs: 'activity-logs.json',
    page_views: 'page-views.json',
};

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function ensureBackupDir() {
    ensureDir(BACKUP_DIR);
}

function ensureDataDir() {
    ensureDir(DATA_DIR);
}

function safeBackupPath(filename: string): string {
    const safeName = path.basename(filename);
    const backupPath = path.join(BACKUP_DIR, safeName);

    if (safeName !== filename || !backupPath.startsWith(BACKUP_DIR)) {
        throw new Error('Invalid filename');
    }

    return backupPath;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function snakeToCamelKey(key: string): string {
    return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function snakeToCamelValue(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(snakeToCamelValue);
    if (!isRecord(value)) return value;

    return Object.entries(value).reduce<Record<string, unknown>>((result, [key, item]) => {
        result[snakeToCamelKey(key)] = snakeToCamelValue(item);
        return result;
    }, {});
}

function readJsonFile<T>(filePath: string, defaultValue: T): T {
    if (!fs.existsSync(filePath)) return defaultValue;

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
    } catch {
        return defaultValue;
    }
}

function writeDataFile(filename: string, data: unknown) {
    ensureDataDir();
    fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

function getLatestBackupData(): Record<string, unknown> {
    ensureBackupDir();

    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(file => file.endsWith('.json'))
        .map(filename => ({
            filename,
            modifiedAt: fs.statSync(path.join(BACKUP_DIR, filename)).mtime.getTime(),
        }))
        .sort((a, b) => b.modifiedAt - a.modifiedAt);

    for (const backup of backups) {
        const parsed = readJsonFile<Record<string, unknown>>(path.join(BACKUP_DIR, backup.filename), {});
        if (isRecord(parsed.data)) return parsed.data;
    }

    return {};
}

function transformProduct(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;

    return {
        ...item,
        image: item.image || item.thumbnail || '',
        categoryName: item.categoryName || '',
        categorySlug: item.categorySlug || item.category || '',
        shortDescription: item.shortDescription || '',
        fullDescription: item.fullDescription || item.description || '',
        featured: item.featured ?? item.isFeatured ?? false,
        price: item.price != null ? String(item.price) : 'Liên hệ',
    };
}

function transformPost(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;

    return {
        ...item,
        image: item.image || item.featuredImage || item.thumbnail || '',
        date: item.date || item.publishedAt || item.createdAt || '',
    };
}

function withOrder(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;
    return {
        ...item,
        order: item.order ?? item.orderIndex ?? 0,
    };
}

function getMediaVariants(variants: unknown, fallbackUrl: string): Record<string, string> {
    const source = isRecord(variants) ? variants : {};
    const thumbnail = typeof source.thumbnail === 'string' ? source.thumbnail : '';
    const medium = typeof source.medium === 'string' ? source.medium : '';
    const full = typeof source.full === 'string' ? source.full : '';
    const fallback = fallbackUrl || full || medium || thumbnail;

    return {
        thumbnail: thumbnail || medium || full || fallback,
        medium: medium || full || thumbnail || fallback,
        full: full || medium || thumbnail || fallback,
    };
}

function transformMedia(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;
    const fallbackUrl = (item.storageUrl as string) || '';
    const usage = Array.isArray(item.usage) ? item.usage : item.usage ? [item.usage] : [];

    return {
        ...item,
        originalName: item.originalName || item.filename || '',
        mimeType: item.mimeType || 'image/jpeg',
        dimensions: item.dimensions || { width: 0, height: 0 },
        variants: getMediaVariants(item.variants, fallbackUrl),
        alt: item.alt || item.altText || '',
        tags: item.tags || [],
        usedIn: item.usedIn || usage,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
    };
}

function transformHolidayEffect(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;

    return {
        ...item,
        startDate: item.startDate || '',
        endDate: item.endDate || '',
        effectTypes: item.effectTypes || [],
        primaryColor: item.primaryColor || '#dc2626',
        secondaryColor: item.secondaryColor || '#ffd700',
    };
}

function transformActivityLog(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;

    return {
        ...item,
        entityId: item.entityId,
        entityName: item.entityName,
        ipAddress: item.ipAddress,
        user: item.user || item.userEmail || 'Admin',
    };
}

function transformPageView(row: Record<string, unknown>): Record<string, unknown> {
    const item = snakeToCamelValue(row) as Record<string, unknown>;

    return {
        ...item,
        sessionId: item.sessionId || item.session_id || 'unknown',
        userAgent: item.userAgent || '',
        createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    };
}

function transformRecord(table: string, row: Record<string, unknown>): Record<string, unknown> {
    if (table === 'products') return transformProduct(row);
    if (table === 'posts') return transformPost(row);
    if (table === 'media') return transformMedia(row);
    if (table === 'holiday_effects') return transformHolidayEffect(row);
    if (table === 'activity_logs') return transformActivityLog(row);
    if (table === 'page_views') return transformPageView(row);

    if (
        table === 'post_categories' ||
        table === 'hero_slides' ||
        table === 'gallery_images' ||
        table === 'office_locations' ||
        table === 'footer_links' ||
        table === 'catalogs' ||
        table === 'homepage_stats' ||
        table === 'homepage_services' ||
        table === 'partner_logos' ||
        table === 'testimonials' ||
        table === 'faqs' ||
        table === 'certifications' ||
        table === 'page_visibility'
    ) {
        return withOrder(row);
    }

    return snakeToCamelValue(row) as Record<string, unknown>;
}

function restoreTableToJson(table: string, records: unknown): boolean {
    if (!Array.isArray(records)) return false;

    if (table === 'site_settings') {
        for (const record of records.filter(isRecord)) {
            if (record.key === 'main') writeDataFile('site-settings.json', record.value || {});
            if (record.key === 'popup-settings') writeDataFile('popup-settings.json', record.value || {});
        }
        return true;
    }

    if (table === 'seo_settings') {
        const main = records.filter(isRecord).find(record => record.key === 'main');
        writeDataFile('seo-settings.json', main?.value || {});
        return true;
    }

    if (table === 'navbar_settings') {
        const navbar = records.filter(isRecord).find(record => record.id === 'navbar');
        writeDataFile('navbar-settings.json', navbar?.settings || {});
        return true;
    }

    const filename = COLLECTION_FILES[table];
    if (!filename) return false;

    writeDataFile(filename, records.filter(isRecord).map(record => transformRecord(table, record)));
    return true;
}

function getJsonTableData(table: string, fallbackData: Record<string, unknown>): unknown[] {
    if (table === 'site_settings') {
        const rows: unknown[] = [];
        const siteSettingsPath = path.join(DATA_DIR, 'site-settings.json');
        const popupSettingsPath = path.join(DATA_DIR, 'popup-settings.json');

        if (fs.existsSync(siteSettingsPath)) {
            rows.push({ key: 'main', value: readJsonFile(siteSettingsPath, {}) });
        }
        if (fs.existsSync(popupSettingsPath)) {
            rows.push({ key: 'popup-settings', value: readJsonFile(popupSettingsPath, {}) });
        }

        return rows.length > 0 ? rows : (Array.isArray(fallbackData[table]) ? fallbackData[table] as unknown[] : []);
    }

    if (table === 'seo_settings') {
        const seoPath = path.join(DATA_DIR, 'seo-settings.json');
        if (fs.existsSync(seoPath)) return [{ key: 'main', value: readJsonFile(seoPath, {}) }];
        return Array.isArray(fallbackData[table]) ? fallbackData[table] as unknown[] : [];
    }

    if (table === 'navbar_settings') {
        const navbarPath = path.join(DATA_DIR, 'navbar-settings.json');
        if (fs.existsSync(navbarPath)) return [{ id: 'navbar', settings: readJsonFile(navbarPath, {}) }];
        return Array.isArray(fallbackData[table]) ? fallbackData[table] as unknown[] : [];
    }

    const filename = COLLECTION_FILES[table];
    if (filename) {
        const filePath = path.join(DATA_DIR, filename);
        if (fs.existsSync(filePath)) return readJsonFile<unknown[]>(filePath, []);
    }

    return Array.isArray(fallbackData[table]) ? fallbackData[table] as unknown[] : [];
}

async function exportFromJson() {
    const fallbackData = getLatestBackupData();
    const data = DATABASE_TABLES.reduce<Record<string, unknown>>((result, table) => {
        result[table] = getJsonTableData(table, fallbackData);
        return result;
    }, {});

    const tableList = Object.keys(data).filter(table => Array.isArray(data[table]) && (data[table] as unknown[]).length > 0);
    const totalRecords = tableList.reduce((total, table) => total + ((data[table] as unknown[]).length || 0), 0);

    return {
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        source: 'json',
        data,
        metadata: {
            totalTables: tableList.length,
            totalRecords,
            tableList,
        },
    };
}

async function exportFromSupabase() {
    const supabase = createAdminClient();
    if (!supabase) return exportFromJson();

    const data: Record<string, unknown> = {};
    let tableCount = 0;
    let totalRecords = 0;

    for (const table of DATABASE_TABLES) {
        try {
            const { data: tableData, error } = await supabase.from(table).select('*');
            if (!error && tableData) {
                data[table] = tableData;
                tableCount++;
                totalRecords += tableData.length;
            }
        } catch (error) {
            console.error(`Error exporting table ${table}:`, error);
        }
    }

    return {
        exportedAt: new Date().toISOString(),
        version: '2.0.0',
        source: 'supabase',
        data,
        metadata: {
            totalTables: tableCount,
            totalRecords,
            tableList: Object.keys(data),
        },
    };
}

async function restoreToJson(data: Record<string, unknown>) {
    let restoredCount = 0;
    let recordsImported = 0;
    const errors: string[] = [];

    for (const table of DATABASE_TABLES) {
        if (!(table in data)) continue;

        try {
            const records = data[table];
            if (restoreTableToJson(table, records)) {
                restoredCount++;
                recordsImported += Array.isArray(records) ? records.length : 0;
            }
        } catch (error) {
            errors.push(`${table}: ${String(error)}`);
        }
    }

    return { restoredCount, recordsImported, errors };
}

async function restoreToSupabase(data: Record<string, unknown>) {
    const supabase = createAdminClient();
    if (!supabase) return restoreToJson(data);

    let restoredCount = 0;
    let recordsImported = 0;
    const errors: string[] = [];

    for (const table of DATABASE_TABLES) {
        const records = data[table];
        if (!Array.isArray(records) || records.length === 0) continue;

        try {
            await supabase.from(table).delete().neq('id', '');
            const { error } = await supabase.from(table).insert(records);

            if (error) {
                errors.push(`${table}: ${error.message}`);
            } else {
                restoredCount++;
                recordsImported += records.length;
            }
        } catch (error) {
            errors.push(`${table}: ${String(error)}`);
        }
    }

    return { restoredCount, recordsImported, errors };
}

function shouldUseSupabase(): boolean {
    return process.env.DB_MODE === 'supabase';
}

// GET - Export all data or list backups
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'list-backups') {
            ensureBackupDir();
            const files = fs.readdirSync(BACKUP_DIR)
                .filter(filename => filename.endsWith('.json'))
                .map(filename => {
                    const filePath = path.join(BACKUP_DIR, filename);
                    const stats = fs.statSync(filePath);
                    return {
                        filename,
                        size: stats.size,
                        createdAt: stats.birthtime.toISOString(),
                        modifiedAt: stats.mtime.toISOString(),
                    };
                })
                .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime());

            return NextResponse.json({ backups: files });
        }

        const exportData = shouldUseSupabase() ? await exportFromSupabase() : await exportFromJson();

        await logActivity({
            action: 'export',
            entity: 'database',
            details: `Xuất ${exportData.metadata.totalTables} bảng, ${exportData.metadata.totalRecords} bản ghi từ ${exportData.source}`,
        });

        return NextResponse.json(exportData);
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Failed to export database' }, { status: 500 });
    }
}

// POST - Import/restore/create backup
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, data, filename } = body;

        if (action === 'create-backup') {
            ensureBackupDir();
            const exportData = shouldUseSupabase() ? await exportFromSupabase() : await exportFromJson();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFilename = `backup-${exportData.source}-${timestamp}.json`;

            fs.writeFileSync(
                path.join(BACKUP_DIR, backupFilename),
                JSON.stringify({ backupAt: new Date().toISOString(), ...exportData }, null, 2),
                'utf-8'
            );

            await logActivity({
                action: 'backup',
                entity: 'database',
                entityName: backupFilename,
                details: `Tạo bản sao lưu từ ${exportData.source}`,
            });

            return NextResponse.json({
                success: true,
                message: 'Backup created successfully',
                filename: backupFilename,
            });
        }

        if (action === 'restore-backup') {
            if (!filename) return NextResponse.json({ error: 'Filename is required' }, { status: 400 });

            const backupPath = safeBackupPath(filename);
            if (!fs.existsSync(backupPath)) return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });

            const backupData = readJsonFile<Record<string, unknown>>(backupPath, {});
            if (!isRecord(backupData.data)) return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 });

            const result = shouldUseSupabase()
                ? await restoreToSupabase(backupData.data)
                : await restoreToJson(backupData.data);

            await logActivity({
                action: 'restore',
                entity: 'database',
                entityName: filename,
                details: `Khôi phục ${result.restoredCount} bảng vào ${shouldUseSupabase() ? 'Supabase' : 'JSON'}`,
            });

            return NextResponse.json({
                success: true,
                message: `Restored ${result.restoredCount} tables`,
                ...result,
                errors: result.errors.length > 0 ? result.errors : undefined,
            });
        }

        if (action === 'import') {
            const importData = isRecord(data?.data) ? data.data : data;
            if (!isRecord(importData)) return NextResponse.json({ error: 'Import data is required' }, { status: 400 });

            const result = shouldUseSupabase()
                ? await restoreToSupabase(importData)
                : await restoreToJson(importData);

            await logActivity({
                action: 'import',
                entity: 'database',
                details: `Import ${result.restoredCount} bảng, ${result.recordsImported} bản ghi vào ${shouldUseSupabase() ? 'Supabase' : 'JSON'}`,
            });

            return NextResponse.json({
                success: true,
                message: `Imported ${result.restoredCount} tables`,
                importedCount: result.restoredCount,
                recordsImported: result.recordsImported,
                errors: result.errors.length > 0 ? result.errors : undefined,
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error) {
        console.error('Database operation error:', error);
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }
}

// DELETE - Delete a backup file
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) return NextResponse.json({ error: 'Filename is required' }, { status: 400 });

        const backupPath = safeBackupPath(filename);
        if (!fs.existsSync(backupPath)) return NextResponse.json({ error: 'Backup file not found' }, { status: 404 });

        fs.unlinkSync(backupPath);

        await logActivity({
            action: 'delete',
            entity: 'database',
            entityName: filename,
            details: 'Xóa bản sao lưu',
        });

        return NextResponse.json({ success: true, message: 'Backup deleted successfully' });
    } catch (error) {
        console.error('Delete backup error:', error);
        return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 });
    }
}
