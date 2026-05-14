"use client";

import React, { useMemo, useState, useEffect } from 'react';
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiEye,
  FiCode,
  FiHash,
  FiMessageSquare,
  FiClock,
  FiMaximize2,
  FiMinimize2,
  FiFileText,
} from 'react-icons/fi';
import Markdown from '../blog/Markdown';

const loadingStages = [
  'Reading your input',
  'Finding useful patterns',
  'Building the report',
  'Polishing recommendations',
];

function parseReport(output = '') {
  const lines = output.split('\n');
  const sections = [];
  let title = 'SEO Report';
  let current = null;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      title = trimmed.replace(/^#\s+/, '').trim() || title;
      return;
    }
    if (trimmed.startsWith('## ')) {
      if (current) sections.push(current);
      current = { heading: trimmed.replace(/^##\s+/, '').trim(), body: [] };
      return;
    }
    if (current) current.body.push(line);
  });
  if (current) sections.push(current);

  return {
    title,
    sections: sections
      .map((section) => ({ ...section, text: section.body.join('\n').trim() }))
      .filter((section) => section.text),
  };
}

/**
 * OutputPresentation Component
 * A high-UX wrapper for tool outputs with preview, raw view, and metadata.
 */
export default function OutputPresentation({
  output,
  toolSlug,
  isProcessing,
  onCopy,
  onDownload,
  emptyMessage = "No analysis generated yet."
}) {
  const [view, setView] = useState('preview'); // 'preview' | 'raw'
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const charCount = output?.length || 0;
  const wordCount = output ? output.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  const isJson = output && (output.trim().startsWith('{') || output.trim().startsWith('['));
  const report = useMemo(() => parseReport(output || ''), [output]);
  const summary = report.sections.find((section) => /summary|overview/i.test(section.heading));
  const reportSections = report.sections.filter((section) => section !== summary);
  const [stageIndex, setStageIndex] = useState(0);

  // Reset view when output changes significantly
  useEffect(() => {
    if (isJson) setView('raw');
    else setView('preview');
  }, [isJson, toolSlug]);

  useEffect(() => {
    if (!isProcessing) {
      setStageIndex(0);
      return undefined;
    }
    const timer = setInterval(() => {
      setStageIndex((index) => (index + 1) % loadingStages.length);
    }, 900);
    return () => clearInterval(timer);
  }, [isProcessing]);

  const copyAsHtml = async () => {
    try {
      // Create a temporary div to render the markdown logic into HTML string
      // This is a simple approximation; for perfect results a real md->html lib is better
      // but we can leverage the existing DOM or a simple regex replacement for the clipboard.
      const htmlContent = output
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n/gim, '<br/>');

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([output], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': textBlob })];
      await navigator.clipboard.write(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('HTML Copy failed', err);
      onCopy(); // Fallback to plain copy
    }
  };

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex min-w-0 flex-col transition-all duration-300 ease-out ${
      isExpanded ? 'fixed inset-3 z-50 rounded-2xl bg-white shadow-2xl dark:bg-gray-950' : 'relative'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border border-b-0 border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-white/10 dark:bg-white/5">
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-gray-950 dark:ring-white/10">
          <button
            onClick={() => setView('preview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              view === 'preview'
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FiEye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setView('raw')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              view === 'raw'
                ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FiCode className="w-3.5 h-3.5" />
            Raw
          </button>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-end gap-1">
          <button
            onClick={handleCopy}
            disabled={!output || isProcessing}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:hover:bg-gray-900 dark:hover:text-white"
            title="Copy to clipboard"
          >
            {isCopied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
          </button>
          <button
            onClick={copyAsHtml}
            disabled={!output || isProcessing}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:hover:bg-gray-900 dark:hover:text-white"
            title="Copy as HTML (for WordPress/CMS)"
          >
            <FiFileText className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            disabled={!output || isProcessing}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:hover:bg-gray-900 dark:hover:text-white"
            title="Download results"
          >
            <FiDownload className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 dark:hover:bg-gray-900 dark:hover:text-white"
            title={isExpanded ? "Collapse" : "Full Screen"}
          >
            {isExpanded ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`relative flex-1 overflow-hidden border-x border-slate-200 bg-white dark:border-white/10 dark:bg-gray-950 ${isExpanded ? '' : 'min-h-[320px] h-[clamp(360px,58vh,560px)]'}`}>
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm dark:bg-gray-950/80">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-gray-900">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-[conic-gradient(from_180deg,#0f172a,#64748b,#e2e8f0,#0f172a)] p-1">
                <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-white dark:bg-gray-900">
                  <FiFileText className="h-9 w-9 text-slate-800 dark:text-white" />
                </div>
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">Generating report</p>
              <h3 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">{loadingStages[stageIndex]}</h3>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {loadingStages.map((stage, index) => (
                  <div key={stage} className={`h-1.5 rounded-full transition-colors ${index <= stageIndex ? 'bg-slate-950 dark:bg-white' : 'bg-slate-200 dark:bg-white/10'}`} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                We are turning the raw response into a clean, useful report.
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 overflow-auto p-4 sm:p-5 md:p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {!output && !isProcessing ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-inner ring-1 ring-slate-100 dark:bg-gray-900 dark:ring-white/10">
                <FiFileText className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">Ready for output</h3>
              <p className="mx-auto max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </p>
            </div>
          ) : (
            <div className={`transition-opacity duration-300 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}>
              {view === 'preview' ? (
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_55%,#eef2ff_100%)] p-5 shadow-sm dark:border-white/10 dark:bg-[linear-gradient(135deg,#111827_0%,#020617_100%)]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Generated report</p>
                        <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{report.title}</h3>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right text-xs shadow-sm dark:border-white/10 dark:bg-white/5">
                        <div className="font-bold text-slate-950 dark:text-white">{wordCount} words</div>
                        <div className="text-slate-500">{readingTime} min read</div>
                      </div>
                    </div>
                    {summary && (
                      <div className="mt-5 rounded-2xl bg-white/80 p-4 text-sm leading-7 text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-300 dark:ring-white/10">
                        <Markdown text={summary.text} className="max-w-none" />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {reportSections.length > 0 ? reportSections.map((section, index) => (
                      <section key={section.heading} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-white/[0.03]">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-extrabold text-white dark:bg-white dark:text-slate-950">{index + 1}</span>
                          <h4 className="text-lg font-extrabold text-slate-950 dark:text-white">{section.heading}</h4>
                        </div>
                        <Markdown text={section.text} className="max-w-none" />
                      </section>
                    )) : (
                      <Markdown text={output} className="max-w-none" />
                    )}
                  </div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-gray-700 selection:bg-slate-100 dark:text-gray-300 dark:selection:bg-slate-800">
                  {output}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border border-t-0 border-slate-200 bg-slate-50/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <FiHash className="w-3 h-3" />
            <span>{charCount} Characters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiMessageSquare className="w-3 h-3" />
            <span>{wordCount} Words</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiClock className="w-3 h-3" />
            <span>{readingTime} Min Read</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <FiClock className="w-3 h-3" />
            <span>Local Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
