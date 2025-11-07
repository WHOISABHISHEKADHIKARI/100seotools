"use client";
import { useState, useRef, useEffect } from 'react';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import {
  FiSettings,
  FiHeart,
  FiClock,
  FiDownload,
  FiSearch,
  FiBookmark,
  FiPlus,
  FiX,
  FiMenu
} from 'react-icons/fi';

export default function FloatingActionButton({ onOpenPreferences }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const { favorites, history, recentSearches, actions } = useUserPreferences();
  const fabRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickActions = [
    {
      id: 'preferences',
      icon: FiSettings,
      label: 'Preferences',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => {
        onOpenPreferences();
        setIsExpanded(false);
      }
    },
    {
      id: 'favorites',
      icon: FiHeart,
      label: `Favorites (${favorites.length})`,
      color: 'bg-red-500 hover:bg-red-600',
      action: () => {
        onOpenPreferences('favorites');
        setIsExpanded(false);
      }
    },
    {
      id: 'history',
      icon: FiClock,
      label: `History (${history.length})`,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => {
        onOpenPreferences('history');
        setIsExpanded(false);
      }
    },
    {
      id: 'searches',
      icon: FiSearch,
      label: `Recent Searches (${recentSearches.length})`,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => {
        onOpenPreferences('searches');
        setIsExpanded(false);
      }
    },
    {
      id: 'export',
      icon: FiDownload,
      label: 'Export Data',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => {
        actions.exportData();
        setIsExpanded(false);
      }
    }
  ];

  return (
    <div
      ref={fabRef}
      className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3"
    >
      {/* Quick Action Buttons */}
      {isExpanded && (
        <div className="flex flex-col-reverse gap-3 animate-in slide-in-from-bottom-2 duration-200">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={action.id} className="relative">
                <button
                  onClick={action.action}
                  onMouseEnter={() => setShowTooltip(action.id)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className={`w-12 h-12 rounded-full ${action.color} text-white shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInUp 0.3s ease-out forwards'
                  }}
                  aria-label={action.label}
                >
                  <Icon className="w-5 h-5" />
                </button>

                {/* Tooltip */}
                {showTooltip === action.id && (
                  <div className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
                    {action.label}
                    <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-lg transition-all duration-300 flex items-center justify-center ${
          isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
        }`}
        aria-label={isExpanded ? 'Close menu' : 'Open quick actions'}
      >
        {isExpanded ? (
          <FiX className="w-6 h-6" />
        ) : (
          <FiMenu className="w-6 h-6" />
        )}
      </button>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
