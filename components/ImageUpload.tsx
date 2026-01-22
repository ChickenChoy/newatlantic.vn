'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  accept?: string;
  className?: string;
  previewClassName?: string;
  showPreview?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  placeholder = 'Nhập URL hoặc upload hình ảnh',
  accept = 'image/*',
  className = '',
  previewClassName = 'w-20 h-20 object-cover rounded',
  showPreview = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File quá lớn. Tối đa 5MB.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('File không hợp lệ. Vui lòng chọn hình ảnh hoặc video.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onChange(base64);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setError('Có lỗi khi đọc file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('Có lỗi khi upload');
      setIsUploading(false);
    }
  }, [onChange]);

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    onChange(e.target.value);
  }, [onChange]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isBase64 = value?.startsWith('data:');
  const isValidUrl = value && !isBase64 && (value.startsWith('/') || value.startsWith('http'));

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Mode Switcher */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mode === 'url'
              ? 'bg-[#5f7ab8] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            mode === 'upload'
              ? 'bg-[#5f7ab8] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upload
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Preview */}
        {showPreview && value && (isBase64 || isValidUrl) && (
          <div className="flex-shrink-0">
            {value.startsWith('data:video') || value.includes('.mp4') || value.includes('.webm') ? (
              <video
                src={value}
                className={previewClassName}
                muted
                playsInline
              />
            ) : (
              <Image
                src={value}
                alt="Preview"
                width={80}
                height={80}
                className={previewClassName}
                unoptimized={isBase64}
              />
            )}
          </div>
        )}

        <div className="flex-1">
          {mode === 'url' ? (
            <input
              type="text"
              value={value}
              onChange={handleUrlChange}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#5f7ab8] focus:border-transparent"
            />
          ) : (
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang upload...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Chọn file
                  </span>
                )}
              </button>
              {isBase64 && (
                <span className="text-xs text-green-600 font-medium">
                  File đã upload
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {isBase64 && (
        <p className="text-xs text-gray-500">
          Hình ảnh đã được chuyển đổi sang base64
        </p>
      )}
    </div>
  );
}
