"use client";
import React, { useState, useEffect } from 'react';
import PerformanceMonitor from '../ui/PerformanceMonitor';
import UserPreferencesPanel from '../ui/UserPreferencesPanel';
import BackToTop from '../ui/BackToTop';

export default function ClientLayout() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isIdle, setIsIdle] = useState(false);

  // Register service worker for performance optimization
  useEffect(() => {
    // Gate non-critical work behind idle time to protect LCP
    const onIdle = () => {
      setIsIdle(true);
      if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const localHost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
        if (localHost) {
          navigator.serviceWorker
            .getRegistrations()
            .then((registrations) => registrations.forEach((registration) => registration.unregister()))
            .catch(() => {});
          return;
        }
        navigator.serviceWorker
          .register('/sw.js')
          .catch(() => {});
      }
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(onIdle, { timeout: 2500 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    } else {
      const t = setTimeout(onIdle, 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const handleOpenPreferences = (tab = 'general') => {
    setActiveTab(tab);
    setShowPreferences(true);
  };

  const handleClosePreferences = () => {
    setShowPreferences(false);
  };

  class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() { if (this.state.hasError) { return null; } return this.props.children; }
  }

  return (
    <>
      {isIdle ? (
        <ErrorBoundary>
          <PerformanceMonitor />
        </ErrorBoundary>
      ) : null}
      {isIdle ? (
        <ErrorBoundary>
          <UserPreferencesPanel
            isOpen={showPreferences}
            onClose={handleClosePreferences}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </ErrorBoundary>
      ) : null}
      <BackToTop />
    </>
  );
}
