"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { HeroSlide } from "@/types"

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const defaultSlides: HeroSlide[] = [
  {
    id: "1",
    title: "NEW ATLANTIC",
    subtitle: "THIẾT BỊ CÔNG NGHỆ CAO",
    description: "Mỗi sản phẩm New Atlantic là sự kết tinh của đẳng cấp và công nghệ tiên tiến, mang đến cho bạn những giải pháp tối ưu cho công việc và dự án.",
    image: "/images/place-holder/telescopic-mast-tower.jpg",
    link: "/san-pham",
    linkText: "Xem thêm",
    order: 1,
    enabled: true,
  },
]

export function HeroSlider({ slides: propSlides }: HeroSliderProps) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // Ensure client-side only rendering for animations
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Lazy load video after component mounts
  useEffect(() => {
    if (isMounted && videoRef.current) {
      // Delay video loading slightly to prioritize critical content
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load()
        }
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isMounted])

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide, isAutoPlaying])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    setIsAutoPlaying(false) // Pause auto-play during touch
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }

    // Resume auto-play after 3 seconds
    setTimeout(() => {
      setIsAutoPlaying(true)
    }, 3000)
  }

  // Mouse handlers for desktop
  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  return (
    <div>
      {/* Hero Slider Section */}
      <section
        ref={sliderRef}
        className="relative min-h-[600px] h-[calc(100vh-80px)] sm:h-[calc(100vh-60px)] md:h-screen overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {/* Background with Enhanced Animation */}
            <div
              className={`absolute inset-0 transition-all duration-[1000ms] ease-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              style={{
                transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
              }}
              suppressHydrationWarning
            >
              {/* Animated Background Container */}
              <div className="relative w-full h-full overflow-hidden" suppressHydrationWarning>
                {/* Video Background (if available) */}
                {slide.video ? (
                  <>
                    {/* Always show image as base */}
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}
                      />
                    )}
                    {/* Video overlay - only render on client to prevent hydration errors */}
                    {isMounted && (
                      <video
                        ref={index === currentSlide ? videoRef : null}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setVideoLoaded(true)}
                        onError={(e) => {
                          console.warn('HeroSlider video load failed:', slide.video)
                          setVideoLoaded(false)
                        }}
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                        style={{
                          animation: index === currentSlide && videoLoaded ? 'subtleZoom 20s ease-in-out infinite alternate' : 'none'
                        }}
                      >
                        <source src={slide.video} type="video/mp4" />
                      </video>
                    )}
                  </>
                ) : (
                  /* Enhanced Image with Animation (fallback) */
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover transition-all duration-[2000ms] ease-out ${index === currentSlide && isMounted
                        ? "scale-110 opacity-100"
                        : "scale-100 opacity-90"
                      }`}
                    style={{
                      animation: index === currentSlide && isMounted ? 'subtleZoom 20s ease-in-out infinite alternate' : 'none'
                    }}
                  />
                )}

                {/* Enhanced Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70 transition-all duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-90"
                  }`}>
                  {/* Animated light rays effect */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/50 to-transparent transform rotate-12"></div>
                    <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent transform -rotate-12"></div>
                  </div>
                </div>

                {/* Enhanced Particle Effect Overlay */}
                {index === currentSlide && isMounted && (
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center z-20 py-8 sm:py-12">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div
                  className={`max-w-5xl mx-auto text-center transition-all duration-[1500ms] ${index === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                    }`}
                  style={{
                    animation: index === currentSlide && isMounted ? 'slideInFromBottom 1.2s ease-out' : 'none'
                  }}
                  suppressHydrationWarning
                >
                  {slide.label && (
                    <p
                      className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-white/90 mb-3 sm:mb-4 md:mb-6 tracking-[0.15em] sm:tracking-[0.2em] uppercase drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                      style={{
                        animation: index === currentSlide && isMounted ? 'slideInFromTop 1s ease-out 0.2s both' : 'none'
                      }}
                      suppressHydrationWarning
                    >
                      {slide.label}
                    </p>
                  )}
                  <h2
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8 uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight px-2"
                    style={{
                      animation: index === currentSlide && isMounted ? 'slideInFromBottom 1.2s ease-out 0.4s both' : 'none'
                    }}
                    suppressHydrationWarning
                  >
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold text-white mb-4 sm:mb-6 md:mb-8 lg:mb-10 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] px-2"
                      style={{
                        animation: index === currentSlide && isMounted ? 'slideInFromBottom 1.2s ease-out 0.6s both' : 'none'
                      }}
                      suppressHydrationWarning
                    >
                      {slide.subtitle}
                    </h3>
                  )}
                  <p
                    className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white/95 mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 leading-relaxed max-w-4xl mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] px-4"
                    style={{
                      animation: index === currentSlide && isMounted ? 'slideInFromBottom 1.2s ease-out 0.8s both' : 'none'
                    }}
                    suppressHydrationWarning
                  >
                    {slide.description}
                  </p>
                  <Link
                    href={slide.link}
                    className="inline-block px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-5 bg-white/90 hover:bg-white text-gray-900 font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg text-sm sm:text-base md:text-lg"
                    style={{
                      animation: index === currentSlide && isMounted ? 'slideInFromBottom 1.2s ease-out 1s both, float 3s ease-in-out 2s infinite' : 'none'
                    }}
                    suppressHydrationWarning
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