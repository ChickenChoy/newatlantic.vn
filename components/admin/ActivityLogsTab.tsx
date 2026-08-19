'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useToast } from '@/components/ToastProvider';
import { ActivityLog, ActivityAction, ActivityEntity } from '@/types';

// Mapping labels tiếng Việt
const ACTION_LABELS: Record<ActivityAction, { label: string; icon: string; color: string }> = {
    create: { label: 'Tạo mới', icon: 'solar:add-circle-bold', color: 'text-green-500' },
    update: { label: 'Cập nhật', icon: 'solar:pen-bold', color: 'text-blue-500' },
    delete: { label: 'Xóa', icon: 'solar:trash-bin-trash-bold', color: 'text-red-500' },
    login: { label: 'Đăng nhập', icon: 'solar:login-bold', color: 'text-purple-500' },
    logout: { label: 'Đăng xuất', icon: 'solar:logout-bold', color: 'text-gray-500' },
    export: { label: 'Xuất dữ liệu', icon: 'solar:download-bold', color: 'text-cyan-500' },
    import: { label: 'Nhập dữ liệu', icon: 'solar:upload-bold', color: 'text-orange-500' },
    backup: { label: 'Sao lưu', icon: 'solar:database-bold', color: 'text-indigo-500' },
    restore: { label: 'Khôi phục', icon: 'solar:refresh-bold', color: 'text-teal-500' },
    upload: { label: 'Tải lên', icon: 'solar:cloud-upload-bold', color: 'text-sky-500' },
    toggle: { label: 'Bật/Tắt', icon: 'solar:toggle-on-bold', color: 'text-yellow-500' },
};

