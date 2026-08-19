'use client';

import { useEffect } from 'react';
import { PageHero, Section, SectionHeader, ArrowButton, Callout } from '@/components/sections';
import StaggerGroup from '@/components/motion/StaggerGroup';

const RECOVERY_STEPS = [
  {
    title: 'Tải lại trang',
    description: 'Phần lớn sự cố là tạm thời. Bấm “Thử lại” để dựng lại trang mà không mất vị trí đang xem.',
  },
  {
    title: 'Kiểm tra kết nối',
    description: 'Nếu mạng vừa gián đoạn, hãy kết nối lại rồi mở lại trang một lần nữa.',
  },
  {
    title: 'Gọi cho chúng tôi',
    description: 'Sự cố vẫn tiếp diễn? Gửi mã lỗi bên dưới cho bộ phận hỗ trợ để được xử lý nhanh.',
  },
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    document.title = '500 - Lỗi máy chủ | NEW ATLANTIC';
    console.error('Application error:', error);
  }, [error]);

  return (
    <>
      <PageHero
        eyebrow="Lỗi hệ thống"
        title={
          <>
            <span aria-hidden="true" className="mb-2 block text-d1 leading-none text-white/14">
              500
            </span>
            Đã xảy ra lỗi
          </>
        }
        intro="Rất tiếc, đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau ít phút hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục."
        align="center"
        actions={
          <>
            <ArrowButton variant="white" onClick={reset}>
              Thử lại
            </ArrowButton>
            <ArrowButton href="/" variant="outline-light">
              Về trang chủ
            </ArrowButton>
          </>
        }
      />

      <Section>
        <SectionHeader
          eyebrow="Cần làm gì tiếp"
          title="Ba bước khắc phục"
          intro="Theo thứ tự từ nhanh nhất đến chắc chắn nhất."
          layout="center"
          size="d4"
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3" stagger={70}>
          {RECOVERY_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex h-full flex-col rounded-card border border-navy/14 bg-background p-8"
            >
              <span
                aria-hidden="true"
                className="font-display ghost-numeral mb-6"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display mb-3 text-d5 uppercase leading-display tracking-display text-navy">
                {step.title}
              </h3>
              <p className="text-base leading-[1.6] text-ink">{step.description}</p>
            </div>
          ))}
        </StaggerGroup>

        {error.digest && (
          <Callout label="Mã lỗi" tone="warning" className="mt-12">
            <code className="font-mono text-sm text-navy">{error.digest}</code>
            <span className="mt-2 block text-sm text-ink">
              Gửi mã này kèm theo yêu cầu hỗ trợ để chúng tôi tra cứu đúng sự cố bạn gặp phải.
            </span>
          </Callout>
        )}
      </Section>

      <Section tone="navy">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-d4 uppercase leading-display tracking-display text-white">
            Cần hỗ trợ ngay?
          </h2>
          <p className="max-w-2xl text-base leading-[1.6] text-white/80">
            Bộ phận kỹ thuật New Atlantic trực hotline trong giờ làm việc và phản hồi email trong 24 giờ.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <ArrowButton href="tel:+842838733686" variant="accent" external>
              Gọi hotline
            </ArrowButton>
            <ArrowButton href="/lien-he" variant="outline-light">
              Gửi yêu cầu hỗ trợ
            </ArrowButton>
          </div>
        </div>
      </Section>
    </>
  );
}
