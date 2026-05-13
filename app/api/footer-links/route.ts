import { NextRequest, NextResponse } from 'next/server';
import { getFooterLinks, saveFooterLinks, addFooterLink, updateFooterLink, deleteFooterLink } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách footer links
export async function GET() {
  try {
    const links = await getFooterLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json({ error: 'Failed to fetch footer links' }, { status: 500 });
  }
}

// POST - Thêm footer link mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, href, section, isExternal, order } = body;

    if (!label || !href) {
      return NextResponse.json({ error: 'Label and href are required' }, { status: 400 });
    }

    const newLink: any = {
      id: String(Date.now()),
      label,
      href,
      section: section || 'quick',
      is_external: isExternal || false,
      order_index: order || 0,
      enabled: true,
    };

    const success = await addFooterLink(newLink);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'footer-link',
        entityId: newLink.id,
        entityName: newLink.label,
      });

      revalidatePath('/');
      return NextResponse.json(newLink, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add footer link' }, { status: 500 });
  } catch (error) {
    console.error('Error adding footer link:', error);
    return NextResponse.json({ error: 'Failed to add footer link' }, { status: 500 });
  }
}

// PUT - Cập nhật footer link(s)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if body is an array (bulk update)
    if (Array.isArray(body)) {
      // Transform to snake_case
      const transformed = body.map(l => ({
        ...l,
        order_index: l.order ?? l.order_index ?? 0,
        is_external: l.isExternal ?? l.is_external ?? false
      }));

      const success = await saveFooterLinks(transformed);
      if (success) {
        await logActivity({
          action: 'update',
          entity: 'footer-link',
          details: `Cập nhật ${body.length} footer links`,
        });

        revalidatePath('/');
        return NextResponse.json(body);
      }
      return NextResponse.json({ error: 'Failed to save footer links' }, { status: 500 });
    }

    // Single link update
    const { id, order, isExternal, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    const links = await getFooterLinks();
    const link = links.find(l => l.id === id);

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    const supabaseUpdates: any = { ...updates };
    if (order !== undefined) supabaseUpdates.order_index = order;
    if (isExternal !== undefined) supabaseUpdates.is_external = isExternal;

    const success = await updateFooterLink(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'footer-link',
        entityId: id,
        entityName: updates.label || link.label,
      });

      revalidatePath('/');
      return NextResponse.json({ ...link, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update footer link' }, { status: 500 });
  } catch (error) {
    console.error('Error updating footer link:', error);
    return NextResponse.json({ error: 'Failed to update footer link' }, { status: 500 });
  }
}

// DELETE - Xóa footer link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    const links = await getFooterLinks();
    const link = links.find(l => l.id === id);

    const success = await deleteFooterLink(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'footer-link',
        entityId: id,
        entityName: link?.label,
      });

      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  }
}
