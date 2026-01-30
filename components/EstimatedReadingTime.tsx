'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EstimatedReadingTimeProps {
  contentSelector?: string;
  wordsPerMinute?: number;
  className?: string;
}

export default function EstimatedReadingTime({
  contentSelector = '.prose',
  wordsPerMinute = 200,
  className = '',
}: EstimatedReadingTimeProps) {
  const [readingTime, setReadingTime] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);

  useEffect(() => {
    const calculateReadingTime = () => {
      const content = document.querySelector(contentSelector);
      if (!content) return;

      // Get text content
      const text = content.textContent || '';
      
      // Count words (Vietnamese and English)
      // For Vietnamese, we count characters/6 as approximation
      // For English, we count spaces + 1
      const vietnameseChars = (text.match(/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/gi) || []).length;
      const englishWords = text.trim().split(/\s+/).length;
      
      // Approximate word count
      const estimatedWords = englishWords + Math.ceil(vietnameseChars / 6);
      setWordCount(estimatedWords);
      
      // Calculate reading time
      const minutes = Math.ceil(estimatedWords / wordsPerMinute);
      setReadingTime(minutes);
    };

    // Wait for content to render
    const timer = setTimeout(calculateReadingTime, 500);
    return () => clearTimeout(timer);
  }, [contentSelector, wordsPerMinute]);

  if (readingTime === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 text-sm text-gray-400 ${className}`}
    >
      <svg
        className="w-4 h-4 text-blue-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        <span className="font-medium text-white">{readingTime} phút</span> đọc
        <span className="text-gray-500 mx-1">•</span>
        <span className="text-gray-500">{wordCount.toLocaleString()} từ</span>
      </span>
    </motion.div>
  );
}
