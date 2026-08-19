'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FAQ } from '@/types';
import { Section, SectionHeader, ArrowButton } from './sections';
import Reveal from './motion/Reveal';
import { EASE_BRAND } from './motion/ease';

export default function FAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  // Load FAQs from API
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          // Filter only enabled FAQs
          const enabled = data.filter((f: FAQ) => f.enabled);
          setFaqs(enabled);
        }
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Don't render if no FAQs
  if (loading) {
    return (
      <Section>
        <p className="animate-pulse text-center text-muted">Đang tải câu hỏi...</p>
      </Section>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <Section>
      <div className="mx-auto max-w-4xl">
        <SectionHeader
        eyebrow="Câu hỏi thường gặp"
        title="Bạn cần biết thêm điều gì?"
        intro="Những thắc mắc chúng tôi nhận được nhiều nhất về thiết bị, bảo hành và triển khai."
        layout="center"
        size="d4"
        className="mb-16"
      />

      <div className="divide-y divide-navy/14 border-y border-navy/14">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.id}>
              <h3>
                <button
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className={`font-display text-d6 uppercase leading-display tracking-display transition-colors duration-300 ease-brand ${
                      isOpen ? 'text-accent' : 'text-navy group-hover:text-accent'
                    }`}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-pill border transition-all duration-300 ease-brand ${
                      isOpen
                        ? 'border-accent bg-accent text-white'
                        : 'border-navy/14 bg-surface text-navy group-hover:border-accent group-hover:text-accent'
                    }`}
                  >
                    <svg
                      className={`h-5 w-5 transition-transform duration-300 ease-brand ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? undefined : { height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_BRAND }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-8 pr-16 text-base leading-[1.6] text-ink">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <Reveal delay={200} className="mt-14 flex flex-col items-center gap-6 text-center">
        <p className="text-base text-ink">
          Vẫn còn thắc mắc? Đội kỹ thuật của chúng tôi trả lời trong ngày làm việc.
        </p>
        <ArrowButton href="/lien-he" variant="accent">
          Liên hệ ngay
        </ArrowButton>
      </Reveal>
      </div>
    </Section>
  );
}
