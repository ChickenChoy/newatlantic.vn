import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProductPageContent from '@/components/ProductPageContent';
import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  
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
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get all products in the same category (excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id);

  return <ProductPageContent product={product} relatedProducts={relatedProducts} />;
}