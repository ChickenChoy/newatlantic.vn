'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { validateVietnamesePhone } from '@/lib/validation';
import { Catalog } from '@/types';
import { Eyebrow, ArrowButton } from '@/components/sections';
import EmptyState from '@/components/EmptyState';
import StaggerGroup from '@/components/motion/StaggerGroup';
import Reveal from '@/components/motion/Reveal';

const DOC_ICON_PATH =
  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';

const DOWNLOAD_ICON_PATH = 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4';

function Icon({ path, className = 'h-6 w-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  );
}

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

  // Close on Escape, the same affordance the gallery lightbox offers
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-[9999] overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="download-modal-title">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-navy/80" onClick={onClose} />

      {/* Modal Container - centered in viewport */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center p-4">
        <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-card bg-background shadow-2xl">
          {/* Header */}
          <div className="bg-navy px-6 py-6 pr-16 md:px-8">
            <h3
              id="download-modal-title"
              className="font-display text-d5 uppercase leading-display tracking-display text-white"
            >
              Tải catalog
            </h3>
            <p className="mt-2 text-sm leading-[1.6] text-white/80">
              Nhập số điện thoại để chúng tôi gửi kèm hỗ trợ kỹ thuật khi cần.
            </p>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {catalogItem && (
              <div className="mb-6 rounded-r-card border-l-4 border-l-accent bg-surface px-5 py-4">
                <p className="text-sm text-ink">Tài liệu</p>
                <p className="mt-1 font-semibold text-navy">{catalogItem.title}</p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-navy">
                Số điện thoại <span className="text-accent">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'phone-error' : undefined}
                className="w-full rounded-card border border-navy/14 bg-surface px-5 py-3 text-base text-navy outline-none transition-colors duration-300 ease-brand placeholder:text-muted focus:border-accent disabled:opacity-60"
                disabled={isLoading}
              />
              {error && (
                <p id="phone-error" className="mt-2 text-sm text-accent">
                  {error}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-pill border border-navy/14 bg-transparent px-6 py-3 text-sm font-semibold text-navy transition-colors duration-300 ease-brand hover:border-navy disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
              >
                Hủy
              </button>
              <ArrowButton type="submit" variant="accent" disabled={isLoading} full className="sm:flex-1">
                {isLoading ? 'Đang xử lý...' : 'Tải về'}
              </ArrowButton>
            </div>
          </form>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-pill bg-white/10 text-white transition-colors duration-300 ease-brand hover:bg-accent"
          >
            <Icon path="M6 18L18 6M6 6l12 12" className="h-5 w-5" />
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

/** Brand identity for the groups the CMS ships today. */
const BRAND_CONFIGS: Record<string, { logo: string; subtitle: string }> = {
  'WILL-BURT': {
    logo: '/images/partner/WillBurt.png',
    subtitle: 'Giải pháp cột tự nâng hàng đầu',
  },
  HIAB: {
    logo: '/images/partner/hiab.png',
    subtitle: 'Thiết bị nâng hạ chuyên nghiệp',
  },
};

const DEFAULT_SUBTITLE = 'Danh mục sản phẩm';

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

  if (isLoading) {
    return (
      <div className="space-y-16">
        {[...Array(2)].map((_, group) => (
          <div key={group} className="animate-pulse">
            <div className="mb-10 flex items-center gap-6 border-b border-navy/14 pb-8">
              <div className="h-20 w-40 rounded-card bg-navy/14" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-1/3 rounded-card bg-navy/14" />
                <div className="h-4 w-1/2 rounded-card bg-navy/14" />
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, card) => (
                <div key={card} className="h-64 rounded-card border border-navy/14 bg-surface" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (catalogs.length === 0) {
    return (
      <EmptyState
        icon={<Icon path={DOC_ICON_PATH} className="h-20 w-20 text-navy/14" />}
        title="Chưa có catalog"
        description="Tài liệu đang được cập nhật. Liên hệ với chúng tôi để nhận catalog trực tiếp qua email."
        actionLabel="Liên hệ nhận tài liệu"
        actionHref="/lien-he"
      />
    );
  }

  const brandEntries = Object.entries(catalogsByBrand);

  return (
    <>
      <div className="space-y-20">
        {brandEntries.map(([brand, brandCatalogs]) => {
          const config = BRAND_CONFIGS[brand];
          return (
            <section key={brand} aria-labelledby={`brand-${brand}`}>
              {/* Brand header */}
              <Reveal className="mb-12 flex flex-col gap-6 border-b border-navy/14 pb-8 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  {config?.logo && (
                    <div className="flex h-20 w-40 shrink-0 items-center justify-center rounded-card border border-navy/14 bg-background p-4">
                      <Image
                        src={config.logo}
                        alt={`Logo ${brand}`}
                        width={140}
                        height={70}
                        className="h-12 w-auto object-contain"
                        priority
                      />
                    </div>
                  )}
                  <div>
                    <h2
                      id={`brand-${brand}`}
                      className="font-display text-d4 uppercase leading-display tracking-display text-navy"
                    >
                      {brand}
                    </h2>
                    <p className="mt-3 text-base leading-[1.6] text-ink">
                      {config?.subtitle ?? DEFAULT_SUBTITLE}
                    </p>
                  </div>
                </div>

                <Eyebrow>
                  {brandCatalogs.length} tài liệu
                </Eyebrow>
              </Reveal>

              {/* Catalog cards */}
              <StaggerGroup
                className={`grid gap-8 md:grid-cols-2 ${
                  brandCatalogs.length <= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
                }`}
                stagger={70}
              >
                {brandCatalogs.map((catalog) => (
                  <div
                    key={catalog.id}
                    className="group flex h-full flex-col rounded-card border border-navy/14 bg-background p-8 transition-colors duration-300 ease-brand hover:border-navy/30"
                  >
                    <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-pill bg-accent text-white transition-transform duration-300 ease-brand group-hover:scale-105">
                      <Icon path={DOC_ICON_PATH} />
                    </span>

                    <h3 className="font-display mb-3 text-d5 uppercase leading-display tracking-display text-navy">
                      {catalog.title}
                    </h3>

                    {catalog.description && (
                      <p className="text-base leading-[1.6] text-ink">{catalog.description}</p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadClick({ title: catalog.title, link: catalog.downloadUrl })
                      }
                      className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-navy transition-colors duration-300 ease-brand group-hover:text-accent"
                    >
                      Tải về
                      <Icon
                        path={DOWNLOAD_ICON_PATH}
                        className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-y-0.5"
                      />
                    </button>
                  </div>
                ))}
              </StaggerGroup>
            </section>
          );
        })}
      </div>

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
