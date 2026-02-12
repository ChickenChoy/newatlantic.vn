'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useAdminContext } from '@/app/admin/layout';
import { adminFetch } from '@/lib/admin-fetch';

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
    icon: 'solar:document-text-bold-duotone',
    items: [
      { id: 'products', name: 'Sản phẩm', icon: 'solar:box-bold-duotone', url: '/admin?tab=products' },
      { id: 'categories', name: 'Danh mục SP', icon: 'solar:layers-bold-duotone', url: '/admin?tab=categories' },
      { id: 'posts', name: 'Bài viết', icon: 'solar:document-add-bold-duotone', url: '/admin?tab=posts' },
      { id: 'post-categories', name: 'Danh mục tin tức', icon: 'solar:folder-bold-duotone', url: '/admin?tab=post-categories' },
    ]
  },
  {
    id: 'homepage',
    name: 'Trang chủ',
    icon: 'solar:home-2-bold-duotone',
    items: [
      { id: 'homepage-services', name: 'Dịch vụ nổi bật', icon: 'solar:star-bold-duotone', url: '/admin?tab=homepage-services' },
      { id: 'partners', name: 'Đối tác', icon: 'solar:users-group-rounded-bold-duotone', url: '/admin?tab=partners' },
      { id: 'testimonials', name: 'Đánh giá KH', icon: 'solar:chat-round-like-bold-duotone', url: '/admin?tab=testimonials' },
      { id: 'faqs', name: 'Câu hỏi thường gặp', icon: 'solar:question-circle-bold-duotone', url: '/admin?tab=faqs' },
      { id: 'certifications', name: 'Chứng nhận', icon: 'solar:diploma-verified-bold-duotone', url: '/admin?tab=certifications' },
    ]
  },
  {
    id: 'media',
    name: 'Thư viện',
    icon: 'solar:gallery-bold-duotone',
    items: [
      { id: 'gallery', name: 'Thư viện ảnh', icon: 'solar:gallery-wide-bold-duotone', url: '/admin?tab=gallery' },
      { id: 'media-library', name: 'Media Upload', icon: 'solar:cloud-upload-bold-duotone', url: '/admin?tab=media-library' },
      { id: 'video-library', name: 'Video', icon: 'solar:video-library-bold-duotone', url: '/admin?tab=video-library' },
      { id: 'catalogs', name: 'Catalogs / Tài liệu', icon: 'solar:book-2-bold-duotone', url: '/admin?tab=catalogs' },
    ]
  },
  {
    id: 'design',
    name: 'Giao diện',
    icon: 'solar:palette-bold-duotone',
    items: [
      { id: 'navbar-settings', name: 'Thanh điều hướng', icon: 'solar:menu-dots-bold-duotone', url: '/admin?tab=navbar-settings' },
      { id: 'holiday-effects', name: 'Hiệu ứng lễ hội', icon: 'solar:confetti-bold-duotone', url: '/admin?tab=holiday-effects' },
      { id: 'popup-settings', name: 'Popup thông báo', icon: 'solar:window-frame-line-duotone', url: '/admin?tab=popup-settings' },
      { id: 'page-visibility', name: 'Ẩn/hiện trang', icon: 'solar:eye-bold-duotone', url: '/admin?tab=page-visibility' },
      { id: 'seo', name: 'SEO & Meta', icon: 'solar:graph-up-bold-duotone', url: '/admin?tab=seo' },
    ]
  },
  {
    id: 'system',
    name: 'Hệ thống',
    icon: 'solar:settings-bold-duotone',
    items: [
      { id: 'site-settings', name: 'Cài đặt Website', icon: 'solar:settings-minimalistic-bold-duotone', url: '/admin?tab=site-settings' },
      { id: 'footer-settings', name: 'Footer', icon: 'solar:widget-6-bold-duotone', url: '/admin?tab=footer-settings' },
      { id: 'users', name: 'Quản lý người dùng', icon: 'solar:users-group-two-rounded-bold-duotone', url: '/admin?tab=users' },
      { id: 'traffic', name: 'Thống kê truy cập', icon: 'solar:chart-2-bold-duotone', url: '/admin?tab=traffic' },
      { id: 'database', name: 'Sao lưu Database', icon: 'solar:database-bold-duotone', url: '/admin?tab=database' },
      { id: 'activity-logs', name: 'Nhật ký hoạt động', icon: 'solar:history-bold-duotone', url: '/admin?tab=activity-logs' },
      { id: 'settings', name: 'Bảo mật & 2FA', icon: 'solar:shield-keyhole-bold-duotone', url: '/admin?tab=settings' },
    ]
  },
];

