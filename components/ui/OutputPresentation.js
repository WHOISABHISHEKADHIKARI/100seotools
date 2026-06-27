"use client";

import { useMemo, useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  Eye,
  Code,
  Hash,
  MessageSquare,
  Clock,
  Maximize2,
  Minimize2,
  FileText,
} from 'lucide-react';
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

export default function OutputPresentation({
  output,
  toolSlug,
  isProcessing,
  onCopy,
  onDownload,
  emptyMessage = "No analysis generated yet."
}) {
  const [view, setView] = useState('preview');
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
      onCopy();
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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border border-b-0 border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-3 py-2 dark:border-white/[0.08] dark:from-gray-900 dark:to-gray-950">
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200 dark:bg-gray-950 dark:ring-white/[0.08]">
          <button
            onClick={() => setView('preview')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              view === 'preview'
                ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setView('raw')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              view === 'raw'
                ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            Raw
          </button>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-end gap-1">
          <button
            onClick={handleCopy}
            disabled={!output || isProcessing}
            aria-label="Copy to clipboard"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:hover:bg-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={copyAsHtml}
            disabled={!output || isProcessing}
            aria-label="Copy as HTML"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:hover:bg-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            disabled={!output || isProcessing}
            aria-label="Download results"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 disabled:opacity-30 dark:hover:bg-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse" : "Full Screen"}
            aria-expanded={isExpanded}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-900 dark:hover:bg-gray-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className={`relative flex-1 overflow-hidden border-x border-slate-200/80 bg-white dark:border-white/[0.08] dark:bg-gray-950 ${isExpanded ? '' : 'min-h-[320px] h-[clamp(360px,58vh,560px)]'}`}>
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-gray-950/90">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-6 text-center shadow-2xl shadow-violet-900/5 dark:border-white/[0.08] dark:from-gray-900 dark:to-gray-950">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 p-[2px] shadow-lg shadow-violet-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-white dark:bg-gray-900">
                  <FileText className="h-9 w-9 text-transparent bg-clip-text bg-gradient-to-br from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400" />
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Generating report</p>
              <h3 className="mt-2 text-lg font-extrabold text-slate-950 dark:text-white">{loadingStages[stageIndex]}</h3>
              <div className="mt-5 grid grid-cols-4 gap-2">
                {loadingStages.map((stage, index) => (
                  <div
                    key={stage}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index <= stageIndex
                        ? 'bg-gradient-to-r from-violet-500 to-blue-500 shadow-sm shadow-violet-500/30'
                        : 'bg-slate-200 dark:bg-white/[0.06]'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Turning raw data into a polished, actionable report
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 overflow-auto p-4 sm:p-5 md:p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {!output && !isProcessing ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-sm ring-1 ring-slate-200/60 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-950 dark:ring-white/[0.06]">
                <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
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
                  <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-5 shadow-sm dark:border-white/[0.08] dark:from-gray-900 dark:via-gray-950 dark:to-violet-950/20">
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-violet-200/20 to-blue-200/10 blur-3xl dark:from-violet-500/5 dark:to-blue-500/5" />
                    <div className="relative flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Generated report</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white truncate">{report.title}</h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04]">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">{wordCount}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">words</span>
                          </div>
                          <div className="flex items-center gap-1 justify-end">
                            <Clock className="w-2.5 h-2.5 text-slate-400" />
                            <span className="text-[10px] font-semibold text-slate-500">{readingTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {summary && (
                      <div className="relative mt-5 rounded-2xl border-l-4 border-violet-500/40 bg-gradient-to-r from-violet-50/80 to-white/80 p-4 text-sm leading-7 text-slate-700 ring-1 ring-slate-200/60 dark:from-violet-950/20 dark:to-gray-950/80 dark:text-slate-300 dark:ring-white/[0.06]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">Executive Summary</span>
                        </div>
                        <Markdown text={summary.text} className="max-w-none" />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {reportSections.length > 0 ? reportSections.map((section, index) => (
                      <section key={section.heading} className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-violet-200/60 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-violet-500/20 dark:hover:bg-white/[0.04]">
                        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-violet-100/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-violet-500/5" />
                        <div className="relative mb-3 flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-xs font-black text-white shadow-sm">{index + 1}</span>
                          <h4 className="text-lg font-black text-slate-950 dark:text-white">{section.heading}</h4>
                        </div>
                        <Markdown text={section.text} className="max-w-none" />
                      </section>
                    )) : (
                      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
                        <Markdown text={output} className="max-w-none" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/50 to-white p-4 dark:border-white/[0.06] dark:from-gray-900/50 dark:to-gray-950">
                  <div className="mb-3 flex items-center gap-2">
                    <Code className="w-3.5 h-3.5 text-violet-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">Raw Output</span>
                    <span className="text-[10px] font-medium text-slate-400">· {charCount} chars</span>
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-gray-700 selection:bg-violet-100 dark:text-gray-300 dark:selection:bg-violet-900/40">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border border-t-0 border-slate-200/80 bg-gradient-to-r from-slate-50/80 to-white/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 backdrop-blur-sm dark:border-white/[0.06] dark:from-gray-900/80 dark:to-gray-950/80 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Hash className="w-3 h-3 text-violet-500" />
            <span>{charCount.toLocaleString()} <span className="hidden sm:inline">Characters</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-blue-500" />
            <span>{wordCount.toLocaleString()} <span className="hidden sm:inline">Words</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-emerald-500" />
            <span>{readingTime} <span className="hidden sm:inline">Min Read</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400">Local Preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
