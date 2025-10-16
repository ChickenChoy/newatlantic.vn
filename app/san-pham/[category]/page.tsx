import { products, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import CategoryPageContent from './category-content';
import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    return genMeta({
      title: 'Không tìm thấy',
      description: 'Danh mục không tồn tại',
      path: `/san-pham/${categorySlug}`,
      noIndex: true,
    });
  }

  const categoryProducts = products.filter(p => p.categorySlug === categorySlug);
  
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
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(p => p.categorySlug === categorySlug);

  return (
    <CategoryPageContent 
      category={category} 
      categoryProducts={categoryProducts}
      categorySlug={categorySlug}
    />
  );
}