export default function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['content', 'media']); // Mặc định mở
  const [logo, setLogo] = useState<string>('/images/logo/logo-color.png');
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';
  const { handleLogout, userEmail, mfaEnabled, currentUser, canAccessTab, isSidebarCollapsed, setIsSidebarCollapsed } = useAdminContext();

  // Use context state for collapsed
  const isCollapsed = isSidebarCollapsed;
  const setIsCollapsed = setIsSidebarCollapsed;

  // Fetch logo from site settings
  useEffect(() => {
    adminFetch('/api/site-settings')
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

  const renderMenuItem = (item: MenuItem, closeMobile = false) => {
    // Check if user can access this tab
    if (!canAccessTab(item.id)) {
      return null;
    }

    return (
      <Link
        key={item.id}
        href={item.url}
        onClick={closeMobile ? () => setIsMobileOpen(false) : undefined}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${isActiveLink(item.id)
          ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md font-medium'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
          }`}
      >
        <Icon icon={item.icon} height={18} className="flex-shrink-0" />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    );
  };

  const renderMenuGroup = (group: MenuGroup, closeMobile = false) => {
    const isExpanded = isGroupExpanded(group.id);
    const isActive = isGroupActive(group);

    return (
      <div key={group.id} className="mb-2">
        {/* Group Header */}
        <button
          onClick={() => toggleGroup(group.id)}
          className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${isActive && !isExpanded
            ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary dark:text-primary'
            : isExpanded
              ? 'bg-gray-100/80 dark:bg-gray-700/50'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/60 dark:hover:bg-gray-700/30'
            }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/15 text-primary' : 'bg-gray-200/80 dark:bg-gray-600/50 text-gray-500 dark:text-gray-400'}`}>
              <Icon icon={group.icon} height={18} />
            </div>
            {!isCollapsed && <span className="font-semibold text-sm">{group.name}</span>}
          </div>
          {!isCollapsed && (
            <Icon
              icon={isExpanded ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'}
              height={16}
              className={`transition-transform text-gray-400 ${isExpanded ? '' : ''}`}
            />
          )}
        </button>

        {/* Group Items - Collapsible */}
        {!isCollapsed && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="pl-4 mt-2 space-y-1 ml-5 border-l-2 border-gray-200 dark:border-gray-700">
              {group.items.map(item => renderMenuItem(item, closeMobile))}
            </div>
          </div>
        )}

        {/* Collapsed mode - show items on hover with tooltip */}
        {isCollapsed && (
          <div className="relative group/menu">
            <div className="hidden group-hover/menu:block absolute left-full top-0 ml-3 z-50 bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px]">
              <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
                {group.name}
              </div>
              {group.items.map(item => (
                <Link
                  key={item.id}
                  href={item.url}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm ${isActiveLink(item.id)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Icon icon={item.icon} height={18} />
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
        className={`hidden xl:flex flex-col fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/80 dark:border-gray-700/50 transition-all duration-300 z-10 shadow-sm ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* Logo Header */}
        <div className="h-[80px] flex items-center justify-between px-5 border-b border-gray-200/80 dark:border-gray-700/50 bg-gradient-to-r from-primary/5 to-transparent">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-md flex items-center justify-center ring-2 ring-primary/20">
                <Image src={logo} alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <span className="font-bold text-lg text-gray-800 dark:text-white block leading-tight">Admin</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Quản trị hệ thống</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Icon
              icon={isCollapsed ? 'solar:sidebar-minimalistic-bold' : 'solar:hamburger-menu-bold'}
              className="text-gray-500 dark:text-gray-400"
              height={22}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {/* Dashboard - standalone item */}
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-4 ${currentTab === 'dashboard'
              ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
          >
            <div className={`p-2 rounded-lg ${currentTab === 'dashboard' ? 'bg-white/20' : 'bg-primary/10'}`}>
              <Icon icon="solar:widget-2-bold-duotone" height={20} className={currentTab === 'dashboard' ? 'text-white' : 'text-primary'} />
            </div>
            {!isCollapsed && <span className="font-semibold">Dashboard</span>}
          </Link>

          {/* Divider with label */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Menu</span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent"></div>
            </div>
          )}

          {/* Menu Groups */}
          <div className="space-y-2">
            {menuGroups.map(group => renderMenuGroup(group))}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200/80 dark:border-gray-700/50 bg-gradient-to-t from-gray-50 dark:from-gray-800/50 to-transparent">
          {userEmail && !isCollapsed && (
            <div className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {currentUser && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Icon icon={currentUser.role === 'super_admin' ? 'solar:crown-bold' : 'solar:user-check-bold'} height={10} />
                        {currentUser.role === 'super_admin' ? 'Super' :
                          currentUser.role === 'admin' ? 'Admin' :
                            currentUser.role === 'editor' ? 'Editor' : 'View'}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${mfaEnabled ? 'text-green-600 bg-green-100' : 'text-amber-600 bg-amber-100'}`}>
                      <Icon icon={mfaEnabled ? 'solar:shield-check-bold' : 'solar:shield-warning-bold'} height={10} />
                      2FA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Website Button */}
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Icon icon="solar:global-bold" height={20} />
            {!isCollapsed && <span className="font-semibold">Xem Website</span>}
          </Link>

          <Button
            variant="ghost"
            color="error"
            onClick={handleLogout}
            className="w-full justify-center !px-4 !py-2.5 !rounded-xl hover:!bg-red-50 dark:hover:!bg-red-900/20"
          >
            <Icon icon="solar:logout-2-bold" height={20} />
            {!isCollapsed && <span className="font-semibold ml-2">Đăng xuất</span>}
          </Button>
        </div>
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
            {/* View Website Button */}
            <Link
              href="/"
              target="_blank"
              onClick={() => setIsMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mb-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all shadow-md"
            >
              <Icon icon="solar:global-bold" height={18} />
              <span className="font-semibold">Xem Website</span>
            </Link>

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
                {currentUser && (
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-primary">
                    <Icon icon={currentUser.role === 'super_admin' ? 'solar:crown-line-duotone' : 'solar:user-check-line-duotone'} height={14} />
                    <span className="font-medium capitalize">
                      {currentUser.role === 'super_admin' ? 'Super Admin' :
                        currentUser.role === 'admin' ? 'Admin' :
                          currentUser.role === 'editor' ? 'Editor' : 'Viewer'}
                    </span>
                  </div>
                )}
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
