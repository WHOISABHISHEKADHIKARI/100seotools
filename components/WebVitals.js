"use client";
import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    // Only load web vitals in production
    if (process.env.NODE_ENV !== 'production') return;

    import('../lib/web-vitals-mock').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      function sendToAnalytics(metric) {
        // Log to console in development, send to analytics in production
        console.log('Web Vital:', metric);
        
        // You can send to Google Analytics, other analytics services, or your own endpoint
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }
      }

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, []);

  return null;
}