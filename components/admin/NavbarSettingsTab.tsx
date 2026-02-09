'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { useToast } from '@/components/ToastProvider';
import { adminFetch } from '@/lib/admin-fetch';

interface NavItem {
    id: string;
    label: string;
    href: string;
    type: 'link' | 'dropdown' | 'button';
    target?: '_self' | '_blank';
    enabled: boolean;
    order: number;
    style?: 'default' | 'outline' | 'primary';
    children?: NavItem[];
    showInMobile: boolean;
    showInDesktop: boolean;
}

interface NavbarSettings {
    items: NavItem[];
    showSearch: boolean;
    showWishlist: boolean;
    showCatalogButton: boolean;
    showContactButton: boolean;
    catalogButtonText: string;
    catalogButtonUrl: string;
    contactButtonText: string;
    contactButtonUrl: string;
}

const DEFAULT_SETTINGS: NavbarSettings = {
    items: [],
    showSearch: true,
    showWishlist: true,
    showCatalogButton: true,
    showContactButton: true,
    catalogButtonText: 'Xem catalog',
    catalogButtonUrl: '/page-download-catalog',
    contactButtonText: 'Liên hệ',
    contactButtonUrl: '/lien-he',
};

export default function NavbarSettingsTab() {
    const toast = useToast();
    const [settings, setSettings] = useState<NavbarSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<NavItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const loadSettings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await adminFetch('/api/navbar-settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error loading navbar settings:', error);
            toast.error('Không thể tải cài đặt navbar');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const saveSettings = async () => {
        setSaving(true);
        try {
            const res = await adminFetch('/api/navbar-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success('Đã lưu cài đặt thanh điều hướng!');
                // Dispatch event so navbar auto-updates without page refresh
                window.dispatchEvent(new CustomEvent('navbarSettingsUpdated'));
            } else {
                toast.error('Không thể lưu cài đặt');
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Có lỗi xảy ra khi lưu');
        } finally {
            setSaving(false);
        }
    };

    const addNewItem = () => {
        const newItem: NavItem = {
            id: Date.now().toString(),
            label: '',
            href: '',
            type: 'link',
            enabled: true,
            order: settings.items.length,
            showInMobile: true,
            showInDesktop: true,
        };
        setEditingItem(newItem);
        setShowAddModal(true);
    };

    const saveItem = (item: NavItem) => {
        setSettings(prev => {
            const existingIndex = prev.items.findIndex(i => i.id === item.id);
            if (existingIndex >= 0) {
                const updated = [...prev.items];
                updated[existingIndex] = item;
                return { ...prev, items: updated };
            } else {
                return { ...prev, items: [...prev.items, item] };
            }
        });
        setEditingItem(null);
        setShowAddModal(false);
    };

    const deleteItem = async (id: string) => {
        const confirmed = await toast.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc muốn xóa mục này khỏi thanh điều hướng?',
            confirmText: 'Xóa',
            type: 'danger',
        });
        if (!confirmed) return;

        setSettings(prev => ({
            ...prev,
            items: prev.items.filter(i => i.id !== id).map((item, idx) => ({ ...item, order: idx })),
        }));
    };

    const toggleItem = (id: string) => {
        setSettings(prev => ({
            ...prev,
            items: prev.items.map(i => i.id === id ? { ...i, enabled: !i.enabled } : i),
        }));
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const items = [...settings.items];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        [items[index], items[targetIndex]] = [items[targetIndex], items[index]];
        items.forEach((item, idx) => item.order = idx);
        setSettings(prev => ({ ...prev, items }));
    };

    const handleDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;

        const items = [...settings.items];
        const draggedItemData = items[draggedItem];
        items.splice(draggedItem, 1);
        items.splice(index, 0, draggedItemData);
        items.forEach((item, idx) => item.order = idx);

        setSettings(prev => ({ ...prev, items }));
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-500">Đang tải cài đặt navbar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Icon icon="solar:menu-dots-bold-duotone" height={24} className="text-primary" />
                        Cài đặt thanh điều hướng (Navbar)
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Quản lý các mục menu, nút bấm và tính năng trên thanh điều hướng website
                    </p>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium shadow-md"
                >
                    <Icon icon={saving ? 'solar:refresh-line-duotone' : 'solar:diskette-bold-duotone'} height={18} className={saving ? 'animate-spin' : ''} />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </div>

            {/* Menu Items */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <Icon icon="solar:list-bold-duotone" height={20} className="text-blue-500" />
                        Các mục menu ({settings.items.length})
                    </h3>
                    <button
                        onClick={addNewItem}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                        <Icon icon="solar:add-circle-bold-duotone" height={18} />
                        Thêm mục menu
                    </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {settings.items.sort((a, b) => a.order - b.order).map((item, index) => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center gap-4 px-5 py-4 transition-all ${!item.enabled ? 'opacity-50 bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                } ${draggedItem === index ? 'bg-blue-50 dark:bg-blue-900/20 shadow-inner' : ''}`}
                        >
                            {/* Drag Handle */}
                            <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                                <Icon icon="solar:hamburger-menu-line-duotone" height={20} />
                            </div>

                            {/* Order Number */}
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500">
                                {index + 1}
                            </span>

                            {/* Type Icon */}
                            <div className={`p-2 rounded-lg ${item.type === 'dropdown' ? 'bg-purple-100 text-purple-600' :
                                item.type === 'button' ? 'bg-green-100 text-green-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                <Icon
                                    icon={
                                        item.type === 'dropdown' ? 'solar:list-arrow-down-bold-duotone' :
                                            item.type === 'button' ? 'solar:cursor-bold-duotone' :
                                                'solar:link-round-bold-duotone'
                                    }
                                    height={18}
                                />
                            </div>

                            {/* Item Info */}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-800 dark:text-white truncate">{item.label || '(Chưa đặt tên)'}</div>
                                <div className="text-xs text-gray-500 truncate flex items-center gap-2 mt-0.5">
                                    <span>{item.href}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${item.type === 'dropdown' ? 'bg-purple-100 text-purple-600' :
                                        item.type === 'button' ? 'bg-green-100 text-green-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                        {item.type === 'dropdown' ? 'Menu thả' : item.type === 'button' ? 'Nút bấm' : 'Liên kết'}
                                    </span>
                                </div>
                            </div>

                            {/* Visibility Indicators */}
                            <div className="flex items-center gap-1.5">
                                <span title="Desktop" className={`p-1 rounded ${item.showInDesktop ? 'text-blue-500' : 'text-gray-300'}`}>
                                    <Icon icon="solar:monitor-bold-duotone" height={16} />
                                </span>
                                <span title="Mobile" className={`p-1 rounded ${item.showInMobile ? 'text-blue-500' : 'text-gray-300'}`}>
                                    <Icon icon="solar:smartphone-bold-duotone" height={16} />
                                </span>
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => toggleItem(item.id)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'
                                    }`} />
                            </button>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button onClick={() => moveItem(index, 'up')} disabled={index === 0}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30">
                                    <Icon icon="solar:alt-arrow-up-bold" height={16} />
                                </button>
                                <button onClick={() => moveItem(index, 'down')} disabled={index === settings.items.length - 1}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 disabled:opacity-30">
                                    <Icon icon="solar:alt-arrow-down-bold" height={16} />
                                </button>
                                <button onClick={() => { setEditingItem(item); setShowAddModal(true); }}
                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500">
                                    <Icon icon="solar:pen-2-bold-duotone" height={16} />
                                </button>
                                <button onClick={() => deleteItem(item.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                                    <Icon icon="solar:trash-bin-trash-bold-duotone" height={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {settings.items.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <Icon icon="solar:menu-dots-line-duotone" height={48} className="mx-auto mb-3 opacity-50" />
                            <p>Chưa có mục menu nào</p>
                            <button onClick={addNewItem} className="mt-3 text-sm text-blue-500 hover:underline">+ Thêm mục menu đầu tiên</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search & Wishlist */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                        <Icon icon="solar:tuning-2-bold-duotone" height={20} className="text-orange-500" />
                        Tính năng
                    </h3>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:magnifer-bold-duotone" height={20} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hiện thanh tìm kiếm</span>
                            </div>
                            <button
                                onClick={() => setSettings(prev => ({ ...prev, showSearch: !prev.showSearch }))}
                                className={`relative w-11 h-6 rounded-full transition-colors ${settings.showSearch ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.showSearch ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </label>
                        <label className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:heart-bold-duotone" height={20} className="text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hiện nút yêu thích</span>
                            </div>
                            <button
                                onClick={() => setSettings(prev => ({ ...prev, showWishlist: !prev.showWishlist }))}
                                className={`relative w-11 h-6 rounded-full transition-colors ${settings.showWishlist ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.showWishlist ? 'translate-x-5' : 'translate-x-0.5'}`} />
                            </button>
                        </label>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                        <Icon icon="solar:cursor-bold-duotone" height={20} className="text-green-500" />
                        Nút hành động (CTA)
                    </h3>
                    <div className="space-y-4">
                        {/* Catalog Button */}
                        <div>
                            <label className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nút Catalog</span>
                                <button
                                    onClick={() => setSettings(prev => ({ ...prev, showCatalogButton: !prev.showCatalogButton }))}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.showCatalogButton ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.showCatalogButton ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </label>
                            {settings.showCatalogButton && (
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        value={settings.catalogButtonText}
                                        onChange={(e) => setSettings(prev => ({ ...prev, catalogButtonText: e.target.value }))}
                                        placeholder="Text nút"
                                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
                                    />
                                    <input
                                        value={settings.catalogButtonUrl}
                                        onChange={(e) => setSettings(prev => ({ ...prev, catalogButtonUrl: e.target.value }))}
                                        placeholder="URL"
                                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Contact Button */}
                        <div>
                            <label className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nút Liên hệ</span>
                                <button
                                    onClick={() => setSettings(prev => ({ ...prev, showContactButton: !prev.showContactButton }))}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.showContactButton ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${settings.showContactButton ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </label>
                            {settings.showContactButton && (
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        value={settings.contactButtonText}
                                        onChange={(e) => setSettings(prev => ({ ...prev, contactButtonText: e.target.value }))}
                                        placeholder="Text nút"
                                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
                                    />
                                    <input
                                        value={settings.contactButtonUrl}
                                        onChange={(e) => setSettings(prev => ({ ...prev, contactButtonUrl: e.target.value }))}
                                        placeholder="URL"
                                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit/Add Modal - rendered via Portal */}
            {showAddModal && editingItem && typeof document !== 'undefined' && createPortal(
                <ItemEditModal
                    item={editingItem}
                    onSave={saveItem}
                    onClose={() => { setShowAddModal(false); setEditingItem(null); }}
                />,
                document.body
            )}
        </div>
    );
}

// Edit Modal Component
function ItemEditModal({ item, onSave, onClose }: {
    item: NavItem;
    onSave: (item: NavItem) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState<NavItem>(item);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Icon icon="solar:pen-new-round-bold-duotone" height={20} className="text-primary" />
                        {item.label ? 'Chỉnh sửa mục menu' : 'Thêm mục menu mới'}
                    </h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Icon icon="solar:close-circle-line-duotone" height={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Label */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tên hiển thị *</label>
                        <input
                            value={form.label}
                            onChange={(e) => setForm(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="Ví dụ: Trang chủ, Sản phẩm..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                    </div>

                    {/* URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Đường dẫn (URL) *</label>
                        <input
                            value={form.href}
                            onChange={(e) => setForm(prev => ({ ...prev, href: e.target.value }))}
                            placeholder="Ví dụ: /san-pham, /tin-tuc, https://..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Loại</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['link', 'dropdown', 'button'] as const).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setForm(prev => ({ ...prev, type }))}
                                    className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.type === type
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-gray-200 dark:border-gray-600 text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon
                                        icon={type === 'link' ? 'solar:link-round-bold' : type === 'dropdown' ? 'solar:list-arrow-down-bold' : 'solar:cursor-bold'}
                                        height={16}
                                        className="inline mr-1.5"
                                    />
                                    {type === 'link' ? 'Liên kết' : type === 'dropdown' ? 'Menu thả' : 'Nút bấm'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Target */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Mở trong</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setForm(prev => ({ ...prev, target: '_self' }))}
                                className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.target !== '_blank'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-600'
                                    }`}
                            >
                                Cửa sổ hiện tại
                            </button>
                            <button
                                onClick={() => setForm(prev => ({ ...prev, target: '_blank' }))}
                                className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.target === '_blank'
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-gray-200 dark:border-gray-600 text-gray-600'
                                    }`}
                            >
                                Tab mới
                            </button>
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="grid grid-cols-2 gap-4">
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={form.showInDesktop}
                                onChange={(e) => setForm(prev => ({ ...prev, showInDesktop: e.target.checked }))}
                                className="w-4 h-4 text-primary rounded"
                            />
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:monitor-bold-duotone" height={18} className="text-gray-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={form.showInMobile}
                                onChange={(e) => setForm(prev => ({ ...prev, showInMobile: e.target.checked }))}
                                className="w-4 h-4 text-primary rounded"
                            />
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:smartphone-bold-duotone" height={18} className="text-gray-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Mobile</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            if (!form.label.trim()) return;
                            onSave(form);
                        }}
                        disabled={!form.label.trim()}
                        className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm font-medium shadow-md disabled:opacity-50"
                    >
                        {item.label ? 'Cập nhật' : 'Thêm mới'}
                    </button>
                </div>
            </div>
        </div>
    );
}
