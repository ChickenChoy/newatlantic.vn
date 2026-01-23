'use client';

import { Icon } from '@iconify/react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}

function StatsCard({ title, value, icon, iconBg, iconColor, trend, trendUp, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-darkgray rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon icon={icon} className={iconColor} height={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            trendUp
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
          }`}>
            <Icon
              icon={trendUp ? 'solar:arrow-up-line-duotone' : 'solar:arrow-down-line-duotone'}
              height={14}
            />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface DashboardStatsProps {
  products: { length: number; featured?: number };
  posts: { length: number };
  categories: { length: number };
  postCategories: { length: number };
  galleryImages: { length: number };
}

export default function DashboardStats({
  products,
  posts,
  categories,
  postCategories,
  galleryImages,
}: DashboardStatsProps) {
  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: products.length,
      icon: 'solar:cart-3-line-duotone',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      trend: '+12%',
      trendUp: true,
      subtitle: `${products.featured || 0} sản phẩm nổi bật`
    },
    {
      title: 'Bài viết',
      value: posts.length,
      icon: 'solar:document-text-line-duotone',
      iconBg: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      subtitle: 'Tin tức & Bài viết'
    },
    {
      title: 'Danh mục SP',
      value: categories.length,
      icon: 'solar:layers-line-duotone',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      subtitle: 'Danh mục sản phẩm'
    },
    {
      title: 'Danh mục tin',
      value: postCategories.length,
      icon: 'solar:folder-line-duotone',
      iconBg: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-600',
      subtitle: 'Danh mục tin tức'
    },
    {
      title: 'Thư viện ảnh',
      value: galleryImages.length,
      icon: 'solar:gallery-line-duotone',
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600',
      subtitle: 'Hình ảnh đã tải lên'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
