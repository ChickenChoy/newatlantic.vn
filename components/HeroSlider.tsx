"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "NEW ATLANTIC",
    subtitle: "THIẾT BỊ CÔNG NGHỆ CAO",
    description: "Mỗi sản phẩm New Atlantic là sự kết tinh của đẳng cấp và công nghệ tiên tiến, mang đến cho bạn những giải pháp tối ưu cho công việc và dự án.",
    image: "/images/place-holder/telescopic-mast-tower.jpg",
    link: "/san-pham",
  },
  {
    id: 2,
    title: "KHÁM PHÁ GIẢI PHÁP KỸ THUẬT",
    description: "Mỗi sản phẩm tại New Atlantic là một giá trị, một chất lượng. Hãy để công nghệ nâng tầm dự án và tạo dấu ấn riêng của bạn.",
    image: "/images/place-holder/hiab-crane-truck.jpg",
    link: "/san-pham",
  },
  {
    id: 3,
    title: "TƯ VẤN CHỌN THIẾT BỊ",
    subtitle: "PHÙ HỢP DỰ ÁN CỦA BẠN",
    description: "Không chỉ là nhà cung cấp thiết bị, New Atlantic giúp bạn khám phá giải pháp phù hợp với nhu cầu và dự án của mình. Liên hệ ngay để được tư vấn tận tình!",
    image: "/images/place-holder/excavator-construction.jpg",
    link: "/san-pham",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide])

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true)
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true)
      setCurrentSlide(index)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }

  return (
    <div>
      {/* Hero Slider Section */}
      <section className="relative h-[100vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with Zoom Animation */}
            <div 
              className={`absolute inset-0 transition-transform duration-[8000ms] ease-out ${
                index === currentSlide ? "scale-110" : "scale-100"
              }`}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60 md:bg-black/65" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center z-20">
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div 
                  className={`max-w-2xl md:max-w-3xl lg:max-w-4xl transition-all duration-1000 delay-300 ${
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-5 lg:mb-6 uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white mb-5 md:mb-6 lg:mb-7 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      {slide.subtitle}
                    </h3>
                  )}
                  <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white mb-8 md:mb-10 lg:mb-12 leading-relaxed max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-block px-8 py-3 md:px-10 md:py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          disabled={isAnimating}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 disabled:opacity-50"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 100 100">
            <path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" fill="currentColor" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          disabled={isAnimating}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 disabled:opacity-50"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 100 100">
            <path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" fill="currentColor" transform="translate(100, 100) rotate(180)" />
          </svg>
        </button>
      </section>
    </div>
  )
}

export default HeroSlider