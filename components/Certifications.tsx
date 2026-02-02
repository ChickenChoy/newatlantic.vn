'use client';

import React, { useState, useEffect } from 'react';
import ScrollAnimation from './ScrollAnimation';
import { Certification } from '@/types';

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  'check-circle': (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'shield': (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'document': (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'star': (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
};

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Load certifications from API
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const res = await fetch('/api/certifications');
        if (res.ok) {
          const data = await res.json();
          // Filter only enabled certifications
          const enabled = data.filter((c: Certification) => c.enabled);
          setCertifications(enabled);
        }
      } catch (error) {
        console.error('Error loading certifications:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCertifications();
  }, []);

  // Don't render if no certifications
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse text-white/50">Đang tải chứng nhận...</div>
        </div>
      </section>
    );
  }

  if (certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-[500px] h-[500px] bg-[#5f7ab8]/20 rounded-full blur-3xl top-0 left-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollAnimation direction="up">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-green-900/40 text-green-300 rounded-full text-sm md:text-base font-semibold mb-4 tracking-wide uppercase border border-green-700/30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Chứng nhận & Giải thưởng
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Uy tín & Chất lượng được công nhận
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                Những chứng nhận và giải thưởng khẳng định chất lượng dịch vụ và sản phẩm của chúng tôi
              </p>
            </div>
          </ScrollAnimation>

          {/* Certifications Grid */}
          <div className={`grid gap-6 lg:gap-8 items-stretch ${certifications.length <= 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
            certifications.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
            {certifications.map((cert, index) => (
              <ScrollAnimation
                key={cert.id}
                direction="up"
                delay={index * 100}
                className="h-full"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 lg:p-8 hover:bg-white/15 hover:shadow-2xl transition-all duration-300 border border-white/20 hover:border-[#5f7ab8]/50 text-center group h-full flex flex-col">
                  <div className="w-16 h-16 mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    {iconComponents[cert.icon] || iconComponents['check-circle']}
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg flex-shrink-0">{cert.title}</h3>
                  <p className="text-white text-sm leading-relaxed flex-grow">{cert.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
