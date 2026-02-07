'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { MediaItem, MediaFolder } from '@/types';
import { useToast } from '@/components/ToastProvider';

// Image processing utilities
async function resizeImage(file: File, maxWidth: number, maxHeight?: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Calculate new dimensions
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            if (maxHeight && height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('Failed to create blob'));
                },
                'image/webp',
                0.8 // 80% quality
            );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };

        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

interface MediaLibraryTabProps {
    onRefresh?: () => void;
}

const FOLDERS: { value: MediaFolder | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'Tất cả', icon: 'solar:gallery-bold' },
    { value: 'products', label: 'Sản phẩm', icon: 'solar:box-bold' },
    { value: 'posts', label: 'Tin tức', icon: 'solar:document-text-bold' },
    { value: 'gallery', label: 'Thư viện', icon: 'solar:album-bold' },
    { value: 'partners', label: 'Đối tác', icon: 'solar:users-group-rounded-bold' },
    { value: 'slides', label: 'Slides', icon: 'solar:slider-horizontal-bold' },
    { value: 'seo', label: 'SEO', icon: 'solar:graph-up-bold' },
    { value: 'general', label: 'Khác', icon: 'solar:folder-bold' },
];

export default function MediaLibraryTab({ onRefresh }: MediaLibraryTabProps) {
    const { success, error } = useToast();
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ file: string; progress: number }[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<MediaFolder | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null); // ID of item to delete
    const [stats, setStats] = useState<{ total: number; byFolder: Record<string, number>; totalSize: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // Fetch media items
    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            let url = '/api/media';
            const params = new URLSearchParams();

            if (selectedFolder !== 'all') {
                params.set('folder', selectedFolder);
            }
            if (searchQuery) {
                params.set('search', searchQuery);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setMedia(data);
            }

            // Fetch stats
            const statsRes = await fetch('/api/media?stats=true');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }
        } catch (err) {
            console.error('Error fetching media:', err);
            error('Không thể tải thư viện media');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFolder, searchQuery]);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    // Upload handler
    const handleUpload = async (files: FileList) => {
        if (!files.length) return;

        setUploading(true);
        setUploadProgress([]);

        const uploadFolder = selectedFolder === 'all' ? 'general' : selectedFolder;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Check file type
            if (!file.type.startsWith('image/')) {
                error(`${file.name} không phải là file ảnh`);
                continue;
            }

            // Check file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                error(`${file.name} vượt quá 10MB`);
                continue;
            }

            setUploadProgress(prev => [...prev, { file: file.name, progress: 0 }]);

            try {
                // Get original dimensions
                const dimensions = await getImageDimensions(file);
                setUploadProgress(prev =>
                    prev.map(p => p.file === file.name ? { ...p, progress: 20 } : p)
                );

                // Create variants
                const fullBlob = await resizeImage(file, 1200);
                setUploadProgress(prev =>
                    prev.map(p => p.file === file.name ? { ...p, progress: 40 } : p)
                );

                const mediumBlob = await resizeImage(file, 800);
                setUploadProgress(prev =>
                    prev.map(p => p.file === file.name ? { ...p, progress: 60 } : p)
                );

                const thumbnailBlob = await resizeImage(file, 150, 150);
                setUploadProgress(prev =>
                    prev.map(p => p.file === file.name ? { ...p, progress: 80 } : p)
                );

                // Convert to base64
                const [fullBase64, mediumBase64, thumbnailBase64] = await Promise.all([
                    blobToBase64(fullBlob),
                    blobToBase64(mediumBlob),
                    blobToBase64(thumbnailBlob)
                ]);

                // Upload to API
                const res = await fetch('/api/media', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: file.name.replace(/\.[^/.]+$/, '.webp'),
                        originalName: file.name,
                        folder: uploadFolder,
                        mimeType: 'image/webp',
                        size: fullBlob.size,
                        dimensions,
                        variants: {
                            full: fullBase64,
                            medium: mediumBase64,
                            thumbnail: thumbnailBase64
                        },
                        alt: file.name.replace(/\.[^/.]+$/, ''),
                        tags: []
                    })
                });

                if (res.ok) {
                    setUploadProgress(prev =>
                        prev.map(p => p.file === file.name ? { ...p, progress: 100 } : p)
                    );
                    success(`Đã upload ${file.name}`);
                } else {
                    throw new Error('Upload failed');
                }
            } catch (err) {
                console.error('Error uploading:', err);
                error(`Lỗi upload ${file.name}`);
                setUploadProgress(prev =>
                    prev.filter(p => p.file !== file.name)
                );
            }
        }

        setUploading(false);
        setShowUploadModal(false);
        fetchMedia();
        onRefresh?.();
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
        }
        const files = e.dataTransfer.files;
        if (files.length) {
            handleUpload(files);
        }
    };

    // Delete handler
    const handleDelete = async (id: string) => {
        setShowDeleteConfirm(id);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;
        const id = showDeleteConfirm;
        setShowDeleteConfirm(null);

        try {
            const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });

            if (res.ok) {
                success("Đã xóa ảnh thành công");
                fetchMedia();
                setShowDetailModal(false);
                onRefresh?.();
            } else {
                const data = await res.json();
                if (data.usedIn) {
                    error(`Không thể xóa - ảnh đang được sử dụng ở ${data.usedIn.length} nơi`);
                } else {
                    error(data.error || 'Lỗi xóa ảnh');
                }
            }
        } catch (err) {
            console.error('Error deleting:', err);
            error('Lỗi xóa ảnh');
        }
    };

    // Update handler
    const handleUpdate = async (updates: Partial<MediaItem>) => {
        if (!selectedMedia) return;

        try {
            const res = await fetch('/api/media', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedMedia.id, ...updates })
            });

            if (res.ok) {
                success('Đã cập nhật');
                fetchMedia();
                setSelectedMedia(prev => prev ? { ...prev, ...updates } : null);
            } else {
                error('Lỗi cập nhật');
            }
        } catch (err) {
            console.error('Error updating:', err);
            error('Lỗi cập nhật');
        }
    };

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Thư viện Media</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý tất cả hình ảnh tập trung. Upload, tìm kiếm và sử dụng trong CMS.
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Icon icon="solar:upload-bold" className="w-5 h-5" />
                    Upload ảnh
                </button>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {FOLDERS.map(folder => (
                        <div
                            key={folder.value}
                            onClick={() => setSelectedFolder(folder.value)}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${selectedFolder === folder.value
                                ? 'bg-blue-100 border-2 border-blue-500'
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon icon={folder.icon} className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-sm">{folder.label}</span>
                            </div>
                            <div className="text-xl font-bold text-gray-900 mt-1">
                                {folder.value === 'all'
                                    ? stats.total
                                    : (stats.byFolder[folder.value] || 0)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Icon
                    icon="solar:magnifer-linear"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên file, alt text, hoặc tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Icon icon="svg-spinners:ring-resize" className="w-8 h-8 text-blue-600" />
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Icon icon="solar:gallery-bold" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Chưa có ảnh nào</h3>
                    <p className="text-gray-500 mt-1">Upload ảnh đầu tiên để bắt đầu</p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Upload ngay
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {media.filter(item => item.variants.full || item.variants.medium || item.variants.thumbnail).map(item => {
                        const imageSrc = item.variants.thumbnail || item.variants.medium || item.variants.full;
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    setSelectedMedia(item);
                                    setShowDetailModal(true);
                                }}
                                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            >
                                {imageSrc ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                        src={imageSrc}
                                        alt={item.alt}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon icon="solar:gallery-broken" className="w-12 h-12 text-gray-300" />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                                    <div className="w-full p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs truncate">{item.filename}</p>
                                        <p className="text-white/70 text-xs">{formatSize(item.size)}</p>
                                    </div>
                                </div>

                                {/* Usage indicator */}
                                {item.usedIn.length > 0 && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-white" />
                                    </div>
                                )}

                                {/* Folder badge */}
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs text-white">
                                    {FOLDERS.find(f => f.value === item.folder)?.label || item.folder}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Upload Modal - Portal to body */}
            {showUploadModal && typeof document !== 'undefined' && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} onClick={() => setShowUploadModal(false)} />
                    <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: 12, boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', zIndex: 100000 }} className="dark:bg-darkgray">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Upload ảnh</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Folder selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thư mục</label>
                                <select
                                    value={selectedFolder === 'all' ? 'general' : selectedFolder}
                                    onChange={(e) => setSelectedFolder(e.target.value as MediaFolder)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {FOLDERS.filter(f => f.value !== 'all').map(folder => (
                                        <option key={folder.value} value={folder.value}>{folder.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Drop zone */}
                            <div
                                ref={dropZoneRef}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                            >
                                <Icon icon="solar:cloud-upload-bold" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">Kéo thả ảnh vào đây</p>
                                <p className="text-gray-400 text-sm mt-1">hoặc click để chọn file</p>
                                <p className="text-gray-400 text-xs mt-3">Hỗ trợ: JPG, PNG, WebP, GIF (Max 10MB)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => e.target.files && handleUpload(e.target.files)}
                                    className="hidden"
                                />
                            </div>

                            {/* Upload progress */}
                            {uploadProgress.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {uploadProgress.map(item => (
                                        <div key={item.file} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700 truncate">{item.file}</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{ width: `${item.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            {item.progress === 100 ? (
                                                <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <span className="text-sm text-gray-500">{item.progress}%</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Detail Modal - Portal to body */}
            {showDetailModal && selectedMedia && typeof document !== 'undefined' && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={() => setShowDetailModal(false)} />
                    <div
                        data-theme="light"
                        className="modern-scrollbar"
                        style={{
                            position: 'relative',
                            backgroundColor: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            width: '100%',
                            maxWidth: 420,
                            maxHeight: '85vh',
                            overflow: 'auto',
                            zIndex: 100000
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#fff',
                            zIndex: 1
                        }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Chi tiết ảnh</span>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                style={{
                                    color: '#9ca3af',
                                    background: 'none',
                                    border: 'none',
                                    padding: 4,
                                    display: 'flex',
                                    cursor: 'pointer'
                                }}
                            >
                                <Icon icon="mdi:close" style={{ width: 20, height: 20 }} />
                            </button>
                        </div>

                        <div style={{ padding: 20 }}>
                            {/* Stacked layout - image on top, info below */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {/* Preview */}
                                <div style={{ textAlign: 'center' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={selectedMedia.variants.medium || selectedMedia.variants.full}
                                        alt={selectedMedia.alt}
                                        style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 8, margin: '0 auto', display: 'block' }}
                                    />
                                    <div style={{ marginTop: 12 }}>
                                        <button
                                            onClick={() => handleDelete(selectedMedia.id)}
                                            style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 8, fontSize: 14, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', cursor: 'pointer' }}
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-5 h-5" />
                                            Xóa ảnh
                                        </button>
                                    </div>
                                </div>

                                {/* Info & Edit */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Tên file</label>
                                        <p style={{ color: '#1f2937', fontWeight: 500, wordBreak: 'break-all' }}>{selectedMedia.filename}</p>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Kích thước</label>
                                            <p style={{ color: '#1f2937' }}>{selectedMedia.dimensions.width} x {selectedMedia.dimensions.height}</p>
                                        </div>
                                        <div>
                                            <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Dung lượng</label>
                                            <p style={{ color: '#1f2937' }}>{formatSize(selectedMedia.size)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Thư mục</label>
                                        <select
                                            value={selectedMedia.folder}
                                            onChange={(e) => handleUpdate({ folder: e.target.value as MediaFolder })}
                                            style={{ color: '#1f2937', backgroundColor: 'white', width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}
                                        >
                                            {FOLDERS.filter(f => f.value !== 'all').map(folder => (
                                                <option key={folder.value} value={folder.value}>{folder.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Alt text (SEO)</label>
                                        <input
                                            type="text"
                                            value={selectedMedia.alt}
                                            onChange={(e) => setSelectedMedia(prev => prev ? { ...prev, alt: e.target.value } : null)}
                                            onBlur={(e) => handleUpdate({ alt: e.target.value })}
                                            style={{ color: '#1f2937', backgroundColor: 'white', width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 4 }}>Caption</label>
                                        <textarea
                                            value={selectedMedia.caption || ''}
                                            onChange={(e) => setSelectedMedia(prev => prev ? { ...prev, caption: e.target.value } : null)}
                                            onBlur={(e) => handleUpdate({ caption: e.target.value })}
                                            rows={2}
                                            style={{ color: '#1f2937', backgroundColor: 'white', width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    {/* Usage info */}
                                    <div>
                                        <label style={{ color: '#4b5563', fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 8 }}>Sử dụng tại</label>
                                        {selectedMedia.usedIn.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                                {selectedMedia.usedIn.map((usage: any, i) => {
                                                    // Format usage display
                                                    const typeLabel = usage.type === 'product' ? 'Sản phẩm'
                                                        : usage.type === 'post' ? 'Bài viết'
                                                            : usage.type === 'gallery' ? 'Thư viện'
                                                                : usage.type === 'slide' ? 'Slide'
                                                                    : usage.type === 'partner' ? 'Đối tác'
                                                                        : usage.type || 'Khác';
                                                    const idDisplay = usage.productId || usage.postId || usage.id || '';

                                                    return (
                                                        <div key={i} style={{
                                                            fontSize: 13,
                                                            backgroundColor: '#059669',
                                                            color: '#ffffff',
                                                            padding: '6px 10px',
                                                            borderRadius: 6,
                                                            fontWeight: 500
                                                        }}>
                                                            {typeLabel}{idDisplay ? ` (ID: ${idDisplay.slice(0, 8)}...)` : ''}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p style={{ color: '#6b7280', fontSize: 14 }}>Chưa được sử dụng</p>
                                        )}
                                    </div>

                                    <div style={{ color: '#6b7280', fontSize: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                                        <p>Tạo lúc: {new Date(selectedMedia.createdAt).toLocaleString('vi-VN')}</p>
                                        <p>Cập nhật: {new Date(selectedMedia.updatedAt).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && typeof document !== 'undefined' && createPortal(
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 16
                }}>
                    <div
                        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setShowDeleteConfirm(null)}
                    />
                    <div
                        data-theme="light"
                        style={{
                            position: 'relative',
                            backgroundColor: 'white',
                            borderRadius: 16,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            width: '100%',
                            maxWidth: 400,
                            padding: 24,
                            textAlign: 'center',
                            zIndex: 1000000
                        }}
                    >
                        {/* Warning Icon */}
                        <div style={{
                            width: 64,
                            height: 64,
                            margin: '0 auto 16px',
                            background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon icon="solar:trash-bin-trash-bold" style={{ width: 32, height: 32, color: '#dc2626' }} />
                        </div>

                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                            Xác nhận xóa ảnh
                        </h3>
                        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.5 }}>
                            Bạn có chắc chắn muốn xóa ảnh này?<br />
                            Hành động này không thể hoàn tác.
                        </p>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    flex: 1,
                                    padding: '12px 20px',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Xóa ảnh
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                className="hidden"
            />
        </div>
    );
}
