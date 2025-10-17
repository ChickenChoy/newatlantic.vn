"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    label: "GIỚI THIỆU",
    title: "NEW ATLANTIC",
    subtitle: "THIẾT BỊ CÔNG NGHỆ CAO",
    description: "Mỗi sản phẩm New Atlantic là sự kết tinh của đẳng cấp và công nghệ tiên tiến, mang đến cho bạn những giải pháp tối ưu cho công việc và dự án.",
    image: "/images/place-holder/telescopic-mast-tower.jpg",
    link: "/san-pham",
  },
  {
    id: 2,
    label: "GIỚI THIỆU",
    title: "KHÁM PHÁ GIẢI PHÁP KỸ THUẬT",
    description: "Mỗi sản phẩm tại New Atlantic là một giá trị, một chất lượng. Hãy để công nghệ nâng tầm dự án và tạo dấu ấn riêng của bạn.",
    image: "/images/place-holder/hiab-crane-truck.jpg",
    link: "/san-pham",
  },
  {
    id: 3,
    label: "TƯ VẤN",
    title: "TƯ VẤN CHỌN THIẾT BỊ",
    subtitle: "PHÙ HỢP DỰ ÁN CỦA BẠN",
    description: "Không chỉ là nhà cung cấp thiết bị, New Atlantic giúp bạn khám phá giải pháp phù hợp với nhu cầu và dự án của mình. Liên hệ ngay để được tư vấn tận tình!",
    image: "/images/place-holder/excavator-construction.jpg",
    link: "/san-pham",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide])

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
                  className={`max-w-5xl mx-auto text-center transition-all duration-1000 delay-300 ${
                    index === currentSlide 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  {slide.label && (
                    <p className="text-sm md:text-base lg:text-lg text-white/90 mb-4 md:mb-6 tracking-[0.2em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                      {slide.label}
                    </p>
                  )}
                  <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 lg:mb-8 uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white mb-6 md:mb-8 lg:mb-10 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      {slide.subtitle}
                    </h3>
                  )}
                  <p className="text-base md:text-xl lg:text-2xl xl:text-3xl text-white mb-10 md:mb-12 lg:mb-14 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-block px-10 py-4 md:px-12 md:py-5 bg-white/90 hover:bg-white text-gray-900 font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg text-base md:text-lg"
                  >
                    Xem thêm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default HeroSlider