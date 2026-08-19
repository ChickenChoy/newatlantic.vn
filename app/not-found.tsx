'use client';

import { useEffect } from 'react';
import { PageHero, Section, SectionHeader, ServiceCard, ArrowButton } from '@/components/sections';
import StaggerGroup from '@/components/motion/StaggerGroup';

function Icon({ path, className = 'h-6 w-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  );
}

const QUICK_LINKS = [
  {
    title: 'Sản phẩm',
    description: 'Cột tự nâng Will-Burt, thiết bị nâng hạ Hiab và máy công trình SKYMARK.',
    href: '/san-pham',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    title: 'Tin tức',
    description: 'Dự án đã triển khai, sự kiện và kiến thức kỹ thuật từ đội ngũ New Atlantic.',
    href: '/tin-tuc',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  },
  {
    title: 'Thư viện hình ảnh',
    description: 'Hình ảnh thực tế của thiết bị và các công trình đã bàn giao.',
    href: '/thu-vien-hinh-anh',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    title: 'Liên hệ',
    description: 'Kỹ sư tư vấn cấu hình, báo giá và lịch bảo dưỡng trong 24 giờ làm việc.',
    href: '/lien-he',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
];

export default function NotFound() {
  useEffect(() => {
    document.title = '404 - Trang không tìm thấy | NEW ATLANTIC';
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Lỗi 404"
        title={
          <>
            <span aria-hidden="true" className="mb-2 block text-d1 leading-none text-white/14">
              404
            </span>
            Trang không tìm thấy
          </>
        }
        intro="Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác."
        align="center"
        actions={
          <>
            <ArrowButton href="/" variant="white">
              Về trang chủ
            </ArrowButton>
            <ArrowButton variant="outline-light" onClick={() => window.history.back()}>
              Quay lại
            </ArrowButton>
          </>
        }
      />

      <Section>
        <SectionHeader
          eyebrow="Có thể bạn đang tìm"
          title="Bắt đầu lại từ đây"
          intro="Bốn lối vào chính của website — chọn một để tiếp tục."
          layout="center"
          size="d4"
        />

        <StaggerGroup
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          stagger={70}
        >
          {QUICK_LINKS.map((link, index) => (
            <ServiceCard
              key={link.href}
              title={link.title}
              description={link.description}
              href={link.href}
              index={index + 1}
              icon={<Icon path={link.icon} />}
              linkText="Truy cập"
              className="h-full"
            />
          ))}
        </StaggerGroup>
      </Section>
    </>
  );
}
