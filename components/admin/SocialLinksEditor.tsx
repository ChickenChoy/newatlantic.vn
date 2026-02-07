'use client';

import { useState } from 'react';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { SocialLink } from '@/types';

const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: 'solar:facebook-line-duotone', color: '#1877F2' },
    { value: 'youtube', label: 'YouTube', icon: 'solar:play-stream-line-duotone', color: '#FF0000' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'solar:case-line-duotone', color: '#0A66C2' },
    { value: 'zalo', label: 'Zalo', icon: 'solar:chat-round-line-duotone', color: '#0068FF' },
    { value: 'instagram', label: 'Instagram', icon: 'solar:camera-line-duotone', color: '#E4405F' },
] as const;

interface SocialLinksEditorProps {
    socialLinks: SocialLink[];
    onChange: (links: SocialLink[]) => void;
}

export default function SocialLinksEditor({ socialLinks, onChange }: SocialLinksEditorProps) {
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editingLinks, setEditingLinks] = useState<SocialLink[]>([]);

    const startEditing = () => {
        setEditingLinks([...socialLinks]);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setIsEditing(false);
        setEditingLinks([]);
    };

    const saveChanges = async () => {
        // Validate URLs
        const invalidLinks = editingLinks.filter(link => link.url && !isValidUrl(link.url));
        if (invalidLinks.length > 0) {
            toast.error('Một số URL không hợp lệ');
            return;
        }

        onChange(editingLinks);
        setIsEditing(false);
        toast.success('Đã cập nhật social links');
    };

    const isValidUrl = (url: string) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const addLink = () => {
        const usedPlatforms = editingLinks.map(l => l.platform);
        const availablePlatform = platformOptions.find(p => !usedPlatforms.includes(p.value));

        if (!availablePlatform) {
            toast.error('Đã thêm đủ các nền tảng');
            return;
        }

        const newLink: SocialLink = {
            id: String(Date.now()),
            platform: availablePlatform.value,
            url: '',
            enabled: true,
        };
        setEditingLinks([...editingLinks, newLink]);
    };

    const removeLink = (id: string) => {
        setEditingLinks(editingLinks.filter(l => l.id !== id));
    };

    const updateLink = (id: string, updates: Partial<SocialLink>) => {
        setEditingLinks(editingLinks.map(l =>
            l.id === id ? { ...l, ...updates } : l
        ));
    };

    const getPlatformInfo = (platform: string) => {
        return platformOptions.find(p => p.value === platform) || platformOptions[0];
    };

    const getAvailablePlatforms = (currentPlatform: string) => {
        const usedPlatforms = editingLinks
            .filter(l => l.platform !== currentPlatform)
            .map(l => l.platform);
        return platformOptions.filter(p => !usedPlatforms.includes(p.value));
    };

    if (!isEditing) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-bodytext">Social Links</h3>
                    <button
                        onClick={startEditing}
                        className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                    >
                        <Icon icon="solar:pen-2-line-duotone" height={16} />
                        Chỉnh sửa
                    </button>
                </div>

                {socialLinks.length === 0 ? (
                    <p className="text-sm text-muted">Chưa có social link nào</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {socialLinks.map((link) => {
                            const platform = getPlatformInfo(link.platform);
                            return (
                                <a
                                    key={link.id}
                                    href={link.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${link.enabled
                                            ? 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            : 'bg-gray-100/50 dark:bg-gray-800/30 opacity-50'
                                        }`}
                                    style={{ borderLeft: `3px solid ${link.enabled ? platform.color : '#9ca3af'}` }}
                                >
                                    <Icon icon={platform.icon} height={18} style={{ color: link.enabled ? platform.color : '#9ca3af' }} />
                                    <span className={`text-sm ${link.enabled ? 'text-dark dark:text-white' : 'text-muted line-through'}`}>{platform.label}</span>
                                    {!link.enabled && <span className="text-[10px] text-red-500 font-medium">(tắt)</span>}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-bodytext">Chỉnh sửa Social Links</h3>
                <div className="flex gap-2">
                    <Button color="light" onClick={cancelEditing} className="!px-3 !py-1.5 text-xs">
                        Hủy
                    </Button>
                    <Button onClick={saveChanges} className="!px-3 !py-1.5 text-xs">
                        Lưu
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                {editingLinks.map((link) => {
                    const platform = getPlatformInfo(link.platform);
                    const availablePlatforms = getAvailablePlatforms(link.platform);

                    return (
                        <div
                            key={link.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <select
                                value={link.platform}
                                onChange={(e) => updateLink(link.id, { platform: e.target.value as SocialLink['platform'] })}
                                className="px-3 py-2 border border-border rounded-lg text-sm bg-white dark:bg-darkgray focus:ring-2 focus:ring-primary focus:border-transparent"
                                style={{ minWidth: '140px' }}
                            >
                                <option value={link.platform}>{platform.label}</option>
                                {availablePlatforms.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>

                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                placeholder={`https://${link.platform}.com/...`}
                                className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />

                            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    checked={link.enabled}
                                    onChange={(e) => updateLink(link.id, { enabled: e.target.checked })}
                                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                                />
                                <span className="text-sm text-bodytext">Hiện</span>
                            </label>

                            <button
                                onClick={() => removeLink(link.id)}
                                className="p-2 text-muted hover:text-danger hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Xóa"
                            >
                                <Icon icon="solar:trash-bin-trash-line-duotone" height={16} />
                            </button>
                        </div>
                    );
                })}

                {editingLinks.length < platformOptions.length && (
                    <button
                        onClick={addLink}
                        className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
                    >
                        <Icon icon="solar:add-circle-line-duotone" height={18} />
                        <span className="text-sm">Thêm social link</span>
                    </button>
                )}
            </div>

            <p className="text-xs text-muted">
                * Các link được bật sẽ hiển thị ở footer và các trang liên hệ
            </p>
        </div>
    );
}
