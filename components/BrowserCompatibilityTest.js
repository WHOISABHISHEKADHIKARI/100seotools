'use client';

import { useState, useEffect } from 'react';
import BrowserCompatibilityTester from '@/lib/browser-compatibility-tester';

export default function BrowserCompatibilityTest() {
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const runTest = () => {
      try {
        const tester = new BrowserCompatibilityTester();
        const results = tester.generateReport();
        setTestResults(results);
      } catch (error) {
        console.error('Browser compatibility test failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    runTest();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRecommendationColor = (level) => {
    switch (level) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!testResults) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        type="button"
        aria-label="Toggle browser compatibility panel"
        aria-expanded={isVisible ? 'true' : 'false'}
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
      >
        <span>🔍</span>
        <span>Compatibility</span>
      </button>

      {isVisible && (
        <div className="absolute bottom-16 left-0 bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-96 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Browser Compatibility Test</h3>

          {/* Browser Info */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Browser</span>
              <span className="text-sm font-bold">
                {testResults.browser.browser} {testResults.browser.version}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Score</span>
              <span className={`text-lg font-bold ${getScoreColor(testResults.score)}`}>
                {testResults.score}%
              </span>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mb-4">
            <div className={`p-3 rounded-lg ${getRecommendationColor(testResults.recommendation.level)}`}>
              <p className="text-sm font-medium">{testResults.recommendation.message}</p>
            </div>
          </div>

          {/* Feature Support */}
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Feature Support</h4>
            <div className="space-y-1">
              {Object.entries(testResults.features).slice(0, 6).map(([feature, supported]) => (
                <div key={`feature-${feature}`} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 truncate">{feature}</span>
                  <span className={`font-bold ${supported ? 'text-green-600' : 'text-red-600'}`}>
                    {supported ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Polyfill Requirements */}
          {testResults.compatibility.polyfillRequired.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">Polyfills Needed</h4>
              <div className="space-y-1">
                {testResults.compatibility.polyfillRequired.slice(0, 3).map(({ feature }) => (
                  <div key={`polyfill-${feature}`} className="text-xs text-orange-600">
                    • {feature}
                  </div>
                ))}
                {testResults.compatibility.polyfillRequired.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{testResults.compatibility.polyfillRequired.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Optimizations */}
          {testResults.optimizations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">Suggestions</h4>
              <div className="space-y-1">
                {testResults.optimizations.map((suggestion) => (
                  <div key={`opt-${suggestion}`} className="text-xs text-blue-600">
                    • {suggestion}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Test completed at {new Date(testResults.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}
