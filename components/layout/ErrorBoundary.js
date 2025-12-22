"use client";

import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log details to console for debugging
    console.error('React ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.message || 'An unexpected error occurred. Please try again.';
      return (
        <div
          className="error-container flex flex-col items-center justify-center p-8 mx-auto my-8 max-w-md text-center"
          role="alert"
          aria-live="assertive"
        >
          <FiAlertTriangle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {message}
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
    return this.props.children;
  }
}