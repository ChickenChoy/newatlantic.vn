'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Testimonial } from '@/types';
import { Section, SectionHeader } from './sections';
import { EASE_BRAND } from './motion/ease';

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
      <Section tone="navy">
        <p className="animate-pulse text-center text-white/60">Đang tải đánh giá...</p>
      </Section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <Section tone="navy">
      <SectionHeader
        eyebrow="Đánh giá khách hàng"
        title="Khách hàng nói gì về chúng tôi"
        intro="Hơn 1000 khách hàng công nghiệp trên cả nước đã chọn NEW ATLANTIC làm đối tác thiết bị."
        layout="center"
        size="d4"
        onDark
        className="mb-16"
      />

      <div
        className="relative mx-auto max-w-4xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative overflow-hidden rounded-card border border-white/14 bg-white/10 p-8 md:p-14">
          {/* Progress bar */}
          <div className="absolute left-0 right-0 top-0 h-0.5 overflow-hidden bg-white/14">
            <div
              key={currentIndex}
              className="h-full bg-accent"
              style={{
                animationName: isPaused ? 'none' : 'progressBar',
                animationDuration: `${AUTOPLAY_INTERVAL}ms`,
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: EASE_BRAND }}
              className="text-center"
            >
              {/* Quote mark */}
              <svg
                className="mx-auto mb-8 h-10 w-10 text-accent"
                fill="currentColor"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>

              {/* Rating */}
              <div
                className="mb-8 flex justify-center gap-1"
                aria-label={`${currentTestimonial.rating} trên 5 sao`}
              >
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <motion.svg
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.3, ease: EASE_BRAND }}
                    className="h-5 w-5 text-accent"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-10 text-lg leading-[1.6] text-white md:text-2xl">
                “{currentTestimonial.text}”
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center gap-4">
                <span className="font-display flex h-16 w-16 items-center justify-center rounded-pill bg-accent text-2xl uppercase tracking-display text-white">
                  {currentTestimonial.name.split(' ').pop()?.charAt(0)}
                </span>
                <div>
                  <p className="font-display text-d6 uppercase leading-display tracking-display text-white">
                    {currentTestimonial.name}
                  </p>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-accent">
                    {currentTestimonial.position}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-all duration-300 ease-brand hover:scale-105 hover:bg-accent md:left-5 md:h-12 md:w-12"
            aria-label="Đánh giá trước"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill border border-white/14 bg-white/10 text-white transition-all duration-300 ease-brand hover:scale-105 hover:bg-accent md:right-5 md:h-12 md:w-12"
            aria-label="Đánh giá tiếp theo"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`h-2.5 rounded-pill transition-all duration-300 ease-brand ${
                index === currentIndex ? 'w-8 bg-accent' : 'w-2.5 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Xem đánh giá ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-white/60">
          {currentIndex + 1} / {testimonials.length}
        </p>
      </div>
    </Section>
  );
}
