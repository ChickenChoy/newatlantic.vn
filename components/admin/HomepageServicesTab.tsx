'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HomepageService } from '@/types';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useToast } from '@/components/ToastProvider';

interface HomepageServicesTabProps {
    services: HomepageService[];
    onUpdate: () => void;
    saving: boolean;
    setSaving: (saving: boolean) => void;
}

export default function HomepageServicesTab({ services, onUpdate, saving, setSaving }: HomepageServicesTabProps) {
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<HomepageService | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        color: '#5f7ab8',
        order: 0,
        enabled: true,
    });

    const colorPresets = [
        { name: 'Xanh dương', value: '#5f7ab8' },
        { name: 'Xanh lá', value: '#10b981' },
        { name: 'Cam', value: '#f59e0b' },
        { name: 'Xanh biển', value: '#3b82f6' },
        { name: 'Tím', value: '#8b5cf6' },
        { name: 'Hồng', value: '#ec4899' },
        { name: 'Đỏ', value: '#ef4444' },
        { name: 'Xám', value: '#6b7280' },
    ];

    const openAddModal = () => {
        setEditingService(null);
        setFormData({
            title: '',
            description: '',
            color: '#5f7ab8',
            order: services.length,
            enabled: true,
        });
        setShowModal(true);
    };

    const openEditModal = (service: HomepageService) => {
        setEditingService(service);
        setFormData({
            title: service.title,
            description: service.description,
            color: service.color,
            order: service.order,
            enabled: service.enabled,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            toast.warning('Vui lòng nhập tiêu đề dịch vụ');
            return;
        }

        setSaving(true);
        try {
            const url = '/api/homepage-services';
            const method = editingService ? 'PUT' : 'POST';
            const body = editingService
                ? { id: editingService.id, ...formData }
                : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                toast.success(editingService ? 'Đã cập nhật dịch vụ!' : 'Đã thêm dịch vụ mới!');
                setShowModal(false);
                onUpdate();
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Failed to save service');
            }
        } catch (error) {
            console.error('Error saving service:', error);
            toast.error('Có lỗi xảy ra khi lưu dịch vụ');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await toast.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc muốn xóa dịch vụ này?',
            confirmText: 'Xóa',
            type: 'danger'
        });
        if (!confirmed) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/homepage-services?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success('Đã xóa dịch vụ!');
                onUpdate();
            } else {
                throw new Error('Failed to delete service');
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Có lỗi xảy ra khi xóa dịch vụ');
        } finally {
            setSaving(false);
        }
    };

    const toggleEnabled = async (service: HomepageService) => {
        setSaving(true);
        try {
            const response = await fetch('/api/homepage-services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: service.id, enabled: !service.enabled }),
            });

            if (response.ok) {
                toast.success(service.enabled ? 'Đã ẩn dịch vụ' : 'Đã hiện dịch vụ');
                onUpdate();
            }
        } catch (error) {
            console.error('Error toggling service:', error);
        } finally {
            setSaving(false);
        }
    };

    const sortedServices = [...services].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6 relative min-h-[600px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-dark dark:text-white">Dịch vụ trang chủ</h2>
                    <p className="text-sm text-muted dark:text-gray-400">
                        Quản lý các dịch vụ hiển thị trong phần &quot;Sản phẩm &amp; Dịch vụ&quot; trên trang chủ
                    </p>
                </div>
                <Button
                    color="primary"
                    onClick={openAddModal}
                    disabled={saving}
                >
                    <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 mr-2" />
                    Thêm dịch vụ
                </Button>
            </div>

            {/* Services List */}
            <div className="grid gap-4">
                {sortedServices.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-darkgray rounded-xl border border-border dark:border-gray-700">
                        <Icon icon="solar:inbox-line-duotone" className="w-16 h-16 mx-auto text-muted dark:text-gray-500 mb-4" />
                        <p className="text-muted dark:text-gray-400">Chưa có dịch vụ nào</p>
                        <Button color="primary" onClick={openAddModal} className="mt-4">
                            Thêm dịch vụ đầu tiên
                        </Button>
                    </div>
                ) : (
                    sortedServices.map((service, index) => (
                        <div
                            key={service.id}
                            className={`bg-white dark:bg-darkgray rounded-xl border border-border dark:border-gray-700 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${!service.enabled ? 'opacity-60' : ''
                                }`}
                        >
                            {/* Color indicator */}
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
                                style={{ backgroundColor: service.color }}
                            >
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Content */}
                            <div className="flex-grow min-w-0">
                                <h3 className="font-semibold text-dark dark:text-white truncate">{service.title}</h3>
                                <p className="text-sm text-muted dark:text-gray-400 line-clamp-2">{service.description}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => toggleEnabled(service)}
                                    className={`p-2 rounded-lg transition-colors ${service.enabled
                                        ? 'text-green-600 bg-green-100 dark:bg-green-900/20 hover:bg-green-200 dark:hover:bg-green-900/30'
                                        : 'text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    title={service.enabled ? 'Đang hiển thị' : 'Đang ẩn'}
                                >
                                    <Icon icon={service.enabled ? "solar:eye-bold" : "solar:eye-closed-bold"} className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => openEditModal(service)}
                                    className="p-2 rounded-lg text-blue-600 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                                    title="Chỉnh sửa"
                                >
                                    <Icon icon="solar:pen-2-line-duotone" className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="p-2 rounded-lg text-red-600 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                    title="Xóa"
                                >
                                    <Icon icon="solar:trash-bin-trash-line-duotone" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal with dark overlay - Portal to body */}
            {showModal && createPortal(
                <>
                    {/* Backdrop overlay */}
                    <div
                        className="fixed inset-0 z-[60]"
                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                        onClick={() => setShowModal(false)}
                    />
                    {/* Modal content */}
                    <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-white dark:bg-darkgray rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto pointer-events-auto border border-border dark:border-gray-700">
                            <div className="p-6 border-b border-border dark:border-gray-700 sticky top-0 bg-white dark:bg-darkgray z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-dark dark:text-white">
                                        {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-muted transition-colors"
                                    >
                                        <Icon icon="solar:close-circle-line-duotone" className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                        placeholder="VD: Cẩu tự hành"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                                        placeholder="Mô tả ngắn về dịch vụ..."
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                                        Màu sắc
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {colorPresets.map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setFormData({ ...formData, color: color.value })}
                                                className={`w-8 h-8 rounded-lg border-2 transition-all ${formData.color === color.value
                                                    ? 'border-dark dark:border-white scale-110'
                                                    : 'border-transparent hover:scale-105'
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="w-8 h-8 rounded-lg border border-border cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="flex-1 px-3 py-2 rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white text-sm font-mono"
                                            placeholder="#5f7ab8"
                                        />
                                    </div>
                                </div>

                                {/* Order & Enabled - Compact row */}
                                <div className="flex items-center gap-4">
                                    <div className="w-24">
                                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">
                                            Thứ tự
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                            className="w-full px-3 py-2 rounded-lg border border-border dark:border-gray-700 bg-white dark:bg-gray-800 text-dark dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                            min={0}
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="service-enabled"
                                            checked={formData.enabled}
                                            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                        />
                                        <label htmlFor="service-enabled" className="text-sm font-medium text-dark dark:text-white">
                                            Hiển thị
                                        </label>
                                    </div>
                                </div>

                                {/* Preview - Compact */}
                                <div className="p-3 bg-gray-900 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-2">Xem trước:</p>
                                    <div
                                        className="bg-white/10 rounded-lg p-3 border-l-4"
                                        style={{ borderColor: formData.color }}
                                    >
                                        <span
                                            className="text-xs font-semibold uppercase tracking-wider mb-1 block"
                                            style={{ color: formData.color }}
                                        >
                                            01
                                        </span>
                                        <h3 className="text-base font-bold text-white mb-1">{formData.title || 'Tiêu đề dịch vụ'}</h3>
                                        <p className="text-white/80 text-xs line-clamp-2">
                                            {formData.description || 'Mô tả dịch vụ sẽ hiển thị ở đây...'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-border dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-darkgray">
                                <Button color="light" onClick={() => setShowModal(false)} disabled={saving}>
                                    Hủy
                                </Button>
                                <Button color="primary" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Đang lưu...' : (editingService ? 'Cập nhật' : 'Thêm mới')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
                , document.body)}
        </div>
    );
}
