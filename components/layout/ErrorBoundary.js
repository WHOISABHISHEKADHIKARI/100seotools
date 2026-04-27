"use client";

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

/**
 * Fallback UI component shown when an error is caught
 */
function ErrorFallback({ error, resetErrorBoundary }) {
  const message = error?.message || 'An unexpected error occurred. Please try again.';
  
  return (
    <div
      className="error-container flex flex-col items-center justify-center p-8 mx-auto my-8 max-w-md text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 shadow-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
        <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" aria-hidden="true" />
      </div>
      
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
      
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={resetErrorBoundary}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          aria-label="Try again"
        >
          <FiRefreshCw aria-hidden="true" className="w-4 h-4" />
          Try Again
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-6 py-2.5 rounded-lg font-medium transition-all"
        >
          Reload Page
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && error?.stack && (
        <details className="mt-8 text-left w-full bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-xs">
          <summary className="cursor-pointer text-gray-400 hover:text-gray-600 font-mono">
            Error Details
          </summary>
          <pre className="mt-2 text-red-500 dark:text-red-400 whitespace-pre-wrap font-mono overflow-x-auto max-h-40">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}

/**
 * Modern ErrorBoundary wrapper
 */
export default function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Optional: clear any state that might have caused the error
        console.log('Error boundary reset triggered');
      }}
    >
      {children}
    </ErrorBoundary>
  );
}