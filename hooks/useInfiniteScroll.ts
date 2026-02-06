import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
    initialData: T[];
    fetchMore: (page: number) => Promise<T[]>;
    pageSize?: number;
}

interface UseInfiniteScrollReturn<T> {
    items: T[];
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    reset: () => void;
}

export function useInfiniteScroll<T>({
    initialData,
    fetchMore,
    pageSize = 12
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
    const [items, setItems] = useState<T[]>(initialData);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const newItems = await fetchMore(nextPage);

            if (newItems.length === 0 || newItems.length < pageSize) {
                setHasMore(false);
            }

            setItems(prev => [...prev, ...newItems]);
            setPage(nextPage);
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            setIsLoading(false);
        }
    }, [page, isLoading, hasMore, fetchMore, pageSize]);

    const reset = useCallback(() => {
        setItems(initialData);
        setPage(1);
        setHasMore(true);
    }, [initialData]);

    // Reset when initialData changes
    useEffect(() => {
        setItems(initialData);
        setPage(1);
        setHasMore(initialData.length >= pageSize);
    }, [initialData, pageSize]);

    return {
        items,
        isLoading,
        hasMore,
        loadMore,
        reset
    };
}
