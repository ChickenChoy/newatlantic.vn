import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db-supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // Validate and parse query parameters
        const pageParam = searchParams.get('page');
        const limitParam = searchParams.get('limit');
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';

        // Validate page number
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        if (isNaN(page) || page < 1) {
            return NextResponse.json(
                { error: 'Invalid page number' },
                { status: 400 }
            );
        }

        // Validate limit
        const limit = limitParam ? parseInt(limitParam, 10) : 12;
        if (isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json(
                { error: 'Invalid limit. Must be between 1 and 100' },
                { status: 400 }
            );
        }

        // Calculate offset
        const offset = (page - 1) * limit;

        // Fetch products with database-level filtering and pagination
        const products = await getProducts({
            limit,
            offset,
            category: category || undefined,
            search: search || undefined
        });

        // Get total count for pagination metadata
        // Note: This is a simplified approach. For production, consider using Supabase count query
        const allProducts = await getProducts({
            category: category || undefined,
            search: search || undefined
        });
        const total = allProducts.length;

        // Return paginated response with cache headers
        return NextResponse.json(
            {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasMore: offset + limit < total
                }
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}
