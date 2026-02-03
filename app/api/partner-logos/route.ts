import { NextRequest, NextResponse } from 'next/server';
import { getPartnerLogos, savePartnerLogos, addPartnerLogo, updatePartnerLogo, deletePartnerLogo } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách partner logos
export async function GET() {
  try {
    const logos = await getPartnerLogos();
    return NextResponse.json(logos);
  } catch (error) {
    console.error('Error fetching partner logos:', error);
    return NextResponse.json({ error: 'Failed to fetch partner logos' }, { status: 500 });
  }
}

// POST - Thêm partner logo mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logo, url, order, enabled } = body;

    if (!name || !logo) {
      return NextResponse.json({ error: 'Name and logo are required' }, { status: 400 });
    }

    const newLogo: any = {
      id: String(Date.now()),
      name,
      logo,
      url: url || '',
      order_index: order || 0,
      enabled: enabled !== false,
    };

    const success = await addPartnerLogo(newLogo);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'partner',
        entityId: newLogo.id,
        entityName: newLogo.name,
      });

      revalidatePath('/');
      return NextResponse.json(newLogo, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add partner logo' }, { status: 500 });
  } catch (error) {
    console.error('Error adding partner logo:', error);
    return NextResponse.json({ error: 'Failed to add partner logo' }, { status: 500 });
  }
}

// PUT - Cập nhật partner logo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Logo ID is required' }, { status: 400 });
    }

    const logos = await getPartnerLogos();
    const logo = logos.find(l => l.id === id);

    if (!logo) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 });
    }

    const supabaseUpdates: any = { ...updates };
    if (order !== undefined) supabaseUpdates.order_index = order;

    const success = await updatePartnerLogo(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'partner',
        entityId: id,
        entityName: updates.name || logo.name,
      });

      revalidatePath('/');
      return NextResponse.json({ ...logo, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update partner logo' }, { status: 500 });
  } catch (error) {
    console.error('Error updating partner logo:', error);
    return NextResponse.json({ error: 'Failed to update partner logo' }, { status: 500 });
  }
}

// DELETE - Xóa partner logo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Logo ID is required' }, { status: 400 });
    }

    const logos = await getPartnerLogos();
    const logo = logos.find(l => l.id === id);

    const success = await deletePartnerLogo(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'partner',
        entityId: id,
        entityName: logo?.name,
      });

      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete partner logo' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting partner logo:', error);
    return NextResponse.json({ error: 'Failed to delete partner logo' }, { status: 500 });
  }
}
