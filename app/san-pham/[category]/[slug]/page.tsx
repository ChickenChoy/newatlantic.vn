import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/ProductPageContent';

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy - NEW ATLANTIC',
      description: 'Sản phẩm bạn đang tìm kiếm không tồn tại.',
    };
  }

  return {
    title: `${product.name} - NEW ATLANTIC`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    notFound();
  }

  // Get all products in the same category (excluding current product)
  const relatedProducts = products
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id);

  return <ProductPageContent product={product} relatedProducts={relatedProducts} />;
}