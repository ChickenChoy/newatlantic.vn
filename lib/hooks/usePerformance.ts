'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      const firstContentfulPaint = fcp ? fcp.startTime : 0;

      // Get LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const largestContentfulPaint = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;

      // Get CLS
      let cumulativeLayoutShift = 0;
      const clsEntries = performance.getEntriesByType('layout-shift');
      clsEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          cumulativeLayoutShift += entry.value;
        }
      });

      // Get FID
      let firstInputDelay = 0;
      const fidEntries = performance.getEntriesByType('first-input');
      if (fidEntries.length > 0) {
        const fid = fidEntries[0] as any;
        firstInputDelay = fid.processingStart - fid.startTime;
      }

      setMetrics({
        loadTime,
        firstContentfulPaint,
        largestContentfulPaint,
        cumulativeLayoutShift,
        firstInputDelay,
      });
      
      setIsLoading(false);
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  return { metrics, isLoading };
}

// Hook for monitoring resource loading
export function useResourceMonitoring() {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      setResources(prev => [...prev, ...entries]);
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return resources;
}

// Hook for preloading critical resources
export function usePreload() {
  const preloadResource = (href: string, as: string) => {
    if (typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (as === 'image') {
      link.setAttribute('imagesizes', '100vw');
      link.setAttribute('imagesrcset', href);
    }
    
    document.head.appendChild(link);
  };

  return { preloadResource };
}
