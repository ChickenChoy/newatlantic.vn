'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useAdminContext } from '@/app/admin/layout';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  url: string;
}

interface MenuGroup {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

// Menu được nhóm theo chức năng
const menuGroups: MenuGroup[] = [
  {
    id: 'content',
    name: 'Nội dung',
    icon: 'solar:document-text-line-duotone',
    items: [
      { id: 'products', name: 'Sản phẩm', icon: 'solar:cart-3-line-duotone', url: '/admin?tab=products' },
      { id: 'posts', name: 'Tin tức', icon: 'solar:widget-add-line-duotone', url: '/admin?tab=posts' },
      { id: 'categories', name: 'Danh mục SP', icon: 'solar:layers-line-duotone', url: '/admin?tab=categories' },
      { id: 'post-categories', name: 'Danh mục tin', icon: 'solar:folder-line-duotone', url: '/admin?tab=post-categories' },
    ]
  },
  {
    id: 'media',
    name: 'Media & Thư viện',
    icon: 'solar:gallery-line-duotone',
    items: [
      { id: 'gallery', name: 'Thư viện ảnh', icon: 'solar:gallery-line-duotone', url: '/admin?tab=gallery' },
      { id: 'media-library', name: 'Thư viện Media', icon: 'solar:cloud-storage-line-duotone', url: '/admin?tab=media-library' },
      { id: 'catalogs', name: 'Catalogs', icon: 'solar:book-2-line-duotone', url: '/admin?tab=catalogs' },
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'solar:star-shine-line-duotone',
    items: [
      { id: 'homepage-services', name: 'Dịch vụ trang chủ', icon: 'solar:home-smile-line-duotone', url: '/admin?tab=homepage-services' },
      { id: 'partners', name: 'Đối tác', icon: 'solar:users-group-rounded-line-duotone', url: '/admin?tab=partners' },
      { id: 'testimonials', name: 'Đánh giá KH', icon: 'solar:chat-round-like-line-duotone', url: '/admin?tab=testimonials' },
      { id: 'faqs', name: 'FAQ', icon: 'solar:question-circle-line-duotone', url: '/admin?tab=faqs' },
      { id: 'certifications', name: 'Chứng nhận', icon: 'solar:diploma-verified-line-duotone', url: '/admin?tab=certifications' },
    ]
  },
  {
    id: 'settings',
    name: 'Cài đặt',
    icon: 'solar:settings-line-duotone',
    items: [
      { id: 'site-settings', name: 'Website', icon: 'solar:home-add-line-duotone', url: '/admin?tab=site-settings' },
      { id: 'footer-settings', name: 'Footer', icon: 'solar:widget-6-line-duotone', url: '/admin?tab=footer-settings' },
      { id: 'seo', name: 'SEO', icon: 'solar:graph-up-line-duotone', url: '/admin?tab=seo' },
      { id: 'traffic', name: 'Traffic Stats', icon: 'solar:chart-2-line-duotone', url: '/admin?tab=traffic' },
      { id: 'appearance', name: 'Giao diện', icon: 'solar:palette-line-duotone', url: '/admin?tab=appearance' },
      { id: 'database', name: 'Database', icon: 'solar:database-line-duotone', url: '/admin?tab=database' },
      { id: 'activity-logs', name: 'Nhật ký', icon: 'solar:history-line-duotone', url: '/admin?tab=activity-logs' },
      { id: 'settings', name: 'Bảo mật', icon: 'solar:shield-keyhole-line-duotone', url: '/admin?tab=settings' },
    ]
  },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['content', 'media']); // Mặc định mở
  const [logo, setLogo] = useState<string>('/images/logo/logo-color.png');
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';
  const { handleLogout, userEmail, mfaEnabled } = useAdminContext();

  // Fetch logo from site settings
  useEffect(() => {
    fetch('/api/site-settings')
      .then(res => res.json())
      .then(data => {
        if (data.logo) setLogo(data.logo);
      })
      .catch(() => { });
  }, []);

  // Auto-expand group containing active tab
  useEffect(() => {
    const activeGroup = menuGroups.find(g => g.items.some(item => item.id === currentTab));
    if (activeGroup && !expandedGroups.includes(activeGroup.id)) {
      setExpandedGroups(prev => [...prev, activeGroup.id]);
    }
  }, [currentTab]);

  const isActiveLink = (id: string) => {
    return currentTab === id;
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isGroupExpanded = (groupId: string) => expandedGroups.includes(groupId);
  const isGroupActive = (group: MenuGroup) => group.items.some(item => item.id === currentTab);

  const renderMenuItem = (item: MenuItem, closeMobile = false) => (
    <Link
      key={item.id}
      href={item.url}
      onClick={closeMobile ? () => setIsMobileOpen(false) : undefined}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${isActiveLink(item.id)
        ? 'bg-primary text-white shadow-md'
        : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
        }`}
    >
      <Icon icon={item.icon} height={16} className="flex-shrink-0" />
      {!isCollapsed && <span className="font-medium">{item.name}</span>}
    </Link>
  );

  const renderMenuGroup = (group: MenuGroup, closeMobile = false) => {
    const isExpanded = isGroupExpanded(group.id);
    const isActive = isGroupActive(group);

    return (
      <div key={group.id} className="mb-1">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.id)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${isActive && !isExpanded
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
            }`}
        >
          <div className="flex items-center gap-3">
            <Icon icon={group.icon} height={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-semibold text-sm">{group.name}</span>}
          </div>
          {!isCollapsed && (
            <Icon
              icon={isExpanded ? 'solar:alt-arrow-up-line-duotone' : 'solar:alt-arrow-down-line-duotone'}
              height={16}
              className={`transition-transform ${isExpanded ? 'rotate-0' : 'rotate-0'}`}
            />
          )}
        </button>

        {/* Group Items - Collapsible */}
        {!isCollapsed && (
          <div
            className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="pl-4 mt-1 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700 ml-5">
              {group.items.map(item => renderMenuItem(item, closeMobile))}
            </div>
          </div>
        )}

        {/* Collapsed mode - show items on hover with tooltip */}
        {isCollapsed && (
          <div className="relative group/menu">
            <div className="hidden group-hover/menu:block absolute left-full top-0 ml-2 z-50 bg-white dark:bg-darkgray shadow-lg rounded-lg border border-border dark:border-darkborder py-2 min-w-[180px]">
              <div className="px-3 py-1.5 text-xs font-semibold text-muted border-b border-border dark:border-darkborder mb-1">
                {group.name}
              </div>
              {group.items.map(item => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`flex items-center gap-2 px-3 py-2 text-sm ${isActiveLink(item.id)
                    ? 'bg-primary text-white'
                    : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
                    }`}
                >
                  <Icon icon={item.icon} height={16} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden xl:block fixed left-0 top-0 h-screen bg-white dark:bg-darkgray border-r border-border dark:border-darkborder transition-all duration-300 z-10 ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center justify-between px-4 border-b border-border dark:border-darkborder">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Image src={logo} alt="Logo" width={36} height={36} className="object-contain" />
              </div>
              <span className="font-bold text-base text-dark dark:text-white">Admin</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-lighthover dark:hover:bg-darkmuted rounded-lg transition-colors"
          >
            <Icon
              icon={isCollapsed ? 'solar:sidebar-minimalistic-line-duotone' : 'solar:hamburger-menu-line-duotone'}
              className="text-bodytext dark:text-bodytext"
              height={20}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-70px)] overflow-y-auto px-3 py-3">
          {/* Dashboard - standalone item */}
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-3 ${currentTab === 'dashboard'
              ? 'bg-primary text-white shadow-md'
              : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
              }`}
          >
            <Icon icon="solar:widget-2-line-duotone" height={18} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-semibold text-sm">Dashboard</span>}
          </Link>

          {/* Divider */}
          <div className="border-t border-border dark:border-darkborder mb-3"></div>

          {/* Menu Groups */}
          {menuGroups.map(group => renderMenuGroup(group))}

          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-border dark:border-darkborder">
            <Button
              variant="ghost"
              color="error"
              onClick={handleLogout}
              className="w-full justify-start !px-3 !py-2"
            >
              <Icon icon="solar:logout-2-line-duotone" height={18} className="flex-shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm">Đăng xuất</span>}
            </Button>

            {userEmail && !isCollapsed && (
              <div className="mt-3 px-3 py-2 bg-lighthover dark:bg-darkmuted rounded-lg">
                <div className="flex items-center gap-2 text-bodytext dark:text-bodytext text-xs">
                  <Icon icon="solar:user-circle-line-duotone" height={14} />
                  <span className="font-medium truncate">{userEmail}</span>
                </div>
                <div className={`flex items-center gap-2 mt-1.5 text-xs ${mfaEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                  <Icon icon={mfaEnabled ? 'solar:shield-check-line-duotone' : 'solar:shield-warning-line-duotone'} height={14} />
                  <span className="font-medium">2FA: {mfaEnabled ? 'Bật' : 'Tắt'}</span>
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
        className={`xl:hidden fixed left-0 top-0 h-screen w-72 bg-white dark:bg-darkgray border-r border-border dark:border-darkborder z-50 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="h-[70px] flex items-center justify-between px-4 border-b border-border dark:border-darkborder">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Image src={logo} alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <span className="font-bold text-base text-dark dark:text-white">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 hover:bg-lighthover dark:hover:bg-darkmuted rounded-lg transition-colors"
          >
            <Icon icon="solar:close-circle-line-duotone" className="text-bodytext dark:text-bodytext" height={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-70px)] overflow-y-auto px-3 py-3">
          {/* Dashboard */}
          <Link
            href="/admin"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-3 ${currentTab === 'dashboard'
              ? 'bg-primary text-white shadow-md'
              : 'text-dark dark:text-bodytext hover:bg-lighthover dark:hover:bg-darkmuted'
              }`}
          >
            <Icon icon="solar:widget-2-line-duotone" height={18} className="flex-shrink-0" />
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>

          {/* Divider */}
          <div className="border-t border-border dark:border-darkborder mb-3"></div>

          {/* Menu Groups */}
          {menuGroups.map(group => renderMenuGroup(group, true))}

          {/* Logout Button */}
          <div className="mt-4 pt-4 border-t border-border dark:border-darkborder">
            <Button
              variant="ghost"
              color="error"
              onClick={() => {
                handleLogout();
                setIsMobileOpen(false);
              }}
              className="w-full justify-start !px-3 !py-2"
            >
              <Icon icon="solar:logout-2-line-duotone" height={18} className="flex-shrink-0" />
              <span className="font-medium text-sm">Đăng xuất</span>
            </Button>

            {userEmail && (
              <div className="mt-3 px-3 py-2 bg-lighthover dark:bg-darkmuted rounded-lg">
                <div className="flex items-center gap-2 text-bodytext dark:text-bodytext text-xs">
                  <Icon icon="solar:user-circle-line-duotone" height={14} />
                  <span className="font-medium truncate">{userEmail}</span>
                </div>
                <div className={`flex items-center gap-2 mt-1.5 text-xs ${mfaEnabled ? 'text-green-600' : 'text-amber-600'}`}>
                  <Icon icon={mfaEnabled ? 'solar:shield-check-line-duotone' : 'solar:shield-warning-line-duotone'} height={14} />
                  <span className="font-medium">2FA: {mfaEnabled ? 'Bật' : 'Tắt'}</span>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}
