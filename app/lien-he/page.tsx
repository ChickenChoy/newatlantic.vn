'use client';

import { useState, useEffect, useCallback } from 'react';
import HolidayBanner from '@/components/HolidayBanner';
import InteractiveMap from '@/components/InteractiveMap';
import type { OfficeLocation } from '@/types';

export default function ContactPage() {
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [isLoadingOffices, setIsLoadingOffices] = useState(true);

  // Load office locations from API
  const loadOfficeLocations = useCallback(async () => {
    try {
      setIsLoadingOffices(true);
      const res = await fetch('/api/office-locations');
      if (res.ok) {
        const data = await res.json();
        setOfficeLocations(data.sort((a: OfficeLocation, b: OfficeLocation) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error loading office locations:', error);
    } finally {
      setIsLoadingOffices(false);
    }
  }, []);

  // Update page title and load data
  useEffect(() => {
    document.title = 'Liên hệ | NEW ATLANTIC - Tân Đại Tây Dương';
    loadOfficeLocations();
  }, [loadOfficeLocations]);

  return (
    <div className="bg-[#050c3a] min-h-screen pt-24 sm:pt-28 md:pt-32 relative overflow-hidden">
        {/* Background decorative elements - Subtle cyan/teal accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 border-b border-white/10">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Kết nối với chúng tôi
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Liên Hệ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Tư Vấn</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
                Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy để lại thông tin, đội ngũ chuyên gia sẽ liên hệ ngay.
              </p>

              {/* Holiday Banner - Centered Minimal */}
              <div className="flex justify-center">
                <HolidayBanner variant="minimal" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">

          {/* Contact Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Phone Card */}
            <a
              href="tel:+842838733686"
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Hotline</h3>
              <p className="text-cyan-400 font-bold text-lg relative z-10">+84 28 3873 3686</p>
              <p className="text-gray-400 text-sm mt-2 relative z-10">Hỗ trợ 24/7</p>
            </a>

            {/* Email Card */}
            <a
              href="mailto:info@newatlantic.vn"
              className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">Email</h3>
              <p className="text-teal-400 font-bold text-lg relative z-10">info@newatlantic.vn</p>
              <p className="text-gray-400 text-sm mt-2 relative z-10">Phản hồi trong 24h</p>
            </a>

            {/* Working Hours Card */}
            <div className="group bg-gradient-to-br from-cyan-600 to-teal-600 rounded-3xl p-8 shadow-xl shadow-cyan-600/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">Giờ Làm Việc</h3>
              <div className="space-y-1 relative z-10">
                <p className="text-cyan-50 font-medium">T2 - T6: 8:00 - 17:30</p>
                <p className="text-cyan-50 font-medium">Thứ 7: 8:00 - 12:00</p>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="max-w-5xl mx-auto pb-16">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center justify-center gap-3">
              <span className="w-1.5 h-8 bg-gradient-to-b from-cyan-500 to-teal-600 rounded-full"></span>
              Vị Trí Văn Phòng
            </h2>
            {isLoadingOffices ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <InteractiveMap offices={officeLocations} />
            )}
          </div>
        </div>
      </div>
  );
}
