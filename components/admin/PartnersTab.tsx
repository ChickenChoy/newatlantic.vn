'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useToast } from '@/components/ToastProvider';
import { Button } from '@/components/admin/Button';
import MediaPicker from '@/components/admin/MediaPicker';
import { PartnerLogo, GlobalPartnerRegion, GlobalPartner } from '@/types';

interface PartnersTabProps {
    partnerLogos: PartnerLogo[];
    onUpdate: () => void;
}

export default function PartnersTab({ partnerLogos, onUpdate }: PartnersTabProps) {
    const toast = useToast();
    const [activeSection, setActiveSection] = useState<'logos' | 'global'>('logos');
    const [loading, setLoading] = useState(false);

    // Partner Logos (homepage banner)
    const [logos, setLogos] = useState<PartnerLogo[]>(partnerLogos);
    const [showLogoModal, setShowLogoModal] = useState(false);
    const [editingLogo, setEditingLogo] = useState<PartnerLogo | null>(null);
    const [logoForm, setLogoForm] = useState({
        name: '',
        logo: '',
        url: '',
        order: 0,
        enabled: true,
    });

    // Global Partners (world map)
    const [regions, setRegions] = useState<GlobalPartnerRegion[]>([]);
    const [partners, setPartners] = useState<GlobalPartner[]>([]);
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [showPartnerModal, setShowPartnerModal] = useState(false);
    const [editingRegion, setEditingRegion] = useState<GlobalPartnerRegion | null>(null);
    const [editingPartner, setEditingPartner] = useState<GlobalPartner | null>(null);
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
    const [regionForm, setRegionForm] = useState({
        name: '',
        nameVi: '',
        order: 0,
        enabled: true,
    });
    const [partnerForm, setPartnerForm] = useState({
        regionId: '',
        name: '',
        country: '',
        logo: '',
        url: '',
        order: 0,
        enabled: true,
    });

    // Sync logos from props
    useEffect(() => {
        setLogos(partnerLogos);
    }, [partnerLogos]);

    // Load global partners data
    useEffect(() => {
        loadGlobalPartners();
    }, []);

    const loadGlobalPartners = async () => {
        try {
            const res = await fetch('/api/global-partners');
            if (res.ok) {
                const data = await res.json();
                setRegions(data.regions || []);
                setPartners(data.partners || []);
            }
        } catch (error) {
            console.error('Error loading global partners:', error);
        }
    };

    // ==================== Partner Logos CRUD ====================
    const openAddLogoModal = () => {
        setEditingLogo(null);
        setLogoForm({ name: '', logo: '', url: '', order: logos.length, enabled: true });
        setShowLogoModal(true);
    };

    const openEditLogoModal = (logo: PartnerLogo) => {
        setEditingLogo(logo);
        setLogoForm({
            name: logo.name,
            logo: logo.logo,
            url: logo.url || '',
            order: logo.order,
            enabled: logo.enabled,
        });
        setShowLogoModal(true);
    };

    const saveLogo = async () => {
        if (!logoForm.name.trim() || !logoForm.logo.trim()) {
            toast.warning('Vui lòng nhập tên và URL logo');
            return;
        }

        setLoading(true);
        try {
            if (editingLogo) {
                const res = await fetch('/api/partner-logos', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingLogo.id, ...logoForm }),
                });
                if (res.ok) {
                    toast.success('Đã cập nhật logo đối tác!');
                } else {
                    throw new Error('Failed to update');
                }
            } else {
                const res = await fetch('/api/partner-logos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(logoForm),
                });
                if (res.ok) {
                    toast.success('Đã thêm logo đối tác!');
                } else {
                    throw new Error('Failed to add');
                }
            }
            setShowLogoModal(false);
            onUpdate();
        } catch (error) {
            console.error('Error saving logo:', error);
            toast.error('Có lỗi xảy ra khi lưu logo');
        } finally {
            setLoading(false);
        }
    };

    const deleteLogo = async (id: string) => {
        const confirmed = await toast.confirm({
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc muốn xóa logo này?',
            confirmText: 'Xóa',
            type: 'danger',
        });
        if (!confirmed) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/partner-logos?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Đã xóa logo đối tác!');
                onUpdate();
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting logo:', error);
            toast.error('Có lỗi xảy ra khi xóa logo');
        } finally {
            setLoading(false);
        }
    };

    // ==================== Global Regions CRUD ====================
    const openAddRegionModal = () => {
        setEditingRegion(null);
        setRegionForm({ name: '', nameVi: '', order: regions.length, enabled: true });
        setShowRegionModal(true);
    };

    const openEditRegionModal = (region: GlobalPartnerRegion) => {
        setEditingRegion(region);
        setRegionForm({
            name: region.name,
            nameVi: region.nameVi,
            order: region.order,
            enabled: region.enabled,
        });
        setShowRegionModal(true);
    };

    const saveRegion = async () => {
        if (!regionForm.name.trim() || !regionForm.nameVi.trim()) {
            toast.warning('Vui lòng nhập tên tiếng Anh và tiếng Việt');
            return;
        }

        setLoading(true);
        try {
            if (editingRegion) {
                const res = await fetch('/api/global-partners', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'region', id: editingRegion.id, ...regionForm }),
                });
                if (res.ok) {
                    toast.success('Đã cập nhật khu vực!');
                } else {
                    throw new Error('Failed to update');
                }
            } else {
                const res = await fetch('/api/global-partners', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'region', ...regionForm }),
                });
                if (res.ok) {
                    toast.success('Đã thêm khu vực mới!');
                } else {
                    throw new Error('Failed to add');
                }
            }
            setShowRegionModal(false);
            loadGlobalPartners();
        } catch (error) {
            console.error('Error saving region:', error);
            toast.error('Có lỗi xảy ra khi lưu khu vực');
        } finally {
            setLoading(false);
        }
    };

    const deleteRegion = async (id: string) => {
        const region = regions.find(r => r.id === id);
        const partnersInRegion = partners.filter(p => p.regionId === id);

        const confirmed = await toast.confirm({
            title: 'Xác nhận xóa',
            message: partnersInRegion.length > 0
                ? `Xóa khu vực "${region?.nameVi}" sẽ xóa luôn ${partnersInRegion.length} đối tác trong đó. Tiếp tục?`
                : `Bạn có chắc muốn xóa khu vực "${region?.nameVi}"?`,
            confirmText: 'Xóa',
            type: 'danger',
        });
        if (!confirmed) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/global-partners?type=region&id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Đã xóa khu vực!');
                loadGlobalPartners();
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting region:', error);
            toast.error('Có lỗi xảy ra khi xóa khu vực');
        } finally {
            setLoading(false);
        }
    };

    // ==================== Global Partners CRUD ====================
    const openAddPartnerModal = (regionId?: string) => {
        setEditingPartner(null);
        setPartnerForm({
            regionId: regionId || (regions[0]?.id || ''),
            name: '',
            country: '',
            logo: '',
            url: '',
            order: partners.filter(p => p.regionId === (regionId || regions[0]?.id)).length,
            enabled: true,
        });
        setShowPartnerModal(true);
    };

    const openEditPartnerModal = (partner: GlobalPartner) => {
        setEditingPartner(partner);
        setPartnerForm({
            regionId: partner.regionId,
            name: partner.name,
            country: partner.country || '',
            logo: partner.logo || '',
            url: partner.url || '',
            order: partner.order,
            enabled: partner.enabled,
        });
        setShowPartnerModal(true);
    };

    const savePartner = async () => {
        if (!partnerForm.name.trim() || !partnerForm.regionId) {
            toast.warning('Vui lòng nhập tên đối tác và chọn khu vực');
            return;
        }

        setLoading(true);
        try {
            if (editingPartner) {
                const res = await fetch('/api/global-partners', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'partner', id: editingPartner.id, ...partnerForm }),
                });
                if (res.ok) {
                    toast.success('Đã cập nhật đối tác!');
                } else {
                    throw new Error('Failed to update');
                }
            } else {
                const res = await fetch('/api/global-partners', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'partner', ...partnerForm }),
                });
                if (res.ok) {
                    toast.success('Đã thêm đối tác mới!');
                } else {
                    throw new Error('Failed to add');
                }
            }
            setShowPartnerModal(false);
            loadGlobalPartners();
        } catch (error) {
            console.error('Error saving partner:', error);
            toast.error('Có lỗi xảy ra khi lưu đối tác');
        } finally {
            setLoading(false);
        }
    };

    const deletePartner = async (id: string) => {
        const partner = partners.find(p => p.id === id);
        const confirmed = await toast.confirm({
            title: 'Xác nhận xóa',
            message: `Bạn có chắc muốn xóa đối tác "${partner?.name}"?`,
            confirmText: 'Xóa',
            type: 'danger',
        });
        if (!confirmed) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/global-partners?type=partner&id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Đã xóa đối tác!');
                loadGlobalPartners();
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting partner:', error);
            toast.error('Có lỗi xảy ra khi xóa đối tác');
        } finally {
            setLoading(false);
        }
    };

    const togglePartnerEnabled = async (partner: GlobalPartner) => {
        setLoading(true);
        try {
            const res = await fetch('/api/global-partners', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'partner', id: partner.id, enabled: !partner.enabled }),
            });
            if (res.ok) {
                toast.success(partner.enabled ? 'Đã ẩn đối tác' : 'Đã hiện đối tác');
                loadGlobalPartners();
            }
        } catch (error) {
            console.error('Error toggling partner:', error);
            toast.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Get filtered partners for selected region
    const filteredPartners = selectedRegionId
        ? partners.filter(p => p.regionId === selectedRegionId)
        : partners;

    return (
        <div className="space-y-6">
            {/* Section Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                    onClick={() => setActiveSection('logos')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${activeSection === 'logos'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Icon icon="solar:gallery-wide-bold-duotone" className="inline-block mr-2" height={20} />
                    Logo Đối tác (Trang chủ)
                </button>
                <button
                    onClick={() => setActiveSection('global')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${activeSection === 'global'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                >
                    <Icon icon="solar:globe-bold-duotone" className="inline-block mr-2" height={20} />
                    Đối tác Đa quốc gia (Bản đồ)
                </button>
            </div>

            {/* Section: Partner Logos */}
            {activeSection === 'logos' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Logo Đối tác</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Hiển thị dưới dạng banner cuộn trên trang chủ
                            </p>
                        </div>
                        <Button color="primary" onClick={openAddLogoModal}>
                            <Icon icon="solar:add-circle-bold" className="mr-2" height={18} />
                            Thêm Logo
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {logos.map(logo => (
                            <div
                                key={logo.id}
                                className={`group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-2 transition-all cursor-pointer ${logo.enabled
                                    ? 'border-gray-200 dark:border-gray-600 hover:border-primary'
                                    : 'border-dashed border-gray-300 dark:border-gray-600 opacity-60'
                                    }`}
                                onClick={() => openEditLogoModal(logo)}
                            >
                                <div className="aspect-[3/2] flex items-center justify-center mb-3">
                                    <img
                                        src={logo.logo}
                                        alt={logo.name}
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder.png';
                                        }}
                                    />
                                </div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center truncate">
                                    {logo.name}
                                </p>

                                {/* Quick actions */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteLogo(logo.id); }}
                                        className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        title="Xóa"
                                    >
                                        <Icon icon="solar:trash-bin-2-bold" height={14} />
                                    </button>
                                </div>

                                {!logo.enabled && (
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-0.5 bg-gray-400 text-white text-xs rounded-full">Ẩn</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {logos.length === 0 && (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            <Icon icon="solar:gallery-wide-line-duotone" className="mx-auto mb-3" height={48} />
                            <p>Chưa có logo đối tác nào</p>
                        </div>
                    )}
                </div>
            )}

            {/* Section: Global Partners */}
            {activeSection === 'global' && (
                <div className="space-y-6">
                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="flex gap-3">
                            <Icon icon="solar:info-circle-bold-duotone" className="text-blue-500 flex-shrink-0 mt-0.5" height={20} />
                            <div>
                                <p className="text-blue-800 dark:text-blue-200 text-sm">
                                    <strong>Đối tác đa quốc gia</strong> hiển thị trên bản đồ thế giới tương tác ở trang Giới thiệu.
                                    Quản lý các khu vực địa lý và danh sách đối tác trong từng khu vực.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Regions Management */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Khu vực địa lý</h3>
                            <Button color="secondary" onClick={openAddRegionModal}>
                                <Icon icon="solar:add-circle-bold" className="mr-2" height={16} />
                                Thêm khu vực
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedRegionId(null)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedRegionId === null
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Tất cả ({partners.filter(p => p.enabled).length})
                            </button>
                            {regions.map(region => {
                                const count = partners.filter(p => p.regionId === region.id && p.enabled).length;
                                return (
                                    <button
                                        key={region.id}
                                        onClick={() => setSelectedRegionId(selectedRegionId === region.id ? null : region.id)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedRegionId === region.id
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        <span>{region.nameVi}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedRegionId === region.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                                            }`}>
                                            {count}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openEditRegionModal(region); }}
                                            className={`p-0.5 rounded hover:bg-white/20 ${selectedRegionId === region.id ? '' : 'hover:bg-gray-300 dark:hover:bg-gray-500'
                                                }`}
                                            title="Sửa khu vực"
                                        >
                                            <Icon icon="solar:pen-bold" height={14} />
                                        </button>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Partners List */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                Danh sách đối tác
                                {selectedRegionId && (
                                    <span className="ml-2 text-primary">
                                        ({regions.find(r => r.id === selectedRegionId)?.nameVi})
                                    </span>
                                )}
                            </h3>
                            <Button color="primary" onClick={() => openAddPartnerModal(selectedRegionId || undefined)}>
                                <Icon icon="solar:add-circle-bold" className="mr-2" height={18} />
                                Thêm đối tác
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tên đối tác</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Khu vực</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Quốc gia</th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Trạng thái</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPartners.map(partner => {
                                        const region = regions.find(r => r.id === partner.regionId);
                                        return (
                                            <tr key={partner.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        {partner.logo && (
                                                            <img src={partner.logo} alt="" className="w-8 h-8 object-contain rounded" />
                                                        )}
                                                        <span className="font-medium text-gray-900 dark:text-white">{partner.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{region?.nameVi || '-'}</td>
                                                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{partner.country || '-'}</td>
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        onClick={() => togglePartnerEnabled(partner)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${partner.enabled
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                            }`}
                                                    >
                                                        <Icon icon={partner.enabled ? 'solar:check-circle-bold' : 'solar:close-circle-bold'} height={14} />
                                                        {partner.enabled ? 'Hiện' : 'Ẩn'}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => openEditPartnerModal(partner)}
                                                            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Icon icon="solar:pen-bold" height={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => deletePartner(partner.id)}
                                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <Icon icon="solar:trash-bin-2-bold" height={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {filteredPartners.length === 0 && (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <Icon icon="solar:users-group-rounded-line-duotone" className="mx-auto mb-3" height={48} />
                                    <p>Chưa có đối tác nào{selectedRegionId ? ' trong khu vực này' : ''}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Add/Edit Logo */}
            {showLogoModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingLogo ? 'Chỉnh sửa Logo' : 'Thêm Logo mới'}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tên đối tác *
                                </label>
                                <input
                                    type="text"
                                    value={logoForm.name}
                                    onChange={(e) => setLogoForm({ ...logoForm, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: HIAB"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Logo *
                                </label>
                                <MediaPicker
                                    value={logoForm.logo}
                                    onChange={(value) => setLogoForm({ ...logoForm, logo: value })}
                                    folder="partners"
                                    aspectRatio="square"
                                    placeholder="Chọn hoặc upload logo"
                                />
                                {logoForm.logo && (
                                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <img
                                            src={logoForm.logo}
                                            alt="Preview"
                                            className="w-20 h-20 object-contain mx-auto"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    URL Website (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={logoForm.url}
                                    onChange={(e) => setLogoForm({ ...logoForm, url: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: https://hiab.com"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="logoEnabled"
                                    checked={logoForm.enabled}
                                    onChange={(e) => setLogoForm({ ...logoForm, enabled: e.target.checked })}
                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="logoEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                                    Hiển thị trên trang chủ
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowLogoModal(false)} disabled={loading}>
                                Hủy
                            </Button>
                            <Button color="primary" onClick={saveLogo} disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Add/Edit Region */}
            {showRegionModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingRegion ? 'Chỉnh sửa Khu vực' : 'Thêm Khu vực mới'}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tên tiếng Anh *
                                </label>
                                <input
                                    type="text"
                                    value={regionForm.name}
                                    onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: North America"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tên tiếng Việt *
                                </label>
                                <input
                                    type="text"
                                    value={regionForm.nameVi}
                                    onChange={(e) => setRegionForm({ ...regionForm, nameVi: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: Bắc Mỹ"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="regionEnabled"
                                    checked={regionForm.enabled}
                                    onChange={(e) => setRegionForm({ ...regionForm, enabled: e.target.checked })}
                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="regionEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                                    Hiển thị trên bản đồ
                                </label>
                            </div>
                            {editingRegion && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => { setShowRegionModal(false); deleteRegion(editingRegion.id); }}
                                        className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2"
                                    >
                                        <Icon icon="solar:trash-bin-2-bold" height={16} />
                                        Xóa khu vực này
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setShowRegionModal(false)} disabled={loading}>
                                Hủy
                            </Button>
                            <Button color="primary" onClick={saveRegion} disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Add/Edit Partner */}
            {showPartnerModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingPartner ? 'Chỉnh sửa Đối tác' : 'Thêm Đối tác mới'}
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Khu vực *
                                </label>
                                <select
                                    value={partnerForm.regionId}
                                    onChange={(e) => setPartnerForm({ ...partnerForm, regionId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                >
                                    {regions.map(region => (
                                        <option key={region.id} value={region.id}>{region.nameVi} ({region.name})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tên đối tác *
                                </label>
                                <input
                                    type="text"
                                    value={partnerForm.name}
                                    onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: WILL-BURT (USA)"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Quốc gia (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={partnerForm.country}
                                    onChange={(e) => setPartnerForm({ ...partnerForm, country: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: USA"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Logo (tùy chọn)
                                </label>
                                <MediaPicker
                                    value={partnerForm.logo}
                                    onChange={(value) => setPartnerForm({ ...partnerForm, logo: value })}
                                    folder="partners"
                                    aspectRatio="square"
                                    placeholder="Chọn hoặc upload logo"
                                />
                                {partnerForm.logo && (
                                    <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <img
                                            src={partnerForm.logo}
                                            alt="Preview"
                                            className="w-16 h-16 object-contain mx-auto"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    URL Website (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={partnerForm.url}
                                    onChange={(e) => setPartnerForm({ ...partnerForm, url: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    placeholder="VD: https://willburt.com"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="partnerEnabled"
                                    checked={partnerForm.enabled}
                                    onChange={(e) => setPartnerForm({ ...partnerForm, enabled: e.target.checked })}
                                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="partnerEnabled" className="text-sm text-gray-700 dark:text-gray-300">
                                    Hiển thị trên bản đồ
                                </label>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800">
                            <Button variant="ghost" onClick={() => setShowPartnerModal(false)} disabled={loading}>
                                Hủy
                            </Button>
                            <Button color="primary" onClick={savePartner} disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
