'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollAnimation from './ScrollAnimation';
import { Testimonial } from '@/types';

const AUTOPLAY_INTERVAL = 5000; // 5 seconds

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load testimonials from API
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          // Filter only enabled testimonials
          const enabled = data.filter((t: Testimonial) => t.enabled);
          setTestimonials(enabled);
        }
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(slideInterval);
  }, [isPaused, currentIndex, testimonials.length]);

  // Don't render if no testimonials
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse text-white/50">Đang tải đánh giá...</div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

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

          {/* Main Carousel */}
          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Container */}
            <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-10 border border-white/20 overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700/50 overflow-hidden">
                <div
                  key={currentIndex}
                  className="h-full bg-gradient-to-r from-[#5f7ab8] to-[#7a92c9]"
                  style={{
                    animationName: isPaused ? 'none' : 'progressBar',
                    animationDuration: `${AUTOPLAY_INTERVAL}ms`,
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards',
                  }}
                />
              </div>

              {/* Testimonial Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="text-center"
                >
                  {/* Quote Icon */}
                  <svg
                    className="w-12 h-12 text-[#5f7ab8]/30 mx-auto mb-6"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                  >
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
                  </svg>

                  {/* Rating */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <motion.svg
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 italic">
                    "{currentTestimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5f7ab8] to-[#4a6199] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {currentTestimonial.name.split(' ').pop()?.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-white text-lg">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-sm text-[#5f7ab8]">
                        {currentTestimonial.position}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Pause Indicator */}
              {isPaused && (
                <div className="absolute top-4 right-4 flex items-center gap-2 text-white/60 text-xs">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Paused
                </div>
              )}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'bg-[#5f7ab8] scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  {index === currentIndex && (
                    <motion.span
                      layoutId="activeDot"
                      className="absolute inset-0 rounded-full ring-2 ring-[#5f7ab8] ring-offset-2 ring-offset-gray-900"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Slide Counter */}
            <div className="text-center mt-4 text-gray-500 text-sm">
              {currentIndex + 1} / {testimonials.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
