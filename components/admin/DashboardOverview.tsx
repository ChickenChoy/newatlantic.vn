'use client';

import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Product, Post, Category, GalleryImage, PostCategory } from '@/types';

interface QuickActionProps {
  title: string;
  icon: string;
  href: string;
  bgColor: string;
  iconColor: string;
}

function QuickAction({ title, icon, href, bgColor, iconColor }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-darkgray rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-[#5f7ab8] transition-all group"
    >
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${bgColor} group-hover:scale-110 transition-transform`}>
        <Icon icon={icon} className={iconColor} height={24} />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">{title}</span>
    </Link>
  );
}

interface RecentItemProps {
  type: 'product' | 'post';
  item: Product | Post;
}

function RecentItem({ type, item }: RecentItemProps) {
  const isProduct = type === 'product';
  const product = isProduct ? (item as Product) : null;
  const post = !isProduct ? (item as Post) : null;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex-shrink-0">
        <img
          src={isProduct ? product?.image : post?.image}
          alt={isProduct ? product?.name : post?.title}
          className="w-14 h-14 object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {isProduct ? product?.name : post?.title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isProduct ? product?.categoryName || product?.category : post?.date}
        </p>
        {isProduct && product?.price && (
          <p className="text-xs font-medium text-[#5f7ab8] mt-1">{product.price}</p>
        )}
      </div>
      <Link
        href={isProduct ? `/admin/product/${product?.id}` : `/admin/post/${post?.id}`}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-[#5f7ab8] hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Icon icon="solar:pen-2-line-duotone" height={18} />
      </Link>
    </div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgGradient: string;
  iconBg: string;
  subtitle?: string;
  link?: string;
}

function StatsCard({ title, value, icon, bgGradient, iconBg, subtitle, link }: StatsCardProps) {
  const Card = (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${bgGradient}`}>
      <div className="relative z-10">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBg} mb-4`}>
          <Icon icon={icon} className="text-white" height={24} />
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-white/80">{title}</p>
        {subtitle && (
          <p className="text-xs text-white/60 mt-2">{subtitle}</p>
        )}
      </div>
      {/* Decorative circles */}
      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
    </div>
  );

  if (link) {
    return <Link href={link}>{Card}</Link>;
  }
  return Card;
}

interface CategoryStatsProps {
  categories: Category[];
  products: Product[];
}

function CategoryStats({ categories, products }: CategoryStatsProps) {
  const categoryStats = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.category === cat.slug).length,
    slug: cat.slug
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const maxCount = Math.max(...categoryStats.map(c => c.count), 1);

  return (
    <div className="bg-white dark:bg-darkgray rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thống kê danh mục</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Top 5 danh mục có nhiều sản phẩm</p>
        </div>
        <Link
          href="/admin?tab=categories"
          className="text-sm text-[#5f7ab8] hover:underline font-medium"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="space-y-4">
        {categoryStats.map((cat, index) => (
          <div key={cat.slug}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{cat.count}</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  index === 0 ? 'bg-[#5f7ab8]' :
                  index === 1 ? 'bg-purple-500' :
                  index === 2 ? 'bg-teal-500' :
                  index === 3 ? 'bg-orange-500' :
                  'bg-pink-500'
                }`}
                style={{ width: `${(cat.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {categoryStats.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Chưa có danh mục nào
          </p>
        )}
      </div>
    </div>
  );
}

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

  const quickActions: QuickActionProps[] = [
    {
      title: 'Thêm sản phẩm',
      icon: 'solar:cart-plus-line-duotone',
      href: '/admin/product/new',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Thêm bài viết',
      icon: 'solar:document-add-line-duotone',
      href: '/admin/post/new',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Quản lý danh mục',
      icon: 'solar:layers-line-duotone',
      href: '/admin?tab=categories',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
    },
    {
      title: 'Thư viện ảnh',
      icon: 'solar:gallery-add-line-duotone',
      href: '/admin?tab=gallery',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600',
    },
    {
      title: 'Cài đặt website',
      icon: 'solar:settings-line-duotone',
      href: '/admin?tab=site-settings',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20',
      iconColor: 'text-teal-600',
    },
    {
      title: 'Bảo mật',
      icon: 'solar:shield-keyhole-line-duotone',
      href: '/admin?tab=settings',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon icon="solar:home-smile-line-duotone" className="text-white" height={24} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Chào mừng quay lại!
              </h1>
            </div>
            <p className="text-white/80 text-sm md:text-base max-w-lg">
              Quản lý nội dung website New Atlantic một cách dễ dàng. Tất cả thay đổi sẽ được cập nhật trực tiếp trên website.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-white/10 rounded-xl px-6 py-3">
              <p className="text-2xl font-bold text-white">{products.length}</p>
              <p className="text-xs text-white/70">Sản phẩm</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl px-6 py-3">
              <p className="text-2xl font-bold text-white">{posts.length}</p>
              <p className="text-xs text-white/70">Bài viết</p>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        <StatsCard
          title="Tổng sản phẩm"
          value={products.length}
          icon="solar:cart-3-bold-duotone"
          bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
          iconBg="bg-blue-400"
          subtitle={`${featuredProducts} sản phẩm nổi bật`}
          link="/admin?tab=products"
        />
        <StatsCard
          title="Bài viết"
          value={posts.length}
          icon="solar:document-text-bold-duotone"
          bgGradient="bg-gradient-to-br from-purple-500 to-purple-600"
          iconBg="bg-purple-400"
          subtitle="Tin tức & Bài viết"
          link="/admin?tab=posts"
        />
        <StatsCard
          title="Danh mục SP"
          value={categories.length}
          icon="solar:layers-bold-duotone"
          bgGradient="bg-gradient-to-br from-orange-500 to-orange-600"
          iconBg="bg-orange-400"
          subtitle="Danh mục sản phẩm"
          link="/admin?tab=categories"
        />
        <StatsCard
          title="Danh mục tin"
          value={postCategories.length}
          icon="solar:folder-bold-duotone"
          bgGradient="bg-gradient-to-br from-teal-500 to-teal-600"
          iconBg="bg-teal-400"
          subtitle="Danh mục tin tức"
          link="/admin?tab=post-categories"
        />
        <StatsCard
          title="Thư viện ảnh"
          value={galleryImages.length}
          icon="solar:gallery-bold-duotone"
          bgGradient="bg-gradient-to-br from-pink-500 to-pink-600"
          iconBg="bg-pink-400"
          subtitle="Hình ảnh đã tải lên"
          link="/admin?tab=gallery"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-darkgray rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-[#5f7ab8]/10 flex items-center justify-center">
            <Icon icon="solar:bolt-line-duotone" className="text-[#5f7ab8]" height={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thao tác nhanh</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Truy cập nhanh các tính năng thường dùng</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <QuickAction key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Products */}
        <div className="bg-white dark:bg-darkgray rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Icon icon="solar:cart-3-line-duotone" className="text-blue-600" height={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sản phẩm mới</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">5 sản phẩm gần nhất</p>
              </div>
            </div>
            <Link
              href="/admin?tab=products"
              className="text-sm text-[#5f7ab8] hover:underline font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? (
              recentProducts.map(product => (
                <RecentItem key={product.id} type="product" item={product} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Icon icon="solar:cart-large-minimalistic-line-duotone" height={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-white dark:bg-darkgray rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Icon icon="solar:document-text-line-duotone" className="text-purple-600" height={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bài viết mới</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">5 bài viết gần nhất</p>
              </div>
            </div>
            <Link
              href="/admin?tab=posts"
              className="text-sm text-[#5f7ab8] hover:underline font-medium"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.length > 0 ? (
              recentPosts.map(post => (
                <RecentItem key={post.id} type="post" item={post} />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Icon icon="solar:document-line-duotone" height={40} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có bài viết nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Stats */}
        <CategoryStats categories={categories} products={products} />
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Icon icon="solar:check-circle-bold-duotone" className="text-green-600" height={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Hệ thống CMS đang hoạt động bình thường</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mọi thay đổi sẽ được lưu trực tiếp vào database</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Icon icon="solar:database-line-duotone" height={16} />
              <span>Database: Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon icon="solar:cloud-line-duotone" height={16} />
              <span>CDN: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
