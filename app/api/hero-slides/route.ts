import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlides, saveHeroSlides, addHeroSlide, deleteHeroSlide } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { HeroSlide } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách hero slides
export async function GET() {
  try {
    const slides = getHeroSlides();
    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

// POST - Thêm hero slide mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, description, image, link, linkText, order, enabled } = body;

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const newSlide: HeroSlide = {
      id: String(Date.now()),
      title,
      subtitle: subtitle || '',
      description: description || '',
      image,
      link: link || '/',
      linkText: linkText || 'Xem thêm',
      order: order || 0,
      enabled: enabled !== false,
    };

    const success = addHeroSlide(newSlide);

    if (success) {
      revalidatePath('/');
      return NextResponse.json(newSlide, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add hero slide' }, { status: 500 });
  } catch (error) {
    console.error('Error adding hero slide:', error);
    return NextResponse.json({ error: 'Failed to add hero slide' }, { status: 500 });
  }
}

// PUT - Cập nhật hero slide
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    const slides = getHeroSlides();
    const index = slides.findIndex(s => s.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    slides[index] = { ...slides[index], ...updates };
    const success = saveHeroSlides(slides);

    if (success) {
      revalidatePath('/');
      return NextResponse.json(slides[index]);
    }

    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  }
}

// DELETE - Xóa hero slide
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    const success = deleteHeroSlide(id);

    if (success) {
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
