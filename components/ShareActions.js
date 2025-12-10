"use client";

import { useState } from 'react';

export default function ShareActions({ url = '', title = '' }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');

  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out';

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setStatus('Link copied');
      setTimeout(() => { setCopied(false); setStatus(''); }, 1500);
    } catch (e) {
      setStatus('Copy failed');
      setTimeout(() => setStatus(''), 2000);
    }
  }

  async function onWebShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: fullUrl });
        setStatus('Shared');
        setTimeout(() => setStatus(''), 1500);
      } else {
        // Fallback: open a Tweet intent
        const u = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(fullUrl)}`;
        window.open(u, '_blank');
      }
    } catch {
      setStatus('Share canceled');
      setTimeout(() => setStatus(''), 1500);
    }
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(fullUrl)}`,
  };

  const btn = 'px-3 py-1.5 rounded-md border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-white/10 transition text-sm';
  const iconBtn = 'inline-flex items-center gap-2 ' + btn;

  return (
    <div aria-label="Share actions" className="not-prose flex flex-wrap items-center gap-3">
      <button onClick={onCopy} className={iconBtn} aria-label="Copy link">
        <span role="img" aria-hidden>📋</span>
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>
      <button onClick={onWebShare} className={iconBtn} aria-label="Share">
        <span role="img" aria-hidden></span>
        <span>Share</span>
      </button>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Share on Twitter">
        <span role="img" aria-hidden>🐦</span>
        <span>Twitter</span>
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Share on LinkedIn">
        <span role="img" aria-hidden></span>
        <span>LinkedIn</span>
      </a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label="Share on Facebook">
        <span role="img" aria-hidden>📣</span>
        <span>Facebook</span>
      </a>
      <a href={shareLinks.email} className={iconBtn} aria-label="Share via Email">
        <span role="img" aria-hidden>✉️</span>
        <span>Email</span>
      </a>
      {status ? <span className="text-xs text-slate-600 dark:text-slate-300">{status}</span> : null}
    </div>
  );
}