"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HeroSlide } from "@/types"
import { ArrowButton, Eyebrow } from "./sections"
import { EASE_BRAND } from "./motion/ease"

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

/** Per-slide media state. A single shared flag mis-reports every other slide. */
type VideoState = 'loading' | 'ready' | 'failed';

export function HeroSlider({ slides: propSlides }: HeroSliderProps) {
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [videoState, setVideoState] = useState<Record<string, VideoState>>({})
  const sliderRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const reduceMotion = useReducedMotion()

  const markVideo = (id: string, state: VideoState) =>
    setVideoState(prev => (prev[id] === state ? prev : { ...prev, [id]: state }))

  // Ensure client-side only rendering for animations
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // NOTE: there used to be a setTimeout here calling videoRef.current.load().
  // Calling load() on an element that is already fetching ABORTS the in-flight
  // request and resets the element, which fights `autoPlay` and can stop
  // `loadeddata` from ever firing — leaving the video stuck at opacity-0 even
  // when the file is perfectly fine. The browser handles loading on its own.

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || slides.length < 2) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [currentSlide, isAutoPlaying, slides.length])

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

  // Copy rises in sequence: eyebrow, headline, subtitle, body, action.
  const step = (index: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: EASE_BRAND, delay: 0.15 + index * 0.12 },
        }

  return (
    <section
      ref={sliderRef}
      className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-navy pb-16 pt-[140px] md:min-h-screen md:pb-24 md:pt-[200px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-roledescription="carousel"
    >
      {/* Backdrops — one per slide, cross-faded */}
      {slides.map((slide, index) => {
        const state = videoState[slide.id] ?? 'loading'
        // Only trust the video once it has actually decoded a frame.
        const showVideo = Boolean(slide.video) && state === 'ready'
        // An empty string as `src` makes the browser re-request the page itself,
        // so the image is only rendered when there is a real path.
        const hasImage = Boolean(slide.image)

        return (
          <div
            key={`bg-${slide.id}`}
            className={`absolute inset-0 -z-10 transition-opacity duration-700 ease-brand ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            {/* Poster: visible until the video is ready, and permanently if it fails. */}
            {hasImage && (
              <img
                src={slide.image}
                alt=""
                className={`absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-700 ${
                  showVideo ? "opacity-0" : "opacity-100"
                }`}
                style={{
                  animation:
                    !slide.video && index === currentSlide && isMounted && !reduceMotion
                      ? 'subtleZoom 20s ease-in-out infinite alternate'
                      : 'none',
                }}
                suppressHydrationWarning
              />
            )}

            {/* Video: dropped from the tree once it has failed, so the browser
                stops retrying a URL we already know is broken. */}
            {slide.video && isMounted && state !== 'failed' && (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={hasImage ? slide.image : undefined}
                onLoadedData={() => markVideo(slide.id, 'ready')}
                onCanPlay={() => markVideo(slide.id, 'ready')}
                onError={() => {
                  console.warn('HeroSlider video load failed:', slide.video)
                  markVideo(slide.id, 'failed')
                }}
                className={`absolute left-1/2 top-1/2 h-auto min-h-full w-auto min-w-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-700 ${
                  showVideo ? "opacity-100" : "opacity-0"
                }`}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            )}

            {/* Navy scrim — carries the display type and lets the nav sit transparent */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
          </div>
        )
      })}

      <div className="mx-auto w-full max-w-site px-5 md:px-gutter">
        <AnimatePresence mode="wait">
          <div key={slides[currentSlide].id} className="max-w-4xl">
            {slides[currentSlide].label && (
              <motion.div {...step(0)} className="mb-8">
                <Eyebrow onDark>{slides[currentSlide].label}</Eyebrow>
              </motion.div>
            )}

            <motion.h1
              {...step(1)}
              className="font-display text-d2 uppercase leading-display tracking-display text-white"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {slides[currentSlide].subtitle && (
              <motion.p
                {...step(2)}
                className="font-display mt-4 text-d4 uppercase leading-display tracking-display text-accent"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
            )}

            <motion.p
              {...step(3)}
              className="mt-8 max-w-2xl text-base leading-[1.6] text-white/80 md:text-lg"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.div {...step(4)} className="mt-10 flex flex-wrap items-center gap-4">
              <ArrowButton href={slides[currentSlide].link} variant="accent">
                {slides[currentSlide].linkText || 'Xem thêm'}
              </ArrowButton>
              <ArrowButton href="/lien-he" variant="outline-light">
                Liên hệ tư vấn
              </ArrowButton>
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Slide controls */}
        {slides.length > 1 && (
          <div className="mt-14 flex items-center gap-3 border-t border-white/14 pt-8">
            {slides.map((slide, index) => (
              <button
                key={`dot-${slide.id}`}
                onClick={() => setCurrentSlide(index)}
                className={`h-1 rounded-pill transition-all duration-300 ease-brand ${
                  index === currentSlide ? 'w-14 bg-accent' : 'w-8 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Xem slide ${index + 1}: ${slide.title}`}
                aria-current={index === currentSlide}
              />
            ))}
            <span className="ml-4 text-sm text-white/60">
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}

export default HeroSlider
