import { NextRequest, NextResponse } from 'next/server';
import { getHeroSlides, addHeroSlide, updateHeroSlide, deleteHeroSlide } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách hero slides
export async function GET() {
  try {
    const slides = await getHeroSlides();
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
    const { title, subtitle, label, description, image, video, link, linkText, order, enabled } = body;

    const newSlide: any = {
      id: String(Date.now()),
      title: title || 'Slide mới',
      subtitle: subtitle || '',
      label: label || '',
      description: description || '',
      image: image || '/images/hero/slide1.jpg',
      video: video || '',
      link: link || '/',
      link_text: linkText || 'Xem thêm',
      order_index: order || 0,
      enabled: enabled !== false,
    };

    const success = await addHeroSlide(newSlide);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'hero-slide',
        entityId: newSlide.id,
        entityName: newSlide.title,
      });

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
    console.log('Hero slide PUT body:', JSON.stringify(body, null, 2));

    const { id, order, linkText, enabled, ...restUpdates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 });
    }

    const slides = await getHeroSlides();
    const slide = slides.find(s => s.id === id);

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    // Map JavaScript field names to Supabase column names
    const supabaseUpdates: any = { ...restUpdates };
    if (order !== undefined) supabaseUpdates.order_index = order;
    if (linkText !== undefined) supabaseUpdates.link_text = linkText;
    if (enabled !== undefined) supabaseUpdates.enabled = enabled;

    // Remove any fields that don't exist in Supabase or are auto-managed
    delete supabaseUpdates.linkText;
    delete supabaseUpdates.order;
    delete supabaseUpdates.createdAt;
    delete supabaseUpdates.updatedAt;
    delete supabaseUpdates.orderIndex;

    console.log('Supabase updates:', JSON.stringify(supabaseUpdates, null, 2));

    const success = await updateHeroSlide(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'hero-slide',
        entityId: id,
        entityName: restUpdates.title || slide.title,
      });

      revalidatePath('/');
      return NextResponse.json({ ...slide, ...body });
    }

    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  } catch (error: any) {
    console.error('Error updating hero slide:', error?.message || error);
    console.error('Error stack:', error?.stack);
    return NextResponse.json({
      error: 'Failed to update hero slide',
      details: error?.message || String(error)
    }, { status: 500 });
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

    const slides = await getHeroSlides();
    const slide = slides.find(s => s.id === id);

    const success = await deleteHeroSlide(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'hero-slide',
        entityId: id,
        entityName: slide?.title,
      });

      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}
