'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { WishlistManager } from '@/lib/wishlist';
import { Product } from '@/types';
import HolidayBanner from '@/components/HolidayBanner';
import EmptyState from '@/components/EmptyState';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { PageHero, Section, CTABand, ArrowButton } from '@/components/sections';
import StaggerGroup from '@/components/motion/StaggerGroup';

const GRID_CLASS = 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    try {
      const items = WishlistManager.getWishlist();
      setWishlist(items);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }

    const handleWishlistUpdate = () => {
      try {
        const updatedItems = WishlistManager.getWishlist();
        setWishlist(updatedItems);
      } catch (error) {
        console.error('Error updating wishlist:', error);
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, []);

  const removeFromWishlist = (productId: string, productName: string) => {
    if (window.confirm(`Xóa "${productName}" khỏi danh sách yêu thích?`)) {
      WishlistManager.removeFromWishlist(productId);
      // Dynamic import toast to show notification
      import('@/components/ToastProvider').then(({ toast }) => {
        toast.info(`Đã xóa "${productName}" khỏi yêu thích`);
      }).catch((err) => {
        console.error('Failed to load toast:', err);
      });
    }
  };

  const clearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm yêu thích?')) {
      WishlistManager.clearWishlist();
      // Dynamic import toast to show notification
      import('@/components/ToastProvider').then(({ toast }) => {
        toast.success('Đã xóa tất cả sản phẩm yêu thích!');
      }).catch((err) => {
        console.error('Failed to load toast:', err);
      });
    }
  };

  // The list lives in localStorage, so the count is only known after mount.
  const intro = !hasMounted || isLoading
    ? 'Đang tải danh sách...'
    : wishlist.length > 0
      ? `Bạn đang quan tâm đến ${wishlist.length} sản phẩm. Liên hệ để được kỹ sư tư vấn cấu hình và báo giá.`
      : 'Lưu lại những thiết bị bạn quan tâm để so sánh và xem lại sau.';

  return (
    <>
      <PageHero
        eyebrow="Danh sách quan tâm"
        title="Sản phẩm yêu thích"
        image="/images/place-holder/hiab-crane-truck.jpg"
        intro={intro}
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Yêu thích' }]}
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      <Section>
        {!hasMounted || isLoading ? (
          <div className={GRID_CLASS}>
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : wishlist.length > 0 ? (
          <>
            <div className="mb-10 flex items-center justify-between gap-4 border-b border-navy/14 pb-6">
              <p className="text-sm text-ink">
                <span className="font-semibold text-navy">{wishlist.length}</span> sản phẩm đã lưu
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="group inline-flex items-center gap-2 rounded-pill border border-navy/14 bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-300 ease-brand hover:border-accent hover:text-accent"
              >
                <TrashIcon className="h-4 w-4" />
                Xóa tất cả
              </button>
            </div>

            <StaggerGroup className={GRID_CLASS} stagger={60}>
              {wishlist.map((product) => (
                <div key={product.id} className="group/item relative h-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(product.id, product.name);
                    }}
                    aria-label={`Xóa ${product.name} khỏi yêu thích`}
                    title="Xóa khỏi yêu thích"
                    className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-pill bg-navy text-white shadow-lg transition-colors duration-300 ease-brand hover:bg-accent focus-visible:opacity-100 md:opacity-0 md:group-hover/item:opacity-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <ProductCard product={product} className="h-full" hideQuickView={true} />
                </div>
              ))}
            </StaggerGroup>
          </>
        ) : (
          <EmptyState
            icon={
              <svg
                className="h-20 w-20 text-navy/14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
            title="Chưa có sản phẩm yêu thích"
            description="Dạo qua danh mục thiết bị của chúng tôi và lưu lại những sản phẩm bạn quan tâm để xem lại sau."
            actionLabel="Khám phá sản phẩm"
            actionHref="/san-pham"
          />
        )}
      </Section>

      <CTABand
        eyebrow="Đã chọn được thiết bị?"
        title="Nhận báo giá cho danh sách của bạn"
        intro="Gửi danh sách quan tâm cho chúng tôi — kỹ sư New Atlantic phản hồi cấu hình và giá trong 24 giờ làm việc."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ ngay
            </ArrowButton>
            <ArrowButton href="/san-pham" variant="outline-light">
              Xem thêm sản phẩm
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
