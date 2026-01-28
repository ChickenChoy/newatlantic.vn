'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { Certification } from '@/types';

const iconOptions = [
    { value: 'check-circle', label: 'Dấu tích', icon: 'solar:check-circle-line-duotone' },
    { value: 'shield', label: 'Khiên bảo vệ', icon: 'solar:shield-check-line-duotone' },
    { value: 'document', label: 'Tài liệu', icon: 'solar:document-text-line-duotone' },
    { value: 'star', label: 'Ngôi sao', icon: 'solar:star-line-duotone' },
];

export default function CertificationsTab() {
    const toast = useToast();
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Certification | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'check-circle',
        enabled: true,
        order: 1,
    });

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/certifications');
            if (res.ok) {
                const data = await res.json();
                setCertifications(data.sort((a: Certification, b: Certification) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error loading certifications:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            icon: 'check-circle',
            enabled: true,
            order: certifications.length + 1,
        });
        setShowModal(true);
    };

    const openEditModal = (item: Certification) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            icon: item.icon,
            enabled: item.enabled,
            order: item.order,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim() || !formData.description.trim()) {
            toast.error('Vui lòng nhập tiêu đề và mô tả');
            return;
        }

        setSaving(true);
        try {
            if (editingItem) {
                const updated = certifications.map(c =>
                    c.id === editingItem.id ? { ...c, ...formData } : c
                );
                const res = await fetch('/api/certifications', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                });
                if (res.ok) {
                    setCertifications(updated);
                    toast.success('Cập nhật thành công');
                    setShowModal(false);
                }
            } else {
                const res = await fetch('/api/certifications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const newItem = await res.json();
                    setCertifications([...certifications, newItem]);
                    toast.success('Thêm mới thành công');
                    setShowModal(false);
                }
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Lỗi khi lưu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa chứng nhận này?')) return;

        try {
            const res = await fetch(`/api/certifications?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCertifications(certifications.filter(c => c.id !== id));
                toast.success('Xóa thành công');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Lỗi khi xóa');
        }
    };

    const toggleEnabled = async (item: Certification) => {
        const updated = certifications.map(c =>
            c.id === item.id ? { ...c, enabled: !c.enabled } : c
        );
        try {
            const res = await fetch('/api/certifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            if (res.ok) {
                setCertifications(updated);
                toast.success(item.enabled ? 'Đã tắt' : 'Đã bật');
            }
        } catch (error) {
            console.error('Error toggling:', error);
        }
    };

    const getIconComponent = (iconName: string) => {
        const option = iconOptions.find(o => o.value === iconName);
        return option?.icon || 'solar:check-circle-line-duotone';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Modal component
    const ModalContent = () => (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-darkgray rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-border dark:border-darkborder">
                <div className="p-6 border-b border-border dark:border-darkborder flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        {editingItem ? 'Sửa chứng nhận' : 'Thêm chứng nhận mới'}
                    </h2>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:close-circle-line-duotone" className="w-6 h-6 text-muted" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Tiêu đề *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="VD: ISO 9001:2015"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Mô tả *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Nhập mô tả chứng nhận..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-2">Icon</label>
                        <div className="grid grid-cols-4 gap-2">
                            {iconOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, icon: option.value })}
                                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all border-2 ${formData.icon === option.value
                                        ? 'bg-primary/10 border-primary'
                                        : 'bg-lightgray dark:bg-dark border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon icon={option.icon} className={`w-6 h-6 ${formData.icon === option.value ? 'text-primary' : 'text-muted'}`} />
                                    <span className="text-xs text-muted">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Thứ tự hiển thị</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            min={1}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="enabled-cert"
                            checked={formData.enabled}
                            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="enabled-cert" className="text-bodytext dark:text-gray-300">Hiển thị trên website</label>
                    </div>
                </div>
                <div className="p-6 border-t border-border dark:border-darkborder flex justify-end gap-3">
                    <Button variant="outline" color="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Đang lưu...' : (editingItem ? 'Cập nhật' : 'Thêm mới')}
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-dark dark:text-white">Chứng nhận & Giải thưởng</h2>
                    <p className="text-muted dark:text-gray-400 text-sm mt-1">Quản lý các chứng nhận hiển thị trên trang chủ</p>
                </div>
                <Button onClick={openAddModal}>
                    <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 mr-2" />
                    Thêm chứng nhận
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:diploma-verified-line-duotone" className="text-green-600" height={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                            Chứng nhận uy tín & Giải thưởng
                        </h3>
                        <p className="text-green-700 dark:text-green-400 text-sm">
                            Hiển thị các chứng nhận ISO, giải thưởng để tăng độ tin cậy với khách hàng.
                        </p>
                    </div>
                </div>
            </div>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {certifications.map((item) => (
                    <div
                        key={item.id}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all ${item.enabled
                            ? 'border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10'
                            : 'border-border dark:border-darkborder bg-white dark:bg-darkgray'
                            }`}
                    >
                        {/* Color strip */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${item.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />

                        <div className="p-5 pt-6">
                            {/* Icon & Toggle */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.enabled ? 'bg-primary/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    <Icon icon={getIconComponent(item.icon)} className={`w-7 h-7 ${item.enabled ? 'text-primary' : 'text-gray-400'}`} />
                                </div>
                                <button
                                    onClick={() => toggleEnabled(item)}
                                    disabled={saving}
                                    className={`relative w-10 h-5 rounded-full transition-all ${item.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all ${item.enabled ? 'left-5' : 'left-0.5'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Content */}
                            <h4 className="font-bold text-dark dark:text-white mb-2">{item.title}</h4>
                            <p className="text-sm text-muted dark:text-gray-400 line-clamp-2 mb-4">{item.description}</p>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-3 border-t border-border dark:border-darkborder">
                                <Button variant="ghost" color="primary" onClick={() => openEditModal(item)} className="flex-1 justify-center">
                                    <Icon icon="solar:pen-line-duotone" className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" color="error" onClick={() => handleDelete(item.id)} className="flex-1 justify-center">
                                    <Icon icon="solar:trash-bin-trash-line-duotone" className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {certifications.length === 0 && (
                <div className="text-center py-12 bg-lightgray dark:bg-darkgray rounded-xl border border-border dark:border-darkborder">
                    <Icon icon="solar:diploma-verified-line-duotone" className="w-16 h-16 mx-auto text-muted mb-4" />
                    <p className="text-muted">Chưa có chứng nhận nào. Nhấn &quot;Thêm chứng nhận&quot; để bắt đầu.</p>
                </div>
            )}

            {/* Modal - rendered via portal to body */}
            {showModal && createPortal(<ModalContent />, document.body)}
        </div>
    );
}
