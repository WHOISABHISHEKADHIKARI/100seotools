"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Defer non-critical client helpers to reduce initial JS
const PerformanceMonitor = dynamic(() => import('./PerformanceMonitor'), { ssr: false });
const FloatingActionButton = dynamic(() => import('./FloatingActionButton'), { ssr: false });
const UserPreferencesPanel = dynamic(() => import('./UserPreferencesPanel'), { ssr: false });

export default function ClientLayout() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isIdle, setIsIdle] = useState(false);

  // Register service worker for performance optimization
  useEffect(() => {
    // Gate non-critical work behind idle time to protect LCP
    const onIdle = () => {
      setIsIdle(true);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
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

  return (
    <>
      {isIdle ? <PerformanceMonitor /> : null}
      {isIdle ? <FloatingActionButton onOpenPreferences={handleOpenPreferences} /> : null}
      {isIdle ? (
        <UserPreferencesPanel
          isOpen={showPreferences}
          onClose={handleClosePreferences}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : null}
    </>
  );
}
