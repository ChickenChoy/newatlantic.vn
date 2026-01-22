import { NextRequest, NextResponse } from 'next/server';
import { getGalleryImages, saveGalleryImages, addGalleryImage, deleteGalleryImage } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { GalleryImage } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách gallery images
export async function GET() {
  try {
    const images = getGalleryImages();
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

    const newImage: GalleryImage = {
      id: String(Date.now()),
      src,
      alt,
      title: title || '',
      description: description || '',
      category: category || '',
      tags: tags || [],
      featured: featured || false,
      order: order || 0,
    };

    const success = addGalleryImage(newImage);

    if (success) {
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const images = getGalleryImages();
    const index = images.findIndex(i => i.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    images[index] = { ...images[index], ...updates };
    const success = saveGalleryImages(images);

    if (success) {
      revalidatePath('/thu-vien-hinh-anh');
      return NextResponse.json(images[index]);
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

    const success = deleteGalleryImage(id);

    if (success) {
      revalidatePath('/thu-vien-hinh-anh');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
