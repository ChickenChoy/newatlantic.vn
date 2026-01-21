'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { validateVietnamesePhone } from '@/lib/validation';

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

  const handleDownloadClick = (item: CatalogItem) => {
    setSelectedCatalog(item);
    setModalOpen(true);
  };

  const handleDownloadSuccess = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const willBurtCatalogs: CatalogItem[] = [
    {
      title: "Military elevation solution and tactical trailers",
      link: "https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    },
    {
      title: "Telecommunication elevation solutions",
      link: "https://drive.google.com/file/d/1AQdNA8nPMgUg3_t5QLA1pdWoRDebq7Ho/view",
      icon: "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    },
    {
      title: "Military elevation solut. & tactical trailers 2",
      link: "https://drive.google.com/file/d/1v_Radki2cjTFfQjbZ2-od73xzmEqDY6O/view",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    }
  ];

  const hiabCatalogs: CatalogItem[] = [
    {
      title: "All-electric Moffet E-Series nx",
      link: "https://drive.google.com/file/d/14Sa2lMixNqNVUUfrxO_3IDcQ9BqG9G4_/view"
    },
    {
      title: "Deliver More HIAB MOFFET",
      link: "https://drive.google.com/file/d/1meoPLNJcUQEtn4TKctweJLNR4Plzdt96/view"
    },
    {
      title: "The New MOFFET 4 NX",
      link: "https://drive.google.com/file/d/1IYD6hloU8_dalTgkSZXHuCNGjqJMrBXN/view"
    },
    {
      title: "Xe nâng gắn xe tải MOFFET",
      link: "https://publuu.com/flip-book/180051/1141767"
    }
  ];

  return (
    <>
      {/* Will-Burt Catalog Section */}
      <section className="mb-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-8 py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/partner/WillBurt.png"
                    alt="Will-Burt Logo"
                    width={140}
                    height={70}
                    className="object-contain h-12 w-auto"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">WILL-BURT</h2>
                  <p className="text-green-100 font-medium text-lg">Giải pháp cột tự nâng hàng đầu thế giới</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {willBurtCatalogs.map((item, idx) => (
                <div key={idx} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

                  <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                      </svg>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="mt-auto pt-4 w-full">
                      <button
                        onClick={() => handleDownloadClick(item)}
                        className="flex items-center justify-center w-full px-6 py-3 bg-white border-2 border-green-600 text-green-700 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 font-bold group-hover:shadow-lg cursor-pointer"
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

      {/* Hiab Catalog Section */}
      <section className="mb-16">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10 mix-blend-overlay"></div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/images/partner/hiab.png"
                    alt="Hiab Logo"
                    width={140}
                    height={70}
                    className="object-contain h-12 w-auto"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">HIAB</h2>
                  <p className="text-gray-300 font-medium text-lg">Thiết bị nâng hạ chuyên nghiệp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 bg-gradient-to-b from-white to-gray-50">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {hiabCatalogs.map((item, idx) => (
                <div key={idx} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-500"></div>

                  <div className="relative z-10 flex-1 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300 shadow-sm">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="mt-auto pt-4 w-full">
                      <button
                        onClick={() => handleDownloadClick(item)}
                        className="flex items-center justify-center w-full px-6 py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-xl hover:bg-gray-800 hover:text-white transition-all duration-300 font-bold group-hover:shadow-lg cursor-pointer"
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
