import { NextRequest, NextResponse } from 'next/server';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách categories
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Thêm category mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const categories = await getCategories();

    if (categories.some(c => c.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newCategory: any = {
      id: String(Date.now()),
      name,
      slug,
      description: description || '',
      image: image || '',
      enabled: true,
      order_index: categories.length
    };

    const success = await addCategory(newCategory);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'category',
        entityId: newCategory.id,
        entityName: newCategory.name,
      });

      revalidatePath('/san-pham');
      revalidatePath('/');

      return NextResponse.json(newCategory, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  } catch (error) {
    console.error('Error adding category:', error);
    return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
  }
}

// PUT - Cập nhật category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, description, image } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const categories = await getCategories();
    const category = categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (slug && categories.some(c => c.slug === slug && c.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug;
    if (description !== undefined) updates.description = description;
    if (image !== undefined) updates.image = image;

    const success = await updateCategory(id, updates);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'category',
        entityId: id,
        entityName: name || category.name,
      });

      revalidatePath('/san-pham');
      revalidatePath('/');

      return NextResponse.json({ ...category, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE - Xóa category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const categories = await getCategories();
    const category = categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const success = await deleteCategory(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'category',
        entityId: id,
        entityName: category.name,
      });

      revalidatePath('/san-pham');
      revalidatePath('/');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
