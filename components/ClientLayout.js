"use client";
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Defer non-critical client helpers to reduce initial JS
const PerformanceMonitor = dynamic(() => import('./PerformanceMonitor'), { ssr: false });
const FloatingActionButton = dynamic(() => import('./FloatingActionButton'), { ssr: false });
const UserPreferencesPanel = dynamic(() => import('./UserPreferencesPanel'), { ssr: false });

export default function ClientLayout() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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