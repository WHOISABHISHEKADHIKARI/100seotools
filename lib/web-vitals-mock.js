// Mock web-vitals module for development
export function getCLS(callback) {
  // Mock Core Web Vitals - Cumulative Layout Shift
  setTimeout(() => {
    callback({
      name: 'CLS',
      value: Math.random() * 0.1, // Random value between 0-0.1
      rating: 'good',
      delta: Math.random() * 0.01,
      id: 'mock-cls-' + Date.now()
    });
  }, 1000);
}

export function getFID(callback) {
  // Mock Core Web Vitals - First Input Delay
  setTimeout(() => {
    callback({
      name: 'FID',
      value: Math.random() * 50, // Random value between 0-50ms
      rating: 'good',
      delta: Math.random() * 10,
      id: 'mock-fid-' + Date.now()
    });
  }, 1500);
}

export function getFCP(callback) {
  // Mock Core Web Vitals - First Contentful Paint
  setTimeout(() => {
    callback({
      name: 'FCP',
      value: 800 + Math.random() * 400, // Random value between 800-1200ms
      rating: 'good',
      delta: Math.random() * 100,
      id: 'mock-fcp-' + Date.now()
    });
  }, 2000);
}

export function getLCP(callback) {
  // Mock Core Web Vitals - Largest Contentful Paint
  setTimeout(() => {
    callback({
      name: 'LCP',
      value: 1200 + Math.random() * 800, // Random value between 1200-2000ms
      rating: 'good',
      delta: Math.random() * 200,
      id: 'mock-lcp-' + Date.now()
    });
  }, 2500);
}

export function getTTFB(callback) {
  // Mock Core Web Vitals - Time to First Byte
  setTimeout(() => {
    callback({
      name: 'TTFB',
      value: 100 + Math.random() * 200, // Random value between 100-300ms
      rating: 'good',
      delta: Math.random() * 50,
      id: 'mock-ttfb-' + Date.now()
    });
  }, 500);
}