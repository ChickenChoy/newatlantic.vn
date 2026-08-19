'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ToastProvider';
import { Icon } from '@iconify/react';

interface PageVisibilityItem {
    id: string;
    path: string;
    name: string;
    description?: string;
    visible: boolean;
    order: number;
    isAutoDetected?: boolean;
}

interface PageVisibilityTabProps {
    onDataChange?: () => void;
}

export default function PageVisibilityTab({ onDataChange }: PageVisibilityTabProps) {
    const toast = useToast();
    const [pages, setPages] = useState<PageVisibilityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load pages
    const loadPages = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/page-visibility');
            if (response.ok) {
                const data = await response.json();
                setPages(data);
            }
        } catch (error) {
            console.error('Error loading pages:', error);
            toast.error('Không thể tải danh sách trang');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPages();
    }, []);

    // Toggle visibility
    const toggleVisibility = async (page: PageVisibilityItem) => {
        setSaving(true);
        try {
            const response = await fetch('/api/page-visibility', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: page.id,
                    visible: !page.visible
                })
            });

            if (response.ok) {
                await loadPages();
                toast.success(
                    page.visible
                        ? `Đã ẩn trang "${page.name}". Người dùng sẽ không thể truy cập.`
                        : `Đã hiện trang "${page.name}". Người dùng có thể truy cập bình thường.`
                );
                onDataChange?.();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-dark dark:text-white">Quản lý hiển thị trang</h2>
                <p className="text-sm text-muted dark:text-gray-400 mt-1">
                    Bật/tắt hiển thị các trang cho người dùng. Trang bị tắt sẽ hiển thị thông báo &quot;Trang tạm thời không khả dụng&quot;.
                </p>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Icon icon="mdi:information" className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                            <li>Trang <strong>ẩn</strong> sẽ hiển thị thông báo &quot;Tạm thời không khả dụng&quot; cho người dùng</li>
                            <li>Trang <strong>Admin</strong> không bị ảnh hưởng bởi cài đặt này</li>
                            <li>Thay đổi có hiệu lực ngay lập tức</li>
                            <li><strong>Tự động phát hiện:</strong> Khi bạn tạo trang mới trong code, nó sẽ tự động xuất hiện ở đây</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Pages Grid */}
            <div className="grid gap-4">
                {pages.map((page) => (
                    <div
                        key={page.id}
                        className={`
                            relative rounded-xl border p-4 transition-all duration-300
                            ${page.visible
                                ? 'bg-white dark:bg-darkgray border-border dark:border-gray-700'
                                : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between gap-4">
                            {/* Page Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-dark dark:text-white">{page.name}</h3>
                                    <span
                                        className={`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                            ${page.visible
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }
                                        `}
                                    >
                                        {page.visible ? (
                                            <>
                                                <Icon icon="mdi:eye" className="w-3 h-3 mr-1" />
                                                Đang hiển thị
                                            </>
                                        ) : (
                                            <>
                                                <Icon icon="mdi:eye-off" className="w-3 h-3 mr-1" />
                                                Đã ẩn
                                            </>
                                        )}
                                    </span>
                                    {page.isAutoDetected && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                            <Icon icon="mdi:auto-fix" className="w-3 h-3 mr-1" />
                                            Mới phát hiện
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted dark:text-gray-400 truncate">
                                    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">{page.path}</code>
                                    {page.description && <span className="ml-2">• {page.description}</span>}
                                </p>
                            </div>

                            {/* Toggle Switch */}
                            <button
                                onClick={() => toggleVisibility(page)}
                                disabled={saving}
                                className={`
                                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
                                    ${page.visible ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                                    ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                                title={page.visible ? 'Ấn để ẩn trang' : 'Ấn để hiện trang'}
                            >
                                <span
                                    className={`
                                        inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300
                                        ${page.visible ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>

                        {/* Hidden overlay indicator */}
                        {!page.visible && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2">
                                <span className="flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
                                        <Icon icon="mdi:eye-off" className="w-3 h-3 text-white" />
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {pages.length === 0 && (
                <div className="text-center py-12">
                    <Icon icon="mdi:file-document-outline" className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Chưa có trang nào được cấu hình</p>
                </div>
            )}
        </div>
    );
}

