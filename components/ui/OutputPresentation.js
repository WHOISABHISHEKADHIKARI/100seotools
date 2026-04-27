"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiCopy, 
  FiCheck, 
  FiDownload, 
  FiEye, 
  FiCode, 
  FiHash, 
  FiMessageSquare,
  FiZap,
  FiClock,
  FiMaximize2,
  FiMinimize2
} from 'react-icons/fi';
import Markdown from '../blog/Markdown';

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
  const isJson = output && (output.trim().startsWith('{') || output.trim().startsWith('['));

  // Reset view when output changes significantly
  useEffect(() => {
    if (isJson) setView('raw');
    else setView('preview');
  }, [isJson, toolSlug]);

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-full transition-all duration-500 ease-in-out ${
      isExpanded ? 'fixed inset-4 z-50 bg-white dark:bg-gray-950 shadow-2xl rounded-2xl' : 'relative'
    }`}>
      {/* Header / Tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 rounded-t-xl">
        <div className="flex bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-lg">
          <button
            onClick={() => setView('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              view === 'preview' 
                ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiEye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setView('raw')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
              view === 'raw' 
                ? 'bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FiCode className="w-3.5 h-3.5" />
            Raw
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!output || isProcessing}
            className="p-2 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all disabled:opacity-30"
            title="Copy to clipboard"
          >
            {isCopied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
          </button>
          <button
            onClick={onDownload}
            disabled={!output || isProcessing}
            className="p-2 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all disabled:opacity-30"
            title="Download results"
          >
            <FiDownload className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
            title={isExpanded ? "Collapse" : "Full Screen"}
          >
            {isExpanded ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-1 relative overflow-hidden bg-white dark:bg-gray-950 border-x border-gray-200 dark:border-gray-800 ${isExpanded ? '' : 'min-h-[400px] h-[500px]'}`}>
        {isProcessing && (
          <div className="absolute inset-0 z-10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-brand-100 dark:border-brand-900/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-sm font-medium text-brand-700 dark:text-brand-400 animate-pulse">
                Analyzing data...
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-0 overflow-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          {!output && !isProcessing ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3">
                <FiZap className="w-10 h-10 text-gray-300 dark:text-gray-700" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ready to Analyze</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                {emptyMessage}
              </p>
            </div>
          ) : (
            <div className={`transition-opacity duration-300 ${isProcessing ? 'opacity-30' : 'opacity-100'}`}>
              {view === 'preview' ? (
                <Markdown text={output} className="max-w-none" />
              ) : (
                <pre className="font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap selection:bg-brand-100 dark:selection:bg-brand-900">
                  {output}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 rounded-b-xl text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FiHash className="w-3 h-3" />
            <span>{charCount} Characters</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiMessageSquare className="w-3 h-3" />
            <span>{wordCount} Words</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
            <FiZap className="w-3 h-3" />
            <span>Instant Processing</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <FiClock className="w-3 h-3" />
            <span>Browser-Side</span>
          </div>
        </div>
      </div>
    </div>
  );
}
