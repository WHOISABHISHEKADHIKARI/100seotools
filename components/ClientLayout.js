"use client";
import { useState } from 'react';
import FloatingActionButton from './FloatingActionButton';
import UserPreferencesPanel from './UserPreferencesPanel';
import PerformanceMonitor from './PerformanceMonitor';

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