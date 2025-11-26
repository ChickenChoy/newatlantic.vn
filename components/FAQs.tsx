'use client';

import { useState, useEffect } from 'react';
import ScrollAnimation from './ScrollAnimation';

const faqs = [
  {
    id: 1,
    question: 'NEW ATLANTIC cung cấp những sản phẩm gì?',
    answer:
      'NEW ATLANTIC là nhà phân phối chính hãng các thương hiệu WILL-BURT, HIAB, LOVOL, LIUGONG tại Việt Nam. Chúng tôi cung cấp cột tự nâng, cẩu tự hành, xe nâng Moffett, máy móc công trình và thiết bị công nghiệp chất lượng cao.',
  },
  {
    id: 2,
    question: 'Thời gian bảo hành sản phẩm là bao lâu?',
    answer:
      'Thời gian bảo hành phụ thuộc vào từng loại sản phẩm. Thông thường, các sản phẩm được bảo hành từ 12-24 tháng. Chúng tôi cũng cung cấp dịch vụ bảo trì và sửa chữa 24/7.',
  },
  {
    id: 3,
    question: 'NEW ATLANTIC có hỗ trợ vận chuyển toàn quốc không?',
    answer:
      'Có, chúng tôi hỗ trợ vận chuyển toàn quốc trong vòng 24-48h. Đội ngũ kỹ thuật của chúng tôi cũng sẵn sàng hỗ trợ lắp đặt và hướng dẫn sử dụng tại địa điểm của khách hàng.',
  },
  {
    id: 4,
    question: 'Làm thế nào để nhận báo giá sản phẩm?',
    answer:
      'Bạn có thể liên hệ trực tiếp qua hotline +84 2838 733 686, email info@newatlantic.vn hoặc điền form liên hệ trên website. Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
  },
  {
    id: 5,
    question: 'Có hỗ trợ tư vấn kỹ thuật không?',
    answer:
      'Có, đội ngũ kỹ thuật viên chuyên nghiệp của chúng tôi sẵn sàng tư vấn miễn phí về sản phẩm, giải pháp và ứng dụng. Chúng tôi hỗ trợ 24/7 qua điện thoại, email hoặc tại công trường.',
  },
  {
    id: 6,
    question: 'Có cung cấp phụ tùng thay thế không?',
    answer:
      'Có, chúng tôi cung cấp đầy đủ phụ tùng thay thế chính hãng cho tất cả sản phẩm. Kho phụ tùng luôn có sẵn tại các chi nhánh Hồ Chí Minh, Hà Nội và Quảng Trị.',
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Fix hydration issue by ensuring client-side only state initialization
  useEffect(() => {
    setIsMounted(true);
    // Optionally open first FAQ after mount
    // setOpenIndex(0);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-[500px] h-[500px] bg-[#5f7ab8]/20 rounded-full blur-3xl top-20 right-0"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#4a6199]/20 rounded-full blur-3xl bottom-20 left-0"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <ScrollAnimation direction="up">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-300 rounded-full text-xs font-medium mb-4 tracking-wide uppercase shadow-sm border border-blue-700/30">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Câu hỏi thường gặp
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Bạn có câu hỏi?
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Tìm câu trả lời cho những thắc mắc phổ biến về sản phẩm và dịch vụ của chúng tôi
              </p>
            </div>
          </ScrollAnimation>

          {/* FAQs Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <ScrollAnimation key={faq.id} direction="up" delay={index * 100}>
                <div
                  className={`bg-white/10 backdrop-blur-md rounded-2xl shadow-sm hover:bg-white/5 hover:shadow-2xl transition-all duration-300 border overflow-hidden group ${openIndex === index
                    ? 'border-[#5f7ab8] shadow-lg shadow-[#5f7ab8]/20'
                    : 'border-white/20 hover:border-white/30'
                    }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full px-6 py-5 text-left flex items-center justify-between gap-4 transition-all duration-300 ${openIndex === index
                      ? 'bg-gradient-to-r from-[#5f7ab8]/10 to-[#4a6199]/10'
                      : 'hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${openIndex === index
                          ? 'bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white shadow-md'
                          : 'bg-gray-100 text-[#5f7ab8] group-hover:bg-[#5f7ab8]/20'
                          }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`font-semibold text-sm md:text-base flex-1 leading-relaxed transition-colors text-white`}
                      >
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index
                        ? 'bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] text-white rotate-180 shadow-md'
                        : 'bg-gray-100 text-[#5f7ab8] group-hover:bg-[#5f7ab8]/20 group-hover:scale-110'
                        }`}
                    >
                      <svg
                        className="w-5 h-5 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <div className="pl-12 pr-4">
                        <div className="relative">
                          <div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#5f7ab8] to-[#4a6199] rounded-full"></div>
                          <p className="text-white text-sm md:text-base leading-relaxed pl-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          {/* CTA */}
          <ScrollAnimation direction="up" delay={600}>
            <div className="mt-12 text-center">
              <p className="text-white mb-4 text-sm md:text-base">
                Vẫn còn thắc mắc? Chúng tôi sẵn sàng hỗ trợ bạn!
              </p>
              <a
                href="/lien-he"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5f7ab8] to-[#4a6199] text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/15 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-sm md:text-base shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Liên hệ ngay
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </section>
  );
}


