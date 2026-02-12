'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { Button } from '@/components/admin/Button';
import MediaPicker from '@/components/admin/MediaPicker';
import { useToast } from '@/components/ToastProvider';
import { adminFetch } from '@/lib/admin-fetch';
import { HolidayEffect } from '@/types';

interface PopupSettings {
    enabled: boolean;
    image: string;
    title: string;
    dismissHours: number;
    linkedHolidaySlug: string;
    delayMs: number;
    maxWidth: number;
}

interface PopupSettingsTabProps {
    holidayEffects: HolidayEffect[];
}

export default function PopupSettingsTab({ holidayEffects }: PopupSettingsTabProps) {
    const toast = useToast();
    const [settings, setSettings] = useState<PopupSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const res = await adminFetch('/api/popup-settings');
            if (res.ok) {
                setSettings(await res.json());
            }
        } catch (error) {
            console.error('Error loading popup settings:', error);
            toast.error('Không thể tải cài đặt popup');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            const res = await adminFetch('/api/popup-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success('Đã lưu cài đặt popup thành công!');
            } else {
                throw new Error('Failed');
            }
        } catch (error) {
            console.error('Error saving popup settings:', error);
            toast.error('Có lỗi xảy ra khi lưu');
        } finally {
            setSaving(false);
        }
    };

    const update = (key: keyof PopupSettings, value: PopupSettings[keyof PopupSettings]) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
    };

    if (loading || !settings) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-3 text-muted">
                    <Icon icon="solar:refresh-circle-line-duotone" className="animate-spin" height={24} />
                    <span>Đang tải cài đặt...</span>
                </div>
            </div>
        );
    }

    const linkedHoliday = holidayEffects.find(e => e.slug === settings.linkedHolidaySlug);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-dark dark:text-white flex items-center gap-2">
                        <Icon icon="solar:window-frame-line-duotone" height={24} className="text-primary" />
                        Popup thông báo
                    </h2>
                    <p className="text-sm text-muted mt-1">
                        Quản lý popup hiển thị trên trang chủ (thông báo nghỉ lễ, khuyến mãi, ...)
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Icon icon={showPreview ? 'solar:eye-closed-line-duotone' : 'solar:eye-line-duotone'} height={18} />
                        {showPreview ? 'Ẩn' : 'Xem trước'}
                    </button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Icon icon="solar:diskette-line-duotone" height={18} />
                        Lưu cài đặt
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Panel */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Enable/Disable Card */}
                    <div className={`rounded-xl border-2 p-5 transition-all ${settings.enabled
                        ? 'border-green-400 bg-green-50/50 dark:border-green-600 dark:bg-green-900/10'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-darkgray'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${settings.enabled ? 'bg-green-500/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                    <Icon
                                        icon={settings.enabled ? 'solar:check-circle-bold' : 'solar:close-circle-line-duotone'}
                                        height={22}
                                        className={settings.enabled ? 'text-green-600' : 'text-gray-400'}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-dark dark:text-white">Trạng thái Popup</h3>
                                    <p className="text-xs text-muted">
                                        {settings.enabled ? 'Popup đang hiển thị cho khách truy cập' : 'Popup đang tắt'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => update('enabled', !settings.enabled)}
                                className={`relative w-14 h-7 rounded-full transition-all ${settings.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${settings.enabled ? 'left-8' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Main Settings */}
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-darkgray p-5 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                Tiêu đề (Alt text cho ảnh)
                            </label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => update('title', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                placeholder="VD: Thông báo lịch nghỉ Tết Nguyên Đán"
                            />
                        </div>

                        {/* Image from Media Library */}
                        <div>
                            <MediaPicker
                                value={settings.image}
                                onChange={(imageUrl) => update('image', imageUrl)}
                                folder="general"
                                label="Hình ảnh popup"
                                placeholder="Chọn ảnh từ thư viện Media"
                                aspectRatio="auto"
                            />
                        </div>

                        {/* Linked Holiday */}
                        <div>
                            <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                Liên kết với ngày lễ
                            </label>
                            <select
                                value={settings.linkedHolidaySlug}
                                onChange={(e) => update('linkedHolidaySlug', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            >
                                <option value="">Không liên kết (luôn hiển thị khi bật)</option>
                                {holidayEffects.map(effect => (
                                    <option key={effect.id} value={effect.slug}>
                                        {effect.name} {effect.enabled ? '✓ Đang bật' : ''}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted mt-1">
                                Popup chỉ hiển thị khi ngày lễ được liên kết đang bật
                            </p>
                        </div>

                        {/* Two columns for numbers */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                    Ẩn sau (giờ)
                                </label>
                                <input
                                    type="number"
                                    value={settings.dismissHours}
                                    onChange={(e) => update('dismissHours', Math.max(1, parseInt(e.target.value) || 1))}
                                    min={1}
                                    max={168}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                />
                                <p className="text-xs text-muted mt-1">Sau khi đóng, popup ẩn trong X giờ</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                    Độ trễ hiện (giây)
                                </label>
                                <input
                                    type="number"
                                    value={settings.delayMs / 1000}
                                    onChange={(e) => update('delayMs', Math.max(0, parseFloat(e.target.value) || 0) * 1000)}
                                    min={0}
                                    max={30}
                                    step={0.5}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                />
                                <p className="text-xs text-muted mt-1">Thời gian chờ giữa khi load xong trang</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark dark:text-white mb-1.5">
                                    Chiều rộng tối đa (px)
                                </label>
                                <input
                                    type="number"
                                    value={settings.maxWidth}
                                    onChange={(e) => update('maxWidth', Math.max(200, parseInt(e.target.value) || 360))}
                                    min={200}
                                    max={800}
                                    step={10}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-dark dark:text-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                />
                                <p className="text-xs text-muted mt-1">Kích thước popup trên màn hình</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Info */}
                    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 p-4">
                        <div className="flex items-start gap-3">
                            <Icon icon="solar:info-circle-line-duotone" className="text-blue-500 mt-0.5 flex-shrink-0" height={18} />
                            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                {settings.linkedHolidaySlug ? (
                                    linkedHoliday ? (
                                        <p>
                                            Popup liên kết với <strong>{linkedHoliday.name}</strong>
                                            {linkedHoliday.enabled
                                                ? <span className="text-green-600 dark:text-green-400"> — đang bật ✓</span>
                                                : <span className="text-orange-600 dark:text-orange-400"> — đang tắt (popup sẽ không hiện)</span>
                                            }
                                        </p>
                                    ) : (
                                        <p className="text-orange-600">Ngày lễ &quot;{settings.linkedHolidaySlug}&quot; không tìm thấy</p>
                                    )
                                ) : (
                                    <p>Popup không liên kết ngày lễ — sẽ hiển thị khi bật</p>
                                )}
                                <p>Khách truy cập sẽ thấy popup sau {settings.delayMs / 1000}s, ẩn {settings.dismissHours}h sau khi đóng</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-4 space-y-4">
                        <h3 className="text-sm font-semibold text-dark dark:text-white flex items-center gap-2">
                            <Icon icon="solar:monitor-smartphone-line-duotone" height={18} className="text-primary" />
                            Xem trước
                        </h3>

                        {/* Mini Preview */}
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 aspect-[9/16] max-h-[480px]">
                            {/* Fake page background */}
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 opacity-80" />

                            {/* Popup preview (centered) */}
                            {settings.enabled && settings.image && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4">
                                    <div className="relative w-full" style={{ maxWidth: `${Math.min(settings.maxWidth * 0.5, 180)}px` }}>
                                        {/* Mini close button */}
                                        <div className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 bg-white rounded-full shadow flex items-center justify-center">
                                            <Icon icon="solar:close-circle-bold" height={10} className="text-gray-400" />
                                        </div>
                                        <div className="overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/20">
                                            <Image
                                                src={settings.image}
                                                alt={settings.title}
                                                width={360}
                                                height={450}
                                                className="h-auto w-full"
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!settings.enabled && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                        <Icon icon="solar:window-frame-line-duotone" height={40} className="mx-auto mb-2 opacity-30" />
                                        <p className="text-xs">Popup đang tắt</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick info */}
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 space-y-2 text-xs text-muted">
                            <div className="flex justify-between">
                                <span>Trạng thái</span>
                                <span className={settings.enabled ? 'text-green-500 font-medium' : 'text-gray-400'}>
                                    {settings.enabled ? '● Đang bật' : '○ Đang tắt'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Kích thước</span>
                                <span className="font-mono">{settings.maxWidth}px</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Xuất hiện sau</span>
                                <span>{settings.delayMs / 1000}s</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ẩn khi đóng</span>
                                <span>{settings.dismissHours} giờ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Preview Modal */}
            {showPreview && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
                    onClick={() => setShowPreview(false)}
                >
                    <div
                        className="relative"
                        style={{ maxWidth: `${settings.maxWidth}px`, width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute -top-2.5 -right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/30 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-red-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                        <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/20" style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.35), 0 0 40px -10px rgba(220,50,50,0.15)' }}>
                            <Image
                                src={settings.image}
                                alt={settings.title}
                                width={720}
                                height={900}
                                className="h-auto w-full"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
