'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { FooterLink } from '@/types';

const sectionLabels: Record<string, string> = {
    quick: 'Liên kết nhanh',
    service: 'Dịch vụ',
    policy: 'Chính sách',
};

const sectionIcons: Record<string, string> = {
    quick: 'solar:bolt-line-duotone',
    service: 'solar:settings-line-duotone',
    policy: 'solar:shield-check-line-duotone',
};

interface FooterLinksTabProps {
    footerLinks: FooterLink[];
    onRefresh: () => void;
}

export default function FooterLinksTab({ footerLinks, onRefresh }: FooterLinksTabProps) {
    const toast = useToast();
    const [links, setLinks] = useState<FooterLink[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
    const [formData, setFormData] = useState({
        label: '',
        href: '',
        section: 'quick' as 'quick' | 'service' | 'policy',
        isExternal: false,
        order: 1,
    });

    useEffect(() => {
        setLinks([...footerLinks].sort((a, b) => {
            // Sort by section first, then by order
            if (a.section !== b.section) {
                const sectionOrder = ['quick', 'service', 'policy'];
                return sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section);
            }
            return a.order - b.order;
        }));
    }, [footerLinks]);

    const openAddModal = (section: 'quick' | 'service' | 'policy') => {
        const sectionLinks = links.filter(l => l.section === section);
        setEditingLink(null);
        setFormData({
            label: '',
            href: '',
            section,
            isExternal: false,
            order: sectionLinks.length + 1,
        });
        setShowModal(true);
    };

    const openEditModal = (link: FooterLink) => {
        setEditingLink(link);
        setFormData({
            label: link.label,
            href: link.href,
            section: link.section,
            isExternal: link.isExternal,
            order: link.order,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.label.trim() || !formData.href.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setSaving(true);
        try {
            if (editingLink) {
                // Update existing
                const updated = links.map(l =>
                    l.id === editingLink.id ? { ...l, ...formData } : l
                );
                const res = await fetch('/api/footer-links', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                });
                if (res.ok) {
                    toast.success('Cập nhật thành công');
                    onRefresh();
                    setShowModal(false);
                }
            } else {
                // Create new
                const newLink: FooterLink = {
                    id: String(Date.now()),
                    ...formData,
                };
                const res = await fetch('/api/footer-links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newLink),
                });
                if (res.ok) {
                    toast.success('Thêm mới thành công');
                    onRefresh();
                    setShowModal(false);
                }
            }
        } catch (error) {
            console.error('Error saving footer link:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa liên kết này?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/footer-links?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Đã xóa liên kết');
                onRefresh();
            }
        } catch (error) {
            console.error('Error deleting footer link:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleMoveOrder = async (link: FooterLink, direction: 'up' | 'down') => {
        const sectionLinks = links.filter(l => l.section === link.section);
        const currentIndex = sectionLinks.findIndex(l => l.id === link.id);

        if (
            (direction === 'up' && currentIndex === 0) ||
            (direction === 'down' && currentIndex === sectionLinks.length - 1)
        ) {
            return;
        }

        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const swapLink = sectionLinks[swapIndex];

        const updated = links.map(l => {
            if (l.id === link.id) return { ...l, order: swapLink.order };
            if (l.id === swapLink.id) return { ...l, order: link.order };
            return l;
        });

        setSaving(true);
        try {
            const res = await fetch('/api/footer-links', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated),
            });
            if (res.ok) {
                onRefresh();
            }
        } catch (error) {
            console.error('Error updating order:', error);
        } finally {
            setSaving(false);
        }
    };

    const groupedLinks = {
        quick: links.filter(l => l.section === 'quick'),
        service: links.filter(l => l.section === 'service'),
        policy: links.filter(l => l.section === 'policy'),
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold text-dark dark:text-white">Quản lý Footer Links</h2>
                <p className="text-sm text-muted dark:text-gray-400 mt-1">
                    Chỉnh sửa các liên kết hiển thị ở chân trang website
                </p>
            </div>

            {/* Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {(['quick', 'service', 'policy'] as const).map((section) => (
                    <div key={section} className="admin-card">
                        <div className="pb-4 mb-4 border-b border-border flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Icon icon={sectionIcons[section]} className="text-primary" height={20} />
                                <h3 className="font-semibold text-dark dark:text-white">
                                    {sectionLabels[section]}
                                </h3>
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                    {groupedLinks[section].length}
                                </span>
                            </div>
                            <button
                                onClick={() => openAddModal(section)}
                                className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Thêm liên kết"
                            >
                                <Icon icon="solar:add-circle-line-duotone" height={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {groupedLinks[section].length === 0 ? (
                                <p className="text-sm text-muted text-center py-4">
                                    Chưa có liên kết nào
                                </p>
                            ) : (
                                groupedLinks[section]
                                    .sort((a, b) => a.order - b.order)
                                    .map((link) => (
                                        <div
                                            key={link.id}
                                            className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-dark dark:text-white text-sm truncate">
                                                    {link.label}
                                                </p>
                                                <p className="text-xs text-muted truncate">
                                                    {link.href}
                                                    {link.isExternal && (
                                                        <span className="ml-1 text-primary">
                                                            <Icon icon="solar:link-external-line-duotone" height={12} className="inline" />
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleMoveOrder(link, 'up')}
                                                    disabled={link.order === 1}
                                                    className="p-1.5 text-muted hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
                                                    title="Move up"
                                                >
                                                    <Icon icon="solar:arrow-up-line-duotone" height={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleMoveOrder(link, 'down')}
                                                    disabled={link.order === groupedLinks[section].length}
                                                    className="p-1.5 text-muted hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
                                                    title="Move down"
                                                >
                                                    <Icon icon="solar:arrow-down-line-duotone" height={14} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(link)}
                                                    className="p-1.5 text-muted hover:text-primary hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Icon icon="solar:pen-2-line-duotone" height={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(link.id)}
                                                    className="p-1.5 text-muted hover:text-danger hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-line-duotone" height={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    title={editingLink ? 'Chỉnh sửa liên kết' : 'Thêm liên kết mới'}
                    onClose={() => setShowModal(false)}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">
                                Nhãn <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="VD: Liên hệ"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">
                                URL <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.href}
                                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                                placeholder="VD: /lien-he hoặc https://..."
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">
                                Phân loại
                            </label>
                            <select
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value as typeof formData.section })}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="quick">Liên kết nhanh</option>
                                <option value="service">Dịch vụ</option>
                                <option value="policy">Chính sách</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isExternal"
                                checked={formData.isExternal}
                                onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                            />
                            <label htmlFor="isExternal" className="text-sm text-bodytext">
                                Liên kết ngoài (mở trong tab mới)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button color="light" onClick={() => setShowModal(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Đang lưu...' : editingLink ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// Modal Component
interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

function Modal({ title, children, onClose }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-darkgray rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-dark dark:text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted hover:text-bodytext hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:close-circle-line-duotone" height={20} />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>,
        document.body
    );
}
