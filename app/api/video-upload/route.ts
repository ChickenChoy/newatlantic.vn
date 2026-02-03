import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';

// Supported video formats
const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov
];

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB (Supabase free plan limit)
const BUCKET_NAME = 'videos';

// Helper function to ensure bucket exists
async function ensureBucketExists(supabase: ReturnType<typeof createAdminClient>) {
    if (!supabase) return false;

    try {
        // Check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();

        if (listError) {
            console.error('Error listing buckets:', listError);
            return false;
        }

        const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

        if (!bucketExists) {
            // Create the bucket
            const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
                public: true,
                fileSizeLimit: MAX_VIDEO_SIZE,
                allowedMimeTypes: ALLOWED_VIDEO_TYPES,
            });

            if (createError) {
                console.error('Error creating bucket:', createError);
                return false;
            }

            console.log('Created videos bucket successfully');
        }

        return true;
    } catch (error) {
        console.error('Error ensuring bucket exists:', error);
        return false;
    }
}

// POST - Upload video to Supabase Storage
export async function POST(request: NextRequest) {
    try {
        const supabase = createAdminClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase not configured' },
                { status: 500 }
            );
        }

        // Ensure bucket exists
        const bucketReady = await ensureBucketExists(supabase);
        if (!bucketReady) {
            return NextResponse.json(
                { error: 'Storage bucket not available. Please check Supabase configuration.' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const folder = (formData.get('folder') as string) || 'general';
        const title = (formData.get('title') as string) || '';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed: ${ALLOWED_VIDEO_TYPES.join(', ')}` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_VIDEO_SIZE) {
            return NextResponse.json(
                { error: `File too large. Maximum size: ${MAX_VIDEO_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 9);
        const extension = file.name.split('.').pop() || 'mp4';
        const filename = `${folder}/${timestamp}_${randomId}.${extension}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('videos')
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json(
                { error: `Upload failed: ${error.message}` },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('videos')
            .getPublicUrl(filename);

        const publicUrl = urlData.publicUrl;

        // Log activity
        await logActivity({
            action: 'upload',
            entity: 'media',
            entityName: title || file.name,
            details: `Video uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        });

        return NextResponse.json({
            success: true,
            filename,
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
            url: publicUrl,
            folder,
            title,
        });

    } catch (error) {
        console.error('Error uploading video:', error);
        return NextResponse.json(
            { error: 'Failed to upload video' },
            { status: 500 }
        );
    }
}

// GET - List videos from Supabase Storage
export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase not configured' },
                { status: 500 }
            );
        }

        // Ensure bucket exists
        const bucketReady = await ensureBucketExists(supabase);
        if (!bucketReady) {
            // Return empty array if bucket doesn't exist yet
            return NextResponse.json([]);
        }

        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder') || '';

        console.log('Listing videos, folder:', folder || 'all');

        // Define all folders to search
        const FOLDERS = ['hero', 'general'];

        let allVideos: Array<{
            id: string;
            name: string;
            path: string;
            url: string;
            size: number;
            mimeType: string;
            createdAt: string;
            updatedAt: string;
        }> = [];

        // If no folder specified, list from all folders
        const foldersToSearch = folder ? [folder] : FOLDERS;

        for (const searchFolder of foldersToSearch) {
            // List files in the folder
            const { data, error } = await supabase.storage
                .from(BUCKET_NAME)
                .list(searchFolder, {
                    limit: 100,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) {
                console.error(`Error listing ${searchFolder}:`, error);
                continue; // Skip failed folder
            }

            // Filter out folders (.emptyFolderPlaceholder) and get public URLs
            const videos = (data || [])
                .filter(item => item.name && !item.name.endsWith('/') && !item.name.startsWith('.'))
                .map(item => {
                    const path = `${searchFolder}/${item.name}`;
                    const { data: urlData } = supabase.storage
                        .from(BUCKET_NAME)
                        .getPublicUrl(path);

                    return {
                        id: item.id || path,
                        name: item.name,
                        path,
                        url: urlData.publicUrl,
                        size: item.metadata?.size || 0,
                        mimeType: item.metadata?.mimetype || 'video/mp4',
                        createdAt: item.created_at || new Date().toISOString(),
                        updatedAt: item.updated_at || new Date().toISOString(),
                    };
                });

            allVideos = [...allVideos, ...videos];
        }

        // Sort by createdAt desc
        allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        console.log(`Found ${allVideos.length} videos`);

        return NextResponse.json(allVideos);

    } catch (error) {
        console.error('Error listing videos:', error);
        return NextResponse.json(
            { error: 'Failed to list videos' },
            { status: 500 }
        );
    }
}

// DELETE - Delete video from Supabase Storage
export async function DELETE(request: NextRequest) {
    try {
        const supabase = createAdminClient();
        if (!supabase) {
            return NextResponse.json(
                { error: 'Supabase not configured' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');

        console.log('Delete request for path:', path);

        if (!path) {
            return NextResponse.json(
                { error: 'Video path is required' },
                { status: 400 }
            );
        }

        // Decode path if needed (it might be double-encoded)
        const decodedPath = decodeURIComponent(path);
        console.log('Decoded path:', decodedPath);

        // Remove the file
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([decodedPath]);

        console.log('Delete result:', { data, error });

        if (error) {
            console.error('Supabase delete error:', error);
            return NextResponse.json(
                { error: `Failed to delete video: ${error.message}` },
                { status: 500 }
            );
        }

        await logActivity({
            action: 'delete',
            entity: 'media',
            entityName: decodedPath,
            details: 'Video deleted from storage',
        });

        return NextResponse.json({ success: true, deleted: decodedPath });

    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json(
            { error: 'Failed to delete video' },
            { status: 500 }
        );
    }
}
