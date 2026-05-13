import { NextRequest, NextResponse } from 'next/server';
import {
    getMediaItems,
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,
    getMediaByFolder,
    searchMedia,
    getMediaStats
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { MediaItem, MediaFolder } from '@/types';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';

// GET - List all media items with optional filtering
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') as MediaFolder | null;
        const search = searchParams.get('search');
        const statsOnly = searchParams.get('stats') === 'true';

        // Return stats only
        if (statsOnly) {
            const stats = await getMediaStats();
            return NextResponse.json(stats);
        }

        let items: MediaItem[];

        // Filter by folder
        if (folder) {
            items = await getMediaByFolder(folder);
        }
        // Search by query
        else if (search) {
            items = await searchMedia(search);
        }
        // Get all
        else {
            items = await getMediaItems();
        }

        // Sort by newest first
        items.sort((a: any, b: any) => new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime());

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
    }
}

// POST - Upload new media
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            filename,
            originalName,
            folder = 'general',
            mimeType,
            size,
            dimensions,
            variants,
            alt = '',
            caption = '',
            tags = []
        } = body;

        // Validate required fields
        if (!filename || !variants?.full) {
            return NextResponse.json(
                { error: 'Missing required fields: filename and variants.full are required' },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();
        const newMedia: any = {
            id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            filename,
            original_name: originalName || filename,
            folder,
            mime_type: mimeType || 'image/webp',
            size: size || 0,
            dimensions: dimensions || { width: 0, height: 0 },
            variants: {
                thumbnail: variants.thumbnail || '',
                medium: variants.medium || '',
                full: variants.full
            },
            alt,
            caption,
            tags: Array.isArray(tags) ? tags : [],
            used_in: [],
            created_at: now,
            updated_at: now
        };

        const success = await addMediaItem(newMedia);

        if (success) {
            await logActivity({
                action: 'upload',
                entity: 'media',
                entityId: newMedia.id,
                entityName: newMedia.original_name,
                details: `Folder: ${folder}`,
            });

            revalidatePath('/admin');
            return NextResponse.json(newMedia, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Failed to save media' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error uploading media:', error);
        return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
    }
}

// PUT - Update media metadata
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
        }

        // Only allow updating certain fields
        const allowedUpdates: any = {};
        if (updates.alt !== undefined) allowedUpdates.alt = updates.alt;
        if (updates.caption !== undefined) allowedUpdates.caption = updates.caption;
        if (updates.tags !== undefined) allowedUpdates.tags = updates.tags;
        if (updates.folder !== undefined) allowedUpdates.folder = updates.folder;

        const success = await updateMediaItem(id, allowedUpdates);

        if (success) {
            revalidatePath('/admin');
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error updating media:', error);
        return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
    }
}

// DELETE - Delete media item
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
        }

        const success = await deleteMediaItem(id);

        if (success) {
            await logActivity({
                action: 'delete',
                entity: 'media',
                entityId: id,
            });

            revalidatePath('/admin');
            return NextResponse.json({ success: true });
        } else {
            // Check if delete failed because media is in use
            const items = await getMediaItems();
            const item = items.find((m: any) => m.id === id);

            if (item && (item as any).usedIn?.length > 0) {
                return NextResponse.json(
                    { error: 'Cannot delete media that is in use', usedIn: (item as any).usedIn },
                    { status: 409 }
                );
            }

            return NextResponse.json({ error: 'Media not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error deleting media:', error);
        return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
    }
}
