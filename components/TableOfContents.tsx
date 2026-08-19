'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE_BRAND } from './motion/ease';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
  minHeadingLevel?: number;
  maxHeadingLevel?: number;
}

export default function TableOfContents({
  contentSelector = '.prose',
  minHeadingLevel = 2,
  maxHeadingLevel = 3,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Extract headings from content
    const extractHeadings = () => {
      const content = document.querySelector(contentSelector);
      if (!content) return;

      const headingElements = content.querySelectorAll(
        Array.from(
          { length: maxHeadingLevel - minHeadingLevel + 1 },
          (_, i) => `h${minHeadingLevel + i}`
        ).join(', ')
      );

      const items: TOCItem[] = Array.from(headingElements).map((heading, index) => {
        // Generate ID if not exists
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }

        return {
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName[1]),
        };
      });

      setHeadings(items);
    };

    // Wait for content to render
    const timer = setTimeout(extractHeadings, 500);
    return () => clearTimeout(timer);
  }, [contentSelector, minHeadingLevel, maxHeadingLevel]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = document.querySelectorAll(
        Array.from(
          { length: maxHeadingLevel - minHeadingLevel + 1 },
          (_, i) => `h${minHeadingLevel + i}`
        ).join(', ')
      );

      let currentActiveId = '';
      headingElements.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 200) {
          currentActiveId = heading.id;
        }
      });

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [minHeadingLevel, maxHeadingLevel]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-card border border-navy/14 bg-surface">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center justify-between gap-3 p-6 transition-colors duration-300 ease-brand hover:bg-navy/[0.04]"
      >
        <span className="flex items-center gap-3">
          <svg
            className="h-5 w-5 text-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <span className="font-display text-d6 uppercase leading-display tracking-display text-navy">
            Mục lục
          </span>
        </span>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE_BRAND }}
          className="h-5 w-5 shrink-0 text-navy"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_BRAND }}
            className="overflow-hidden"
          >
            <nav className="px-4 pb-6">
              <ul className="space-y-1 border-t border-navy/14 pt-4">
                {headings.map((heading) => {
                  const isActive = activeId === heading.id;
                  return (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`w-full rounded-card px-3 py-2 text-left text-sm transition-colors duration-300 ease-brand ${
                          isActive
                            ? 'bg-navy font-semibold text-white'
                            : 'text-ink hover:bg-navy/[0.06] hover:text-navy'
                        } ${heading.level === 3 ? 'pl-7 text-xs' : ''}`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-pill transition-colors duration-300 ease-brand ${
                              isActive ? 'bg-accent' : 'bg-navy/30'
                            }`}
                          />
                          <span>{heading.text}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
