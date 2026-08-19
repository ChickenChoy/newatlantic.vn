'use client';

import { useState, useEffect, useCallback } from 'react';
import HolidayBanner from '@/components/HolidayBanner';
import InteractiveMap from '@/components/InteractiveMap';
import {
  PageHero,
  Section,
  SectionHeader,
  CTABand,
  ArrowButton,
} from '@/components/sections';
import StaggerGroup from '@/components/motion/StaggerGroup';
import type { OfficeLocation } from '@/types';

/** Direct channels — the template's three-up contact row. */
const CHANNELS = [
  {
    id: 'hotline',
    label: 'Hotline',
    value: '+84 28 3873 3686',
    note: 'Hỗ trợ kỹ thuật 24/7',
    href: 'tel:+842838733686',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    ),
  },
  {
    id: 'email',
    label: 'Email',
    value: 'info@newatlantic.vn',
    note: 'Phản hồi trong 24 giờ làm việc',
    href: 'mailto:info@newatlantic.vn',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    id: 'hours',
    label: 'Giờ làm việc',
    value: 'T2 – T6: 8:00 – 17:30',
    note: 'Thứ 7: 8:00 – 12:00',
    href: null,
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
] as const;

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
    <>
      <PageHero
        eyebrow="Kết nối với chúng tôi"
        title="Liên hệ tư vấn"
        image="/images/place-holder/hiab-crane-truck.jpg"
        intro="Gọi hotline hoặc gửi email — kỹ sư New Atlantic sẽ khảo sát hiện trường và đề xuất cấu hình thiết bị phù hợp với công trình của bạn."
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Liên hệ' }]}
        actions={
          <>
            <ArrowButton href="tel:+842838733686" variant="accent" external>
              Gọi ngay
            </ArrowButton>
            <ArrowButton href="mailto:info@newatlantic.vn" variant="outline-light" external>
              Gửi email
            </ArrowButton>
          </>
        }
      />

      {/* Holiday banner — collapses on days with no active holiday effect */}
      <div className="mx-auto flex w-full max-w-site justify-center px-5 py-12 md:px-gutter empty:hidden">
        <HolidayBanner variant="minimal" />
      </div>

      {/* Direct channels */}
      <Section>
        <SectionHeader
          eyebrow="Kênh liên hệ"
          title="Ba cách nhanh nhất để gặp chúng tôi"
          intro="Mọi yêu cầu đều được chuyển trực tiếp tới bộ phận kỹ thuật phụ trách khu vực của bạn."
          size="d4"
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CHANNELS.map((channel) => {
            const body = (
              <>
                <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-accent/10 text-accent">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {channel.icon}
                  </svg>
                </span>

                <span className="mt-8 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {channel.label}
                </span>
                {/*
                  `break-words`: `channel.value` carries "info@newatlantic.vn" — one
                  unbreakable token — and this renders it in the display face,
                  uppercased, so it is far wider than the 14px body text elsewhere.
                  In the md 3-column grid the card is only ~156px wide inside its
                  padding, so the address overflowed its own bordered card. No
                  `min-w-0` needed here: the parent is `flex-col`, so this child is
                  stretched to the column width rather than sized to its content.
                */}
                <span className="mt-3 block break-words font-display text-d6 uppercase leading-display tracking-display text-navy">
                  {channel.value}
                </span>
                <span className="mt-3 block text-sm leading-[1.6] text-ink">{channel.note}</span>
              </>
            );

            const shell = 'flex h-full flex-col rounded-card border border-navy/14 bg-surface p-8';

            return channel.href ? (
              <a
                key={channel.id}
                href={channel.href}
                className={`group ${shell} transition-colors duration-300 ease-brand hover:border-navy`}
              >
                {body}
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors duration-300 ease-brand group-hover:text-accent">
                  Kết nối
                  <svg
                    className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            ) : (
              <div key={channel.id} className={shell}>
                {body}
              </div>
            );
          })}
        </StaggerGroup>
      </Section>

      {/* Offices + map */}
      <Section tone="surface" id="van-phong">
        <SectionHeader
          eyebrow="Hệ thống văn phòng"
          title="Ba văn phòng, phủ khắp ba miền"
          intro="Trụ sở tại TP.HCM cùng chi nhánh Hà Nội và Quảng Trị — hỗ trợ lắp đặt, nghiệm thu và bảo trì tại chỗ."
          size="d4"
        />

        <div className="mt-16">
          {isLoadingOffices ? (
            <div className="flex h-[450px] items-center justify-center rounded-card border border-navy/14 bg-background">
              <div className="h-12 w-12 animate-spin rounded-pill border-2 border-navy/14 border-t-accent" />
            </div>
          ) : (
            <InteractiveMap offices={officeLocations} />
          )}
        </div>
      </Section>

      <CTABand
        eyebrow="Sẵn sàng bắt đầu?"
        title="Gửi yêu cầu, nhận báo giá trong 24 giờ"
        intro="Cho chúng tôi biết tải trọng, chiều cao nâng và điều kiện vận hành — phần còn lại để kỹ sư New Atlantic lo."
        actions={
          <>
            <ArrowButton href="tel:+842838733686" variant="accent" external>
              +84 28 3873 3686
            </ArrowButton>
            <ArrowButton href="/san-pham" variant="outline-light">
              Xem sản phẩm
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
