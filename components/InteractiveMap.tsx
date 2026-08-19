'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { OfficeLocation } from '@/types';

const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

interface InteractiveMapProps {
  offices: OfficeLocation[];
}

// Sample fallback offices if none provided
const fallbackOffices: OfficeLocation[] = [
  {
    id: '1',
    name: 'Trụ sở chính - TP.HCM',
    address: 'A60 Đường Phú Thuận, P. Phú Thuận, Q.7, TP.HCM',
    phone: '+84 28 3873 3686',
    email: 'info@newatlantic.vn',
    type: 'headquarters',
    order: 1,
    region: 'south',
    directionsUrl: '',
  },
  {
    id: '2',
    name: 'Chi nhánh - Hà Nội',
    address: 'Số 15 ngõ 76 Nguyễn Chí Thanh, Phường Láng Thượng, Quận Đống Đa, Hà Nội',
    phone: '+84 24 3795 8368',
    email: 'hanoi@newatlantic.vn',
    type: 'branch',
    order: 2,
    region: 'north',
    directionsUrl: '',
  },
];

export default function InteractiveMap({ offices }: InteractiveMapProps) {
  const [selectedOffice, setSelectedOffice] = useState<OfficeLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'directions'>('map');
  const [isLoading, setIsLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  // Use provided offices or fallback
  const displayOffices = offices.length > 0 ? offices : fallbackOffices;

  // Set first office as selected on mount
  useEffect(() => {
    if (displayOffices.length > 0 && !selectedOffice) {
      setSelectedOffice(displayOffices[0]);
    }
  }, [displayOffices, selectedOffice]);

  const getDirectionsUrl = (office: OfficeLocation) => {
    // Use custom directions URL if provided, otherwise generate from address
    if (office.directionsUrl) {
      return office.directionsUrl;
    }
    const query = encodeURIComponent(`${office.name}, ${office.address}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  const getMapEmbedUrl = (address: string, officeId?: string): string => {
    // Use specific embed URL for TP.HCM headquarters
    if (officeId === '1' || address.includes('Phú Thuận')) {
      return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1222.4606233726392!2d106.7348257696231!3d10.731340799338442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175256fcd089315%3A0x55b22ce70100ac4!2zMzMgxJAuIFBow7ogVGh14bqtbiwgS2h1IEJp4buHdCB0aOG7sSBU4bqlbiBUcsaw4budbmcsIFF14bqtbiA3LCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmggNzAwMDAwLCBWaWV0bmFt!5e1!3m2!1sen!2suk!4v1769745342544!5m2!1sen!2suk';
    }
    // Fallback for other offices
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (displayOffices.length === 0) {
    return (
      <div className="rounded-card border border-navy/14 bg-background p-12 text-center">
        <p className="text-sm text-muted">Không có thông tin văn phòng</p>
      </div>
    );
  }

  const tabClass = (isActive: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-pill px-4 py-3 text-sm font-semibold transition-colors duration-300 ease-brand ${
      isActive ? 'bg-navy text-white' : 'text-ink hover:text-navy'
    }`;

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-2 rounded-pill border border-navy/14 bg-background p-1">
        <button
          onClick={() => setActiveTab('map')}
          aria-pressed={activeTab === 'map'}
          className={tabClass(activeTab === 'map')}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
          </svg>
          Bản đồ
        </button>
        <button
          onClick={() => setActiveTab('directions')}
          aria-pressed={activeTab === 'directions'}
          className={tabClass(activeTab === 'directions')}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Chỉ đường
        </button>
      </div>

      {/* Map Container */}
      <AnimatePresence mode="wait">
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: EASE_BRAND }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {/* Map Frame - Left side (2/3 width on desktop) */}
            <div className="lg:col-span-2">
              <div className="relative h-[300px] overflow-hidden rounded-card border border-navy/14 bg-background lg:h-full lg:min-h-[450px]">
                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <div className="h-12 w-12 animate-spin rounded-pill border-2 border-navy/14 border-t-accent" />
                  </div>
                )}

                {/* Map Iframe */}
                {selectedOffice && (
                  <iframe
                    src={getMapEmbedUrl(selectedOffice.address, selectedOffice.id)}
                    title={`Bản đồ ${selectedOffice.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(30%) contrast(1.05)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={handleIframeLoad}
                    className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  />
                )}
              </div>
            </div>

            {/* Office Cards - Right side (1/3 width on desktop) */}
            <div className="space-y-4 lg:max-h-[450px] lg:overflow-y-auto lg:pr-2">
              {displayOffices.map((office) => {
                const isActive = selectedOffice?.id === office.id;
                return (
                  <button
                    key={office.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setSelectedOffice(office);
                      setIsLoading(true);
                    }}
                    className={`group w-full rounded-card border p-6 text-left transition-colors duration-300 ease-brand ${
                      isActive
                        ? 'border-navy bg-navy'
                        : 'border-navy/14 bg-background hover:border-navy'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Marker Icon */}
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-pill transition-colors duration-300 ease-brand ${
                          isActive ? 'bg-accent text-white' : 'bg-surface text-accent'
                        }`}
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`font-display text-base uppercase leading-none tracking-display ${
                              isActive ? 'text-white' : 'text-navy'
                            }`}
                          >
                            {office.name}
                          </h4>
                          {office.type === 'headquarters' && (
                            <span
                              className={`rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                isActive ? 'bg-white/14 text-white' : 'bg-accent/10 text-accent'
                              }`}
                            >
                              Trụ sở
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-2 line-clamp-2 text-sm leading-[1.6] ${
                            isActive ? 'text-white/60' : 'text-ink'
                          }`}
                        >
                          {office.address}
                        </p>

                        {/* `break-words` on both: the wrapper above is
                            `min-w-0 flex-1`, so it correctly shrinks with the
                            column — which means an unbreakable value (an email,
                            or a phone saved without spaces from the admin) would
                            overflow it and cross the card edge. */}
                        <div className="mt-3 space-y-1.5">
                          {office.phone && (
                            <a
                              href={`tel:${office.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className={`block break-words text-sm font-semibold transition-colors duration-300 ease-brand hover:text-accent ${
                                isActive ? 'text-white' : 'text-navy'
                              }`}
                            >
                              {office.phone}
                            </a>
                          )}
                          {office.email && (
                            <a
                              href={`mailto:${office.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className={`block break-words text-sm transition-colors duration-300 ease-brand hover:text-accent ${
                                isActive ? 'text-white/60' : 'text-muted'
                              }`}
                            >
                              {office.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === 'directions' && (
          <motion.div
            key="directions"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: EASE_BRAND }}
            className="space-y-4"
          >
            {displayOffices.map((office) => (
              <a
                key={office.id}
                href={getDirectionsUrl(office)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 rounded-card border border-navy/14 bg-background p-6 transition-colors duration-300 ease-brand hover:border-navy"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-surface text-accent transition-colors duration-300 ease-brand group-hover:bg-accent group-hover:text-white">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base uppercase leading-none tracking-display text-navy">
                      {office.name}
                    </span>
                    {office.type === 'headquarters' && (
                      <span className="rounded-pill bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
                        Trụ sở
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block line-clamp-1 text-sm text-ink">{office.address}</span>
                </span>

                <span className="shrink-0 text-navy transition-transform duration-300 ease-brand group-hover:translate-x-1">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
