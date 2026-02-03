'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useToast } from '@/components/ToastProvider';

interface BackupFile {
    filename: string;
    size: number;
    createdAt: string;
    modifiedAt: string;
}

export default function DatabaseTab() {
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [backups, setBackups] = useState<BackupFile[]>([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importData, setImportData] = useState<string>('');
    const [importPreview, setImportPreview] = useState<{
        files: string[];
        exportedAt: string;
    } | null>(null);

    // Load backups on mount
    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = async () => {
        try {
            const response = await fetch('/api/database?action=list-backups');
            if (response.ok) {
                const data = await response.json();
                setBackups(data.backups || []);
            }
        } catch (error) {
            console.error('Error loading backups:', error);
        }
    };

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/database');
            if (response.ok) {
                const data = await response.json();

                // Create and download file
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `newatlantic-supabase-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                toast.success(`Đã xuất ${data.metadata.totalTables} bảng, ${data.metadata.totalRecords} bản ghi từ Supabase!`);
            } else {
                throw new Error('Export failed');
            }
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Có lỗi khi xuất dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBackup = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create-backup' }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(`Đã tạo bản sao lưu: ${data.filename}`);
                loadBackups();
            } else {
                throw new Error('Backup failed');
            }
        } catch (error) {
            console.error('Backup error:', error);
            toast.error('Có lỗi khi tạo bản sao lưu');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result as string;
                const parsed = JSON.parse(content);

                if (!parsed.data) {
                    toast.error('File không hợp lệ - thiếu trường "data"');
                    return;
                }

                setImportData(content);
                setImportPreview({
                    files: Object.keys(parsed.data),
                    exportedAt: parsed.exportedAt || parsed.backupAt || 'Unknown',
                });
                setShowImportModal(true);
            } catch (error) {
                console.error('Parse error:', error);
                toast.error('Không thể đọc file JSON');
            }
        };
        reader.readAsText(file);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImport = async () => {
        if (!importData) return;

        const confirmed = await toast.confirm({
            title: 'Xác nhận Import',
            message: 'Dữ liệu hiện tại sẽ được backup trước khi import. Bạn có chắc muốn tiếp tục?',
            confirmText: 'Import',
            type: 'warning',
        });

        if (!confirmed) return;

        setLoading(true);
        try {
            const parsedImport = JSON.parse(importData);
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'import',
                    data: parsedImport.data || parsedImport, // Handle both formats
                }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(`Đã import ${result.importedCount} bảng, ${result.recordsImported} bản ghi vào Supabase!`);
                setShowImportModal(false);
                setImportData('');
                setImportPreview(null);
                loadBackups();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Import failed');
            }
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Có lỗi khi import dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreBackup = async (filename: string) => {
        const confirmed = await toast.confirm({
            title: 'Xác nhận Restore',
            message: `Bạn có chắc muốn khôi phục dữ liệu từ backup "${filename}"? Dữ liệu hiện tại sẽ bị ghi đè.`,
            confirmText: 'Khôi phục',
            type: 'danger',
        });

        if (!confirmed) return;

        setLoading(true);
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'restore-backup', filename }),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(`Đã khôi phục ${result.restoredCount} bảng dữ liệu!`);
            } else {
                throw new Error('Restore failed');
            }
        } catch (error) {
            console.error('Restore error:', error);
            toast.error('Có lỗi khi khôi phục dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBackup = async (filename: string) => {
        const confirmed = await toast.confirm({
            title: 'Xác nhận Xóa',
            message: `Bạn có chắc muốn xóa backup "${filename}"?`,
            confirmText: 'Xóa',
            type: 'danger',
        });

        if (!confirmed) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/database?filename=${encodeURIComponent(filename)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Đã xóa backup!');
                loadBackups();
            } else {
                throw new Error('Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Có lỗi khi xóa backup');
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-dark dark:text-white">Quản lý Database</h2>
                    <p className="text-sm text-muted dark:text-gray-400">
                        Import, Export và Backup dữ liệu từ Supabase
                    </p>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Export Card */}
                <div className="bg-white dark:bg-darkgray rounded-xl border border-border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Icon icon="solar:download-minimalistic-line-duotone" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-dark dark:text-white">Export Database</h3>
                            <p className="text-sm text-muted dark:text-gray-400">Tải xuống toàn bộ dữ liệu</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted dark:text-gray-400 mb-4">
                        Xuất tất cả dữ liệu từ Supabase thành file JSON để sao lưu local hoặc migrate.
                    </p>
                    <Button
                        color="primary"
                        onClick={handleExport}
                        disabled={loading}
                        className="w-full"
                    >
                        <Icon icon="solar:download-minimalistic-line-duotone" className="w-5 h-5 mr-2" />
                        {loading ? 'Đang xuất...' : 'Export JSON'}
                    </Button>
                </div>

                {/* Import Card */}
                <div className="bg-white dark:bg-darkgray rounded-xl border border-border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Icon icon="solar:upload-minimalistic-line-duotone" className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-dark dark:text-white">Import Database</h3>
                            <p className="text-sm text-muted dark:text-gray-400">Nhập dữ liệu từ file</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted dark:text-gray-400 mb-4">
                        Import dữ liệu từ file JSON vào Supabase. Dữ liệu hiện tại sẽ được backup tự động.
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Button
                        color="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="w-full"
                    >
                        <Icon icon="solar:upload-minimalistic-line-duotone" className="w-5 h-5 mr-2" />
                        Chọn file JSON
                    </Button>
                </div>

                {/* Backup Card */}
                <div className="bg-white dark:bg-darkgray rounded-xl border border-border dark:border-gray-700 p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Icon icon="solar:server-minimalistic-line-duotone" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-dark dark:text-white">Tạo Backup</h3>
                            <p className="text-sm text-muted dark:text-gray-400">Sao lưu nhanh trên server</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted dark:text-gray-400 mb-4">
                        Tạo bản sao lưu từ Supabase ra file JSON trên server. Có thể khôi phục bất cứ lúc nào.
                    </p>
                    <Button
                        color="light"
                        onClick={handleCreateBackup}
                        disabled={loading}
                        className="w-full"
                    >
                        <Icon icon="solar:server-minimalistic-line-duotone" className="w-5 h-5 mr-2" />
                        {loading ? 'Đang tạo...' : 'Tạo Backup'}
                    </Button>
                </div>
            </div>

            {/* Backups List */}
            <div className="bg-white dark:bg-darkgray rounded-xl border border-border dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-border dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-dark dark:text-white">Danh sách Backup</h3>
                            <p className="text-sm text-muted dark:text-gray-400">
                                {backups.length} bản sao lưu trên server
                            </p>
                        </div>
                        <Button color="light" onClick={loadBackups} disabled={loading}>
                            <Icon icon="solar:refresh-line-duotone" className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {backups.length === 0 ? (
                    <div className="text-center py-12">
                        <Icon icon="solar:server-minimalistic-line-duotone" className="w-16 h-16 mx-auto text-muted dark:text-gray-500 mb-4" />
                        <p className="text-muted dark:text-gray-400">Chưa có bản sao lưu nào</p>
                        <Button color="primary" onClick={handleCreateBackup} className="mt-4" disabled={loading}>
                            Tạo backup đầu tiên
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-border dark:divide-gray-700">
                        {backups.map((backup) => (
                            <div
                                key={backup.filename}
                                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        <Icon icon="solar:file-text-line-duotone" className="w-5 h-5 text-muted" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-dark dark:text-white text-sm">{backup.filename}</p>
                                        <p className="text-xs text-muted dark:text-gray-400">
                                            {formatFileSize(backup.size)} • {formatDate(backup.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleRestoreBackup(backup.filename)}
                                        className="p-2 rounded-lg text-blue-600 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                                        title="Khôi phục"
                                        disabled={loading}
                                    >
                                        <Icon icon="solar:restart-line-duotone" className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteBackup(backup.filename)}
                                        className="p-2 rounded-lg text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                        title="Xóa"
                                        disabled={loading}
                                    >
                                        <Icon icon="solar:trash-bin-trash-line-duotone" className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Import Modal */}
            {showImportModal && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[60]"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                        onClick={() => setShowImportModal(false)}
                    />
                    <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-white dark:bg-darkgray rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto pointer-events-auto border border-border dark:border-gray-700">
                            <div className="p-6 border-b border-border dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-dark dark:text-white">
                                        Xác nhận Import
                                    </h3>
                                    <button
                                        onClick={() => setShowImportModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted transition-colors"
                                    >
                                        <Icon icon="solar:close-circle-line-duotone" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {importPreview && (
                                    <>
                                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <Icon icon="solar:danger-triangle-line-duotone" className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-amber-800 dark:text-amber-200">Cảnh báo</p>
                                                    <p className="text-sm text-amber-700 dark:text-amber-300">
                                                        Dữ liệu hiện tại sẽ được backup tự động trước khi import. Tuy nhiên, hãy chắc chắn file bạn chọn là đúng.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-dark dark:text-white mb-2">Thông tin file:</p>
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
                                                <p className="text-sm text-muted dark:text-gray-400">
                                                    <strong className="text-dark dark:text-white">Thời gian xuất:</strong>{' '}
                                                    {formatDate(importPreview.exportedAt)}
                                                </p>
                                                <p className="text-sm text-muted dark:text-gray-400">
                                                    <strong className="text-dark dark:text-white">Số bảng dữ liệu:</strong>{' '}
                                                    {importPreview.files.length}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-dark dark:text-white mb-2">Các bảng sẽ được import:</p>
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-48 overflow-y-auto">
                                                <div className="flex flex-wrap gap-2">
                                                    {importPreview.files.map((file) => (
                                                        <span
                                                            key={file}
                                                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
                                                        >
                                                            {file}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6 border-t border-border dark:border-gray-700 flex justify-end gap-3">
                                <Button color="light" onClick={() => setShowImportModal(false)} disabled={loading}>
                                    Hủy
                                </Button>
                                <Button color="error" onClick={handleImport} disabled={loading}>
                                    <Icon icon="solar:upload-minimalistic-line-duotone" className="w-5 h-5 mr-2" />
                                    {loading ? 'Đang import...' : 'Xác nhận Import'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
