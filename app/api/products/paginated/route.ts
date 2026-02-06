import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db-supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';

        // Get all products first (from cache or DB)
        const allProducts = await getProducts();

        // Filter by category if provided
        let filteredProducts = allProducts;
        if (category) {
            filteredProducts = allProducts.filter((p: any) =>
                p.category?.toLowerCase() === category.toLowerCase() ||
                p.category_slug?.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by search query if provided
        if (search) {
            const searchLower = search.toLowerCase();
            filteredProducts = filteredProducts.filter((p: any) =>
                p.name?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower) ||
                p.category?.toLowerCase().includes(searchLower)
            );
        }

        // Calculate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Return paginated response
        return NextResponse.json({
            products: paginatedProducts,
            pagination: {
                page,
                limit,
                total: filteredProducts.length,
                totalPages: Math.ceil(filteredProducts.length / limit),
                hasMore: endIndex < filteredProducts.length
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
