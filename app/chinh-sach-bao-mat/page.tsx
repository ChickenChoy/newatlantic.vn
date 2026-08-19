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
  title: 'Chính Sách Bảo Mật',
  description: 'Chính sách bảo mật thông tin khách hàng của Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC). Cam kết bảo vệ quyền riêng tư và an toàn thông tin cá nhân.',
  path: '/chinh-sach-bao-mat',
  keywords: [
    'chính sách bảo mật',
    'bảo mật thông tin',
    'quyền riêng tư',
    'NEW ATLANTIC',
    'Tân Đại Tây Dương',
  ],
});

/** Shared icon geometry for the security cards and the contact block. */
function Icon({ path, className = 'h-6 w-6' }: { path: string; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  );
}

const SECURITY_MEASURES = [
  {
    title: 'Mã hóa dữ liệu',
    description: 'Sử dụng SSL/TLS để bảo vệ thông tin truyền tải.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    title: 'Kiểm soát truy cập',
    description: 'Chỉ nhân viên được ủy quyền mới có quyền truy cập.',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    title: 'Máy chủ an toàn',
    description: 'Lưu trữ trên hệ thống máy chủ bảo mật cao.',
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  },
  {
    title: 'Sao lưu định kỳ',
    description: 'Backup dữ liệu thường xuyên để đảm bảo an toàn.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
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

export default function PrivacyPolicyPage() {
  const updatedAt = new Date().toLocaleDateString('vi-VN');

  return (
    <>
      <PageHero
        eyebrow={`Cập nhật: ${updatedAt} Bởi Nam Nam`}
        title="Chính sách bảo mật"
        intro="Cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng NEW ATLANTIC."
        breadcrumbs={[{ name: 'Trang chủ', href: '/' }, { name: 'Chính sách bảo mật' }]}
      />

      <Section>
        <div className="mx-auto max-w-4xl space-y-14">
          {/* Lead paragraph */}
          <Reveal>
            <p className="text-lg leading-[1.6] text-ink">
              Công ty Cổ phần Thương mại Quốc tế Tân Đại Tây Dương (NEW ATLANTIC) cam kết bảo vệ quyền riêng tư và
              thông tin cá nhân của khách hàng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng,
              lưu trữ và bảo vệ thông tin của bạn.
            </p>
          </Reveal>

          <LegalSection index={1} title="Thu thập thông tin">
            <p>Chúng tôi thu thập thông tin khi bạn:</p>
            <LegalList
              items={[
                'Đăng ký tài khoản hoặc liên hệ với chúng tôi',
                'Yêu cầu báo giá hoặc tư vấn sản phẩm',
                'Đặt hàng sản phẩm hoặc dịch vụ',
                'Tham gia khảo sát hoặc chương trình khuyến mãi',
                'Truy cập và sử dụng website của chúng tôi',
              ]}
            />

            <div className="rounded-card border border-navy/14 bg-surface p-6">
              <h3 className="mb-4 text-base font-semibold text-navy">
                Thông tin chúng tôi có thể thu thập:
              </h3>
              <LegalList
                items={[
                  'Họ tên, chức vụ, tên công ty',
                  'Địa chỉ email, số điện thoại',
                  'Địa chỉ giao hàng và thanh toán',
                  'Thông tin kỹ thuật (IP, trình duyệt, thiết bị)',
                ]}
              />
            </div>
          </LegalSection>

          <LegalSection index={2} title="Mục đích sử dụng thông tin">
            <p>Thông tin của bạn được sử dụng để:</p>
            <LegalList
              items={[
                <>
                  <strong className="font-semibold text-navy">Xử lý đơn hàng:</strong> Xác nhận, giao hàng và hỗ trợ
                  sau bán hàng
                </>,
                <>
                  <strong className="font-semibold text-navy">Tư vấn kỹ thuật:</strong> Cung cấp thông tin sản phẩm
                  và giải pháp phù hợp
                </>,
                <>
                  <strong className="font-semibold text-navy">Cải thiện dịch vụ:</strong> Nâng cao chất lượng sản
                  phẩm và trải nghiệm khách hàng
                </>,
                <>
                  <strong className="font-semibold text-navy">Marketing:</strong> Gửi thông tin khuyến mãi, sản phẩm
                  mới (chỉ khi có sự đồng ý)
                </>,
                <>
                  <strong className="font-semibold text-navy">Tuân thủ pháp luật:</strong> Đáp ứng các yêu cầu pháp
                  lý và quy định
                </>,
              ]}
            />
          </LegalSection>

          <LegalSection index={3} title="Bảo mật thông tin">
            <p>Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ thông tin của bạn:</p>
            <div className="grid gap-6 md:grid-cols-2">
              {SECURITY_MEASURES.map((measure) => (
                <ServiceCard
                  key={measure.title}
                  title={measure.title}
                  description={measure.description}
                  icon={<Icon path={measure.icon} />}
                />
              ))}
            </div>
          </LegalSection>

          <LegalSection index={4} title="Chia sẻ thông tin">
            <p>
              Chúng tôi <strong className="font-semibold text-navy">KHÔNG</strong> bán, trao đổi hoặc cho thuê thông
              tin cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp:
            </p>
            <LegalList
              items={[
                <>
                  <strong className="font-semibold text-navy">Đối tác vận chuyển:</strong> Để giao hàng đến địa chỉ
                  của bạn
                </>,
                <>
                  <strong className="font-semibold text-navy">Nhà cung cấp dịch vụ:</strong> Hỗ trợ vận hành website
                  và thanh toán
                </>,
                <>
                  <strong className="font-semibold text-navy">Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan
                  có thẩm quyền
                </>,
                <>
                  <strong className="font-semibold text-navy">Có sự đồng ý:</strong> Khi bạn cho phép chia sẻ thông
                  tin
                </>,
              ]}
            />
          </LegalSection>

          <LegalSection index={5} title="Quyền của bạn">
            <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>
            <div className="rounded-card border border-navy/14 bg-surface p-6">
              <LegalList
                items={[
                  <>
                    <strong className="font-semibold text-navy">Quyền truy cập:</strong> Yêu cầu xem thông tin chúng
                    tôi đang lưu trữ
                  </>,
                  <>
                    <strong className="font-semibold text-navy">Quyền chỉnh sửa:</strong> Cập nhật hoặc sửa đổi thông
                    tin không chính xác
                  </>,
                  <>
                    <strong className="font-semibold text-navy">Quyền xóa:</strong> Yêu cầu xóa thông tin cá nhân
                    (trong phạm vi cho phép)
                  </>,
                  <>
                    <strong className="font-semibold text-navy">Quyền từ chối:</strong> Không nhận email marketing
                    hoặc tin khuyến mãi
                  </>,
                ]}
              />
            </div>
          </LegalSection>

          <LegalSection index={6} title="Cookies">
            <p>Website sử dụng cookies để cải thiện trải nghiệm người dùng. Cookies giúp chúng tôi:</p>
            <LegalList
              items={[
                'Ghi nhớ thông tin đăng nhập và tùy chọn của bạn',
                'Phân tích lưu lượng truy cập và hành vi người dùng',
                'Cải thiện hiệu suất và chức năng website',
              ]}
            />
            <Callout label="Lưu ý" tone="warning">
              Bạn có thể từ chối cookies thông qua cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến trải
              nghiệm sử dụng website.
            </Callout>
          </LegalSection>

          {/* Contact */}
          <Reveal className="rounded-card border border-navy/14 bg-surface p-8 md:p-10">
            <h2 className="font-display text-d5 uppercase leading-display tracking-display text-navy">Liên hệ</h2>
            <p className="mt-4 text-base leading-[1.6] text-ink">
              Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc muốn thực hiện các quyền của mình, vui lòng
              liên hệ:
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
              Chính sách này có hiệu lực từ ngày {updatedAt}.
              <br />
              Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được thông báo trên website.
            </p>
          </div>
        </div>
      </Section>

      <CTABand
        eyebrow="Còn câu hỏi?"
        title="Chúng tôi luôn sẵn sàng giải đáp"
        intro="Liên hệ với NEW ATLANTIC để được hỗ trợ về quyền riêng tư, dữ liệu cá nhân hoặc bất kỳ thắc mắc nào khác."
        actions={
          <>
            <ArrowButton href="/lien-he" variant="accent">
              Liên hệ ngay
            </ArrowButton>
            <ArrowButton href="/dieu-khoan-dich-vu" variant="outline-light">
              Điều khoản dịch vụ
            </ArrowButton>
          </>
        }
      />
    </>
  );
}
