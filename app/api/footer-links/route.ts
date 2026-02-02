import { NextRequest, NextResponse } from 'next/server';
import { getFooterLinks, saveFooterLinks, addFooterLink, deleteFooterLink } from '@/lib/db';
import { revalidatePath, revalidateTag } from 'next/cache';
import { FooterLink } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách footer links
export async function GET() {
  try {
    const links = getFooterLinks();
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

    const newLink: FooterLink = {
      id: String(Date.now()),
      label,
      href,
      section: section || 'quick',
      isExternal: isExternal || false,
      order: order || 0,
    };

    const success = addFooterLink(newLink);

    if (success) {
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

    // Check if body is an array (bulk update) or single object
    if (Array.isArray(body)) {
      // Bulk update - save entire array
      const success = saveFooterLinks(body);
      if (success) {
        revalidatePath('/');
        return NextResponse.json(body);
      }
      return NextResponse.json({ error: 'Failed to save footer links' }, { status: 500 });
    }

    // Single link update
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    const links = getFooterLinks();
    const index = links.findIndex(l => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    links[index] = { ...links[index], ...updates };
    const success = saveFooterLinks(links);

    if (success) {
      revalidatePath('/');
      return NextResponse.json(links[index]);
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

    const success = deleteFooterLink(id);

    if (success) {
      revalidatePath('/');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json({ error: 'Failed to delete footer link' }, { status: 500 });
  }
}
