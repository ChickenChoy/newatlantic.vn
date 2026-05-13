import { MetadataRoute } from 'next';
import { getProducts, getCategories, getPosts } from '@/lib/db';
import { siteConfig } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const products = await getProducts();
  const categories = await getCategories();
  const posts = await getPosts();

  // Homepage
  const homepage = {
    url: siteConfig.url,
    lastModified: currentDate,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  };

  // Static pages
  const staticPages = [
    {
      url: `${siteConfig.url}/san-pham`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/tin-tuc`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/lien-he`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/gioi-thieu`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/chinh-sach-bao-mat`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/dieu-khoan-dich-vu`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${siteConfig.url}/san-pham/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Product pages
  const productPages = products.filter((p: any) => p.enabled !== false).map((product: any) => ({
    url: `${siteConfig.url}/san-pham/${product.category_slug || product.categorySlug || product.category}/${product.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Post pages
  const postPages = posts.map((post: any) => ({
    url: `${siteConfig.url}/tin-tuc/${post.slug}`,
    lastModified: new Date(post.date || post.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    homepage,
    ...staticPages,
    ...categoryPages,
    ...productPages,
    ...postPages,
  ];
}
