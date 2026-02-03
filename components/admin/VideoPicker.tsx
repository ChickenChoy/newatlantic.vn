'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { useToast } from '@/components/ToastProvider';

interface VideoItem {
    id: string;
    name: string;
    path: string;
    url: string;
    size: number;
    mimeType: string;
    createdAt: string;
}

interface VideoPickerProps {
    value?: string;
    onChange: (url: string) => void;
    placeholder?: string;
    className?: string;
}

const FOLDERS = [
    { value: '', label: 'Tất cả', icon: 'solar:gallery-bold' },
    { value: 'hero', label: 'Hero', icon: 'solar:video-frame-bold' },
    { value: 'general', label: 'Khác', icon: 'solar:folder-bold' },
];

export default function VideoPicker({ value, onChange, placeholder = 'Chọn video...', className = '' }: VideoPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [uploading, setUploading] = useState(false);
    const [externalUrl, setExternalUrl] = useState('');
    const [showExternalInput, setShowExternalInput] = useState(false);
    const toast = useToast();

    // Load videos
    const loadVideos = useCallback(async () => {
        setLoading(true);
        try {
            const url = selectedFolder
                ? `/api/video-upload?folder=${selectedFolder}`
                : '/api/video-upload';
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setVideos(data || []);
            }
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            setLoading(false);
        }
    }, [selectedFolder]);

    useEffect(() => {
        if (isOpen) {
            loadVideos();
        }
    }, [isOpen, loadVideos]);

    // Handle file upload
    const handleUpload = async (files: FileList) => {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('video/')
        );

        if (validFiles.length === 0) {
            toast.error('Chỉ chấp nhận file video (MP4, WebM, OGG)');
            return;
        }

        setUploading(true);
        const file = validFiles[0];

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', selectedFolder || 'hero');
            formData.append('title', file.name);

            const response = await fetch('/api/video-upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Upload video thành công!');
                // Select the uploaded video
                onChange(result.url);
                setIsOpen(false);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Upload thất bại');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Lỗi upload video');
        } finally {
            setUploading(false);
        }
    };

    // Select video
    const handleSelect = (video: VideoItem) => {
        onChange(video.url);
        setIsOpen(false);
    };

    // Clear selection
    const handleClear = () => {
        onChange('');
    };

    // Apply external URL
    const handleApplyExternalUrl = () => {
        if (!externalUrl.trim()) {
            toast.error('Vui lòng nhập URL video');
            return;
        }
        // Basic URL validation
        if (!externalUrl.match(/^https?:\/\/.+/)) {
            toast.error('URL không hợp lệ');
            return;
        }
        onChange(externalUrl.trim());
        setExternalUrl('');
        setShowExternalInput(false);
        setIsOpen(false);
        toast.success('Đã áp dụng URL video');
    };

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <>
            {/* Trigger Button */}
            <div className={`relative max-w-[200px] ${className}`}>
                {value ? (
                    <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {/* Video Preview */}
                        <video
                            src={value}
                            className="w-full h-[120px] object-cover"
                            muted
                            preload="metadata"
                        />
                        {/* Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(true)}
                                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white"
                                title="Đổi video"
                            >
                                <Icon icon="solar:refresh-bold" className="text-lg" />
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1.5 bg-red-500/50 hover:bg-red-500/70 rounded-full text-white"
                                title="Xóa"
                            >
                                <Icon icon="solar:trash-bin-trash-bold" className="text-lg" />
                            </button>
                        </div>
                        {/* URL Display */}
                        <div className="p-1.5 text-xs text-gray-500 truncate">
                            {value.split('/').pop()}
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="w-full h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 transition-colors flex flex-col items-center justify-center gap-1 text-gray-500"
                    >
                        <Icon icon="solar:videocamera-record-bold" className="text-2xl" />
                        <span className="text-xs">{placeholder}</span>
                    </button>
                )}
            </div>

            {/* Modal */}
            {isOpen && createPortal(
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:video-library-bold" className="text-2xl text-blue-500" />
                                <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                                    Chọn Video
                                </h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <Icon icon="solar:close-circle-bold" className="text-xl" />
                            </button>
                        </div>

                        {/* Toolbar */}
                        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between gap-4 flex-wrap">
                            {/* Folder Filter */}
                            <div className="flex gap-2 flex-wrap">
                                {FOLDERS.map(folder => (
                                    <button
                                        key={folder.value}
                                        onClick={() => setSelectedFolder(folder.value)}
                                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${selectedFolder === folder.value
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                            }`}
                                    >
                                        <Icon icon={folder.icon} />
                                        {folder.label}
                                    </button>
                                ))}
                            </div>

                            {/* Upload Button */}
                            <div className="flex gap-2">
                                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors" style={{ color: '#ffffff' }}>
                                    <Icon icon={uploading ? "solar:refresh-bold-duotone" : "solar:upload-bold"} className={`${uploading ? "animate-spin" : ""} text-white`} />
                                    <span className="text-white">{uploading ? 'Đang upload...' : 'Upload (≤50MB)'}</span>
                                    <input
                                        type="file"
                                        accept="video/mp4,video/webm,video/ogg"
                                        className="hidden"
                                        disabled={uploading}
                                        onChange={(e) => e.target.files && handleUpload(e.target.files)}
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowExternalInput(!showExternalInput)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showExternalInput
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon icon="solar:link-bold" />
                                    URL ngoài
                                </button>
                            </div>
                        </div>

                        {/* External URL Input */}
                        {showExternalInput && (
                            <div className="px-4 py-3 bg-green-50 dark:bg-green-900/20 border-b dark:border-gray-700">
                                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                                    <Icon icon="solar:info-circle-bold" className="inline mr-1" />
                                    Dùng cho video lớn (&gt;50MB): YouTube, Cloudinary, CDN...
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={externalUrl}
                                        onChange={(e) => setExternalUrl(e.target.value)}
                                        placeholder="https://example.com/video.mp4"
                                        className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyExternalUrl}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                                    >
                                        <Icon icon="solar:check-circle-bold" />
                                        Áp dụng
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Video Grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Icon icon="solar:refresh-bold-duotone" className="text-3xl text-blue-500 animate-spin" />
                                </div>
                            ) : videos.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Icon icon="solar:video-frame-cut-bold-duotone" className="text-5xl mx-auto mb-4 opacity-50" />
                                    <p>Chưa có video nào</p>
                                    <p className="text-sm mt-2">Upload video mới để bắt đầu</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {videos.map((video) => (
                                        <button
                                            key={video.id || video.path}
                                            onClick={() => handleSelect(video)}
                                            className={`group relative bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden text-left transition-all hover:ring-2 hover:ring-blue-500 ${value === video.url ? 'ring-2 ring-blue-600' : ''
                                                }`}
                                        >
                                            <div className="aspect-video bg-black">
                                                <video
                                                    src={video.url}
                                                    className="w-full h-full object-contain"
                                                    preload="metadata"
                                                    muted
                                                />
                                            </div>
                                            {/* Selected indicator */}
                                            {value === video.url && (
                                                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Icon icon="solar:check-circle-bold" className="text-white" />
                                                </div>
                                            )}
                                            <div className="p-2">
                                                <p className="text-xs font-medium text-gray-800 dark:text-white truncate">
                                                    {video.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatSize(video.size)}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                {videos.length} video trong thư viện
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
