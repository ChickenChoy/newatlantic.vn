'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { Testimonial } from '@/types';

export default function TestimonialsTab() {
    const toast = useToast();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        rating: 5,
        text: '',
        image: '',
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
            const res = await fetch('/api/testimonials');
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data.sort((a: Testimonial, b: Testimonial) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            position: '',
            rating: 5,
            text: '',
            image: '',
            enabled: true,
            order: testimonials.length + 1,
        });
        setShowModal(true);
    };

    const openEditModal = (item: Testimonial) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            position: item.position,
            rating: item.rating,
            text: item.text,
            image: item.image || '',
            enabled: item.enabled,
            order: item.order,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.text.trim()) {
            toast.error('Vui lòng nhập tên và nội dung đánh giá');
            return;
        }

        setSaving(true);
        try {
            if (editingItem) {
                const updated = testimonials.map(t =>
                    t.id === editingItem.id ? { ...t, ...formData } : t
                );
                const res = await fetch('/api/testimonials', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                });
                if (res.ok) {
                    setTestimonials(updated);
                    toast.success('Cập nhật thành công');
                    setShowModal(false);
                }
            } else {
                const res = await fetch('/api/testimonials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const newItem = await res.json();
                    setTestimonials([...testimonials, newItem]);
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
        if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

        try {
            const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTestimonials(testimonials.filter(t => t.id !== id));
                toast.success('Xóa thành công');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Lỗi khi xóa');
        }
    };

    const toggleEnabled = async (item: Testimonial) => {
        const updated = testimonials.map(t =>
            t.id === item.id ? { ...t, enabled: !t.enabled } : t
        );
        try {
            const res = await fetch('/api/testimonials', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            if (res.ok) {
                setTestimonials(updated);
                toast.success(item.enabled ? 'Đã tắt' : 'Đã bật');
            }
        } catch (error) {
            console.error('Error toggling:', error);
        }
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
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-darkgray rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-border dark:border-darkborder">
                <div className="p-6 border-b border-border dark:border-darkborder flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        {editingItem ? 'Sửa đánh giá' : 'Thêm đánh giá mới'}
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
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Tên khách hàng *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="VD: Ông Nguyễn Văn A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Chức vụ</label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="VD: Giám đốc Công ty ABC"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-2">Đánh giá (sao)</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`p-1 transition-transform hover:scale-110 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    <Icon icon="solar:star-bold" className="w-8 h-8" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Nội dung đánh giá *</label>
                        <textarea
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Nhập nội dung đánh giá..."
                        />
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
                            id="enabled"
                            checked={formData.enabled}
                            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="enabled" className="text-bodytext dark:text-gray-300">Hiển thị trên website</label>
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
                    <h2 className="text-xl font-bold text-dark dark:text-white">Đánh giá khách hàng</h2>
                    <p className="text-muted dark:text-gray-400 text-sm mt-1">Quản lý các đánh giá hiển thị trên trang chủ</p>
                </div>
                <Button onClick={openAddModal}>
                    <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 mr-2" />
                    Thêm đánh giá
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:chat-round-like-line-duotone" className="text-purple-600" height={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                            Đánh giá từ khách hàng thực tế
                        </h3>
                        <p className="text-purple-700 dark:text-purple-400 text-sm">
                            Các đánh giá sẽ hiển thị trên carousel trang chủ. Bật/tắt để kiểm soát hiển thị.
                        </p>
                    </div>
                </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((item) => (
                    <div
                        key={item.id}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all ${item.enabled
                            ? 'border-green-400 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10'
                            : 'border-border dark:border-darkborder bg-white dark:bg-darkgray'
                            }`}
                    >
                        {/* Color strip */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${item.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />

                        <div className="p-5 pl-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                        {item.name.split(' ').pop()?.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-dark dark:text-white">{item.name}</h4>
                                        <p className="text-xs text-muted dark:text-gray-400">{item.position}</p>
                                    </div>
                                </div>

                                {/* Toggle */}
                                <button
                                    onClick={() => toggleEnabled(item)}
                                    disabled={saving}
                                    className={`relative w-12 h-6 rounded-full transition-all ${item.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${item.enabled ? 'left-6' : 'left-0.5'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Rating */}
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        icon={i < item.rating ? 'solar:star-bold' : 'solar:star-line-duotone'}
                                        className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-sm text-bodytext dark:text-gray-300 italic line-clamp-3 mb-4">
                                &ldquo;{item.text}&rdquo;
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border dark:border-darkborder">
                                <Button variant="ghost" color="primary" onClick={() => openEditModal(item)}>
                                    <Icon icon="solar:pen-line-duotone" className="w-4 h-4 mr-1" />
                                    Sửa
                                </Button>
                                <Button variant="ghost" color="error" onClick={() => handleDelete(item.id)}>
                                    <Icon icon="solar:trash-bin-trash-line-duotone" className="w-4 h-4 mr-1" />
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && (
                <div className="text-center py-12 bg-lightgray dark:bg-darkgray rounded-xl border border-border dark:border-darkborder">
                    <Icon icon="solar:chat-round-like-line-duotone" className="w-16 h-16 mx-auto text-muted mb-4" />
                    <p className="text-muted">Chưa có đánh giá nào. Nhấn &quot;Thêm đánh giá&quot; để bắt đầu.</p>
                </div>
            )}

            {/* Modal - rendered via portal to body */}
            {showModal && createPortal(<ModalContent />, document.body)}
        </div>
    );
}
