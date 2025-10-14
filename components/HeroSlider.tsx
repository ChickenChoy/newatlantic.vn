'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    badge: '🏆 Nhà phân phối chính thức tại Việt Nam',
    title: 'Tân Đại Tây Dương',
    subtitle: 'Thiết Bị Công Nghiệp Hàng Đầu',
    description: 'Đại diện phân phối độc quyền các thương hiệu WILL-BURT, HIAB, LOVOL, LIUGONG với cam kết chất lượng và dịch vụ tốt nhất',
    image: '/images/place-holder/placeholder.jpg'
  },
  {
    id: 2,
    badge: '🔥 Thiết bị PCCC chuyên nghiệp',
    title: 'Giải Pháp PCCC',
    subtitle: 'An Toàn Tuyệt Đối',
    description: 'Cung cấp và thi công hệ thống phòng cháy chữa cháy đạt tiêu chuẩn quốc tế, bảo vệ tài sản và tính mạng',
    image: '/images/place-holder/placeholder.jpg'
  },
  {
    id: 3,
    badge: '⚡ Thiết bị điện công nghiệp',
    title: 'Hệ Thống Điện',
    subtitle: 'Vận Hành Ổn Định',
    description: 'Cung ứng và tư vấn hệ thống điện công nghiệp, đảm bảo vận hành liên tục và an toàn tuyệt đối',
    image: '/images/place-holder/placeholder.jpg'
  },
  {
    id: 4,
    badge: '🏗️ Máy móc công trình',
    title: 'Thiết Bị Xây Dựng',
    subtitle: 'Hiệu Suất Cao',
    description: 'Máy xúc, máy ủi, cẩu tự hành HIAB, LOVOL, LIUGONG - Giải pháp toàn diện cho mọi công trình',
    image: '/images/place-holder/placeholder.jpg'
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  return (
    <section className="relative h-[100vh] md:h-[70vh] lg:h-[80vh] flex items-center overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#5f7ab8] via-[#4a6199] to-[#3a4d7a]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
              <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"></div>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }}></div>
              </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 relative z-10 h-full flex items-center">
              <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 lg:gap-12 items-center w-full">
                {/* Text Content */}
                <div className="text-white order-2 lg:order-1">
                  <div className={`inline-block bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3 md:mb-4 border border-white/20 transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`} style={{ transitionDelay: '200ms' }}>
                    <span className="text-xs md:text-sm font-medium">{slide.badge}</span>
                  </div>
                  <h1 className={`text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-3 lg:mb-4 leading-tight transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`} style={{ transitionDelay: '400ms' }}>
                    {slide.title}
                    <span className="block bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mt-1">
                      {slide.subtitle}
                    </span>
                  </h1>
                  <p className={`text-sm md:text-base lg:text-lg mb-4 md:mb-6 text-gray-100 leading-relaxed transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`} style={{ transitionDelay: '600ms' }}>
                    {slide.description}
                  </p>
                  <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`} style={{ transitionDelay: '800ms' }}>
                    <Link
                      href="/san-pham"
                      className="bg-white text-[#5f7ab8] px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg text-center"
                    >
                      Khám phá sản phẩm
                    </Link>
                    <Link
                      href="/lien-he"
                      className="bg-transparent border-2 border-white text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-bold hover:bg-white hover:text-[#5f7ab8] transition-all text-center"
                    >
                      Liên hệ tư vấn
                    </Link>
                  </div>

                  {/* Stats - Mobile Optimized */}
                  <div className={`grid grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/20 transition-all duration-700 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`} style={{ transitionDelay: '1000ms' }}>
                    <div className="text-center">
                      <div className="text-base md:text-xl lg:text-2xl font-bold mb-1">2003</div>
                      <div className="text-xs text-gray-200">Thành lập</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base md:text-xl lg:text-2xl font-bold mb-1">Top 5</div>
                      <div className="text-xs text-gray-200">DN Q.7</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base md:text-xl lg:text-2xl font-bold mb-1">4</div>
                      <div className="text-xs text-gray-200">Thương hiệu</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base md:text-xl lg:text-2xl font-bold mb-1">24/7</div>
                      <div className="text-xs text-gray-200">Hỗ trợ</div>
                    </div>
                  </div>
                </div>

                {/* Visual Side - Image */}
                <div className={`relative order-1 lg:order-2 transition-all duration-700 ${
                  index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`} style={{ transitionDelay: '600ms' }}>
                  <div className="relative aspect-[16/9] md:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Mobile Optimized */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-2 md:p-3 rounded-full transition-all hover:scale-110 group"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-2 md:p-3 rounded-full transition-all hover:scale-110 group"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators - Mobile Optimized */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentSlide
                ? 'w-8 md:w-10 bg-white'
                : 'w-2 md:w-3 bg-white/40 hover:bg-white/60'
            } h-2 md:h-3 rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play Toggle - Hidden on small mobile */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white p-2 md:p-3 rounded-full transition-all hidden sm:block"
        aria-label={isAutoPlay ? 'Pause autoplay' : 'Resume autoplay'}
      >
        {isAutoPlay ? (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Scroll indicator - Hidden on mobile */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 animate-bounce z-20 hidden md:block">
        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

