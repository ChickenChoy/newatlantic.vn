'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { validateVietnamesePhone } from '@/lib/validation';
import { Catalog } from '@/types';

interface CatalogItem {
  title: string;
  link: string;
  icon?: string;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogItem: CatalogItem | null;
  onSuccess: (link: string) => void;
}

function DownloadModal({ isOpen, onClose, catalogItem, onSuccess }: DownloadModalProps) {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }

    const validation = validateVietnamesePhone(phone);
    if (!validation.valid) {
      setError(validation.error || 'Số điện thoại không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      // Send email via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          phone_number: phone,
          catalog_name: catalogItem?.title || 'Unknown Catalog',
          download_link: catalogItem?.link || '',
          download_time: new Date().toLocaleString('vi-VN'),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );

      // Success - open download link
      onSuccess(catalogItem?.link || '');
      setPhone('');
      onClose();
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container - centered in viewport */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5">
            <h3 className="text-xl font-bold text-white">Tải Catalog</h3>
            <p className="text-green-100 text-sm mt-1">Vui lòng nhập số điện thoại để tiếp tục</p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {catalogItem && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Tài liệu:</p>
                <p className="font-semibold text-gray-900">{catalogItem.title}</p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none text-lg"
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Tải về</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal directly to body, avoiding any parent overflow issues
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}

export default function DownloadCatalogClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState<CatalogItem | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load catalogs from API
  const loadCatalogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/catalogs');
      if (res.ok) {
        const data = await res.json();
        setCatalogs(data.filter((c: Catalog) => c.enabled).sort((a: Catalog, b: Catalog) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error loading catalogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogs();
  }, [loadCatalogs]);

  const handleDownloadClick = (item: CatalogItem) => {
    setSelectedCatalog(item);
    setModalOpen(true);
  };

  const handleDownloadSuccess = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Group catalogs by brand
  const catalogsByBrand = catalogs.reduce((acc, catalog) => {
    const brand = catalog.brand || 'Khác';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(catalog);
    return acc;
  }, {} as Record<string, Catalog[]>);

  // Brand configurations for styling
  const brandConfigs: Record<string, { logo: string; title: string; subtitle: string; gradient: string; iconColor: string; hoverBorder: string; btnHover: string }> = {
    'WILL-BURT': {
      logo: '/images/partner/WillBurt.png',
      title: 'WILL-BURT',
      subtitle: 'Giải pháp cột tự nâng hàng đầu thế giới',
      gradient: 'from-green-700 to-emerald-600',
      iconColor: 'bg-green-500/20 text-green-400 group-hover:bg-green-600',
      hoverBorder: 'hover:border-green-400/30',
      btnHover: 'border-green-500/50 text-green-400 hover:bg-green-600 hover:border-green-600',
    },
    'HIAB': {
      logo: '/images/partner/hiab.png',
      title: 'HIAB',
      subtitle: 'Thiết bị nâng hạ chuyên nghiệp',
      gradient: 'from-gray-900 to-gray-800',
      iconColor: 'bg-gray-500/20 text-gray-300 group-hover:bg-gray-700',
      hoverBorder: 'hover:border-gray-400/30',
      btnHover: 'border-gray-500/50 text-gray-300 hover:bg-gray-700 hover:border-gray-700',
    },
  };

  // Default brand config
  const defaultBrandConfig = {
    logo: '',
    title: '',
    subtitle: 'Danh mục sản phẩm',
    gradient: 'from-blue-700 to-indigo-600',
    iconColor: 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-600',
    hoverBorder: 'hover:border-blue-400/30',
    btnHover: 'border-blue-500/50 text-blue-400 hover:bg-blue-600 hover:border-blue-600',
  };

  if (isLoading) {
    return (
      <div className="space-y-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl h-[400px] animate-pulse"></div>
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl h-[400px] animate-pulse"></div>
      </div>
    );
  }

  if (catalogs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Chưa có catalog</h3>
        <p className="text-gray-400">Vui lòng quay lại sau</p>
      </div>
    );
  }

  return (
    <>
      {Object.entries(catalogsByBrand).map(([brand, brandCatalogs], brandIdx) => {
        const config = brandConfigs[brand] || { ...defaultBrandConfig, title: brand };
        return (
          <section key={brand} className={brandIdx < Object.keys(catalogsByBrand).length - 1 ? 'mb-20' : 'mb-16'}>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl shadow-black/20 overflow-hidden border border-white/10">
              {/* Header */}
              <div className={`bg-gradient-to-r ${config.gradient} px-8 py-10 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    {config.logo && (
                      <div className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <Image
                          src={config.logo}
                          alt={`${config.title} Logo`}
                          width={140}
                          height={70}
                          className="object-contain h-12 w-auto"
                          priority
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{config.title}</h2>
                      <p className="text-white/80 font-medium text-lg">{config.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10">
                <div className={`grid gap-8 ${brandCatalogs.length <= 3 ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
                  {brandCatalogs.map((catalog) => (
                    <div key={catalog.id} className={`group bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/10 hover:shadow-xl ${config.hoverBorder} transition-all duration-300 flex flex-col h-full relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

                      <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 ${config.iconColor} group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm`}>
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-4 group-hover:text-white/80 transition-colors line-clamp-2">
                          {catalog.title}
                        </h3>

                        <div className="mt-auto pt-4 w-full">
                          <button
                            onClick={() => handleDownloadClick({ title: catalog.title, link: catalog.downloadUrl })}
                            className={`flex items-center justify-center w-full px-6 py-3 bg-white/10 backdrop-blur-sm border-2 ${config.btnHover} hover:text-white rounded-xl transition-all duration-300 font-bold group-hover:shadow-lg cursor-pointer`}
                          >
                            <span className="mr-2">TẢI VỀ</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Download Modal */}
      <DownloadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        catalogItem={selectedCatalog}
        onSuccess={handleDownloadSuccess}
      />
    </>
  );
}
