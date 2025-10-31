"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={handleClick}
      className={`fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 hover:bg-brand-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <FiArrowUp className="w-6 h-6" aria-hidden />
      <span className="sr-only">Back to top</span>
    </button>
  );
}