const ENTITY_LABELS: Record<ActivityEntity, string> = {
    product: 'Sản phẩm',
    post: 'Bài viết',
    category: 'Danh mục SP',
    'post-category': 'Danh mục tin tức',
    gallery: 'Thư viện ảnh',
    catalog: 'Catalog',
    partner: 'Đối tác',
    'global-partner': 'Đối tác đa quốc gia',
    testimonial: 'Đánh giá',
    faq: 'FAQ',
    certification: 'Chứng nhận',
    'holiday-effect': 'Hiệu ứng ngày lễ',
    'page-visibility': 'Ẩn/hiện trang',
    'hero-slide': 'Hero Slide',
    'homepage-stat': 'Số liệu trang chủ',
    'homepage-service': 'Dịch vụ trang chủ',
    'footer-link': 'Footer Link',
    'site-settings': 'Cài đặt website',
    'office-location': 'Địa chỉ văn phòng',
    seo: 'SEO',
    media: 'Media',
    database: 'Database',
    auth: 'Xác thực',
    'navbar-settings': 'Thanh điều hướng',
};

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function ActivityLogsTab() {
    const toast = useToast();
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    // Filters
    const [filterAction, setFilterAction] = useState<ActivityAction | ''>('');
    const [filterEntity, setFilterEntity] = useState<ActivityEntity | ''>('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    // Modal
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Fetch logs
    const fetchLogs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page.toString());
            params.set('limit', '20');
            if (filterAction) params.set('action', filterAction);
            if (filterEntity) params.set('entity', filterEntity);
            if (filterStartDate) params.set('startDate', filterStartDate);
            if (filterEndDate) params.set('endDate', filterEndDate);

            const res = await fetch(`/api/activity-logs?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
            toast.error('Không thể tải nhật ký hoạt động');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterAction, filterEntity, filterStartDate, filterEndDate]);

    useEffect(() => {
        fetchLogs(1);
    }, [fetchLogs]);

    // Clear all logs
    const handleClearAll = async () => {
        try {
            const res = await fetch('/api/activity-logs?clearAll=true', { method: 'DELETE' });
            if (res.ok) {
                toast.success('Đã xóa tất cả nhật ký');
                fetchLogs(1);
                setShowClearConfirm(false);
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    // Time ago
    const timeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return formatDate(dateString);
    };

    return (
        <div className="admin-card p-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-border dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Icon icon="solar:history-bold" className="text-xl text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-bodytext dark:text-white">Nhật ký hoạt động</h2>
                            <p className="text-sm text-muted">Theo dõi mọi thao tác trong hệ thống</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            color="secondary"
                            onClick={() => fetchLogs(pagination.page)}
                            className="!px-3 !py-2"
                        >
                            <Icon icon="solar:refresh-bold" className="mr-1" />
                            Làm mới
                        </Button>
                        <Button
                            color="error"
                            onClick={() => setShowClearConfirm(true)}
                            className="!px-3 !py-2"
                        >
                            <Icon icon="solar:trash-bin-trash-bold" className="mr-1" />
                            Xóa tất cả
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-border dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value as ActivityAction | '')}
                        className="px-3 py-2 border border-border rounded-lg text-sm bg-white dark:bg-gray-800"
                    >
                        <option value="">Tất cả hành động</option>
                        {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    <select
                        value={filterEntity}
                        onChange={(e) => setFilterEntity(e.target.value as ActivityEntity | '')}
                        className="px-3 py-2 border border-border rounded-lg text-sm bg-white dark:bg-gray-800"
                    >
                        <option value="">Tất cả đối tượng</option>
                        {Object.entries(ENTITY_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={filterStartDate}
                        onChange={(e) => setFilterStartDate(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg text-sm bg-white dark:bg-gray-800"
                        placeholder="Từ ngày"
                    />

                    <input
                        type="date"
                        value={filterEndDate}
                        onChange={(e) => setFilterEndDate(e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg text-sm bg-white dark:bg-gray-800"
                        placeholder="Đến ngày"
                    />
                </div>
            </div>

            {/* Logs List */}
            <div className="divide-y divide-border dark:divide-gray-700">
                {loading ? (
                    <div className="p-12 text-center">
                        <Icon icon="solar:refresh-bold" className="animate-spin text-4xl text-muted mb-2" />
                        <p className="text-muted">Đang tải...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="mx-auto text-5xl text-muted mb-3" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l2.5 2.5" opacity=".5"></path><path fill="currentColor" d="m5.604 5.604l-.53-.53zM4.338 6.871l-.75.003a.75.75 0 0 0 .746.747zm2.542.762a.75.75 0 1 0 .007-1.5zM5.075 4.321a.75.75 0 1 0-1.5.008zm-1.248 6.464a.75.75 0 1 0-1.486-.204zm15.035-5.647c-3.82-3.82-9.993-3.86-13.788-.064l1.06 1.06c3.2-3.199 8.423-3.18 11.668.064zM5.138 18.862c3.82 3.82 9.993 3.86 13.788.064l-1.06-1.06c-3.2 3.199-8.423 3.18-11.668-.064zm13.788.064c3.795-3.795 3.756-9.968-.064-13.788l-1.06 1.06c3.244 3.245 3.263 8.468.064 11.668zM5.074 5.074L3.807 6.34L4.868 7.4l1.266-1.266zm-.74 2.547l2.546.012l.007-1.5l-2.545-.012zm.754-.754L5.075 4.32l-1.5.008l.013 2.545zM2.34 10.58a9.81 9.81 0 0 0 2.797 8.281l1.06-1.06a8.31 8.31 0 0 1-2.371-7.017z"></path></g></svg>
                        <p className="text-muted">Chưa có hoạt động nào được ghi nhận</p>
                    </div>
                ) : (
                    logs.map((log) => {
                        const actionInfo = ACTION_LABELS[log.action] || { label: log.action, icon: 'solar:info-circle-bold', color: 'text-gray-500' };
                        const entityLabel = ENTITY_LABELS[log.entity] || log.entity;

                        return (
                            <div
                                key={log.id}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                onClick={() => setSelectedLog(log)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${actionInfo.color}`}>
                                        <Icon icon={actionInfo.icon} className="text-lg" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-bodytext dark:text-white">
                                                {log.user}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionInfo.color} bg-current/10`}>
                                                {actionInfo.label}
                                            </span>
                                            <span className="text-sm text-bodytext dark:text-gray-300">
                                                {entityLabel}
                                            </span>
                                            {log.entityName && (
                                                <span className="text-sm font-medium text-primary truncate max-w-[200px]">
                                                    &quot;{log.entityName}&quot;
                                                </span>
                                            )}
                                        </div>
                                        {log.details && (
                                            <p className="text-sm text-muted mt-1 truncate">{log.details}</p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                                            <span className="flex items-center gap-1">
                                                <Icon icon="solar:clock-circle-line-duotone" />
                                                {timeAgo(log.timestamp)}
                                            </span>
                                            {log.ipAddress && (
                                                <span className="flex items-center gap-1">
                                                    <Icon icon="solar:global-line-duotone" />
                                                    {log.ipAddress}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <Icon icon="solar:alt-arrow-right-line-duotone" className="text-muted" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-border dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-muted">
                        Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} hoạt động
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            color="secondary"
                            onClick={() => fetchLogs(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="!px-3 !py-1.5"
                        >
                            <Icon icon="solar:alt-arrow-left-line-duotone" />
                        </Button>
                        <span className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium">
                            {pagination.page}
                        </span>
                        <Button
                            color="secondary"
                            onClick={() => fetchLogs(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="!px-3 !py-1.5"
                        >
                            <Icon icon="solar:alt-arrow-right-line-duotone" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLog && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedLog(null)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-border dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-bodytext dark:text-white">Chi tiết hoạt động</h3>
                            <button onClick={() => setSelectedLog(null)} className="text-muted hover:text-bodytext">
                                <Icon icon="solar:close-circle-bold" className="text-xl" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted mb-1">Thời gian</p>
                                    <p className="text-sm font-medium">{formatDate(selectedLog.timestamp)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted mb-1">Người thực hiện</p>
                                    <p className="text-sm font-medium">{selectedLog.user}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted mb-1">Hành động</p>
                                    <p className={`text-sm font-medium ${ACTION_LABELS[selectedLog.action]?.color || ''}`}>
                                        {ACTION_LABELS[selectedLog.action]?.label || selectedLog.action}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted mb-1">Đối tượng</p>
                                    <p className="text-sm font-medium">{ENTITY_LABELS[selectedLog.entity] || selectedLog.entity}</p>
                                </div>
                            </div>

                            {selectedLog.entityName && (
                                <div>
                                    <p className="text-xs text-muted mb-1">Tên đối tượng</p>
                                    <p className="text-sm font-medium text-primary">{selectedLog.entityName}</p>
                                </div>
                            )}

                            {selectedLog.entityId && (
                                <div>
                                    <p className="text-xs text-muted mb-1">ID</p>
                                    <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{selectedLog.entityId}</p>
                                </div>
                            )}

                            {selectedLog.details && (
                                <div>
                                    <p className="text-xs text-muted mb-1">Chi tiết</p>
                                    <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">{selectedLog.details}</p>
                                </div>
                            )}

                            {selectedLog.changes && selectedLog.changes.length > 0 && (
                                <div>
                                    <p className="text-xs text-muted mb-2">Các thay đổi</p>
                                    <div className="space-y-2">
                                        {selectedLog.changes.map((change, idx) => (
                                            <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm">
                                                <p className="font-medium">{change.field}</p>
                                                {change.oldValue && (
                                                    <p className="text-red-500 line-through text-xs">{change.oldValue}</p>
                                                )}
                                                {change.newValue && (
                                                    <p className="text-green-500 text-xs">{change.newValue}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedLog.ipAddress && (
                                <div>
                                    <p className="text-xs text-muted mb-1">IP Address</p>
                                    <p className="text-sm font-mono">{selectedLog.ipAddress}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Clear Confirm Modal */}
            {showClearConfirm && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" onClick={() => setShowClearConfirm(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <Icon icon="solar:trash-bin-trash-bold" className="text-3xl text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-bodytext dark:text-white mb-2">Xóa tất cả nhật ký?</h3>
                            <p className="text-sm text-muted mb-6">
                                Hành động này không thể hoàn tác. Tất cả {pagination.total} hoạt động sẽ bị xóa vĩnh viễn.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <Button color="secondary" onClick={() => setShowClearConfirm(false)}>
                                    Hủy
                                </Button>
                                <Button color="error" onClick={handleClearAll}>
                                    Xóa tất cả
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
