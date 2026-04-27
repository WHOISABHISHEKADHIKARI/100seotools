"use client";
import { useEffect, useRef } from 'react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';

export default function PerformanceMonitor() {
  const { actions } = useUserPreferences();
  const metricsRef = useRef({});
  const observerRef = useRef(null);
  const observersRef = useRef([]);
  const scheduleRef = useRef(null);

  const scheduleUpdate = () => {
    if (scheduleRef.current) {
      try { clearTimeout(scheduleRef.current); } catch { }
    }
    scheduleRef.current = setTimeout(() => {
      try {
        actions.updatePreferences({
          performanceMetrics: {
            ...metricsRef.current,
            lastUpdated: Date.now()
          }
        });
      } catch { }
    }, 0);
  };

  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Use web-vitals mock library
      import('../../lib/web-vitals-mock.mjs').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          metricsRef.current.cls = Math.round(metric.value * 1000) / 1000;
          scheduleUpdate();
        });

        getFID((metric) => {
          metricsRef.current.fid = Math.round(metric.value);
          scheduleUpdate();
        });

        getFCP((metric) => {
          metricsRef.current.fcp = Math.round(metric.value);
          scheduleUpdate();
        });

        getLCP((metric) => {
          metricsRef.current.lcp = Math.round(metric.value);
          scheduleUpdate();
        });

        getTTFB((metric) => {
          metricsRef.current.ttfb = Math.round(metric.value);
          scheduleUpdate();
        });
      }).catch(() => {
        // Fallback to manual implementation
        if ('PerformanceObserver' in window) {
          try {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              metricsRef.current.lcp = Math.round(lastEntry.startTime);
              scheduleUpdate();
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            observerRef.current = lcpObserver;
            observersRef.current.push(lcpObserver);
          } catch (e) {
            console.warn('LCP observer not supported:', e);
          }

          // First Input Delay (FID)
          try {
            const fidObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                metricsRef.current.fid = Math.round(entry.processingStart - entry.startTime);
                scheduleUpdate();
              });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            observersRef.current.push(fidObserver);
          } catch (e) {
            console.warn('FID observer not supported:', e);
          }

          // Cumulative Layout Shift (CLS)
          try {
            let clsValue = 0;
            let clsEntries = [];
            let sessionValue = 0;
            let sessionEntries = [];

            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  const firstSessionEntry = sessionEntries[0];
                  const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

                  if (sessionValue &&
                    entry.startTime - lastSessionEntry.startTime < 1000 &&
                    entry.startTime - firstSessionEntry.startTime < 5000) {
                    sessionValue += entry.value;
                    sessionEntries.push(entry);
                  } else {
                    sessionValue = entry.value;
                    sessionEntries = [entry];
                  }

                  if (sessionValue > clsValue) {
                    clsValue = sessionValue;
                    clsEntries = [...sessionEntries];
                    metricsRef.current.cls = Math.round(clsValue * 1000) / 1000;
                    scheduleUpdate();
                  }
                }
              }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            observersRef.current.push(clsObserver);
          } catch (e) {
            console.warn('CLS observer not supported:', e);
          }

          // Time to First Byte (TTFB)
          try {
            const navigationEntries = performance.getEntriesByType('navigation');
            if (navigationEntries.length > 0) {
              const navEntry = navigationEntries[0];
              metricsRef.current.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);
            }
          } catch (e) {
            console.warn('TTFB measurement not supported:', e);
          }

          // First Contentful Paint (FCP)
          try {
            const fcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              entries.forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                  metricsRef.current.fcp = Math.round(entry.startTime);

                  actions.updatePreferences({
                    performanceMetrics: {
                      ...metricsRef.current,
                      lastUpdated: Date.now()
                    }
                  });
                }
              });
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
            observersRef.current.push(fcpObserver);
          } catch (e) {
            console.warn('FCP observer not supported:', e);
          }

          // CSS resource timing (baseline for blocking CSS impact)
          try {
            const resourceObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const cssEntries = entries.filter((e) => {
                return e.initiatorType === 'link' || (typeof e.name === 'string' && e.name.includes('.css'));
              });

              if (cssEntries.length) {
                // Track the slowest CSS load as baseline
                const slowest = cssEntries.reduce((max, e) => (e.duration > max.duration ? e : max), cssEntries[0]);
                metricsRef.current.cssLoadTime = Math.round(slowest.duration);
                metricsRef.current.cssEntry = slowest.name;

                // Optional: log for A/B baseline comparison
                console.log('[Perf] CSS loaded:', slowest.name, `${Math.round(slowest.duration)}ms`);
                scheduleUpdate();
              }
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
            observersRef.current.push(resourceObserver);
          } catch (e) {
            console.warn('Resource timing not supported:', e);
          }
        }
      });

      // Track page load time
      const loadHandler = () => {
        setTimeout(() => {
          const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
          metricsRef.current.pageLoadTime = loadTime;

          scheduleUpdate();
        }, 0);
      };
      window.addEventListener('load', loadHandler);

      // Real-time sampling and alerts: store snapshots every minute
      const SAMPLE_KEY = 'perf_samples';
      const ALERTS_KEY = 'perf_alerts';
      const baselineKey = 'perf_baseline_tti';
      const pushSample = () => {
        try {
          const sample = { ...metricsRef.current, ts: Date.now() };
          const arr = JSON.parse(localStorage.getItem(SAMPLE_KEY) || '[]');
          arr.push(sample);
          localStorage.setItem(SAMPLE_KEY, JSON.stringify(arr.slice(-120)));

          // Initialize TTI baseline using FCP+FID approximation
          const ttiApprox = (sample.fcp || 0) + (sample.fid || 0);
          if (!Number.isFinite(Number(localStorage.getItem(baselineKey))) && ttiApprox > 0) {
            localStorage.setItem(baselineKey, String(ttiApprox));
          }

          // Threshold alerts
          const alerts = JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
          const baselineTti = Number(localStorage.getItem(baselineKey)) || 0;
          const newAlerts = [];
          if (sample.cssLoadTime && sample.cssLoadTime > 250) {
            newAlerts.push({ type: 'key_path_delay', value: sample.cssLoadTime, ts: sample.ts });
          }
          if (sample.fcp && sample.fcp > 100) {
            newAlerts.push({ type: 'fcp_timeout', value: sample.fcp, ts: sample.ts });
          }
          if (baselineTti > 0 && ttiApprox > 0) {
            const delta = Math.abs(ttiApprox - baselineTti) / baselineTti;
            if (delta >= 0.15) {
              newAlerts.push({ type: 'tti_degradation', value: ttiApprox, baseline: baselineTti, delta, ts: sample.ts });
            }
          }
          if (newAlerts.length) {
            localStorage.setItem(ALERTS_KEY, JSON.stringify([...alerts, ...newAlerts].slice(-200)));
            for (const a of newAlerts) {
              console.warn('[Perf Alert]', a.type, a);
            }
          }
        } catch (e) {
          // ignore storage errors
        }
      };

      const samplingInterval = setInterval(pushSample, 60_000);

      // Track user engagement
      let startTime = Date.now();
      let isActive = true;

      const trackEngagement = () => {
        if (isActive) {
          const sessionTime = Date.now() - startTime;
          metricsRef.current.sessionTime = sessionTime;

          scheduleUpdate();
        }
      };

      // Track visibility changes
      const handleVisibilityChange = () => {
        if (document.hidden) {
          isActive = false;
          trackEngagement();
        } else {
          isActive = true;
          startTime = Date.now();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Track engagement every 30 seconds
      const engagementInterval = setInterval(trackEngagement, 30000);

      // Track before page unload
      window.addEventListener('beforeunload', trackEngagement);

      return () => {
        clearInterval(engagementInterval);
        clearInterval(samplingInterval);
        window.removeEventListener('load', loadHandler);
        window.removeEventListener('beforeunload', trackEngagement);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (observerRef.current) {
          try { observerRef.current.disconnect(); } catch { }
        }
        if (Array.isArray(observersRef.current)) {
          for (const obs of observersRef.current) {
            try { obs.disconnect(); } catch { }
          }
          observersRef.current = [];
        }
      };
    };

    // Start tracking after a short delay to ensure page is loaded
    const timeoutId = setTimeout(trackWebVitals, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [actions]);

  // Track scroll depth
  useEffect(() => {
    let maxScrollDepth = 0;

    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        metricsRef.current.maxScrollDepth = maxScrollDepth;

        actions.updatePreferences({
          performanceMetrics: {
            ...metricsRef.current,
            lastUpdated: Date.now()
          }
        });
      }
    };

    const throttledScrollTracker = throttle(trackScrollDepth, 1000);
    window.addEventListener('scroll', throttledScrollTracker, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScrollTracker);
    };
  }, [actions]);

  return null; // This component doesn't render anything
}

// Throttle function to limit how often a function can be called
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
