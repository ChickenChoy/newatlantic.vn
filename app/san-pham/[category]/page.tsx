import { getCategories, getProductsByCategory } from '@/lib/db';
import { notFound } from 'next/navigation';
import CategoryPageContent from './category-content';
import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === categorySlug);

  if (!category) {
    return genMeta({
      title: 'Không tìm thấy',
      description: 'Danh mục không tồn tại',
      path: `/san-pham/${categorySlug}`,
      noIndex: true,
    });
  }

  const categoryProducts = (await getProductsByCategory(categorySlug)).filter(p => p.enabled !== false);

  return genMeta({
    title: category.name,
    description: `${category.description}. Khám phá ${categoryProducts.length} sản phẩm ${category.name} chính hãng với giá tốt nhất tại NEW ATLANTIC. Bảo hành chính hãng, hỗ trợ 24/7.`,
    path: `/san-pham/${categorySlug}`,
    keywords: [
      category.name,
      'NEW ATLANTIC',
      'thiết bị công nghiệp',
      'hàng chính hãng',
      'giá tốt',
    ],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const categories = await getCategories();
  const category = categories.find(c => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const categoryProducts = (await getProductsByCategory(categorySlug)).filter(p => p.enabled !== false);

  return (
    <CategoryPageContent
      category={category}
      categoryProducts={categoryProducts}
      categorySlug={categorySlug}
    />
  );
}
