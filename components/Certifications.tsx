'use client';

import React, { useState, useEffect } from 'react';
import { Certification } from '@/types';
import { Section, SectionHeader } from './sections';
import StaggerGroup from './motion/StaggerGroup';

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  'check-circle': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'shield': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'document': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'star': (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <Section tone="surface">
        <p className="animate-pulse text-center text-muted">Đang tải chứng nhận...</p>
      </Section>
    );
  }

  if (certifications.length === 0) {
    return null;
  }

  const gridClass =
    certifications.length <= 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
      : certifications.length === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Chứng nhận & giải thưởng"
        title="Uy tín và chất lượng được công nhận"
        intro="Những chứng nhận khẳng định năng lực kỹ thuật và cam kết chất lượng của NEW ATLANTIC."
        layout="center"
        size="d4"
        className="mb-16"
      />

      <StaggerGroup className={`grid items-stretch gap-8 ${gridClass}`}>
        {certifications.map(cert => (
          <div
            key={cert.id}
            className="group flex h-full flex-col rounded-card border border-navy/14 bg-background p-8 transition-colors duration-300 ease-brand hover:border-navy/30"
          >
            <span className="mb-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-accent text-white transition-transform duration-300 ease-brand group-hover:scale-105">
              {iconComponents[cert.icon] || iconComponents['check-circle']}
            </span>

            <h3 className="font-display shrink-0 text-d6 uppercase leading-display tracking-display text-navy">
              {cert.title}
            </h3>

            <p className="mt-4 flex-grow text-sm leading-[1.6] text-ink">{cert.description}</p>
          </div>
        ))}
      </StaggerGroup>
    </Section>
  );
}
