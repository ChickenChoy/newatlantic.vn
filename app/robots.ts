import { MetadataRoute } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { siteConfig } from '@/lib/seo';

interface SEORobots {
  allowAll: boolean;
  disallowPaths: string[];
  crawlDelay: number;
  customRules: string;
}

interface SEOData {
  robots: SEORobots;
}

async function getSEORobots(): Promise<SEORobots> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'seo.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const data: SEOData = JSON.parse(content);
    return data.robots;
  } catch {
    // Default robots config
    return {
      allowAll: true,
      disallowPaths: ['/api/', '/admin/', '/_next/', '/private/'],
      crawlDelay: 0,
      customRules: '',
    };
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const robotsConfig = await getSEORobots();

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: robotsConfig.allowAll ? '/' : undefined,
      disallow: robotsConfig.disallowPaths,
    },
    {
      userAgent: 'Googlebot',
      allow: '/',
      disallow: robotsConfig.disallowPaths.filter(p => p !== '/_next/'),
    },
    {
      userAgent: 'Bingbot',
      allow: '/',
      disallow: robotsConfig.disallowPaths.filter(p => p !== '/_next/'),
    },
  ];

  return {
    rules,
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
