"use client";

import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';

/**
 * BackToTop Component
 * A floating button that appears when scrolling down, allowing users to quickly return to the top.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
    }`}>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="group flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
      >
        <FiArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
