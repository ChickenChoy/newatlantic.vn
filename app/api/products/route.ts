import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories, getProductById } from '@/lib/db-supabase';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types';
import { logActivity } from '@/lib/activity-logs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const id = searchParams.get('id');
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');

    // If requesting single product by ID
    if (id) {
      const products = await getProducts();
      const product = products.find(p => p.id === id);
      if (product) {
        return NextResponse.json(product, {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
          }
        });
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Parse pagination parameters
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const page = pageParam ? parseInt(pageParam, 10) : 1;

    // Validate pagination parameters
    if (limit !== undefined && (isNaN(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid page number' },
        { status: 400 }
      );
    }

    // Calculate offset for pagination
    const offset = limit ? (page - 1) * limit : undefined;

    // Fetch products with filtering and pagination
    let products = await getProducts({
      limit,
      offset,
      category: category || undefined
    });

    // Filter by featured (done in memory as it's a simple boolean check)
    if (featured === 'true') {
      products = products.filter(p => (p as { is_featured?: boolean; featured?: boolean }).is_featured || (p as { is_featured?: boolean; featured?: boolean }).featured);
    }

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Thêm product mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, slug, category, description, fullDescription, shortDescription,
      image, images, price, featured, specifications
    } = body;

    if (!name || !slug || !category) {
      return NextResponse.json({ error: 'Name, slug and category are required' }, { status: 400 });
    }

    // Check if slug already exists - only fetch products with matching slug
    const existingProducts = await getProducts({ search: slug });
    const slugExists = existingProducts.some(p => p.slug === slug);

    if (slugExists) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Get category name
    const categories = await getCategories();
    const categoryObj = categories.find(c => c.slug === category);
    const categoryName = categoryObj?.name || category;

    const newProduct = {
      id: String(Date.now()),
      name,
      slug,
      category,
      categoryName,
      description: description || fullDescription || '',
      shortDescription: shortDescription || '',
      image: image || '/images/products/placeholder.jpg',
      images: images || [],
      price: undefined,
      isFeatured: featured || false, // Convert 'featured' to 'isFeatured' for camelToSnake()
      specifications: specifications || {},
      enabled: true
    };

    const success = await addProduct(newProduct as Product);

    if (success) {
      await logActivity({
        action: 'create',
        entity: 'product',
        entityId: newProduct.id,
        entityName: newProduct.name,
      });

      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${category}`);
      revalidatePath('/');

      return NextResponse.json(newProduct, { status: 201 });
    }

    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// PUT - Cập nhật product
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Fetch only the product being updated
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if new slug conflicts with another product
    if (updates.slug && updates.slug !== product.slug) {
      const conflictingProducts = await getProducts({ search: updates.slug });
      const slugConflict = conflictingProducts.some(p => p.slug === updates.slug && p.id !== id);

      if (slugConflict) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
      }
    }

    // Update category name if category changed
    if (updates.category) {
      const categories = await getCategories();
      const categoryObj = categories.find(c => c.slug === updates.category);
      updates.category_name = categoryObj?.name || updates.category;
    }

    // Map camelCase to snake_case - manual mapping không cần nữa vì đã có camelToSnake()
    // Nhưng vẫn giữ lại logic update category_name
    const supabaseUpdates = { ...updates };

    // Special handling: frontend sends 'featured' but DB needs 'isFeatured' -> 'is_featured'
    if ('featured' in updates) {
      supabaseUpdates.isFeatured = updates.featured;
      delete supabaseUpdates.featured;
    }

    const success = await updateProduct(id, supabaseUpdates as Partial<Product>);

    if (success) {
      await logActivity({
        action: 'update',
        entity: 'product',
        entityId: id,
        entityName: updates.name || product.name,
      });

      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${product.category}`);
      revalidatePath('/');

      return NextResponse.json({ ...product, ...updates });
    }

    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Xóa product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Fetch only the product being deleted
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const success = await deleteProduct(id);

    if (success) {
      await logActivity({
        action: 'delete',
        entity: 'product',
        entityId: id,
        entityName: product.name,
      });

      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${product.category}`);
      revalidatePath('/');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
