import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách gallery images
export async function GET() {
  try {
    const images = await getGalleryImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

// POST - Thêm gallery image mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { src, alt, title, description, category, tags, featured, order } = body;

    if (!src || !alt) {
      return NextResponse.json({ error: 'Src and alt are required' }, { status: 400 });
    }

    const newImage: any = {
      id: String(Date.now()),
      src,
      alt,
      title: title || '',
      description: description || '',
      category: category || '',
      tags: tags || [],
      featured: featured || false,
      order_index: order || 0,
    };

    const success = await addGalleryImage(newImage);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'gallery',
        entityId: newImage.id,
        entityName: newImage.title || newImage.alt,
      });

      revalidatePath('/thu-vien-hinh-anh');
      return NextResponse.json(newImage, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

// PUT - Cập nhật gallery image
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const images = await getGalleryImages();
    const image = images.find(i => i.id === id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const supabaseUpdates: any = { ...updates };
    if (order !== undefined) supabaseUpdates.order_index = order;

    const success = await updateGalleryImage(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'gallery',
        entityId: id,
        entityName: updates.title || image.title || image.alt,
      });

      revalidatePath('/thu-vien-hinh-anh');
      return NextResponse.json({ ...image, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

// DELETE - Xóa gallery image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const images = await getGalleryImages();
    const image = images.find(i => i.id === id);

    const success = await deleteGalleryImage(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'gallery',
        entityId: id,
        entityName: image?.title || image?.alt,
      });

      revalidatePath('/thu-vien-hinh-anh');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
