'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { Button } from './Button';
import { AdminUser, UserRole, ROLE_DISPLAY_NAMES, ROLE_DESCRIPTIONS, Permission, hasPermission } from '@/types';

// Vietnamese display names for permissions
const PERMISSION_DISPLAY_NAMES: Record<Permission, string> = {
    'manage_users': 'Quản lý người dùng',
    'manage_security': 'Quản lý bảo mật',
    'manage_settings': 'Quản lý cài đặt',
    'manage_content': 'Quản lý nội dung',
    'manage_media': 'Quản lý media',
    'manage_seo': 'Quản lý SEO',
    'manage_appearance': 'Quản lý giao diện',
    'export_data': 'Xuất dữ liệu',
    'import_data': 'Nhập dữ liệu',
    'backup_restore': 'Sao lưu/Khôi phục',
    'view_analytics': 'Xem thống kê',
    'view_activity_logs': 'Xem nhật ký',
    'view_dashboard': 'Xem bảng điều khiển',
};

interface Toast {
    type: 'success' | 'error' | 'info';
    message: string;
}

interface UserStats {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
    with2FA: number;
}

interface UsersManagementTabProps {
    currentUserEmail: string;
    onToast?: (toast: Toast) => void;
}

export default function UsersManagementTab({ currentUserEmail, onToast }: UsersManagementTabProps) {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: 'viewer' as UserRole,
        isActive: true,
    });
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const showToast = useCallback((type: Toast['type'], message: string) => {
        if (onToast) {
            onToast({ type, message });
        }
    }, [onToast]);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/users', {
                headers: {
                    'x-user-email': currentUserEmail,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users || []);
            setStats(data.stats || null);
        } catch (error) {
            console.error('Error fetching users:', error);
            showToast('error', 'Không thể tải danh sách người dùng');
        } finally {
            setIsLoading(false);
        }
    }, [currentUserEmail, showToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && user.isActive) ||
            (statusFilter === 'inactive' && !user.isActive);
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Open add modal
    const openAddModal = () => {
        setFormData({
            email: '',
            name: '',
            password: '',
            role: 'viewer',
            isActive: true,
        });
        setFormError('');
        setShowAddModal(true);
    };

    // Open edit modal
    const openEditModal = (user: AdminUser) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            name: user.name,
            password: '',
            role: user.role,
            isActive: user.isActive,
        });
        setFormError('');
        setShowEditModal(true);
    };

    // Open delete modal
    const openDeleteModal = (user: AdminUser) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    // Handle form submit (create)
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setIsSaving(true);

        // Validate password if provided
        if (formData.password && formData.password.length < 6) {
            setFormError('Mật khẩu phải có ít nhất 6 ký tự');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': currentUserEmail,
                },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,
                    role: formData.role,
                    isActive: formData.isActive,
                    password: formData.password || undefined,
                    invitedBy: currentUserEmail,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể tạo người dùng');
            }

            showToast('success', data.message || 'Tạo người dùng thành công');
            setShowAddModal(false);
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            setFormError(message);
            showToast('error', message);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle form submit (update)
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setFormError('');
        setIsSaving(true);

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': currentUserEmail,
                },
                body: JSON.stringify({
                    id: selectedUser.id,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể cập nhật người dùng');
            }

            showToast('success', 'Cập nhật người dùng thành công');
            setShowEditModal(false);
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            setFormError(message);
            showToast('error', message);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setIsSaving(true);

        try {
            const response = await fetch(`/api/users?id=${selectedUser.id}`, {
                method: 'DELETE',
                headers: {
                    'x-user-email': currentUserEmail,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể xóa người dùng');
            }

            showToast('success', 'Xóa người dùng thành công');
            setShowDeleteModal(false);
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            showToast('error', message);
        } finally {
            setIsSaving(false);
        }
    };

    // Toggle user active status
    const handleToggleActive = async (user: AdminUser) => {
        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': currentUserEmail,
                },
                body: JSON.stringify({
                    id: user.id,
                    isActive: !user.isActive,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể cập nhật trạng thái');
            }

            showToast('success', user.isActive ? 'Đã vô hiệu hóa người dùng' : 'Đã kích hoạt người dùng');
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            showToast('error', message);
        }
    };

    // Toggle user 2FA status
    const handleToggle2FA = async (user: AdminUser) => {
        if (!user.totpEnabled) {
            showToast('info', 'Người dùng chưa bật 2FA');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': currentUserEmail,
                },
                body: JSON.stringify({
                    id: user.id,
                    totpEnabled: false,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Không thể tắt 2FA');
            }

            showToast('success', `Đã tắt 2FA cho ${user.name}`);
            fetchUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Có lỗi xảy ra';
            showToast('error', message);
        }
    };

    // Get role badge color
    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'super_admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'admin':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'editor':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'viewer':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Get role icon
    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'super_admin':
                return 'solar:crown-line-duotone';
            case 'admin':
                return 'solar:shield-keyhole-line-duotone';
            case 'editor':
                return 'solar:pen-2-line-duotone';
            case 'viewer':
                return 'solar:eye-line-duotone';
            default:
                return 'solar:user-line-duotone';
        }
    };

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Chưa có';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Check if current user can edit this user
    const canEditUser = (user: AdminUser) => {
        const currentUser = users.find(u => u.email === currentUserEmail);
        if (!currentUser) return false;

        // Super admin can edit everyone
        if (currentUser.role === 'super_admin') return true;

        // Can't edit super admins if not super admin
        if (user.role === 'super_admin') return false;

        // Admin can edit non-super-admins
        if (currentUser.role === 'admin') return true;

        return false;
    };

    // Check if current user can delete this user
    const canDeleteUser = (user: AdminUser) => {
        const currentUser = users.find(u => u.email === currentUserEmail);
        if (!currentUser) return false;

        // Can't delete yourself
        if (user.email === currentUserEmail) return false;

        // Only super admin can delete
        return currentUser.role === 'super_admin';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
                    <p className="text-gray-600 mt-1">Quản lý tài khoản và phân quyền truy cập</p>
                </div>
                <Button onClick={openAddModal} className="flex items-center gap-2">
                    <Icon icon="solar:user-plus-line-duotone" className="w-5 h-5" />
                    Thêm người dùng
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Icon icon="solar:users-group-rounded-line-duotone" className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500">Tổng người dùng</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <Icon icon="solar:check-circle-line-duotone" className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                                <p className="text-xs text-gray-500">Đang hoạt động</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <Icon icon="solar:close-circle-line-duotone" className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                                <p className="text-xs text-gray-500">Vô hiệu hóa</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <Icon icon="solar:shield-check-line-duotone" className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.with2FA}</p>
                                <p className="text-xs text-gray-500">Bật 2FA</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Icon icon="solar:crown-line-duotone" className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.byRole.super_admin + stats.byRole.admin}</p>
                                <p className="text-xs text-gray-500">Quản trị viên</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">Tất cả role</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="editor">Biên tập viên</option>
                    <option value="viewer">Người xem</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Vô hiệu hóa</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    2FA
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Đăng nhập cuối
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Icon icon="solar:users-group-rounded-line-duotone" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p>Không tìm thấy người dùng nào</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                                {user.email === currentUserEmail && (
                                                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                                        Bạn
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                                                <Icon icon={getRoleIcon(user.role)} className="w-3.5 h-3.5" />
                                                {ROLE_DISPLAY_NAMES[user.role]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => canEditUser(user) && handleToggleActive(user)}
                                                disabled={!canEditUser(user)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${user.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    } ${canEditUser(user) ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'}`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {user.isActive ? 'Hoạt động' : 'Vô hiệu'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.totpEnabled ? (
                                                <button
                                                    onClick={() => canEditUser(user) && handleToggle2FA(user)}
                                                    disabled={!canEditUser(user)}
                                                    className={`inline-flex items-center gap-1 text-green-600 ${canEditUser(user) ? 'cursor-pointer hover:text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-lg transition-colors' : 'cursor-not-allowed'}`}
                                                    title={canEditUser(user) ? "Click để tắt 2FA" : "Không có quyền"}
                                                >
                                                    <Icon icon="solar:shield-check-bold-duotone" className="w-4 h-4" />
                                                    <span className="text-xs">Bật</span>
                                                    {canEditUser(user) && (
                                                        <Icon icon="solar:close-circle-line-duotone" className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-gray-400">
                                                    <Icon icon="solar:shield-line-duotone" className="w-4 h-4" />
                                                    <span className="text-xs">Tắt</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(user.lastLogin)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEditUser(user) && (
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Icon icon="solar:pen-2-line-duotone" className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {canDeleteUser(user) && (
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Icon icon="solar:trash-bin-2-line-duotone" className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Role Permissions Reference */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Icon icon="solar:info-circle-line-duotone" className="w-5 h-5 text-blue-500" />
                    Ma trận phân quyền
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(['super_admin', 'admin', 'editor', 'viewer'] as UserRole[]).map((role) => (
                        <div key={role} className={`rounded-lg border p-4 ${getRoleBadgeColor(role)}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon={getRoleIcon(role)} className="w-5 h-5" />
                                <span className="font-medium">{ROLE_DISPLAY_NAMES[role]}</span>
                            </div>
                            <p className="text-xs opacity-75 mb-3">{ROLE_DESCRIPTIONS[role]}</p>
                            <div className="space-y-1">
                                {(['manage_users', 'manage_content', 'manage_settings', 'view_analytics'] as Permission[]).map((perm) => (
                                    <div key={perm} className="flex items-center gap-1.5 text-xs">
                                        {hasPermission(role, perm) ? (
                                            <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5 text-green-600" />
                                        ) : (
                                            <Icon icon="solar:close-circle-bold" className="w-3.5 h-3.5 text-red-400" />
                                        )}
                                        <span>{PERMISSION_DISPLAY_NAMES[perm]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">Thêm người dùng mới</h3>
                            <p className="text-sm text-gray-500 mt-1">Tạo tài khoản mới cho người dùng</p>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu
                                    <span className="text-gray-400 font-normal ml-1">(tùy chọn)</span>
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tối thiểu 6 ký tự"
                                    minLength={6}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Nếu để trống, người dùng cần sử dụng &quot;Quên mật khẩu&quot; để đặt mật khẩu
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="viewer">Người xem</option>
                                    <option value="editor">Biên tập viên</option>
                                    <option value="admin">Quản trị viên</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">{ROLE_DESCRIPTIONS[formData.role]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">Kích hoạt ngay</label>
                            </div>

                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1"
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSaving} className="flex-1">
                                    {isSaving ? 'Đang tạo...' : 'Tạo người dùng'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">Chỉnh sửa người dùng</h3>
                            <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin người dùng</p>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên hiển thị *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="viewer">Người xem</option>
                                    <option value="editor">Biên tập viên</option>
                                    <option value="admin">Quản trị viên</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">{ROLE_DESCRIPTIONS[formData.role]}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="editIsActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="editIsActive" className="text-sm text-gray-700">Đang hoạt động</label>
                            </div>

                            {formError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {formError}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1"
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSaving} className="flex-1">
                                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                                <Icon icon="solar:trash-bin-2-bold-duotone" className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 text-center">Xóa người dùng?</h3>
                            <p className="text-gray-500 text-center mt-2">
                                Bạn có chắc chắn muốn xóa <strong>{selectedUser.name}</strong> ({selectedUser.email})?
                                Hành động này không thể hoàn tác.
                            </p>
                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleDeleteUser}
                                    disabled={isSaving}
                                    className="flex-1 !bg-red-600 hover:!bg-red-700"
                                >
                                    {isSaving ? 'Đang xóa...' : 'Xóa người dùng'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
