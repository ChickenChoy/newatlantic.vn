import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategories, addCategory, deleteCategory } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Category } from '@/types';

// Force Node.js runtime for fs operations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách categories
export async function GET() {
  try {
    const categories = getCategories();
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

    const categories = getCategories();

    // Check if slug already exists
    if (categories.some(c => c.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newCategory: Category = {
      id: String(Date.now()),
      name,
      slug,
      description: description || '',
      image: image || '',
    };

    const success = addCategory(newCategory);

    if (success) {
      // Revalidate pages that use categories
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

    const categories = getCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if new slug conflicts with another category
    if (slug && categories.some(c => c.slug === slug && c.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const oldSlug = categories[index].slug;
    categories[index] = {
      ...categories[index],
      name: name || categories[index].name,
      slug: slug || categories[index].slug,
      description: description !== undefined ? description : categories[index].description,
      image: image !== undefined ? image : categories[index].image,
    };

    const success = saveCategories(categories);

    if (success) {
      // Revalidate pages
      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${oldSlug}`);
      if (slug && slug !== oldSlug) {
        revalidatePath(`/san-pham/${slug}`);
      }
      revalidatePath('/');

      return NextResponse.json(categories[index]);
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

    const categories = getCategories();
    const category = categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const success = deleteCategory(id);

    if (success) {
      // Revalidate pages
      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${category.slug}`);
      revalidatePath('/');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
