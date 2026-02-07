'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import { Icon } from '@iconify/react';
import { FooterLink, SocialLink, SiteSettings } from '@/types';
import MediaPicker from '@/components/admin/MediaPicker';

// Platform options for social links
const platformOptions = [
    { value: 'facebook', label: 'Facebook', icon: 'solar:facebook-line-duotone', color: '#1877F2' },
    { value: 'youtube', label: 'YouTube', icon: 'solar:play-stream-line-duotone', color: '#FF0000' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'solar:case-line-duotone', color: '#0A66C2' },
    { value: 'zalo', label: 'Zalo', icon: 'solar:chat-round-line-duotone', color: '#0068FF' },
    { value: 'instagram', label: 'Instagram', icon: 'solar:camera-line-duotone', color: '#E4405F' },
] as const;

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

interface FooterSettingsTabProps {
    siteSettings: SiteSettings;
    footerLinks: FooterLink[];
    onRefresh: () => void;
}

export default function FooterSettingsTab({ siteSettings, footerLinks, onRefresh }: FooterSettingsTabProps) {
    const toast = useToast();
    const [activeSection, setActiveSection] = useState<'info' | 'social' | 'links'>('info');

    // Footer Info State
    const [footerInfo, setFooterInfo] = useState({
        companyName: '',
        companySlogan: '',
        companyDescription: '',
        phone: '',
        email: '',
        hotline: '',
        footerLogo: '',
        copyright: '',
    });

    // Social Links State
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isEditingSocial, setIsEditingSocial] = useState(false);
    const [editingSocialLinks, setEditingSocialLinks] = useState<SocialLink[]>([]);

    // Footer Links State
    const [links, setLinks] = useState<FooterLink[]>([]);
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
        setSocialLinks(siteSettings.socialLinks || []);
        setFooterInfo({
            companyName: siteSettings.companyName || '',
            companySlogan: siteSettings.companySlogan || '',
            companyDescription: siteSettings.companyDescription || '',
            phone: siteSettings.phone || '',
            email: siteSettings.email || '',
            hotline: siteSettings.hotline || '',
            footerLogo: siteSettings.footerLogo || siteSettings.logo || '',
            copyright: siteSettings.copyright || '',
        });
    }, [siteSettings]);

    useEffect(() => {
        setLinks([...footerLinks].sort((a, b) => {
            if (a.section !== b.section) {
                const sectionOrder = ['quick', 'service', 'policy'];
                return sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section);
            }
            return a.order - b.order;
        }));
    }, [footerLinks]);

    // ==================== Footer Info Functions ====================
    const saveFooterInfo = async () => {
        setSaving(true);
        try {
            const updatedSettings = {
                ...siteSettings,
                companyName: footerInfo.companyName,
                companySlogan: footerInfo.companySlogan,
                companyDescription: footerInfo.companyDescription,
                phone: footerInfo.phone,
                email: footerInfo.email,
                hotline: footerInfo.hotline,
                footerLogo: footerInfo.footerLogo,
                copyright: footerInfo.copyright,
            };
            const res = await fetch('/api/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSettings),
            });
            if (res.ok) {
                toast.success('Đã cập nhật thông tin footer');
                onRefresh();
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    // ==================== Social Links Functions ====================
    const startEditingSocial = () => {
        setEditingSocialLinks([...socialLinks]);
        setIsEditingSocial(true);
    };

    const cancelEditingSocial = () => {
        setIsEditingSocial(false);
        setEditingSocialLinks([]);
    };

    const saveSocialLinks = async () => {
        // Validate URLs
        const invalidLinks = editingSocialLinks.filter(link => link.url && !isValidUrl(link.url));
        if (invalidLinks.length > 0) {
            toast.error('Một số URL không hợp lệ');
            return;
        }

        setSaving(true);
        try {
            const updatedSettings = { ...siteSettings, socialLinks: editingSocialLinks };
            const res = await fetch('/api/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSettings),
            });
            if (res.ok) {
                setSocialLinks(editingSocialLinks);
                setIsEditingSocial(false);
                toast.success('Đã cập nhật social links');
                onRefresh();
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
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

    const addSocialLink = () => {
        const usedPlatforms = editingSocialLinks.map(l => l.platform);
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
        setEditingSocialLinks([...editingSocialLinks, newLink]);
    };

    const removeSocialLink = (id: string) => {
        setEditingSocialLinks(editingSocialLinks.filter(l => l.id !== id));
    };

    const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
        setEditingSocialLinks(editingSocialLinks.map(l =>
            l.id === id ? { ...l, ...updates } : l
        ));
    };

    const getPlatformInfo = (platform: string) => {
        return platformOptions.find(p => p.value === platform) || platformOptions[0];
    };

    const getAvailablePlatforms = (currentPlatform: string) => {
        const usedPlatforms = editingSocialLinks
            .filter(l => l.platform !== currentPlatform)
            .map(l => l.platform);
        return platformOptions.filter(p => !usedPlatforms.includes(p.value));
    };

    // ==================== Footer Links Functions ====================
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

    const handleSaveLink = async () => {
        if (!formData.label.trim() || !formData.href.trim()) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setSaving(true);
        try {
            if (editingLink) {
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
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa liên kết này?')) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/footer-links?id=${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                toast.success('Đã xóa liên kết');
                onRefresh();
            }
        } catch {
            toast.error('Có lỗi xảy ra');
        } finally {
            setSaving(false);
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
        } catch {
            console.error('Error updating order');
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
            {/* Header with tabs */}
            <div className="admin-card">
                <div className="pb-4 mb-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-dark dark:text-white flex items-center gap-2">
                        <Icon icon="solar:widget-6-line-duotone" className="text-primary" height={24} />
                        Cài đặt Footer
                    </h2>
                    <p className="text-sm text-muted mt-1">
                        Quản lý thông tin công ty, social links và các liên kết hiển thị ở chân trang website
                    </p>
                </div>

                {/* Section Tabs */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveSection('info')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeSection === 'info'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-bodytext'
                            }`}
                    >
                        <Icon icon="solar:buildings-line-duotone" height={18} />
                        Thông tin
                    </button>
                    <button
                        onClick={() => setActiveSection('social')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeSection === 'social'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-bodytext'
                            }`}
                    >
                        <Icon icon="solar:share-circle-line-duotone" height={18} />
                        Social Links
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSection === 'social' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            {socialLinks.filter(l => l.enabled).length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveSection('links')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeSection === 'links'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-gray-100 dark:bg-gray-800 text-muted hover:text-bodytext'
                            }`}
                    >
                        <Icon icon="solar:link-round-line-duotone" height={18} />
                        Footer Links
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSection === 'links' ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                            {links.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* Footer Info Section */}
            {activeSection === 'info' && (
                <div className="admin-card">
                    <div className="pb-4 mb-4 border-b border-border">
                        <h3 className="font-semibold text-dark dark:text-white">Thông tin Footer</h3>
                        <p className="text-sm text-muted">Thông tin công ty và liên hệ hiển thị ở footer</p>
                    </div>

                    <div className="space-y-6">
                        {/* Logo Footer */}
                        <div className="max-w-md">
                            <label className="block text-sm font-medium text-bodytext dark:text-white mb-2">
                                Logo Footer
                                <span className="text-xs text-muted ml-2">(Trắng - cho nền tối)</span>
                            </label>
                            <MediaPicker
                                value={footerInfo.footerLogo}
                                onChange={(url) => setFooterInfo({ ...footerInfo, footerLogo: url })}
                                label="Chọn logo footer"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Tên công ty</label>
                                <input
                                    type="text"
                                    value={footerInfo.companyName}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, companyName: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Slogan</label>
                                <input
                                    type="text"
                                    value={footerInfo.companySlogan}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, companySlogan: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Mô tả công ty</label>
                                <textarea
                                    value={footerInfo.companyDescription}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, companyDescription: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Số điện thoại</label>
                                <input
                                    type="text"
                                    value={footerInfo.phone}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Email</label>
                                <input
                                    type="email"
                                    value={footerInfo.email}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Hotline</label>
                                <input
                                    type="text"
                                    value={footerInfo.hotline}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, hotline: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-bodytext dark:text-white mb-1">Copyright</label>
                                <input
                                    type="text"
                                    value={footerInfo.copyright}
                                    onChange={(e) => setFooterInfo({ ...footerInfo, copyright: e.target.value })}
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <Button onClick={saveFooterInfo} disabled={saving}>
                                {saving ? 'Đang lưu...' : 'Lưu thông tin footer'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Links Section */}
            {activeSection === 'social' && (
                <div className="admin-card">
                    <div className="pb-4 mb-4 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-dark dark:text-white">Social Links</h3>
                            <p className="text-sm text-muted">Liên kết mạng xã hội hiển thị ở footer</p>
                        </div>
                        {!isEditingSocial && (
                            <Button onClick={startEditingSocial} color="light" className="!px-3 !py-2">
                                <Icon icon="solar:pen-2-line-duotone" height={16} className="mr-1" />
                                Chỉnh sửa
                            </Button>
                        )}
                    </div>

                    {!isEditingSocial ? (
                        <div className="space-y-3">
                            {socialLinks.length === 0 ? (
                                <p className="text-sm text-muted text-center py-8">Chưa có social link nào</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {socialLinks.map((link) => {
                                        const platform = getPlatformInfo(link.platform);
                                        return (
                                            <a
                                                key={link.id}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center gap-3 p-4 rounded-xl transition-colors group ${link.enabled
                                                        ? 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        : 'bg-gray-100/50 dark:bg-gray-800/30 opacity-50'
                                                    }`}
                                                style={{ borderLeft: `4px solid ${link.enabled ? platform.color : '#9ca3af'}` }}
                                            >
                                                <Icon icon={platform.icon} height={24} style={{ color: link.enabled ? platform.color : '#9ca3af' }} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-medium ${link.enabled ? 'text-dark dark:text-white' : 'text-muted line-through'}`}>{platform.label}</p>
                                                    <p className="text-xs text-muted truncate">{link.url || '(chưa có URL)'}</p>
                                                </div>
                                                {!link.enabled && (
                                                    <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                                                        Đã tắt
                                                    </span>
                                                )}
                                                {link.enabled && (
                                                    <Icon icon="solar:arrow-right-up-line-duotone" height={16} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {editingSocialLinks.map((link) => {
                                const platform = getPlatformInfo(link.platform);
                                const availablePlatforms = getAvailablePlatforms(link.platform);

                                return (
                                    <div
                                        key={link.id}
                                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                                    >
                                        <select
                                            value={link.platform}
                                            onChange={(e) => updateSocialLink(link.id, { platform: e.target.value as SocialLink['platform'] })}
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
                                            onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                                            placeholder={`https://${link.platform}.com/...`}
                                            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                        />

                                        <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={link.enabled}
                                                onChange={(e) => updateSocialLink(link.id, { enabled: e.target.checked })}
                                                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                                            />
                                            <span className="text-sm text-bodytext">Hiện</span>
                                        </label>

                                        <button
                                            onClick={() => removeSocialLink(link.id)}
                                            className="p-2 text-muted hover:text-danger hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Icon icon="solar:trash-bin-trash-line-duotone" height={16} />
                                        </button>
                                    </div>
                                );
                            })}

                            {editingSocialLinks.length < platformOptions.length && (
                                <button
                                    onClick={addSocialLink}
                                    className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icon icon="solar:add-circle-line-duotone" height={18} />
                                    <span className="text-sm">Thêm social link</span>
                                </button>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <Button color="light" onClick={cancelEditingSocial}>Hủy</Button>
                                <Button onClick={saveSocialLinks} disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Footer Links Section */}
            {activeSection === 'links' && (
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
                                                        onClick={() => handleDeleteLink(link.id)}
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
            )}

            {/* Modal for adding/editing links */}
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
                            <Button onClick={handleSaveLink} disabled={saving}>
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
