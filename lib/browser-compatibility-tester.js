/**
 * Simple browser compatibility tester used by the UI widget.
 */

class BrowserCompatibilityTester {
  constructor() {
    this.timestamp = Date.now();
  }

  detectBrowser() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    let browser = 'Unknown';
    let version = '0';

    if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
      browser = 'Chrome';
      version = (ua.match(/Chrome\/(\d+)/) || [,'0'])[1];
    } else if (/Firefox\//.test(ua)) {
      browser = 'Firefox';
      version = (ua.match(/Firefox\/(\d+)/) || [,'0'])[1];
    } else if (/Safari\//.test(ua) && /Version\//.test(ua)) {
      browser = 'Safari';
      version = (ua.match(/Version\/(\d+)/) || [,'0'])[1];
    } else if (/Edg\//.test(ua)) {
      browser = 'Edge';
      version = (ua.match(/Edg\/(\d+)/) || [,'0'])[1];
    }

    return { browser, version };
  }

  featureChecks() {
    const checks = {
      'ESM Modules': typeof document !== 'undefined' && 'noModule' in document.createElement('script') === false,
      'Array.prototype.at': typeof Array.prototype.at === 'function',
      'Array.prototype.flat': typeof Array.prototype.flat === 'function',
      'Array.prototype.flatMap': typeof Array.prototype.flatMap === 'function',
      'Object.fromEntries': typeof Object.fromEntries === 'function',
      'Object.hasOwn': typeof Object.hasOwn === 'function',
      'String.trimStart/trimEnd': (typeof ''.trimStart === 'function') && (typeof ''.trimEnd === 'function'),
      'PerformanceObserver': typeof PerformanceObserver !== 'undefined',
    };
    return checks;
  }

  computeScore(features) {
    const values = Object.values(features);
    const supported = values.filter(Boolean).length;
    return Math.round((supported / values.length) * 100);
  }

  polyfillRequirements(features) {
    const requirements = [];
    const map = {
      'Array.prototype.at': 'Array.prototype.at',
      'Array.prototype.flat': 'Array.prototype.flat',
      'Array.prototype.flatMap': 'Array.prototype.flatMap',
      'Object.fromEntries': 'Object.fromEntries',
      'Object.hasOwn': 'Object.hasOwn',
      'String.trimStart/trimEnd': 'String.prototype.trimStart/trimEnd',
    };
    Object.entries(features).forEach(([key, supported]) => {
      if (!supported && map[key]) {
        requirements.push({ feature: map[key] });
      }
    });
    return requirements;
  }

  recommendations(score) {
    if (score >= 90) return { level: 'excellent', message: 'Your browser supports modern features. No action needed.' };
    if (score >= 70) return { level: 'good', message: 'Good support. Consider updating for best performance.' };
    if (score >= 50) return { level: 'fair', message: 'Partial support. Some features may be degraded.' };
    return { level: 'poor', message: 'Limited support. Update browser or enable polyfills.' };
  }

  generateReport() {
    const browser = this.detectBrowser();
    const features = this.featureChecks();
    const score = this.computeScore(features);
    const compatibility = {
      polyfillRequired: this.polyfillRequirements(features),
    };
    const recommendation = this.recommendations(score);
    const optimizations = [];
    if (score < 90) {
      optimizations.push('Enable modern polyfills selectively');
      optimizations.push('Update to latest stable browser version');
    }
    return {
      timestamp: this.timestamp,
      browser,
      features,
      score,
      compatibility,
      recommendation,
      optimizations,
    };
  }
}

export default BrowserCompatibilityTester;