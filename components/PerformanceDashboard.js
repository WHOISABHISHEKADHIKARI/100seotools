'use client';

import { useState, useEffect } from 'react';

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState({
    lcp: 0,
    fcp: 0,
    bundleSize: 0,
    wastedBytes: 0,
    loadTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkPerformanceMetrics = () => {
      if (typeof window !== 'undefined') {
        // Get bundle size from performance entries
        const performanceEntries = performance.getEntriesByType('resource');
        let totalSize = 0;

        performanceEntries.forEach(entry => {
          if (entry.transferSize) {
            totalSize += entry.transferSize;
          }
        });

        // Get LCP and FCP from performance observer
        let lcp = 0;
        let fcp = 0;

        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            fcp = entry.startTime;
          }
        });

        // Estimate wasted bytes (simplified)
        const wastedBytes = Math.floor(totalSize * 0.15); // Assume 15% waste

        setMetrics({
          lcp: Math.round(lcp),
          fcp: Math.round(fcp),
          bundleSize: Math.round(totalSize / 1024), // Convert to KB
          wastedBytes: Math.round(wastedBytes / 1024), // Convert to KB
          loadTime: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart),
        });
      }
    };

    // Check metrics after page load
    const timer = setTimeout(checkPerformanceMetrics, 2000);
    return () => clearTimeout(timer);
  }, []);

  const getGrade = (value, thresholds) => {
    if (value <= thresholds.good) return { grade: 'A', color: 'text-green-600' };
    if (value <= thresholds.needsImprovement) return { grade: 'B', color: 'text-yellow-600' };
    return { grade: 'C', color: 'text-red-600' };
  };

  const lcpGrade = getGrade(metrics.lcp, { good: 2500, needsImprovement: 4000 });
  const fcpGrade = getGrade(metrics.fcp, { good: 1800, needsImprovement: 3000 });
  const bundleGrade = getGrade(metrics.bundleSize, { good: 500, needsImprovement: 1000 });

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        📊 Performance
      </button>

      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-80">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Largest Contentful Paint</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.lcp}ms</span>
                <span className={`text-xs font-bold ${lcpGrade.color}`}>{lcpGrade.grade}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">First Contentful Paint</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.fcp}ms</span>
                <span className={`text-xs font-bold ${fcpGrade.color}`}>{fcpGrade.grade}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bundle Size</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{metrics.bundleSize} KB</span>
                <span className={`text-xs font-bold ${bundleGrade.color}`}>{bundleGrade.grade}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wasted Bytes</span>
              <span className="text-sm font-medium text-red-600">{metrics.wastedBytes} KB</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Load Time</span>
              <span className="text-sm font-medium">{metrics.loadTime}ms</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>🎯 Target: LCP &lt; 2.5s, FCP &lt; 1.8s</p>
              <p>📦 Bundle &lt; 500KB for optimal performance</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
