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

  // Register service worker for performance optimization
  useEffect(() => {
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
      <PerformanceMonitor />
      <FloatingActionButton onOpenPreferences={handleOpenPreferences} />
      <UserPreferencesPanel 
        isOpen={showPreferences}
        onClose={handleClosePreferences}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </>
  );
}