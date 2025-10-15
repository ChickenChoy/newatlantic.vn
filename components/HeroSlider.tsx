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
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden mt-[140px] md:mt-[150px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={slide.image || "/images/place-holder/placeholder.jpg"} alt={slide.title} className="w-full h-full object-contain object-center scale-90" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="container mx-auto px-4">
              <div className="inline-block bg-gradient-to-r from-black/70 via-black/50 to-black/20 backdrop-blur-md rounded-3xl p-10 md:p-12 shadow-2xl max-w-3xl">
                <div className="inline-block px-4 py-2 bg-primary/90 text-white rounded-full text-sm font-semibold mb-6">
                  SẢN PHẨM NỔI BẬT
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-4 text-balance">{slide.subtitle}</p>
                <p className="text-lg text-gray-300 mb-10">{slide.description}</p>
                <Link
                  href={slide.link}
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Tìm hiểu thêm
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-white w-8 h-3 shadow-lg" 
                : "bg-white/60 w-3 h-3 hover:bg-white/90 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlider