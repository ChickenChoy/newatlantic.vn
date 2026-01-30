'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OfficeLocation } from '@/types';

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
      <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center">
        <p className="text-gray-400">Không có thông tin văn phòng</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
          </svg>
          Bản đồ
        </button>
        <button
          onClick={() => setActiveTab('directions')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === 'directions'
              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Chỉ đường
        </button>
      </div>

      {/* Map Container */}
      <AnimatePresence mode="wait">
        {activeTab === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Map Frame - Left side (2/3 width on desktop) */}
            <div className="lg:col-span-2">
              <div className="relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 h-[300px] lg:h-full lg:min-h-[450px]">
                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#050c3a]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                  </div>
                )}
                
                {/* Map Iframe */}
                {selectedOffice && (
                  <iframe
                    src={getMapEmbedUrl(selectedOffice.address, selectedOffice.id)}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(20%) contrast(1.1)' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={handleIframeLoad}
                    className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                  />
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#050c3a]/30 to-transparent" />
              </div>
            </div>

            {/* Office Cards - Right side (1/3 width on desktop) */}
            <div className="space-y-4 lg:overflow-y-auto lg:max-h-[450px] lg:pr-2">
              {displayOffices.map((office, index) => (
                <motion.div
                  key={office.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedOffice(office);
                    setIsLoading(true);
                  }}
                  className={`group p-4 sm:p-5 rounded-3xl cursor-pointer transition-all duration-300 border backdrop-blur-sm ${
                    selectedOffice?.id === office.id
                      ? 'bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-500/50 shadow-xl shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Marker Icon */}
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      selectedOffice?.id === office.id
                        ? 'bg-gradient-to-br from-cyan-500 to-teal-500 shadow-lg shadow-cyan-500/30'
                        : 'bg-white/10 group-hover:bg-white/15'
                    }`}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h4 className="font-bold text-white text-sm sm:text-base truncate">{office.name}</h4>
                        {office.type === 'headquarters' && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 text-[10px] sm:text-xs font-medium rounded-full border border-cyan-500/30">
                            Trụ sở
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2 mb-2">{office.address}</p>
                      {office.phone && (
                        <a
                          href={`tel:${office.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-1 duration-300 mb-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cyan-500/10 flex items-center justify-center">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </span>
                          <span className="font-medium">{office.phone}</span>
                        </a>
                      )}
                      {office.email && (
                        <a
                          href={`mailto:${office.email}`}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-teal-400 hover:text-teal-300 transition-colors group-hover:translate-x-1 duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-teal-500/10 flex items-center justify-center">
                            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </span>
                          <span className="font-medium">{office.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'directions' && (
          <motion.div
            key="directions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {displayOffices.map((office, index) => (
              <motion.a
                key={office.id}
                href={getDirectionsUrl(office)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/15 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{office.name}</h4>
                    {office.type === 'headquarters' && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Trụ sở
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1">{office.address}</p>
                </div>
                <div className="flex-shrink-0 text-cyan-400 group-hover:translate-x-1 transition-transform duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
