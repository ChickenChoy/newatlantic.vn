'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/admin/Button';
import { useToast } from '@/components/ToastProvider';
import { HolidayEffect } from '@/types';

interface HolidayEffectsTabProps {
    holidayEffects: HolidayEffect[];
    onRefresh: () => void;
}

const EFFECT_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
    banner: { label: 'Banner', icon: 'solar:flag-line-duotone' },
    flowers: { label: 'Hoa rơi', icon: 'solar:flower-line-duotone' },
    snow: { label: 'Tuyết rơi', icon: 'solar:snowflake-line-duotone' },
    fireworks: { label: 'Pháo hoa', icon: 'solar:stars-line-duotone' },
    flags: { label: 'Cờ bay', icon: 'solar:flag-2-line-duotone' },
};

export default function HolidayEffectsTab({ holidayEffects, onRefresh }: HolidayEffectsTabProps) {
    const toast = useToast();
    const [saving, setSaving] = useState(false);

    const toggleEffect = async (effect: HolidayEffect) => {
        setSaving(true);
        try {
            const response = await fetch('/api/holiday-effects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: effect.id,
                    enabled: !effect.enabled,
                }),
            });

            if (response.ok) {
                // If enabling this effect, disable all others
                if (!effect.enabled) {
                    // Disable all other enabled effects
                    const otherEnabled = holidayEffects.filter(e => e.id !== effect.id && e.enabled);
                    for (const other of otherEnabled) {
                        await fetch('/api/holiday-effects', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id: other.id,
                                enabled: false,
                            }),
                        });
                    }
                }
                toast.success(`Đã ${!effect.enabled ? 'bật' : 'tắt'} hiệu ứng "${effect.name}"`);
                onRefresh();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Error updating holiday effect:', error);
            toast.error('Có lỗi xảy ra khi cập nhật hiệu ứng');
        } finally {
            setSaving(false);
        }
    };

    const toggleEffectType = async (effect: HolidayEffect, effectType: string) => {
        setSaving(true);
        try {
            const newEffectTypes = effect.effectTypes.includes(effectType)
                ? effect.effectTypes.filter(t => t !== effectType)
                : [...effect.effectTypes, effectType];

            const response = await fetch('/api/holiday-effects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: effect.id,
                    effectTypes: newEffectTypes,
                }),
            });

            if (response.ok) {
                toast.success('Đã cập nhật loại hiệu ứng');
                onRefresh();
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Error updating effect types:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:stars-line-duotone" className="text-amber-600" height={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                            Quản lý hiệu ứng ngày lễ Việt Nam
                        </h3>
                        <p className="text-amber-700 dark:text-amber-400 text-sm">
                            Bật/tắt các hiệu ứng trang trí phù hợp với từng ngày lễ. Hiệu ứng sẽ tự động hiển thị trong khoảng thời gian đã cài đặt.
                        </p>
                    </div>
                </div>
            </div>

            {/* Holiday Effects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {holidayEffects.map((effect) => (
                    <div
                        key={effect.id}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all ${effect.enabled
                            ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                            : 'border-border dark:border-darkborder bg-white dark:bg-darkgray'
                            }`}
                    >
                        {/* Color strip */}
                        <div
                            className="absolute top-0 left-0 w-1 h-full"
                            style={{ backgroundColor: effect.primaryColor }}
                        />

                        <div className="p-5 pl-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${effect.primaryColor}20` }}
                                    >
                                        <Icon
                                            icon={
                                                effect.slug === 'tet-nguyen-dan' ? 'solar:home-smile-line-duotone' :
                                                    effect.slug === 'giang-sinh' ? 'solar:gift-line-duotone' :
                                                        effect.slug === 'quoc-khanh' ? 'solar:flag-line-duotone' :
                                                            effect.slug === 'valentine' ? 'solar:heart-line-duotone' :
                                                                effect.slug === 'tet-trung-thu' ? 'solar:moon-line-duotone' :
                                                                    effect.slug === 'quoc-te-lao-dong' ? 'solar:medal-ribbon-line-duotone' :
                                                                        effect.slug === 'giai-phong-mien-nam' ? 'solar:medal-star-line-duotone' :
                                                                            effect.slug === 'gio-to-hung-vuong' ? 'solar:crown-line-duotone' :
                                                                                effect.slug === 'tet-duong-lich' ? 'solar:confetti-line-duotone' :
                                                                                    'solar:calendar-line-duotone'
                                            }
                                            height={20}
                                            style={{ color: effect.primaryColor }}
                                        />    </div>
                                    <div>
                                        <h4 className="font-semibold text-dark dark:text-white">
                                            {effect.name}
                                        </h4>
                                        <p className="text-xs text-muted dark:text-gray-400">
                                            {effect.startDate} → {effect.endDate}
                                        </p>
                                    </div>
                                </div>

                                {/* Toggle Button */}
                                <button
                                    onClick={() => toggleEffect(effect)}
                                    disabled={saving}
                                    className={`relative w-14 h-7 rounded-full transition-all ${effect.enabled
                                        ? 'bg-green-500'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${effect.enabled ? 'left-8' : 'left-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Description */}
                            {effect.description && (
                                <p className="text-sm text-muted dark:text-gray-400 mb-4">
                                    {effect.description}
                                </p>
                            )}

                            {/* Effect Types - Read Only */}
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(EFFECT_TYPE_LABELS).map(([type, { label, icon }]) => {
                                    const isActive = effect.effectTypes.includes(type);
                                    if (!isActive) return null; // Only show active effects
                                    return (
                                        <span
                                            key={type}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30"
                                        >
                                            <Icon icon={icon} height={14} />
                                            {label}
                                        </span>
                                    );
                                })}
                            </div>

                            {/* Color Preview */}
                            <div className="mt-4 flex items-center gap-3">
                                <span className="text-xs text-muted">Màu sắc:</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                                        style={{ backgroundColor: effect.primaryColor }}
                                        title="Màu chính"
                                    />
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-white shadow"
                                        style={{ backgroundColor: effect.secondaryColor }}
                                        title="Màu phụ"
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                ))}
            </div>

            {/* Active Effects Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                    <Icon icon="solar:info-circle-line-duotone" className="text-blue-600" height={20} />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300">Hiệu ứng đang hoạt động</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                    {holidayEffects.filter(e => e.enabled).length === 0 ? (
                        <p className="text-blue-600 dark:text-blue-400 text-sm">Chưa có hiệu ứng nào được bật</p>
                    ) : (
                        holidayEffects.filter(e => e.enabled).map(effect => (
                            <span
                                key={effect.id}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-darkgray rounded-full text-sm font-medium"
                                style={{ color: effect.primaryColor }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: effect.primaryColor }}
                                />
                                {effect.name}
                            </span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
