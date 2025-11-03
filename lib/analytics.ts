// Google Analytics 4 & Google Tag Manager Integration

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics 4 Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Google Tag Manager ID
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

// ============================================
// GOOGLE ANALYTICS 4 FUNCTIONS
// ============================================

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: false, // We'll send manually
  });
};

/**
 * Track page views
 */
export const pageview = (url: string) => {
  if (typeof window === 'undefined') return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

/**
 * Track custom events
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// ============================================
// ECOMMERCE TRACKING
// ============================================

/**
 * Track product view
 */
export const trackProductView = (product: {
  id: string;
  name: string;
  category: string;
  price?: string;
  brand?: string;
}) => {
  event({
    action: 'view_item',
    category: 'ecommerce',
    label: product.name,
  });
  
  if (typeof window !== 'undefined') {
    window.gtag('event', 'view_item', {
      currency: 'VND',
      value: product.price !== 'Liên hệ' ? parseFloat(product.price || '0') : 0,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand || 'NEW ATLANTIC',
        },
      ],
    });
  }
};

/**
 * Track add to wishlist
 */
export const trackAddToWishlist = (product: {
  id: string;
  name: string;
  category: string;
}) => {
  event({
    action: 'add_to_wishlist',
    category: 'ecommerce',
    label: product.name,
  });
  
  if (typeof window !== 'undefined') {
    window.gtag('event', 'add_to_wishlist', {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
        },
      ],
    });
  }
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
  
  if (typeof window !== 'undefined') {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

/**
 * Track contact form submission
 */
export const trackContactForm = (formType: string) => {
  event({
    action: 'form_submit',
    category: 'engagement',
    label: formType,
  });
  
  if (typeof window !== 'undefined') {
    window.gtag('event', 'generate_lead', {
      currency: 'VND',
      value: 0,
    });
  }
};

/**
 * Track phone call click
 */
export const trackPhoneCall = () => {
  event({
    action: 'phone_call',
    category: 'engagement',
    label: 'Click to call',
  });
};

/**
 * Track email click
 */
export const trackEmailClick = () => {
  event({
    action: 'email_click',
    category: 'engagement',
    label: 'Click to email',
  });
};

/**
 * Track social share
 */
export const trackSocialShare = (platform: string, url: string) => {
  event({
    action: 'share',
    category: 'engagement',
    label: `${platform} - ${url}`,
  });
  
  if (typeof window !== 'undefined') {
    window.gtag('event', 'share', {
      method: platform,
      content_type: 'product',
      item_id: url,
    });
  }
};

/**
 * Track file download
 */
export const trackDownload = (fileName: string, fileType: string) => {
  event({
    action: 'file_download',
    category: 'engagement',
    label: `${fileName} (${fileType})`,
  });
};

/**
 * Track video play
 */
export const trackVideoPlay = (videoName: string) => {
  event({
    action: 'video_start',
    category: 'engagement',
    label: videoName,
  });
};

/**
 * Track outbound link click
 */
export const trackOutboundLink = (url: string) => {
  event({
    action: 'click',
    category: 'outbound',
    label: url,
  });
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage: number) => {
  event({
    action: 'scroll',
    category: 'engagement',
    label: `${percentage}%`,
    value: percentage,
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    value: seconds,
  });
};

// ============================================
// GOOGLE TAG MANAGER FUNCTIONS
// ============================================

/**
 * Push custom event to dataLayer
 */
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window === 'undefined') return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};

/**
 * Track custom GTM event
 */
export const trackGTMEvent = (eventName: string, eventData?: Record<string, any>) => {
  pushToDataLayer({
    event: eventName,
    ...eventData,
  });
};

// ============================================
// PERFORMANCE TRACKING
// ============================================

/**
 * Track Core Web Vitals
 */
export const trackWebVitals = (metric: {
  id: string;
  name: string;
  value: number;
  label: string;
}) => {
  event({
    action: metric.name,
    category: 'Web Vitals',
    label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
  });
};

// ============================================
// ERROR TRACKING
// ============================================

/**
 * Track JavaScript errors
 */
export const trackError = (error: Error, errorInfo?: any) => {
  event({
    action: 'exception',
    category: 'error',
    label: `${error.message} - ${error.stack?.substring(0, 150)}`,
  });
  
  if (typeof window !== 'undefined') {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
    });
  }
};

// ============================================
// USER ENGAGEMENT
// ============================================

/**
 * Track user engagement score
 */
export const trackEngagement = (score: number) => {
  event({
    action: 'engagement_score',
    category: 'user_engagement',
    value: score,
  });
};

/**
 * Track session quality
 */
export const trackSessionQuality = (quality: 'high' | 'medium' | 'low') => {
  event({
    action: 'session_quality',
    category: 'user_engagement',
    label: quality,
  });
};

