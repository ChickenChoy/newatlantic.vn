'use server';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

// List of all JSON data files to include in export
const DATA_FILES = [
    'admin-settings.json',
    'catalogs.json',
    'categories.json',
    'certifications.json',
    'faqs.json',
    'footer-links.json',
    'gallery-images.json',
    'hero-slides.json',
    'holiday-effects.json',
    'homepage-services.json',
    'homepage-stats.json',
    'media.json',
    'office-locations.json',
    'page-visibility.json',
    'partner-logos.json',
    'post-categories.json',
    'posts.json',
    'products.json',
    'seo.json',
    'site-settings.json',
    'testimonials.json',
];

// Ensure backup directory exists
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
}

// GET - Export all database to JSON
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

        // Export all data
        const exportData: Record<string, unknown> = {
            exportedAt: new Date().toISOString(),
            version: '1.0.0',
            data: {},
        };

        for (const filename of DATA_FILES) {
            const filePath = path.join(DATA_DIR, filename);
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const key = filename.replace('.json', '');
                    (exportData.data as Record<string, unknown>)[key] = JSON.parse(content);
                } catch (error) {
                    console.error(`Error reading ${filename}:`, error);
                }
            }
        }

        // Get file counts for metadata
        const metadata = {
            totalFiles: Object.keys(exportData.data as object).length,
            fileList: Object.keys(exportData.data as object),
        };

        return NextResponse.json({
            ...exportData,
            metadata,
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export database' },
            { status: 500 }
        );
    }
}

// POST - Import database from JSON or create backup
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, data, filename } = body;

        if (action === 'create-backup') {
            // Create a backup before import
            ensureBackupDir();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFilename = `backup-${timestamp}.json`;
            const backupPath = path.join(BACKUP_DIR, backupFilename);

            // Export current data to backup
            const backupData: Record<string, unknown> = {
                backupAt: new Date().toISOString(),
                version: '1.0.0',
                data: {},
            };

            for (const file of DATA_FILES) {
                const filePath = path.join(DATA_DIR, file);
                if (fs.existsSync(filePath)) {
                    try {
                        const content = fs.readFileSync(filePath, 'utf-8');
                        const key = file.replace('.json', '');
                        (backupData.data as Record<string, unknown>)[key] = JSON.parse(content);
                    } catch (error) {
                        console.error(`Error reading ${file}:`, error);
                    }
                }
            }

            fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf-8');

            return NextResponse.json({
                success: true,
                message: 'Backup created successfully',
                filename: backupFilename,
            });
        }

        if (action === 'restore-backup') {
            // Restore from a specific backup file
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

            // Restore each file
            let restoredCount = 0;
            for (const [key, value] of Object.entries(backupData.data)) {
                const filePath = path.join(DATA_DIR, `${key}.json`);
                try {
                    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
                    restoredCount++;
                } catch (error) {
                    console.error(`Error restoring ${key}:`, error);
                }
            }

            return NextResponse.json({
                success: true,
                message: `Restored ${restoredCount} files from backup`,
                restoredCount,
            });
        }

        if (action === 'delete-backup') {
            // Delete a specific backup file
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

            fs.unlinkSync(backupPath);

            return NextResponse.json({
                success: true,
                message: 'Backup deleted successfully',
            });
        }

        // Import data
        if (!data || !data.data) {
            return NextResponse.json(
                { error: 'Invalid import data format. Expected { data: { ... } }' },
                { status: 400 }
            );
        }

        // Create backup before import
        ensureBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const preImportBackup = `pre-import-${timestamp}.json`;
        const preImportPath = path.join(BACKUP_DIR, preImportBackup);

        const currentData: Record<string, unknown> = {
            backupAt: new Date().toISOString(),
            reason: 'Pre-import backup',
            data: {},
        };

        for (const file of DATA_FILES) {
            const filePath = path.join(DATA_DIR, file);
            if (fs.existsSync(filePath)) {
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const key = file.replace('.json', '');
                    (currentData.data as Record<string, unknown>)[key] = JSON.parse(content);
                } catch (error) {
                    console.error(`Error reading ${file}:`, error);
                }
            }
        }

        fs.writeFileSync(preImportPath, JSON.stringify(currentData, null, 2), 'utf-8');

        // Import each data file
        let importedCount = 0;
        const importedFiles: string[] = [];
        const errors: string[] = [];

        for (const [key, value] of Object.entries(data.data)) {
            const filePath = path.join(DATA_DIR, `${key}.json`);
            try {
                fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf-8');
                importedCount++;
                importedFiles.push(key);
            } catch (error) {
                console.error(`Error importing ${key}:`, error);
                errors.push(key);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Imported ${importedCount} files successfully`,
            importedFiles,
            errors: errors.length > 0 ? errors : undefined,
            preImportBackup,
        });
    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: 'Failed to import database' },
            { status: 500 }
        );
    }
}
