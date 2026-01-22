import { NextRequest, NextResponse } from 'next/server';
import { getCatalogs, saveCatalogs, addCatalog, deleteCatalog } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Catalog } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách catalogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    let catalogs = getCatalogs();

    if (brand) {
      catalogs = catalogs.filter(c => c.brand === brand && c.enabled);
    }

    return NextResponse.json(catalogs);
  } catch (error) {
    console.error('Error fetching catalogs:', error);
    return NextResponse.json({ error: 'Failed to fetch catalogs' }, { status: 500 });
  }
}

// POST - Thêm catalog mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, brand, downloadUrl, thumbnail, order, enabled } = body;

    if (!title || !brand || !downloadUrl) {
      return NextResponse.json({ error: 'Title, brand, and downloadUrl are required' }, { status: 400 });
    }

    const newCatalog: Catalog = {
      id: String(Date.now()),
      title,
      description: description || '',
      brand,
      downloadUrl,
      thumbnail: thumbnail || '',
      order: order || 0,
      enabled: enabled !== false,
    };

    const success = addCatalog(newCatalog);

    if (success) {
      revalidatePath('/page-download-catalog');
      return NextResponse.json(newCatalog, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add catalog' }, { status: 500 });
  } catch (error) {
    console.error('Error adding catalog:', error);
    return NextResponse.json({ error: 'Failed to add catalog' }, { status: 500 });
  }
}

// PUT - Cập nhật catalog
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Catalog ID is required' }, { status: 400 });
    }

    const catalogs = getCatalogs();
    const index = catalogs.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    catalogs[index] = { ...catalogs[index], ...updates };
    const success = saveCatalogs(catalogs);

    if (success) {
      revalidatePath('/page-download-catalog');
      return NextResponse.json(catalogs[index]);
    }

    return NextResponse.json({ error: 'Failed to update catalog' }, { status: 500 });
  } catch (error) {
    console.error('Error updating catalog:', error);
    return NextResponse.json({ error: 'Failed to update catalog' }, { status: 500 });
  }
}

// DELETE - Xóa catalog
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Catalog ID is required' }, { status: 400 });
    }

    const success = deleteCatalog(id);

    if (success) {
      revalidatePath('/page-download-catalog');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete catalog' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting catalog:', error);
    return NextResponse.json({ error: 'Failed to delete catalog' }, { status: 500 });
  }
}
