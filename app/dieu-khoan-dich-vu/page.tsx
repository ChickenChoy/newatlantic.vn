import { generateMetadata as genMeta } from '@/lib/seo';
import type { Metadata } from 'next';
import {
  PageHero,
  Section,
  CTABand,
  ArrowButton,
  ServiceCard,
  LegalSection,
  LegalList,
  Callout,
} from '@/components/sections';
import Reveal from '@/components/motion/Reveal';

export const metadata: Metadata = genMeta({
  title: 'Điều Khoản Dịch Vụ',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ của Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC). Quy định về bảo hành, đổi trả, thanh toán và giao hàng.',
  path: '/dieu-khoan-dich-vu',
  keywords: [
    'điều khoản dịch vụ',
    'điều kiện sử dụng',
    'chính sách bảo hành',
    'chính sách đổi trả',
    'NEW ATLANTIC',
  ],
});

function Icon({ path, className = 'h-6 w-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  );
}

const CHECK_PATH = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';

const PRODUCT_LINES = [
  {
    title: 'Cột tự nâng WILL-BURT',
    description: 'Giải pháp nâng cao chuyên dụng cho quân sự, truyền thông và công nghiệp.',
  },
  {
    title: 'Thiết bị nâng hạ HIAB',
    description: 'Cẩu tự hành, xe nâng Moffett đa dạng tải trọng.',
  },
  {
    title: 'Thiết bị hàng không SKYMARK',
    description: 'Thiết bị cơ giới xây dựng độ bền vượt trội.',
  },
];

const WARRANTY = [
  {
    title: 'Bảo hành chính hãng',
    description: 'Theo quy định của nhà sản xuất (6-24 tháng tùy sản phẩm).',
    icon: CHECK_PATH,
  },
  {
    title: 'Hỗ trợ kỹ thuật',
    description: 'Tư vấn và hỗ trợ kỹ thuật 24/7 suốt vòng đời sản phẩm.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
];

const CONTACT = [
  {
    label: 'info@newatlantic.vn',
    href: 'mailto:info@newatlantic.vn',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: '+84 2838 733 686',
    href: 'tel:+842838733686',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
  {
    label: 'A60 Phú Thuận, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh',
    icon: 'M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

export default function TermsOfServicePage() {
  const updatedAt = new Date().toLocaleDateString('vi-VN');

  return (
    <>
      <PageHero
        eyebrow={`Cập nhật: ${updatedAt} `}
        title="Điều khoản dịch vụ"
        intro="Quy định sử dụng sản phẩm và dịch vụ của NEW ATLANTIC — Tân Đại Tây Dương."
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Điều khoản dịch vụ' }]}
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-14">
          {/* Lead paragraph */}
          <Reveal>
            <p className="text-lg leading-[1.6] text-ink">
              Chào mừng bạn đến với Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC). Khi sử dụng
              website và dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây. Vui lòng đọc
              kỹ trước khi sử dụng dịch vụ.
            </p>
          </Reveal>

          <LegalSection index={1} title="Định nghĩa">
            <LegalList
              items={[
                <>
                  <strong className="font-semibold text-navy">&quot;Chúng tôi&quot;, &quot;NEW ATLANTIC&quot;:</strong>{' '}
                  Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương
                </>,
                <>
                  <strong className="font-semibold text-navy">&quot;Khách hàng&quot;, &quot;Bạn&quot;:</strong> Cá nhân
                  hoặc tổ chức sử dụng dịch vụ của chúng tôi
                </>,
                <>
                  <strong className="font-semibold text-navy">&quot;Dịch vụ&quot;:</strong> Tất cả sản phẩm, giải pháp
                  và dịch vụ do NEW ATLANTIC cung cấp
                </>,
                <>
                  <strong className="font-semibold text-navy">&quot;Website&quot;:</strong> Trang web newatlantic.vn
                  và các subdomain liên quan
                </>,
              ]}
            />
          </LegalSection>

          <LegalSection index={2} title="Sản phẩm & dịch vụ">
            <p>NEW ATLANTIC chuyên cung cấp thiết bị công nghiệp chất lượng cao bao gồm:</p>
            <div className="grid gap-6 md:grid-cols-2">
              {PRODUCT_LINES.map((line) => (
                <ServiceCard
                  key={line.title}
                  title={line.title}
                  description={line.description}
                  icon={<Icon path={CHECK_PATH} />}
                />
              ))}
            </div>
            <Callout label="Lưu ý">
              Tất cả sản phẩm đều là hàng chính hãng, có đầy đủ giấy tờ xuất xứ và chứng nhận chất lượng.
            </Callout>
          </LegalSection>

          <LegalSection index={3} title="Đặt hàng & thanh toán">
            <h3 className="text-base font-semibold text-navy">Quy trình đặt hàng:</h3>
            <ol className="space-y-4">
              {[
                { title: 'Liên hệ tư vấn', body: 'Gọi hotline hoặc gửi yêu cầu qua website' },
                { title: 'Nhận báo giá', body: 'Chúng tôi cung cấp báo giá chi tiết trong 24h' },
                { title: 'Xác nhận đơn hàng', body: 'Ký hợp đồng và thanh toán theo thỏa thuận' },
                { title: 'Giao hàng', body: 'Vận chuyển và lắp đặt (nếu có)' },
              ].map((step, index) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-navy/14 bg-surface font-display text-sm font-semibold tracking-display text-navy"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="pt-1.5">
                    <strong className="font-semibold text-navy">{step.title}:</strong> {step.body}
                  </span>
                </li>
              ))}
            </ol>

            <h3 className="pt-2 text-base font-semibold text-navy">Phương thức thanh toán:</h3>
            <LegalList
              items={[
                'Chuyển khoản ngân hàng',
                'Thanh toán trực tiếp tại công ty',
                'COD (với đơn hàng phù hợp)',
                'Thanh toán theo tiến độ (đơn hàng lớn)',
              ]}
            />
          </LegalSection>

          <LegalSection index={4} title="Giao hàng">
            <LegalList
              items={[
                'Giao hàng toàn quốc với đơn vị vận chuyển uy tín',
                'Thời gian giao hàng tùy thuộc vào loại sản phẩm và địa điểm',
                'Khách hàng có trách nhiệm kiểm tra hàng hóa khi nhận',
                'Dịch vụ lắp đặt miễn phí hoặc có phí tùy theo thỏa thuận',
              ]}
            />
            <Callout label="Quan trọng" tone="warning">
              Vui lòng thông báo ngay nếu phát hiện hàng hóa bị hư hỏng hoặc không đúng yêu cầu trong vòng 24h kể từ
              khi nhận hàng.
            </Callout>
          </LegalSection>

          <LegalSection index={5} title="Bảo hành & đổi trả">
            <h3 className="text-base font-semibold text-navy">Chính sách bảo hành:</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {WARRANTY.map((item) => (
                <ServiceCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={<Icon path={item.icon} />}
                />
              ))}
            </div>

            <h3 className="pt-2 text-base font-semibold text-navy">Điều kiện đổi trả:</h3>
            <LegalList
              items={[
                'Sản phẩm bị lỗi kỹ thuật do nhà sản xuất',
                'Giao sai sản phẩm hoặc thiếu phụ kiện',
                'Sản phẩm hư hỏng trong quá trình vận chuyển',
                'Còn nguyên bao bì, tem niêm phong (nếu có)',
              ]}
            />
          </LegalSection>

          <LegalSection index={6} title="Trách nhiệm người dùng">
            <p>Khi sử dụng dịch vụ của chúng tôi, bạn cam kết:</p>
            <LegalList
              items={[
                'Cung cấp thông tin chính xác và đầy đủ',
                'Sử dụng sản phẩm đúng mục đích và hướng dẫn',
                'Không sử dụng dịch vụ cho mục đích bất hợp pháp',
                'Tuân thủ các quy định về an toàn lao động',
                'Bảo quản và bảo trì sản phẩm theo hướng dẫn',
              ]}
            />
          </LegalSection>

          <LegalSection index={7} title="Giới hạn trách nhiệm">
            <p>NEW ATLANTIC không chịu trách nhiệm cho:</p>
            <LegalList
              tone="negative"
              items={[
                'Thiệt hại do sử dụng sai mục đích hoặc không tuân thủ hướng dẫn',
                'Hư hỏng do tác động của thiên tai, hỏa hoạn, chiến tranh',
                'Sản phẩm đã qua sửa chữa bởi bên thứ ba không được ủy quyền',
                'Thông tin sai lệch do khách hàng cung cấp',
              ]}
            />
          </LegalSection>

          <LegalSection index={8} title="Quyền sở hữu trí tuệ">
            <p>
              Tất cả nội dung trên website bao gồm văn bản, hình ảnh, logo, thiết kế đều thuộc quyền sở hữu của NEW
              ATLANTIC hoặc các đối tác. Nghiêm cấm sao chép, phân phối hoặc sử dụng mà không có sự cho phép bằng văn
              bản.
            </p>
          </LegalSection>

          <LegalSection index={9} title="Giải quyết tranh chấp">
            <LegalList
              items={[
                'Mọi tranh chấp sẽ được giải quyết thông qua thương lượng và hòa giải',
                'Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại TP. Hồ Chí Minh',
                'Điều khoản này tuân thủ theo pháp luật Việt Nam',
              ]}
            />
          </LegalSection>

          {/* Contact */}
          <Reveal className="rounded-card border border-navy/14 bg-surface p-8 md:p-10">
            <h2 className="font-display text-d5 uppercase leading-display tracking-display text-navy">
              Liên hệ & hỗ trợ
            </h2>
            <p className="mt-4 text-base leading-[1.6] text-ink">
              Nếu bạn có câu hỏi về điều khoản dịch vụ hoặc cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi:
            </p>
            <ul className="mt-6 space-y-4">
              {CONTACT.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-accent text-white"
                  >
                    <Icon path={item.icon} className="h-5 w-5" />
                  </span>
                  {/* `min-w-0 break-words`: CONTACT carries an email and a long
                      street address. As flex children they default to
                      `min-width: auto` and so would not shrink below their
                      longest token, overflowing this bordered card on narrow
                      phones. */}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="min-w-0 break-words pt-2.5 text-base font-medium text-navy transition-colors duration-300 ease-brand hover:text-accent"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="min-w-0 break-words pt-2.5 text-base leading-[1.6] text-ink">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Update notice */}
          <div className="border-t border-navy/14 pt-8 text-center text-sm leading-[1.6] text-muted">
            <p>
              Điều khoản này có hiệu lực từ ngày {updatedAt}.
              <br />
              NEW ATLANTIC có quyền cập nhật điều khoản này mà không cần thông báo trước. Phiên bản mới nhất luôn được
              đăng tải trên website.
            </p>
          </div>
        </div>
      </Section>

      <CTABand
        eyebrow="Sẵn sàng bắt đầu?"
        title="Nhận báo giá trong 24 giờ"
        intro="Kỹ sư New Atlantic khảo sát nhu cầu, đề xuất cấu hình thiết bị và gửi báo giá chi tiết."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ ngay
            </ArrowButton>
            <ArrowButton href="/chinh-sach-bao-mat" variant="outline-light">
              Chính sách bảo mật
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
