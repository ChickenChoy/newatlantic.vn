'use client';

import { useState } from 'react';
import ScrollAnimation from './ScrollAnimation';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    company: 'Công ty Xây dựng ABC',
    position: 'Giám đốc Kỹ thuật',
    rating: 5,
    text: 'Sản phẩm WILL-BURT của NEW ATLANTIC chất lượng vượt trội, đội ngũ kỹ thuật hỗ trợ nhiệt tình. Chúng tôi đã sử dụng nhiều năm và rất hài lòng với dịch vụ.',
    image: '/images/place-holder/1.png',
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    company: 'Công ty Công nghiệp XYZ',
    position: 'Trưởng phòng Mua hàng',
    rating: 5,
    text: 'HIAB cẩu tự hành mua từ NEW ATLANTIC hoạt động ổn định, hiệu suất cao. Dịch vụ hậu mãi tốt, luôn sẵn sàng hỗ trợ khi cần thiết.',
    image: '/images/place-holder/2.png',
  },
  {
    id: 3,
    name: 'Lê Minh Cường',
    company: 'Công ty Vận tải DEF',
    position: 'Quản lý Đội xe',
    rating: 5,
    text: 'Xe nâng Moffett của NEW ATLANTIC giúp chúng tôi tăng hiệu quả công việc đáng kể. Giá cả hợp lý, chất lượng đảm bảo.',
    image: '/images/place-holder/3.png',
  },
  {
    id: 4,
    name: 'Phạm Thị Dung',
    company: 'Công ty Công trình GHI',
    position: 'Giám đốc Dự án',
    rating: 5,
    text: 'Máy móc LOVOL từ NEW ATLANTIC đáp ứng tốt yêu cầu của các dự án lớn. Đội ngũ tư vấn chuyên nghiệp, giao hàng đúng hẹn.',
    image: '/images/place-holder/1.png',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-[600px] h-[600px] bg-[#5f7ab8]/20 rounded-full blur-3xl top-20 -left-48"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#4a6199]/20 rounded-full blur-3xl bottom-20 -right-48"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollAnimation direction="up">
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 text-purple-300 rounded-full text-xs font-medium mb-4 tracking-wide uppercase border border-purple-700/30">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Đánh giá khách hàng
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Khách hàng nói gì về chúng tôi
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
                Hơn 1000+ khách hàng tin tưởng và hài lòng với dịch vụ của NEW ATLANTIC
              </p>
            </div>
          </ScrollAnimation>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimation
                key={testimonial.id}
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 100}
              >
                <div
                  className={`bg-white rounded-2xl shadow-lg p-6 lg:p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 h-full flex flex-col ${
                    index === currentIndex ? 'ring-2 ring-[#5f7ab8]' : ''
                  }`}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="mb-6 flex-grow">
                    <svg
                      className="w-8 h-8 text-[#5f7ab8]/40 mb-4"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                    </svg>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      "{testimonial.text}"
                    </p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {testimonial.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm md:text-base">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 truncate">
                        {testimonial.position}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#5f7ab8] w-8'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


