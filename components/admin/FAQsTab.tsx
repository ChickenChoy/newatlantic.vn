'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { FAQ } from '@/types';

export default function FAQsTab() {
    const toast = useToast();
    const [faqs, setFAQs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
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
            const res = await fetch('/api/faqs');
            if (res.ok) {
                const data = await res.json();
                setFAQs(data.sort((a: FAQ, b: FAQ) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error loading FAQs:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        setFormData({
            question: '',
            answer: '',
            enabled: true,
            order: faqs.length + 1,
        });
        setShowModal(true);
    };

    const openEditModal = (item: FAQ) => {
        setEditingItem(item);
        setFormData({
            question: item.question,
            answer: item.answer,
            enabled: item.enabled,
            order: item.order,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.question.trim() || !formData.answer.trim()) {
            toast.error('Vui lòng nhập câu hỏi và câu trả lời');
            return;
        }

        setSaving(true);
        try {
            if (editingItem) {
                const updated = faqs.map(f =>
                    f.id === editingItem.id ? { ...f, ...formData } : f
                );
                const res = await fetch('/api/faqs', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                });
                if (res.ok) {
                    setFAQs(updated);
                    toast.success('Cập nhật thành công');
                    setShowModal(false);
                }
            } else {
                const res = await fetch('/api/faqs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const newItem = await res.json();
                    setFAQs([...faqs, newItem]);
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
        if (!confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;

        try {
            const res = await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setFAQs(faqs.filter(f => f.id !== id));
                toast.success('Xóa thành công');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Lỗi khi xóa');
        }
    };

    const toggleEnabled = async (item: FAQ) => {
        const updated = faqs.map(f =>
            f.id === item.id ? { ...f, enabled: !f.enabled } : f
        );
        try {
            const res = await fetch('/api/faqs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            if (res.ok) {
                setFAQs(updated);
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-darkgray rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-border dark:border-darkborder">
                <div className="p-6 border-b border-border dark:border-darkborder flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark dark:text-white">
                        {editingItem ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
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
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Câu hỏi *</label>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="VD: Làm thế nào để đặt hàng?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-bodytext dark:text-gray-300 mb-1">Câu trả lời *</label>
                        <textarea
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-2.5 bg-lightgray dark:bg-dark border border-border dark:border-darkborder rounded-lg text-dark dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Nhập câu trả lời..."
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
                            id="enabled-faq"
                            checked={formData.enabled}
                            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label htmlFor="enabled-faq" className="text-bodytext dark:text-gray-300">Hiển thị trên website</label>
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
                    <h2 className="text-xl font-bold text-dark dark:text-white">Câu hỏi thường gặp</h2>
                    <p className="text-muted dark:text-gray-400 text-sm mt-1">Quản lý các FAQ hiển thị trên trang chủ</p>
                </div>
                <Button onClick={openAddModal}>
                    <Icon icon="solar:add-circle-line-duotone" className="w-5 h-5 mr-2" />
                    Thêm câu hỏi
                </Button>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:question-circle-line-duotone" className="text-blue-600" height={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
                            Câu hỏi được hỏi thường xuyên
                        </h3>
                        <p className="text-blue-700 dark:text-blue-400 text-sm">
                            FAQ giúp khách hàng tìm câu trả lời nhanh chóng. Sắp xếp theo thứ tự ưu tiên.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQs List */}
            <div className="space-y-3">
                {faqs.map((item, idx) => (
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
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    {/* Header with number badge */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold">
                                            {idx + 1}
                                        </span>
                                        <h4 className="font-semibold text-dark dark:text-white flex-1">{item.question}</h4>
                                    </div>

                                    {/* Answer preview */}
                                    <p className="text-sm text-muted dark:text-gray-400 line-clamp-2 ml-10 mb-3">
                                        {item.answer}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 ml-10">
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

                                {/* Toggle */}
                                <button
                                    onClick={() => toggleEnabled(item)}
                                    disabled={saving}
                                    className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${item.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${item.enabled ? 'left-6' : 'left-0.5'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {faqs.length === 0 && (
                <div className="text-center py-12 bg-lightgray dark:bg-darkgray rounded-xl border border-border dark:border-darkborder">
                    <Icon icon="solar:question-circle-line-duotone" className="w-16 h-16 mx-auto text-muted mb-4" />
                    <p className="text-muted">Chưa có câu hỏi nào. Nhấn &quot;Thêm câu hỏi&quot; để bắt đầu.</p>
                </div>
            )}

            {/* Modal - rendered via portal to body */}
            {showModal && createPortal(<ModalContent />, document.body)}
        </div>
    );
}
