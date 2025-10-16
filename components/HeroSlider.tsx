"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Cột Tự Nâng WILL-BURT",
    subtitle: "Giải pháp nâng cao hiệu quả cho quân sự & truyền thông",
    description: "Hơn 100 năm lịch sử, chất lượng vượt trội",
    image: "/images/place-holder/1.png",
    link: "/san-pham/cot-tu-nang-will-burt",
  },
  {
    id: 2,
    title: "Thiết Bị Nâng HIAB",
    subtitle: "Cẩu tự hành & xe nâng Moffett chuyên nghiệp",
    description: "Đa dạng tải trọng, phù hợp mọi nhu cầu",
    image: "/images/place-holder/2.png",
    link: "/san-pham/thiet-bi-nang-ha-hiab",
  },
  {
    id: 3,
    title: "Máy Móc Công Trình",
    subtitle: "LOVOL & LIUGONG - Thiết bị xây dựng hàng đầu",
    description: "Hiệu suất cao, giá cạnh tranh",
    image: "/images/place-holder/3.png",
    link: "/san-pham",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative h-[450px] md:h-[550px] lg:h-[700px] overflow-hidden mt-[80px] md:mt-[90px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/images/place-holder/placeholder.jpg"} alt={slide.title} className="w-full h-full object-contain object-center md:scale-90" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-[#63c9fe]/70 via-[#63c9fe]/50 to-[#63c9fe]/20 backdrop-blur-md rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-12 shadow-2xl max-w-3xl">
                <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-primary/90 text-white rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
                  SẢN PHẨM NỔI BẬT
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight text-balance">
                  {slide.title}
                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-gray-800 mb-2 md:mb-3 lg:mb-4 text-balance">{slide.subtitle}</p>
                <p className="text-sm md:text-base lg:text-lg text-gray-700 mb-4 md:mb-6 lg:mb-10 line-clamp-2 md:line-clamp-none">{slide.description}</p>
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 bg-white text-primary px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-lg md:rounded-xl text-sm md:text-base font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Tìm hiểu thêm
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3 bg-black/30 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-6 md:w-8 h-2.5 md:h-3 shadow-lg" 
                : "bg-white/60 w-2.5 md:w-3 h-2.5 md:h-3 hover:bg-white/90 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider