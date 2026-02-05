'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { MediaItem, MediaFolder } from '@/types';

interface MediaPickerProps {
    value?: string; // Current image URL or base64
    onChange: (imageBase64: string, mediaItem?: MediaItem) => void;
    label?: string;
    placeholder?: string;
    folder?: MediaFolder;
    className?: string;
    aspectRatio?: 'square' | 'video' | 'auto';
}

export default function MediaPicker({
    value,
    onChange,
    label = 'Hình ảnh',
    placeholder = 'Chọn hoặc upload ảnh',
    folder = 'general',
    className = '',
    aspectRatio = 'auto'
}: MediaPickerProps) {
    const [showModal, setShowModal] = useState(false);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState<MediaFolder | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);

    const FOLDERS = [
        { value: 'all', label: 'Tất cả', icon: 'solar:gallery-line-duotone' },
        { value: 'products', label: 'Sản phẩm', icon: 'solar:box-line-duotone' },
        { value: 'posts', label: 'Tin tức', icon: 'solar:document-text-line-duotone' },
        { value: 'gallery', label: 'Thư viện', icon: 'solar:gallery-wide-line-duotone' },
        { value: 'partners', label: 'Đối tác', icon: 'solar:users-group-rounded-line-duotone' },
        { value: 'slides', label: 'Slides', icon: 'solar:slider-horizontal-line-duotone' },
        { value: 'seo', label: 'SEO', icon: 'solar:graph-up-line-duotone' },
        { value: 'general', label: 'Khác', icon: 'solar:folder-line-duotone' },
    ];

    // Fetch media
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
        } catch (err) {
            console.error('Error fetching media:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedFolder, searchQuery]);

    useEffect(() => {
        if (showModal) {
            fetchMedia();
        }
    }, [showModal, fetchMedia]);

    // Handle image upload
    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            // Resize and convert to WebP
            const processedBlob = await resizeImage(file, 1200);
            const base64 = await blobToBase64(processedBlob);

            // Get dimensions
            const dimensions = await getImageDimensions(base64);

            // Create thumbnail
            const thumbnailBlob = await resizeImage(file, 150, 150);
            const thumbnailBase64 = await blobToBase64(thumbnailBlob);

            // Create medium
            const mediumBlob = await resizeImage(file, 800);
            const mediumBase64 = await blobToBase64(mediumBlob);

            // Upload to API
            const response = await fetch('/api/media', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name.replace(/\.[^/.]+$/, '.webp'),
                    originalName: file.name,
                    folder: folder,
                    mimeType: 'image/webp',
                    size: processedBlob.size,
                    dimensions,
                    variants: {
                        thumbnail: thumbnailBase64,
                        medium: mediumBase64,
                        full: base64
                    },
                    alt: file.name.replace(/\.[^/.]+$/, ''),
                    tags: []
                })
            });

            if (response.ok) {
                const newMedia = await response.json();
                onChange(mediumBase64, newMedia);
                setShowModal(false);
            }
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    // Select media from library
    const handleSelect = (item: MediaItem) => {
        onChange(item.variants.medium || item.variants.full, item);
        setShowModal(false);
    };

    // Clear selected image
    const handleClear = () => {
        onChange('');
    };

    // Helper functions
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

                if (maxHeight) {
                    // Square crop for thumbnails
                    const size = Math.min(width, height);
                    const sx = (width - size) / 2;
                    const sy = (height - size) / 2;

                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, sx, sy, size, size, 0, 0, maxWidth, maxHeight);
                } else {
                    // Proportional resize
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                }

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error('Failed to create blob'));
                    },
                    'image/webp',
                    0.85
                );
            };

            img.onerror = reject;
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = base64;
        });
    }

    const aspectRatioClass = aspectRatio === 'square' ? 'aspect-square' :
        aspectRatio === 'video' ? 'aspect-video' :
            'min-h-[80px]';

    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-bodytext dark:text-white mb-2">
                    {label}
                </label>
            )}

            {/* Preview or Placeholder */}
            <div
                onClick={() => setShowModal(true)}
                className={`relative border-2 border-dashed border-border dark:border-darkborder rounded-lg cursor-pointer hover:border-primary transition-colors overflow-visible ${value ? 'w-fit' : aspectRatioClass}`}
            >
                {value ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={value}
                            alt="Selected"
                            className="w-auto h-auto max-w-[150px] max-h-[120px] object-contain block"
                        />
                        {/* Change button overlay - behind clear button */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                            <span className="text-white font-medium text-sm">Đổi ảnh</span>
                        </div>
                        {/* Clear button - on top */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleClear();
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10 shadow-md"
                        >
                            <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6 text-muted">
                        <Icon icon="solar:gallery-add-line-duotone" className="w-10 h-10 mb-2" />
                        <span className="text-sm">{placeholder}</span>
                    </div>
                )}
            </div>

            {/* Media Picker Modal */}
            {showModal && typeof document !== 'undefined' && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)' }} onClick={() => setShowModal(false)} />
                    <div style={{ position: 'relative', backgroundColor: 'white', borderRadius: 12, boxShadow: 'rgba(0, 0, 0, 0.25) 0px 25px 50px -12px', width: '100%', maxWidth: 900, maxHeight: '85vh', display: 'flex', flexDirection: 'column', zIndex: 100000 }} className="dark:bg-darkgray">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-darkborder flex items-center justify-between flex-shrink-0">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chọn ảnh từ thư viện</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-200 dark:border-darkborder flex flex-wrap gap-3 flex-shrink-0">
                            {/* Upload button */}
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                                <Icon icon="solar:upload-linear" className="w-5 h-5" />
                                <span className="text-sm font-medium">{uploading ? 'Đang upload...' : 'Upload mới'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>

                            {/* Folder filter */}
                            <select
                                value={selectedFolder}
                                onChange={(e) => setSelectedFolder(e.target.value as MediaFolder | 'all')}
                                className="px-3 py-2 border border-gray-300 dark:border-darkborder rounded-lg text-sm text-gray-700 dark:text-white dark:bg-darkgray"
                            >
                                {FOLDERS.map(f => (
                                    <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                            </select>

                            {/* Search */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Icon icon="solar:magnifer-line-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-darkborder rounded-lg text-sm text-gray-700 dark:text-white dark:bg-darkgray"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : media.length === 0 ? (
                                <div className="text-center py-12">
                                    <Icon icon="solar:gallery-line-duotone" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Chưa có ảnh nào</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                    {media.filter(item => item.variants.thumbnail || item.variants.medium || item.variants.full).map(item => {
                                        const imageSrc = item.variants.thumbnail || item.variants.medium || item.variants.full;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelect(item)}
                                                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                                            >
                                                {imageSrc && (
                                                    /* eslint-disable-next-line @next/next/no-img-element */
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.alt}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <Icon icon="solar:check-circle-bold" className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
