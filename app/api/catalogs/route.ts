import { NextRequest, NextResponse } from 'next/server';
import { getCatalogs, addCatalog, updateCatalog, deleteCatalog } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách catalogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    let catalogs = await getCatalogs();

    if (brand) {
      catalogs = catalogs.filter(c => c.brand === brand);
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

    const newCatalog: any = {
      id: String(Date.now()),
      title,
      description: description || '',
      brand,
      download_url: downloadUrl,
      thumbnail: thumbnail || '',
      order_index: order || 0,
      enabled: enabled !== false,
    };

    const success = await addCatalog(newCatalog);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'catalog',
        entityId: newCatalog.id,
        entityName: newCatalog.title,
      });

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
    const { id, order, downloadUrl, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Catalog ID is required' }, { status: 400 });
    }

    const catalogs = await getCatalogs();
    const catalog = catalogs.find(c => c.id === id);

    if (!catalog) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    const supabaseUpdates: any = { ...updates };
    if (order !== undefined) supabaseUpdates.order_index = order;
    if (downloadUrl !== undefined) supabaseUpdates.download_url = downloadUrl;

    const success = await updateCatalog(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'catalog',
        entityId: id,
        entityName: updates.title || catalog.title,
      });

      revalidatePath('/page-download-catalog');
      return NextResponse.json({ ...catalog, ...updates });
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

    const catalogs = await getCatalogs();
    const catalog = catalogs.find(c => c.id === id);

    const success = await deleteCatalog(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'catalog',
        entityId: id,
        entityName: catalog?.title,
      });

      revalidatePath('/page-download-catalog');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete catalog' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting catalog:', error);
    return NextResponse.json({ error: 'Failed to delete catalog' }, { status: 500 });
  }
}
