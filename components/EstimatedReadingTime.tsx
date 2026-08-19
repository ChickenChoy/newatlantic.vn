'use client';

import { useState, useEffect } from 'react';

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
    <span className={`flex items-center gap-2 text-sm ${className}`}>
      <svg
        className="h-4 w-4 text-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        <span className="font-semibold">{readingTime} phút</span> đọc
        <span aria-hidden="true" className="mx-2 opacity-40">•</span>
        <span className="opacity-70">{wordCount.toLocaleString()} từ</span>
      </span>
    </span>
  );
}
