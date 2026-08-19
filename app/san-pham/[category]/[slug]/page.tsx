import { getProductBySlug, getProductsByCategory, getProducts } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/ProductPageContent';
import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';
import type { Product } from '@/types';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Enable static generation for better performance
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for all products at build time
export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product: Product) => ({
    category: product.categorySlug || product.category,
    slug: product.slug,
  }));
}

// Optimized metadata generation - uses getProductBySlug instead of fetching all products
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return genMeta({
      title: 'Sản phẩm không tìm thấy',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
      path: `/san-pham/${slug}`,
      noIndex: true,
    });
  }

  const specs = product.specifications
    ? Object.entries(product.specifications)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
    : '';

  return genMeta({
    title: product.name,
    description: `${product.description}. ${specs}. Hàng chính hãng, giá tốt nhất. Liên hệ NEW ATLANTIC để được tư vấn và báo giá chi tiết.`,
    image: product.image,
    path: `/san-pham/${product.category}/${slug}`,
    keywords: [
      product.name,
      product.categoryName,
      'NEW ATLANTIC',
      'hàng chính hãng',
      'giá tốt',
      'bảo hành chính hãng',
    ],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, category } = await params;

  // Optimized: Use getProductBySlug instead of fetching all products
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get all products in the same category (excluding current product)
  const relatedProducts = (await getProductsByCategory(category))
    .filter((p: Product) => p.id !== product.id && p.enabled !== false);

  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPageContent product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}

// Loading skeleton component for better UX
function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-28 md:pt-32">
      <div className="mx-auto w-full max-w-site px-5 py-12 md:px-gutter">
        <div className="grid grid-cols-1 gap-8 rounded-card border border-navy/14 bg-surface p-6 md:p-10 lg:grid-cols-2 lg:gap-12">
          {/* Image Skeleton */}
          <div className="animate-pulse">
            <div className="relative h-[250px] rounded-card bg-navy/14 sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]"></div>
          </div>

          {/* Content Skeleton */}
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 rounded-card bg-navy/14"></div>
            <div className="h-6 w-1/2 rounded-card bg-navy/14"></div>
            <div className="h-32 rounded-card bg-navy/14"></div>
            <div className="h-12 rounded-pill bg-navy/14"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
