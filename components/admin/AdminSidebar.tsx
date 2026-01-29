'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useAdminContext } from '@/app/admin/layout';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'solar:widget-2-line-duotone',
    url: '/admin',
  },
  {
    id: 'products',
    name: 'Sản phẩm',
    icon: 'solar:cart-3-line-duotone',
    url: '/admin?tab=products',
  },
  {
    id: 'posts',
    name: 'Tin tức',
    icon: 'solar:widget-add-line-duotone',
    url: '/admin?tab=posts',
  },
  {
    id: 'categories',
    name: 'Danh mục sản phẩm',
    icon: 'solar:layers-line-duotone',
    url: '/admin?tab=categories',
  },
  {
    id: 'post-categories',
    name: 'Danh mục tin tức',
    icon: 'solar:folder-line-duotone',
    url: '/admin?tab=post-categories',
  },
  {
    id: 'gallery',
    name: 'Thư viện',
    icon: 'solar:gallery-line-duotone',
    url: '/admin?tab=gallery',
  },
  {
    id: 'catalogs',
    name: 'Catalogs',
    icon: 'solar:book-2-line-duotone',
    url: '/admin?tab=catalogs',
  },
  {
    id: 'partners',
    name: 'Đối tác',
    icon: 'solar:users-group-rounded-line-duotone',
    url: '/admin?tab=partners',
  },
  {
    id: 'testimonials',
    name: 'Đánh giá KH',
    icon: 'solar:chat-round-like-line-duotone',
    url: '/admin?tab=testimonials',
  },
  {
    id: 'faqs',
    name: 'Câu hỏi thường gặp',
    icon: 'solar:question-circle-line-duotone',
    url: '/admin?tab=faqs',
  },
  {
    id: 'certifications',
    name: 'Chứng nhận',
    icon: 'solar:diploma-verified-line-duotone',
    url: '/admin?tab=certifications',
  },
  {
    id: 'holiday-effects',
    name: 'Hiệu ứng ngày lễ',
    icon: 'solar:stars-line-duotone',
    url: '/admin?tab=holiday-effects',
  },
  {
    id: 'page-visibility',
    name: 'Quản lý trang',
    icon: 'solar:eye-scan-line-duotone',
    url: '/admin?tab=page-visibility',
  },
  {
    id: 'site-settings',
    name: 'Cài đặt Website',
    icon: 'solar:home-add-line-duotone',
    url: '/admin?tab=site-settings',
  },
  {
    id: 'settings',
    name: 'Bảo mật',
    icon: 'solar:settings-line-duotone',
    url: '/admin?tab=settings',
  },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';
  const { handleLogout, userEmail, mfaEnabled } = useAdminContext();

  const isActiveLink = (id: string) => {
    return currentTab === id;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden xl:block fixed left-0 top-0 h-screen bg-white dark:bg-darkgray border-r border-border dark:border-darkborder transition-all duration-300 z-10 ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        {/* Logo */}
        <div className="h-[85px] flex items-center justify-between px-6 border-b border-border dark:border-darkborder">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon icon="solar:atom-line-duotone" className="text-white" height={24} />
              </div>
              <span className="font-bold text-lg text-dark dark:text-white">Admin Dashboard</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-lighthover dark:hover:bg-darkmuted rounded-lg transition-colors"
          >
            <Icon
              icon="solar:hamburger-menu-line-duotone"
              className="text-bodytext dark:text-bodytext"
              height={20}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-85px)] overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActiveLink(item.id)
                    ? 'bg-primary text-white shadow-md'
                    : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
                    }`}
                >
                  <Icon icon={item.icon} height={18} className="flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-border dark:border-darkborder">
            <Button
              variant="ghost"
              color="error"
              onClick={handleLogout}
              className="w-full justify-start !px-3 !py-2.5"
            >
              <Icon icon="solar:logout-2-line-duotone" height={18} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">Đăng xuất</span>}
            </Button>

            {userEmail && !isCollapsed && (
              <div className="mt-3 px-4 py-2 bg-lighthover dark:bg-darkmuted rounded-lg">
                <div className="flex items-center gap-2 text-bodytext dark:text-bodytext text-xs">
                  <Icon icon="solar:user-circle-line-duotone" height={16} />
                  <span className="font-medium truncate">{userEmail}</span>
                </div>
                <div className={`flex items-center gap-2 mt-2 text-xs ${mfaEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                  <Icon icon={mfaEnabled ? 'solar:shield-check-line-duotone' : 'solar:shield-warning-line-duotone'} height={16} />
                  <span className="font-medium">2FA: {mfaEnabled ? 'Đã bật' : 'Chưa bật'}</span>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="xl:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-darkgray rounded-lg shadow-md border border-border dark:border-darkborder"
      >
        <Icon icon="solar:hamburger-menu-line-duotone" className="text-bodytext dark:text-bodytext" height={24} />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`xl:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-darkgray border-r border-border dark:border-darkborder z-50 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="h-[85px] flex items-center justify-between px-6 border-b border-border dark:border-darkborder">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon icon="solar:atom-line-duotone" className="text-white" height={24} />
            </div>
            <span className="font-bold text-lg text-dark dark:text-white">Admin</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-lighthover dark:hover:bg-darkmuted rounded-lg transition-colors"
          >
            <Icon icon="solar:close-circle-line-duotone" className="text-bodytext dark:text-bodytext" height={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-85px)] overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActiveLink(item.id)
                    ? 'bg-primary text-white shadow-md'
                    : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
                    }`}
                >
                  <Icon icon={item.icon} height={18} className="flex-shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-border dark:border-darkborder">
            <Button
              variant="ghost"
              color="error"
              onClick={() => {
                handleLogout();
                setIsMobileOpen(false);
              }}
              className="w-full justify-start !px-3 !py-2.5"
            >
              <Icon icon="solar:logout-2-line-duotone" height={18} className="flex-shrink-0" />
              <span className="font-medium text-sm">Đăng xuất</span>
            </Button>

            {userEmail && (
              <div className="mt-3 px-4 py-2 bg-lighthover dark:bg-darkmuted rounded-lg">
                <div className="flex items-center gap-2 text-bodytext dark:text-bodytext text-xs">
                  <Icon icon="solar:user-circle-line-duotone" height={16} />
                  <span className="font-medium truncate">{userEmail}</span>
                </div>
                <div className={`flex items-center gap-2 mt-2 text-xs ${mfaEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                  <Icon icon={mfaEnabled ? 'solar:shield-check-line-duotone' : 'solar:shield-warning-line-duotone'} height={16} />
                  <span className="font-medium">2FA: {mfaEnabled ? 'Đã bật' : 'Chưa bật'}</span>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
