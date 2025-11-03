"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true); // Start with dark as default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : true; // default to dark
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button className="btn-secondary" aria-label="Toggle theme">
        <span className="opacity-0">Light Mode</span>
      </button>
    );
  }

  return (
    <button className="btn-secondary" onClick={toggle} aria-label="Toggle theme">
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}