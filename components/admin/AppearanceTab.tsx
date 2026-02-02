'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { HolidayEffect, PageVisibility } from '@/types';

interface AppearanceTabProps {
    holidayEffects: HolidayEffect[];
    onRefresh: () => void;
}

export default function AppearanceTab({ holidayEffects, onRefresh }: AppearanceTabProps) {
    const toast = useToast();
    const [activeSection, setActiveSection] = useState<'holidays' | 'pages'>('holidays');

    // Holiday Effects State
    const [effects, setEffects] = useState<HolidayEffect[]>([]);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingEffect, setEditingEffect] = useState<HolidayEffect | null>(null);

    // Page Visibility State
    const [pages, setPages] = useState<PageVisibility[]>([]);
    const [loadingPages, setLoadingPages] = useState(true);

    useEffect(() => {
        setEffects(holidayEffects);
    }, [holidayEffects]);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/page-visibility');
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoadingPages(false);
        }
    };

    // ==================== Holiday Effects Functions ====================
    const toggleEffect = async (id: string, enabled: boolean) => {
        setSaving(true);
        try {
            const res = await fetch('/api/holiday-effects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, enabled }),
            });
            if (res.ok) {
                setEffects(effects.map(e => e.id === id ? { ...e, enabled } : e));
                toast.success(enabled ? 'Đã bật hiệu ứng' : 'Đã tắt hiệu ứng');
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const openEditEffect = (effect: HolidayEffect) => {
        setEditingEffect(effect);
        setShowModal(true);
    };

    const saveEffect = async (updatedEffect: HolidayEffect) => {
        setSaving(true);
        try {
            const res = await fetch('/api/holiday-effects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEffect),
            });
            if (res.ok) {
                setEffects(effects.map(e => e.id === updatedEffect.id ? updatedEffect : e));
                setShowModal(false);
                toast.success('Đã cập nhật hiệu ứng');
                onRefresh();
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    // ==================== Page Visibility Functions ====================
    const togglePageVisibility = async (id: string, visible: boolean) => {
        setSaving(true);
        try {
            const res = await fetch('/api/page-visibility', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, visible }),
            });
            if (res.ok) {
                setPages(pages.map(p => p.id === id ? { ...p, visible } : p));
                toast.success(visible ? 'Đã hiển thị trang' : 'Đã ẩn trang');
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with tabs */}
            <div className="admin-card">
                <div className="pb-4 mb-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-dark dark:text-white flex items-center gap-2">
                        <Icon icon="solar:palette-line-duotone" className="text-primary" height={24} />
                        Giao diện & Hiển thị
                    </h2>
                    <p className="text-sm text-muted mt-1">
                        Quản lý hiệu ứng ngày lễ và hiển thị các trang
                    </p>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveSection('holidays')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeSection === 'holidays'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-bodytext'
                            }`}
                    >
                        <Icon icon="solar:stars-line-duotone" height={18} />
                        Hiệu ứng lễ
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSection === 'holidays' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            {effects.filter(e => e.enabled).length}/{effects.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveSection('pages')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeSection === 'pages'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-bodytext'
                            }`}
                    >
                        <Icon icon="solar:eye-scan-line-duotone" height={18} />
                        Quản lý trang
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSection === 'pages' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            {pages.filter(p => p.visible).length}/{pages.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Holiday Effects Section */}
            {activeSection === 'holidays' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {effects.map((effect) => (
                        <div
                            key={effect.id}
                            className={`admin-card relative overflow-hidden transition-all ${effect.enabled ? 'ring-2 ring-primary/50' : ''
                                }`}
                        >
                            {/* Color indicator */}
                            <div
                                className="absolute top-0 left-0 right-0 h-1"
                                style={{
                                    background: `linear-gradient(to right, ${effect.primaryColor || '#14b8a6'}, ${effect.secondaryColor || '#f59e0b'})`
                                }}
                            />

                            <div className="pt-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: `${effect.primaryColor || '#14b8a6'}20` }}
                                        >
                                            <Icon
                                                icon="solar:stars-line-duotone"
                                                height={24}
                                                style={{ color: effect.primaryColor || '#14b8a6' }}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-dark dark:text-white">{effect.name}</h3>
                                            <p className="text-xs text-muted">{effect.startDate} → {effect.endDate}</p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={effect.enabled}
                                            onChange={(e) => toggleEffect(effect.id, e.target.checked)}
                                            disabled={saving}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                {effect.description && (
                                    <p className="text-sm text-muted mb-4">{effect.description}</p>
                                )}

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {effect.effectTypes.map((type) => (
                                        <span
                                            key={type}
                                            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-bodytext rounded-full"
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => openEditEffect(effect)}
                                    className="w-full py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center justify-center gap-1"
                                >
                                    <Icon icon="solar:pen-2-line-duotone" height={14} />
                                    Chỉnh sửa
                                </button>
                            </div>
                        </div>
                    ))}

                    {effects.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted">
                            Chưa có hiệu ứng ngày lễ nào
                        </div>
                    )}
                </div>
            )}

            {/* Page Visibility Section */}
            {activeSection === 'pages' && (
                <div className="admin-card">
                    <div className="pb-4 mb-4 border-b border-border">
                        <h3 className="font-semibold text-dark dark:text-white">Quản lý hiển thị trang</h3>
                        <p className="text-sm text-muted">Bật/tắt hiển thị các trang trên website</p>
                    </div>

                    {loadingPages ? (
                        <div className="text-center py-8 text-muted">Đang tải...</div>
                    ) : (
                        <div className="space-y-2">
                            {pages.map((page) => (
                                <div
                                    key={page.id}
                                    className={`flex items-center justify-between p-4 rounded-xl transition-all ${page.visible
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                            : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${page.visible ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-200 dark:bg-gray-700'
                                            }`}>
                                            <Icon
                                                icon={page.visible ? 'solar:eye-line-duotone' : 'solar:eye-closed-line-duotone'}
                                                height={20}
                                                className={page.visible ? 'text-green-600' : 'text-muted'}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-dark dark:text-white">{page.name}</p>
                                            <p className="text-sm text-muted">{page.path}</p>
                                        </div>
                                    </div>

                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={page.visible}
                                            onChange={(e) => togglePageVisibility(page.id, e.target.checked)}
                                            disabled={saving}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                            ))}

                            {pages.length === 0 && (
                                <div className="text-center py-8 text-muted">
                                    Chưa có trang nào được cấu hình
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Edit Holiday Effect Modal */}
            {showModal && editingEffect && (
                <EditEffectModal
                    effect={editingEffect}
                    onSave={saveEffect}
                    onClose={() => setShowModal(false)}
                    saving={saving}
                />
            )}
        </div>
    );
}

// Edit Effect Modal Component
interface EditEffectModalProps {
    effect: HolidayEffect;
    onSave: (effect: HolidayEffect) => void;
    onClose: () => void;
    saving: boolean;
}

function EditEffectModal({ effect, onSave, onClose, saving }: EditEffectModalProps) {
    const [formData, setFormData] = useState<HolidayEffect>(effect);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    if (!mounted) return null;

    const effectTypeOptions = ['banner', 'flowers', 'snow', 'fireworks', 'lanterns', 'particles'];

    const toggleEffectType = (type: string) => {
        const types = formData.effectTypes.includes(type)
            ? formData.effectTypes.filter(t => t !== type)
            : [...formData.effectTypes, type];
        setFormData({ ...formData, effectTypes: types });
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-darkgray rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-dark dark:text-white">Chỉnh sửa: {effect.name}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted hover:text-bodytext hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Icon icon="solar:close-circle-line-duotone" height={20} />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">Ngày bắt đầu</label>
                            <input
                                type="text"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                placeholder="MM-DD"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">Ngày kết thúc</label>
                            <input
                                type="text"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                placeholder="MM-DD"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">Màu chính</label>
                            <input
                                type="color"
                                value={formData.primaryColor || '#14b8a6'}
                                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-bodytext mb-1">Màu phụ</label>
                            <input
                                type="color"
                                value={formData.secondaryColor || '#f59e0b'}
                                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                className="w-full h-10 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-bodytext mb-2">Loại hiệu ứng</label>
                        <div className="flex flex-wrap gap-2">
                            {effectTypeOptions.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => toggleEffectType(type)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${formData.effectTypes.includes(type)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-muted hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-bodytext mb-1">Mô tả</label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button color="light" onClick={onClose}>Hủy</Button>
                        <Button onClick={() => onSave(formData)} disabled={saving}>
                            {saving ? 'Đang lưu...' : 'Cập nhật'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
