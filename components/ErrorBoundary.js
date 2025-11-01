'use client';

import { useEffect, useState } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add global error handler
    const errorHandler = (event) => {
      console.error('Caught in error boundary:', event.error);
      setError(event.error?.message || 'An unexpected error occurred');
      setHasError(true);
      // Prevent the default error dialog
      event.preventDefault();
    };

    // Add event listener for uncaught errors
    window.addEventListener('error', errorHandler);
    
    // Add event listener for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(event.reason?.message || 'An unexpected promise rejection occurred');
      setHasError(true);
      // Prevent the default error dialog
      event.preventDefault();
    });

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div 
        className="error-container flex flex-col items-center justify-center p-8 mx-auto my-8 max-w-md text-center"
        role="alert"
        aria-live="assertive"
      >
        <FiAlertTriangle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {error || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn inline-flex items-center gap-2"
          aria-label="Reload page"
        >
          <FiRefreshCw aria-hidden="true" className="w-4 h-4" />
          Reload Page
        </button>
      </div>
    );
  }

  return children;
}