import { NextRequest, NextResponse } from 'next/server';
import { getPostCategories, savePostCategories, addPostCategory, updatePostCategory, deletePostCategory } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách post categories
export async function GET() {
  try {
    const categories = await getPostCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching post categories:', error);
    return NextResponse.json({ error: 'Failed to fetch post categories' }, { status: 500 });
  }
}

// POST - Thêm post category mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, order, enabled } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const categories = await getPostCategories();

    if (categories.some(c => c.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newCategory: any = {
      id: `post-cat-${Date.now()}`,
      name,
      slug,
      description: description || '',
      order_index: order ?? categories.length,
      enabled: enabled !== false,
    };

    const success = await addPostCategory(newCategory);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'post-category',
        entityId: newCategory.id,
        entityName: newCategory.name,
      });

      revalidatePath('/tin-tuc');
      return NextResponse.json(newCategory, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add post category' }, { status: 500 });
  } catch (error) {
    console.error('Error adding post category:', error);
    return NextResponse.json({ error: 'Failed to add post category' }, { status: 500 });
  }
}

// PUT - Cập nhật post category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const categories = await getPostCategories();
    const category = categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (updates.slug && categories.some(c => c.slug === updates.slug && c.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const supabaseUpdates: any = { ...updates };
    if (order !== undefined) supabaseUpdates.order_index = order;

    const success = await updatePostCategory(id, supabaseUpdates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'post-category',
        entityId: id,
        entityName: updates.name || category.name,
      });

      revalidatePath('/tin-tuc');
      return NextResponse.json({ ...category, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update post category' }, { status: 500 });
  } catch (error) {
    console.error('Error updating post category:', error);
    return NextResponse.json({ error: 'Failed to update post category' }, { status: 500 });
  }
}

// DELETE - Xóa post category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const categories = await getPostCategories();
    const category = categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category.slug === 'all') {
      return NextResponse.json({ error: 'Cannot delete the "All" category' }, { status: 400 });
    }

    const success = await deletePostCategory(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'post-category',
        entityId: id,
        entityName: category.name,
      });

      revalidatePath('/tin-tuc');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete post category' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting post category:', error);
    return NextResponse.json({ error: 'Failed to delete post category' }, { status: 500 });
  }
}
