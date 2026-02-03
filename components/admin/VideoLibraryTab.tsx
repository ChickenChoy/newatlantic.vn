'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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

interface VideoLibraryTabProps {
    onRefresh?: () => void;
}

const FOLDERS = [
    { value: 'hero', label: 'Hero Slides', icon: 'solar:video-frame-bold' },
    { value: 'general', label: 'Khác', icon: 'solar:folder-bold' },
];

export default function VideoLibraryTab({ onRefresh }: VideoLibraryTabProps) {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
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
            toast.error('Không thể tải danh sách video');
        } finally {
            setLoading(false);
        }
    }, [selectedFolder, toast]);

    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    // Upload handler
    const handleUpload = async (files: FileList) => {
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('video/')
        );

        if (validFiles.length === 0) {
            toast.error('Chỉ chấp nhận file video (MP4, WebM, OGG)');
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('folder', selectedFolder || 'general');
                formData.append('title', file.name);

                // Simulate progress for better UX
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => Math.min(prev + 10, 90));
                }, 500);

                const response = await fetch('/api/video-upload', {
                    method: 'POST',
                    body: formData,
                });

                clearInterval(progressInterval);
                setUploadProgress(100);

                if (response.ok) {
                    const result = await response.json();
                    toast.success(`Đã upload: ${file.name}`);
                } else {
                    const error = await response.json();
                    toast.error(error.error || 'Upload thất bại');
                }
            } catch (error) {
                console.error('Upload error:', error);
                toast.error(`Lỗi upload: ${file.name}`);
            }
        }

        setUploading(false);
        setUploadProgress(0);
        loadVideos();
        onRefresh?.();
    };

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    }, [handleUpload]);

    // Delete video
    const handleDelete = async (path: string) => {
        try {
            const response = await fetch(`/api/video-upload?path=${encodeURIComponent(path)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Đã xóa video');
                setDeleteConfirm(null);
                setSelectedVideo(null);
                loadVideos();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Xóa thất bại');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Lỗi khi xóa video');
        }
    };

    // Copy URL to clipboard
    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success('Đã copy URL');
    };

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon icon="solar:video-library-bold" className="text-2xl text-blue-500" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Thư viện Video
                    </h2>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <Icon icon="solar:upload-bold" />
                    Upload Video
                </button>
            </div>

            {/* Folder Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedFolder('')}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFolder === ''
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                    <Icon icon="solar:gallery-bold" />
                    Tất cả
                </button>
                {FOLDERS.map(folder => (
                    <button
                        key={folder.value}
                        onClick={() => setSelectedFolder(folder.value)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${selectedFolder === folder.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        <Icon icon={folder.icon} />
                        {folder.label}
                    </button>
                ))}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
            />

            {/* Upload Progress */}
            {uploading && (
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Icon icon="solar:upload-bold" className="text-blue-500 animate-bounce" />
                        <span className="text-blue-700 dark:text-blue-300">Đang upload...</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Drop Zone */}
            <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }`}
            >
                <Icon
                    icon="solar:videocamera-record-bold"
                    className={`text-5xl mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
                />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Kéo thả video vào đây hoặc
                </p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                >
                    chọn file từ máy tính
                </button>
                <p className="text-sm text-gray-500 mt-2">
                    Hỗ trợ: MP4, WebM, OGG (tối đa 50MB)
                </p>
            </div>

            {/* Video Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Icon icon="solar:refresh-bold-duotone" className="text-3xl text-blue-500 animate-spin" />
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <Icon icon="solar:video-frame-cut-bold-duotone" className="text-5xl mx-auto mb-4 opacity-50" />
                    <p>Chưa có video nào</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video) => (
                        <div
                            key={video.id || video.path}
                            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Video Preview */}
                            <div className="relative aspect-video bg-black">
                                <video
                                    src={video.url}
                                    className="w-full h-full object-contain"
                                    preload="metadata"
                                    onClick={() => setSelectedVideo(video)}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setSelectedVideo(video)}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
                                        title="Xem"
                                    >
                                        <Icon icon="solar:play-bold" className="text-xl" />
                                    </button>
                                    <button
                                        onClick={() => copyUrl(video.url)}
                                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
                                        title="Copy URL"
                                    >
                                        <Icon icon="solar:copy-bold" className="text-xl" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(video.path)}
                                        className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-full text-white"
                                        title="Xóa"
                                    >
                                        <Icon icon="solar:trash-bin-trash-bold" className="text-xl" />
                                    </button>
                                </div>
                            </div>

                            {/* Video Info */}
                            <div className="p-3">
                                <p className="font-medium text-gray-800 dark:text-white truncate" title={video.name}>
                                    {video.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatSize(video.size)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Video Preview Modal */}
            {selectedVideo && createPortal(
                <div
                    className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                {selectedVideo.name}
                            </h3>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <Icon icon="solar:close-circle-bold" className="text-xl" />
                            </button>
                        </div>
                        <div className="aspect-video bg-black">
                            <video
                                src={selectedVideo.url}
                                controls
                                autoPlay
                                className="w-full h-full"
                            />
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>URL:</span>
                                <code className="flex-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate">
                                    {selectedVideo.url}
                                </code>
                                <button
                                    onClick={() => copyUrl(selectedVideo.url)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                >
                                    <Icon icon="solar:copy-bold" />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setDeleteConfirm(selectedVideo.path)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg"
                                >
                                    <Icon icon="solar:trash-bin-trash-bold" />
                                    Xóa video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirm Modal */}
            {deleteConfirm && createPortal(
                <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <Icon icon="solar:trash-bin-trash-bold" className="text-2xl text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                    Xác nhận xóa
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Bạn có chắc muốn xóa video này?
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
