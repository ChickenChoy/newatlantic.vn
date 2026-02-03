'use client';

import { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Permission, UserRole, hasPermission, ROLE_DISPLAY_NAMES } from '@/types';

interface PermissionGuardProps {
    children: ReactNode;
    permission: Permission;
    userRole?: UserRole;
    fallback?: ReactNode;
    showMessage?: boolean;
}

/**
 * PermissionGuard - Wrap components to protect by permission
 * 
 * Usage:
 * <PermissionGuard permission="manage_users" userRole={currentUser?.role}>
 *   <UsersManagementTab />
 * </PermissionGuard>
 */
export function PermissionGuard({
    children,
    permission,
    userRole,
    fallback,
    showMessage = true,
}: PermissionGuardProps) {
    // If no role provided, show nothing
    if (!userRole) {
        if (fallback) return <>{fallback}</>;
        if (showMessage) {
            return <AccessDenied message="Vui lòng đăng nhập để truy cập" />;
        }
        return null;
    }

    // Check permission
    if (!hasPermission(userRole, permission)) {
        if (fallback) return <>{fallback}</>;
        if (showMessage) {
            return <AccessDenied message={getPermissionMessage(permission)} role={userRole} />;
        }
        return null;
    }

    return <>{children}</>;
}

/**
 * usePermission hook - Check if current user has a permission
 */
export function usePermission(userRole: UserRole | undefined, permission: Permission): boolean {
    if (!userRole) return false;
    return hasPermission(userRole, permission);
}

/**
 * usePermissions hook - Check multiple permissions at once
 */
export function usePermissions(
    userRole: UserRole | undefined,
    permissions: Permission[]
): Record<Permission, boolean> {
    const result = {} as Record<Permission, boolean>;

    for (const permission of permissions) {
        result[permission] = userRole ? hasPermission(userRole, permission) : false;
    }

    return result;
}

/**
 * Check if user can access a tab
 */
export function canAccessTab(userRole: UserRole | undefined, tabId: string): boolean {
    if (!userRole) return false;

    const tabPermissions: Record<string, Permission> = {
        // Content tabs
        'products': 'manage_content',
        'categories': 'manage_content',
        'posts': 'manage_content',
        'post-categories': 'manage_content',
        'gallery': 'manage_content',
        'catalogs': 'manage_content',
        'partners': 'manage_content',
        'testimonials': 'manage_content',
        'faqs': 'manage_content',
        'certifications': 'manage_content',

        // Media
        'media-library': 'manage_media',

        // Marketing/Appearance
        'homepage-services': 'manage_appearance',
        'hero-slides': 'manage_appearance',
        'holiday-effects': 'manage_appearance',
        'page-visibility': 'manage_appearance',
        'appearance': 'manage_appearance',

        // Settings
        'site-settings': 'manage_settings',
        'offices': 'manage_settings',
        'footer': 'manage_settings',
        'footer-links': 'manage_settings',
        'social-links': 'manage_settings',

        // SEO
        'seo': 'manage_seo',

        // Analytics
        'dashboard': 'view_dashboard',
        'traffic': 'view_analytics',

        // Database
        'database': 'backup_restore',

        // Activity logs
        'activity-logs': 'view_activity_logs',

        // Security
        'settings': 'manage_security',

        // Users
        'users': 'manage_users',
    };

    const requiredPermission = tabPermissions[tabId];

    // If tab doesn't require specific permission, allow access
    if (!requiredPermission) return true;

    return hasPermission(userRole, requiredPermission);
}

/**
 * Get permission-based message
 */
function getPermissionMessage(permission: Permission): string {
    const messages: Record<Permission, string> = {
        'manage_users': 'Chỉ Super Admin mới có quyền quản lý người dùng',
        'manage_security': 'Bạn không có quyền truy cập cài đặt bảo mật',
        'manage_settings': 'Bạn không có quyền thay đổi cài đặt website',
        'manage_content': 'Bạn không có quyền chỉnh sửa nội dung',
        'manage_media': 'Bạn không có quyền quản lý media',
        'manage_seo': 'Bạn không có quyền quản lý SEO',
        'manage_appearance': 'Bạn không có quyền thay đổi giao diện',
        'export_data': 'Bạn không có quyền export dữ liệu',
        'import_data': 'Bạn không có quyền import dữ liệu',
        'backup_restore': 'Bạn không có quyền backup/restore database',
        'view_analytics': 'Bạn không có quyền xem thống kê',
        'view_activity_logs': 'Bạn không có quyền xem nhật ký hoạt động',
        'view_dashboard': 'Bạn không có quyền xem dashboard',
    };

    return messages[permission] || 'Bạn không có quyền truy cập tính năng này';
}

/**
 * AccessDenied component - Show when user doesn't have permission
 */
function AccessDenied({ message, role }: { message: string; role?: UserRole }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                <Icon icon="solar:lock-keyhole-bold-duotone" className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có quyền truy cập</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">{message}</p>
            {role && (
                <p className="text-sm text-gray-400">
                    Role hiện tại của bạn: <span className="font-medium">{ROLE_DISPLAY_NAMES[role]}</span>
                </p>
            )}
        </div>
    );
}

export default PermissionGuard;
