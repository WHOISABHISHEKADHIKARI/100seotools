"use client";
import { useEffect, useState } from "react";

export default function SplashScreen({ duration = 1200 }) {
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Ensure the splash renders only after hydration to avoid SSR/client mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => setHidden(true), duration);
    return () => clearTimeout(timer);
  }, [mounted, duration]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-hidden={hidden}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-950 transition-opacity duration-500 ${hidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" aria-hidden />
        <h1 className="text-xl md:text-2xl font-bold">100 SEO Tools</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Free, fast, client-side</p>
      </div>
    </div>
  );
}