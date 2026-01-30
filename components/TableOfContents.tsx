'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden sticky top-32">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          <h3 className="font-bold text-white">Mục lục</h3>
        </div>
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
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
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <nav className="p-4 pt-0">
              <ul className="space-y-1">
                {headings.map((heading, index) => (
                  <motion.li
                    key={heading.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 ${
                        activeId === heading.id
                          ? 'bg-blue-500/20 text-blue-400 font-medium'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      } ${
                        heading.level === 3 ? 'pl-6 text-xs' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {activeId === heading.id && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                          />
                        )}
                        <span className={activeId === heading.id ? 'ml-0' : 'ml-3.5'}>
                          {heading.text}
                        </span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
