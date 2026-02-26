'use client';


import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Product, Post, Category, GalleryImage, PostCategory } from '@/types';

interface DashboardOverviewProps {
  products: Product[];
  posts: Post[];
  categories: Category[];
  postCategories: PostCategory[];
  galleryImages: GalleryImage[];
}

export default function DashboardOverview({
  products,
  posts,
  categories,
  postCategories,
  galleryImages,
}: DashboardOverviewProps) {
  const featuredProducts = products.filter(p => p.featured).length;
  const recentProducts = [...products].sort((a, b) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  ).slice(0, 5);
  const recentPosts = [...posts].sort((a, b) =>
    new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  ).slice(0, 5);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const stats = [
    { label: 'Sản phẩm', value: products.length, sub: `${featuredProducts} nổi bật`, icon: 'solar:cart-3-bold-duotone', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', link: '/admin?tab=products' },
    { label: 'Bài viết', value: posts.length, sub: 'Tin tức & Blog', icon: 'solar:document-text-bold-duotone', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10', link: '/admin?tab=posts' },
    { label: 'Danh mục SP', value: categories.length, sub: 'Danh mục sản phẩm', icon: 'solar:layers-bold-duotone', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', link: '/admin?tab=categories' },
    { label: 'Danh mục tin', value: postCategories.length, sub: 'Danh mục tin tức', icon: 'solar:folder-bold-duotone', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-500/10', link: '/admin?tab=post-categories' },
    { label: 'Thư viện ảnh', value: galleryImages.length, sub: 'Hình ảnh đã tải', icon: 'solar:gallery-bold-duotone', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10', link: '/admin?tab=gallery' },
  ];

  const quickActions = [
    { title: 'Thêm sản phẩm', icon: 'solar:cart-plus-bold-duotone', href: '/admin/product/new', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { title: 'Thêm bài viết', icon: 'solar:document-add-bold-duotone', href: '/admin/post/new', color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { title: 'Quản lý danh mục', icon: 'solar:layers-bold-duotone', href: '/admin?tab=categories', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { title: 'Thư viện ảnh', icon: 'solar:gallery-add-bold-duotone', href: '/admin?tab=gallery', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    { title: 'Cài đặt website', icon: 'solar:settings-bold-duotone', href: '/admin?tab=site-settings', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-500/10' },
    { title: 'Bảo mật', icon: 'solar:shield-keyhole-bold-duotone', href: '/admin?tab=settings', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-500/10' },
  ];

  // Category stats
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.category === cat.slug).length,
    slug: cat.slug
  })).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxCount = Math.max(...categoryStats.map(c => c.count), 1);
  const barColors = ['bg-blue-500', 'bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500'];

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ── */}
      <div className="bg-white dark:bg-darkgray rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
              {greeting}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Quản lý nội dung website <span className="font-medium text-gray-700 dark:text-gray-200">New Atlantic</span> một cách dễ dàng.
              <br className="hidden sm:block" />
              Tất cả thay đổi sẽ được cập nhật trực tiếp trên website.
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Hệ thống hoạt động</span>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {stats.map(stat => (
          <Link key={stat.label} href={stat.link}
            className="bg-white dark:bg-darkgray rounded-2xl p-5 border border-gray-100 dark:border-gray-700
              hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm transition-all group">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg} mb-4`}>
              <Icon icon={stat.icon} className={stat.color} height={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white dark:bg-darkgray rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
            <Icon icon="solar:bolt-bold-duotone" className="text-amber-600 dark:text-amber-400" height={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Thao tác nhanh</h2>
            <p className="text-xs text-gray-400">Truy cập nhanh các tính năng thường dùng</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map(action => (
            <Link key={action.title} href={action.href}
              className="flex flex-col items-center gap-3 p-4 rounded-xl
                border border-gray-100 dark:border-gray-700
                hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm
                transition-all text-center group">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${action.bg}
                group-hover:scale-105 transition-transform`}>
                <Icon icon={action.icon} className={action.color} height={22} />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Products */}
        <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Icon icon="solar:cart-3-bold-duotone" className="text-blue-600 dark:text-blue-400" height={16} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Sản phẩm mới</h3>
            </div>
            <Link href="/admin?tab=products" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="p-3">
            {recentProducts.length > 0 ? recentProducts.map(product => (
              <div key={product.id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img src={product.image} alt={product.name}
                  className="w-11 h-11 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{product.categoryName || product.category}</p>
                </div>
                {product.price && (
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">{product.price}</span>
                )}
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400">
                <Icon icon="solar:cart-large-minimalistic-line-duotone" height={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center">
                <Icon icon="solar:document-text-bold-duotone" className="text-violet-600 dark:text-violet-400" height={16} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bài viết mới</h3>
            </div>
            <Link href="/admin?tab=posts" className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="p-3">
            {recentPosts.length > 0 ? recentPosts.map(post => (
              <div key={post.id}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <img src={post.image} alt={post.title}
                  className="w-11 h-11 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
                </div>
                <Link href={`/admin/post/${post.id}`}
                  className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-colors flex-shrink-0">
                  <Icon icon="solar:pen-2-bold-duotone" height={15} />
                </Link>
              </div>
            )) : (
              <div className="text-center py-10 text-gray-400">
                <Icon icon="solar:document-line-duotone" height={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Chưa có bài viết nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Stats */}
        <div className="bg-white dark:bg-darkgray rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center">
                <Icon icon="solar:chart-2-bold-duotone" className="text-teal-600 dark:text-teal-400" height={16} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Thống kê danh mục</h3>
            </div>
            <Link href="/admin?tab=categories" className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline">
              Xem tất cả →
            </Link>
          </div>
          <div className="p-6">
            {categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.map((cat, i) => (
                  <div key={cat.slug}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-600 dark:text-gray-300 truncate mr-3">{cat.name}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{cat.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColors[i] || barColors[0]} transition-all duration-500`}
                        style={{ width: `${(cat.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Icon icon="solar:layers-line-duotone" height={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Chưa có danh mục nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

