'use client';

import { useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import InfiniteScrollTrigger from './InfiniteScrollTrigger';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import EmptyState from './EmptyState';
import { ProductListSkeleton } from './LoadingIndicator';
import { Product } from '@/types';

interface InfiniteProductListProps {
    initialProducts: Product[];
    category?: string;
    searchQuery?: string;
    pageSize?: number;
}

export default function InfiniteProductList({
    initialProducts,
    category = '',
    searchQuery = '',
    pageSize = 12
}: InfiniteProductListProps) {
    const [error, setError] = useState<string | null>(null);

    // Function to fetch more products
    const fetchMoreProducts = useCallback(async (page: number): Promise<Product[]> => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pageSize.toString(),
                ...(category && { category }),
                ...(searchQuery && { search: searchQuery })
            });

            const response = await fetch(`/api/products/paginated?${params}`);

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            return data.products || [];
        } catch (err) {
            console.error('Error fetching more products:', err);
            setError('Không thể tải thêm sản phẩm. Vui lòng thử lại.');
            return [];
        }
    }, [category, searchQuery, pageSize]);

    const {
        items: products,
        isLoading,
        hasMore,
        loadMore
    } = useInfiniteScroll({
        initialData: initialProducts,
        fetchMore: fetchMoreProducts,
        pageSize
    });

    // Show empty state if no products
    if (products.length === 0 && !isLoading) {
        return (
            <EmptyState
                title="Không tìm thấy sản phẩm"
                description={
                    searchQuery
                        ? `Không có kết quả nào cho từ khóa "${searchQuery}". Vui lòng thử lại với từ khóa khác.`
                        : category
                            ? `Danh mục này hiện chưa có sản phẩm nào. Vui lòng xem các danh mục khác.`
                            : 'Hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau.'
                }
                actionLabel="Xem tất cả sản phẩm"
                actionHref="/san-pham"
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {products.map((product, index) => (
                    <ProductCard
                        key={`${product.id}-${index}`}
                        product={product}
                        className="h-full"
                    />
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-card border border-accent/30 bg-accent/5 p-6 text-center">
                    <p className="text-sm text-navy">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            loadMore();
                        }}
                        className="mt-3 inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 ease-brand hover:bg-navy"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            <InfiniteScrollTrigger
                onLoadMore={loadMore}
                isLoading={isLoading}
                hasMore={hasMore}
                loadingText="Đang tải thêm sản phẩm..."
            />

            {/* Loading Skeleton for first load */}
            {isLoading && products.length === 0 && (
                <ProductListSkeleton count={pageSize} />
            )}
        </div>
    );
}
