import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { logActivity } from '@/lib/activity-logs';
import { createAdminClient } from '@/lib/supabase';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// All Supabase tables to export/import
const SUPABASE_TABLES = [
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
];

// Ensure backup directory exists
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
}

// Get Supabase client
function getClient() {
    const client = createAdminClient();
    if (!client) {
        throw new Error('Supabase admin client not configured');
    }
    return client;
}

// GET - Export all data from Supabase or list backups
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'list-backups') {
            // List all backup files
            ensureBackupDir();
            const files = fs.readdirSync(BACKUP_DIR)
                .filter(f => f.endsWith('.json'))
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
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            return NextResponse.json({ backups: files });
        }

        // Export all data from Supabase
        const supabase = getClient();
        const exportData: Record<string, unknown> = {
            exportedAt: new Date().toISOString(),
            version: '2.0.0', // Supabase version
            source: 'supabase',
            data: {},
        };

        let tableCount = 0;
        let totalRecords = 0;

        for (const table of SUPABASE_TABLES) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*');

                if (!error && data) {
                    (exportData.data as Record<string, unknown>)[table] = data;
                    tableCount++;
                    totalRecords += data.length;
                }
            } catch (e) {
                console.error(`Error exporting table ${table}:`, e);
            }
        }

        // Get metadata
        const metadata = {
            totalTables: tableCount,
            totalRecords,
            tableList: Object.keys(exportData.data as object),
        };

        // Log activity
        await logActivity({
            action: 'export',
            entity: 'database',
            details: `Xuất ${tableCount} bảng, ${totalRecords} bản ghi từ Supabase`,
        });

        return NextResponse.json({
            ...exportData,
            metadata,
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export database from Supabase' },
            { status: 500 }
        );
    }
}

// POST - Import data to Supabase or manage backups
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, data, filename } = body;

        if (action === 'create-backup') {
            // Create a backup from current Supabase data
            ensureBackupDir();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFilename = `backup-supabase-${timestamp}.json`;
            const backupPath = path.join(BACKUP_DIR, backupFilename);

            const supabase = getClient();
            const backupData: Record<string, unknown> = {
                backupAt: new Date().toISOString(),
                version: '2.0.0',
                source: 'supabase',
                data: {},
            };

            for (const table of SUPABASE_TABLES) {
                try {
                    const { data: tableData } = await supabase
                        .from(table)
                        .select('*');

                    if (tableData) {
                        (backupData.data as Record<string, unknown>)[table] = tableData;
                    }
                } catch (e) {
                    console.error(`Error backing up table ${table}:`, e);
                }
            }

            fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

            // Log activity
            await logActivity({
                action: 'backup',
                entity: 'database',
                entityName: backupFilename,
                details: 'Tạo bản sao lưu từ Supabase',
            });

            return NextResponse.json({
                success: true,
                message: 'Backup created successfully from Supabase',
                filename: backupFilename,
            });
        }

        if (action === 'restore-backup') {
            // Restore from a backup file to Supabase
            if (!filename) {
                return NextResponse.json(
                    { error: 'Filename is required' },
                    { status: 400 }
                );
            }

            const backupPath = path.join(BACKUP_DIR, filename);
            if (!fs.existsSync(backupPath)) {
                return NextResponse.json(
                    { error: 'Backup file not found' },
                    { status: 404 }
                );
            }

            const backupContent = fs.readFileSync(backupPath, 'utf-8');
            const backupData = JSON.parse(backupContent);

            if (!backupData.data) {
                return NextResponse.json(
                    { error: 'Invalid backup format' },
                    { status: 400 }
                );
            }

            const supabase = getClient();
            let restoredCount = 0;
            const errors: string[] = [];

            for (const [table, records] of Object.entries(backupData.data)) {
                if (!SUPABASE_TABLES.includes(table)) continue;
                if (!Array.isArray(records) || records.length === 0) continue;

                try {
                    // Delete existing data
                    await supabase.from(table).delete().neq('id', '');

                    // Insert backup data
                    const { error } = await supabase.from(table).insert(records);

                    if (error) {
                        errors.push(`${table}: ${error.message}`);
                    } else {
                        restoredCount++;
                    }
                } catch (e) {
                    errors.push(`${table}: ${String(e)}`);
                }
            }

            // Log activity
            await logActivity({
                action: 'restore',
                entity: 'database',
                entityName: filename,
                details: `Khôi phục ${restoredCount} bảng vào Supabase`,
            });

            return NextResponse.json({
                success: true,
                message: `Restored ${restoredCount} tables to Supabase`,
                restoredCount,
                errors: errors.length > 0 ? errors : undefined,
            });
        }

        if (action === 'import') {
            // Import from uploaded JSON data to Supabase
            if (!data) {
                return NextResponse.json(
                    { error: 'Import data is required' },
                    { status: 400 }
                );
            }

            const supabase = getClient();
            let importedCount = 0;
            let recordsImported = 0;
            const errors: string[] = [];

            for (const [table, records] of Object.entries(data)) {
                if (!SUPABASE_TABLES.includes(table)) continue;
                if (!Array.isArray(records) || records.length === 0) continue;

                try {
                    // Clear existing data
                    await supabase.from(table).delete().neq('id', '');

                    // Insert new data
                    const { error } = await supabase.from(table).insert(records);

                    if (error) {
                        errors.push(`${table}: ${error.message}`);
                    } else {
                        importedCount++;
                        recordsImported += records.length;
                    }
                } catch (e) {
                    errors.push(`${table}: ${String(e)}`);
                }
            }

            // Log activity
            await logActivity({
                action: 'import',
                entity: 'database',
                details: `Import ${importedCount} bảng, ${recordsImported} bản ghi vào Supabase`,
            });

            return NextResponse.json({
                success: true,
                message: `Imported ${importedCount} tables, ${recordsImported} records to Supabase`,
                importedCount,
                recordsImported,
                errors: errors.length > 0 ? errors : undefined,
            });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Database operation error:', error);
        return NextResponse.json(
            { error: 'Database operation failed' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a backup file
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json(
                { error: 'Filename is required' },
                { status: 400 }
            );
        }

        const backupPath = path.join(BACKUP_DIR, filename);

        // Security check - ensure path is within BACKUP_DIR
        if (!backupPath.startsWith(BACKUP_DIR)) {
            return NextResponse.json(
                { error: 'Invalid filename' },
                { status: 400 }
            );
        }

        if (!fs.existsSync(backupPath)) {
            return NextResponse.json(
                { error: 'Backup file not found' },
                { status: 404 }
            );
        }

        fs.unlinkSync(backupPath);

        // Log activity
        await logActivity({
            action: 'delete',
            entity: 'database',
            entityName: filename,
            details: 'Xóa bản sao lưu',
        });

        return NextResponse.json({
            success: true,
            message: 'Backup deleted successfully',
        });
    } catch (error) {
        console.error('Delete backup error:', error);
        return NextResponse.json(
            { error: 'Failed to delete backup' },
            { status: 500 }
        );
    }
}
