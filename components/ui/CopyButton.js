"use client";
import { useState } from "react";

export default function CopyButton({ text, className = "", ariaLabel = "Copy to clipboard" }) {
  const [copied, setCopied] = useState(false);

  const copyFallback = (str) => {
    const textarea = document.createElement("textarea");
    textarea.value = str;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand("copy"); } catch {}
    document.body.removeChild(textarea);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        copyFallback(text);
      }
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      // As a last resort, try the fallback
      try { copyFallback(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={`px-2.5 py-1.5 text-xs rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition ${className}`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}