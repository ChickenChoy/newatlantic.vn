import { NextRequest, NextResponse } from 'next/server';
import { getPostCategories, savePostCategories, addPostCategory, deletePostCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PostCategory } from '@/types';
import { logActivity } from '@/lib/activity-logs';

// Force Node.js runtime for fs operations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách post categories
export async function GET() {
  try {
    const categories = getPostCategories();
    // Sort by order
    categories.sort((a, b) => a.order - b.order);
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

    const categories = getPostCategories();

    // Check if slug already exists
    if (categories.some(c => c.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newCategory: PostCategory = {
      id: `post-cat-${Date.now()}`,
      name,
      slug,
      description: description || '',
      order: order ?? categories.length,
      enabled: enabled !== false,
    };

    const success = addPostCategory(newCategory);

    if (success) {
      // Log activity
      await logActivity({
        action: 'create',
        entity: 'post-category',
        entityId: newCategory.id,
        entityName: newCategory.name,
      });

      // Revalidate news page
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
    const { id, name, slug, description, order, enabled } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const categories = getPostCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if new slug conflicts with another category
    if (slug && categories.some(c => c.slug === slug && c.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    categories[index] = {
      ...categories[index],
      name: name ?? categories[index].name,
      slug: slug ?? categories[index].slug,
      description: description !== undefined ? description : categories[index].description,
      order: order !== undefined ? order : categories[index].order,
      enabled: enabled !== undefined ? enabled : categories[index].enabled,
    };

    const success = savePostCategories(categories);

    if (success) {
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'post-category',
        entityId: id,
        entityName: categories[index].name,
      });

      // Revalidate news page
      revalidatePath('/tin-tuc');

      return NextResponse.json(categories[index]);
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

    const categories = getPostCategories();
    const category = categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Don't allow deleting the "all" category
    if (category.slug === 'all') {
      return NextResponse.json({ error: 'Cannot delete the "All" category' }, { status: 400 });
    }

    const success = deletePostCategory(id);

    if (success) {
      // Log activity
      await logActivity({
        action: 'delete',
        entity: 'post-category',
        entityId: id,
        entityName: category.name,
      });

      // Revalidate news page
      revalidatePath('/tin-tuc');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete post category' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting post category:', error);
    return NextResponse.json({ error: 'Failed to delete post category' }, { status: 500 });
  }
}
