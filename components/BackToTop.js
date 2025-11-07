"use client";

import { useEffect, useState, useCallback } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  // Throttled scroll handler for better performance
  const onScroll = useCallback(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  useEffect(() => {
    const scrollHandler = onScroll();
    window.addEventListener("scroll", scrollHandler, { passive: true });
    // Initial check
    scrollHandler();
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [onScroll]);

  const handleClick = () => {
    try {
      // Try smooth scrolling first
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Announce to screen readers
      const announcer = document.getElementById('back-to-top-announcer');
      if (announcer) {
        announcer.textContent = 'Scrolling to top of page';
        setTimeout(() => {
          announcer.textContent = '';
        }, 1000);
      }
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <div
        id="back-to-top-announcer"
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      ></div>
      <button
        type="button"
        aria-label="Back to top"
        title="Back to top"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`fixed bottom-4 right-4 z-50 inline-flex items-center justify-center p-3 rounded-full bg-brand-600 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 hover:bg-brand-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <FiArrowUp className="w-6 h-6" aria-hidden="true" />
        <span className="sr-only">Back to top</span>
      </button>
    </>
  );
}
