/**
 * Performance monitoring utility for tracking bundle size and metrics
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      bundleSize: 0,
      lcp: 0,
      fcp: 0,
      wastedBytes: 0,
      polyfillSize: 0,
      modernBundleSize: 0,
      legacyBundleSize: 0,
    };
    this.startTime = Date.now();
  }

  // Track bundle sizes
  trackBundleSize(type, size) {
    this.metrics[`${type}BundleSize`] = size;
    console.log(`📦 ${type} bundle size: ${(size / 1024).toFixed(2)} KB`);
  }

  // Track Core Web Vitals
  trackCoreWebVitals() {
    if (typeof window !== 'undefined') {
      // Track Largest Contentful Paint (LCP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.lcp = entry.startTime;
          console.log(`🎯 LCP: ${entry.startTime.toFixed(2)}ms`);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Contentful Paint (FCP)
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.fcp = entry.startTime;
          console.log(`🎨 FCP: ${entry.startTime.toFixed(2)}ms`);
        }
      }).observe({ entryTypes: ['paint'] });

      // Track wasted bytes from unused polyfills
      this.trackWastedBytes();
    }
  }

  // Calculate wasted bytes from unused polyfills
  trackWastedBytes() {
    const baselineFeatures = [
      'Array.prototype.at',
      'Array.prototype.flat',
      'Array.prototype.flatMap',
      'Object.fromEntries',
      'Object.hasOwn',
      'String.prototype.trimEnd',
      'String.prototype.trimStart',
    ];

    let wastedBytes = 0;

    // Estimate polyfill sizes (approximate)
    const polyfillSizes = {
      'Array.prototype.at': 500,
      'Array.prototype.flat': 300,
      'Array.prototype.flatMap': 350,
      'Object.fromEntries': 400,
      'Object.hasOwn': 200,
      'String.prototype.trimEnd': 150,
      'String.prototype.trimStart': 150,
    };

    baselineFeatures.forEach(feature => {
      if (this.isFeatureSupported(feature)) {
        wastedBytes += polyfillSizes[feature] || 0;
      }
    });

    this.metrics.wastedBytes = wastedBytes;
    console.log(`🗑️ Wasted bytes from unused polyfills: ${wastedBytes} bytes`);
  }

  // Check if a feature is supported
  isFeatureSupported(feature) {
    try {
      switch (feature) {
        case 'Array.prototype.at':
          return typeof Array.prototype.at === 'function';
        case 'Array.prototype.flat':
          return typeof Array.prototype.flat === 'function';
        case 'Array.prototype.flatMap':
          return typeof Array.prototype.flatMap === 'function';
        case 'Object.fromEntries':
          return typeof Object.fromEntries === 'function';
        case 'Object.hasOwn':
          return typeof Object.hasOwn === 'function';
        case 'String.prototype.trimEnd':
          return typeof String.prototype.trimEnd === 'function';
        case 'String.prototype.trimStart':
          return typeof String.prototype.trimStart === 'function';
        default:
          return false;
      }
    } catch (e) {
      return false;
    }
  }

  // Get performance report
  getReport() {
    const totalSavings = this.metrics.wastedBytes;
    const modernSavings = this.metrics.modernBundleSize > 0 ?
      Math.max(0, this.metrics.legacyBundleSize - this.metrics.modernBundleSize) : 0;

    return {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      savings: {
        wastedBytes: totalSavings,
        modernBundleSavings: modernSavings,
        totalSavings: totalSavings + modernSavings,
      },
      recommendations: this.generateRecommendations(),
    };
  }

  // Generate optimization recommendations
  generateRecommendations() {
    const recommendations = [];

    if (this.metrics.wastedBytes > 10000) {
      recommendations.push('Consider removing unused polyfills to save bandwidth');
    }

    if (this.metrics.lcp > 2500) {
      recommendations.push('LCP is above 2.5s - optimize critical rendering path');
    }

    if (this.metrics.fcp > 1800) {
      recommendations.push('FCP is above 1.8s - consider code splitting improvements');
    }

    if (this.metrics.modernBundleSize > 200000) {
      recommendations.push('Modern bundle is large - implement more aggressive code splitting');
    }

    return recommendations;
  }

  // Send metrics to analytics
  sendToAnalytics() {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metrics', {
        lcp: this.metrics.lcp,
        fcp: this.metrics.fcp,
        bundle_size: this.metrics.modernBundleSize,
        wasted_bytes: this.metrics.wastedBytes,
        load_time: Date.now() - this.startTime,
      });
    }
  }
}

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  const monitor = new PerformanceMonitor();

  if (typeof window !== 'undefined') {
    // Start monitoring after page load
    window.addEventListener('load', () => {
      monitor.trackCoreWebVitals();

      // Send metrics after a delay to ensure all data is collected
      setTimeout(() => {
        monitor.sendToAnalytics();
        console.log('📊 Performance Report:', monitor.getReport());
      }, 3000);
    });
  }

  return monitor;
};

export default PerformanceMonitor;
