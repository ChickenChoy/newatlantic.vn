import { products, categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import CategoryPageContent from './category-content';

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

