import { NextRequest, NextResponse } from 'next/server';
import { getProducts, saveProducts, addProduct, deleteProduct, getCategories } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Product } from '@/types';
import { logActivity } from '@/lib/activity-logs';

// Force Node.js runtime for fs operations
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Lấy danh sách products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const id = searchParams.get('id');

    let products = getProducts();

    // Filter by single product ID
    if (id) {
      const product = products.find(p => p.id === id);
      if (product) {
        return NextResponse.json(product);
      }
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Filter by category
    if (category) {
      products = products.filter(p => p.category === category);
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    return NextResponse.json(products);
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

    const products = getProducts();

    // Check if slug already exists
    if (products.some(p => p.slug === slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Get category name
    const categories = getCategories();
    const categoryObj = categories.find(c => c.slug === category);
    const categoryName = categoryObj?.name || category;

    const newProduct: Product = {
      id: String(Date.now()),
      name,
      slug,
      category,
      categoryName,
      description: description || '',
      fullDescription: fullDescription || '',
      shortDescription: shortDescription || '',
      image: image || '/images/products/placeholder.jpg',
      images: images || [],
      price: price || 'Liên hệ',
      featured: featured || false,
      specifications: specifications || {},
    };

    const success = addProduct(newProduct);

    if (success) {
      // Log activity
      await logActivity({
        action: 'create',
        entity: 'product',
        entityId: newProduct.id,
        entityName: newProduct.name,
      });

      // Revalidate pages
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

    const products = getProducts();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if new slug conflicts with another product
    if (updates.slug && products.some(p => p.slug === updates.slug && p.id !== id)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Update category name if category changed
    if (updates.category) {
      const categories = getCategories();
      const categoryObj = categories.find(c => c.slug === updates.category);
      updates.categoryName = categoryObj?.name || updates.category;
    }

    const oldSlug = products[index].slug;
    const oldCategory = products[index].category;
    products[index] = { ...products[index], ...updates };

    const success = saveProducts(products);

    if (success) {
      // Log activity
      await logActivity({
        action: 'update',
        entity: 'product',
        entityId: id,
        entityName: products[index].name,
      });

      // Revalidate pages
      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${oldCategory}`);
      revalidatePath(`/san-pham/${oldCategory}/${oldSlug}`);
      if (updates.category && updates.category !== oldCategory) {
        revalidatePath(`/san-pham/${updates.category}`);
      }
      if (updates.slug && updates.slug !== oldSlug) {
        revalidatePath(`/san-pham/${products[index].category}/${updates.slug}`);
      }
      revalidatePath('/');

      return NextResponse.json(products[index]);
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

    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const success = deleteProduct(id);

    if (success) {
      // Log activity
      await logActivity({
        action: 'delete',
        entity: 'product',
        entityId: id,
        entityName: product.name,
      });

      // Revalidate pages
      revalidatePath('/san-pham');
      revalidatePath(`/san-pham/${product.category}`);
      revalidatePath(`/san-pham/${product.category}/${product.slug}`);
      revalidatePath('/');

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
