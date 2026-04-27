"use client";
import { useMemo, useState, useEffect } from 'react';
import { getTemplateDefinition, runTemplate } from '../../lib/templates';
import { copyToClipboardWithHistory, normalizePastedContent, downloadAllFormats } from '../../lib/utils';
import { sanitizeInput, validateURL, checkInputSize } from '../../lib/security';
import { checkRateLimit } from '../../lib/rateLimit';
import { validateField, validateAllFields } from '../../lib/validation';
import Markdown from '../blog/Markdown';
import ProofTrace from '../prover/ProofTrace';
import OutputPresentation from '../ui/OutputPresentation';

export default function ToolRunner({ tool }) {
  const def = useMemo(() => getTemplateDefinition(tool.template), [tool.template]);
  // Initialize state
  const [inputs, setInputs] = useState(() => {
    // Try to load from session storage during initialization (client-side only technically, but safe in useEffect)
    // Actually, for SSR safety, better to initialize default and load in effect.
    const init = {};
    def.fields.forEach((f) => {
      init[f.name] = f.default ?? '';
    });
    return init;
  });
  const [output, setOutput] = useState('');
  const [proof, setProof] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteFeedback, setPasteFeedback] = useState({ field: null, ts: 0 });
  const [isCopied, setIsCopied] = useState(false);
  const [isLivePreview, setIsLivePreview] = useState(false);

  // Initial inputs helper
  const getInitialInputs = () => {
    const init = {};
    def.fields.forEach((f) => {
      init[f.name] = f.default ?? '';
    });
    return init;
  };

  const resetForm = () => {
    setInputs(getInitialInputs());
    setOutput('');
    setError('');
    setFieldErrors({});
    setIsCopied(false);
  };

  const loadExample = () => {
    const exampleInputs = {};
    let hasExample = false;
    def.fields.forEach((f) => {
      if (f.example !== undefined) {
        exampleInputs[f.name] = f.example;
        hasExample = true;
      } else if (f.placeholder && f.placeholder.startsWith('e.g.')) {
        // Fallback to placeholder if it contains an example
        exampleInputs[f.name] = f.placeholder.replace('e.g.', '').trim();
        hasExample = true;
      }
    });

    if (hasExample) {
      setInputs(prev => ({ ...prev, ...exampleInputs }));
      setError('');
      setFieldErrors({});
    }
  };

  // Load from session storage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem(`tool-inputs-${tool.slug}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setInputs(prev => ({ ...prev, ...parsed }));
        }

        const savedPreview = sessionStorage.getItem(`tool-live-${tool.slug}`);
        if (savedPreview) {
          setIsLivePreview(JSON.parse(savedPreview));
        }
      }
    } catch (e) {
      console.error('Failed to load session', e);
    }
  }, [tool.slug]);

  // Save inputs to session storage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`tool-inputs-${tool.slug}`, JSON.stringify(inputs));
      }
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }, [inputs, tool.slug]);

  // Save live preview preference
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`tool-live-${tool.slug}`, JSON.stringify(isLivePreview));
      }
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }, [isLivePreview, tool.slug]);

  // Debounced execution for Live Preview and Validation
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Validate fields (always run validation logic passively)
      // Note: We duplicate some validation logic here for passive feedback,
      // but we shouldn't block the user from typing.

      if (isLivePreview) {
        // Live preview analysis handled by separate effect below
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [inputs, isLivePreview]);

  const onChange = (name, value) => {
    const field = def.fields.find(f => f.name === name);
    if (!field) return;

    // Clear specific error immediately to avoid "stuck" errors while typing fix
    setFieldErrors(prev => ({ ...prev, [name]: null }));

    // Sanitize and update immediately
    // We keep sanitization as it modifies the input value itself, not just checking it.
    // Use 'text' type for sanitization if not specified to prevent XSS in state
    const sanitized = sanitizeInput(value, field.type || 'text');
    setInputs((prev) => ({ ...prev, [name]: sanitized }));
  };

  const onPaste = (e, name) => {
    try {
      const plain = e.clipboardData?.getData('text/plain') || '';
      const html = e.clipboardData?.getData('text/html') || '';
      const src = plain || html || '';

      if (!src) return;

      // Size limit check
      if (src.length > 100000) {
        setError('Pasted content too large (maximum 100KB). Please paste smaller content.');
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const normalized = normalizePastedContent(src);
      const sanitized = sanitizeInput(normalized, 'text');
      onChange(name, sanitized);

      setPasteFeedback({ field: name, ts: Date.now() });
      setTimeout(() => setPasteFeedback((p) => (p.field === name ? { field: null, ts: 0 } : p)), 2000);
    } catch (error) {
      console.error('Paste error:', error);
      setError('Failed to paste content. Please try again.');
    }
  };

  const analyze = async () => {
    try {
      setError('');
      setFieldErrors({});
      setIsProcessing(true);

      // Rate limiting
      const rateCheck = checkRateLimit(tool.slug, 10, 60000);
      if (!rateCheck.allowed) {
        setError(rateCheck.message);
        setIsProcessing(false);
        return;
      }

      // Validate all fields
      const validation = validateAllFields(inputs, def.fields);
      if (!validation.valid) {
        setFieldErrors(validation.errors);
        setIsProcessing(false);
        return;
      }

      let result;

      // Check if tool should run server-side via API
      if (tool.api) {
        let apiPath;
        if (typeof tool.api === 'string' && tool.api.startsWith('http')) {
          apiPath = tool.api;
        } else {
          apiPath = tool.api === true ? `/api/${tool.slug}` : `/api/${tool.api}`;
        }
        
        const response = await fetch(apiPath, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputs),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || data.message || 'Failed to process request');
        }

        // Format result if it's an object, or use directly if string
        if (typeof data.result === 'object') {
          // If the API returns a complex object, we might need a way to format it.
          // For now, let's assume the API returns a formatted string OR we JSON stringify it
          // UNLESS the template has a specific formatter.
          // Simple approach: JSON.stringify pretty print
          result = typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2);
        } else {
          result = data.result;
        }

        if (data.trace) {
          setProof({
            trace: data.trace,
            timestamp: data.timestamp,
            verified: data.verified
          });
        }
      } else {
        // Run client-side template with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Processing timeout - operation took too long')), 10000)
        );

        const resultPromise = Promise.resolve(runTemplate(tool.template, inputs));
        result = await Promise.race([resultPromise, timeoutPromise]);
      }

      setOutput(result || 'No output generated');
    } catch (error) {
      console.error('Tool execution error:', error);
      const errorMessage = error.message || 'Failed to process input. Please check your data and try again.';
      setError(errorMessage);
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  // Live Preview Trigger
  useEffect(() => {
    if (!isLivePreview) return;

    // Check if we have minimum required inputs
    const hasData = Object.values(inputs).some(v => v && v.toString().trim().length > 0);
    if (!hasData) return;

    const timer = setTimeout(() => {
      analyze();
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputs, isLivePreview]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {def.fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm mb-1 font-medium" htmlFor={`field-${f.name}`}>
                {f.label}
                {f.required && <span className="text-red-500 ml-1" title="Required">*</span>}
                {pasteFeedback.field === f.name && (
                  <span role="status" aria-live="polite" className="ml-2 text-xs text-green-600 dark:text-green-400">
                    ✓ Pasted as plain text
                  </span>
                )}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  id={`field-${f.name}`}
                  className={`input h-36 ${fieldErrors[f.name] ? 'border-red-500 dark:border-red-400' : ''}`}
                  value={inputs[f.name]}
                  onChange={(e) => onChange(f.name, e.target.value)}
                  onPaste={(e) => onPaste(e, f.name)}
                  placeholder={f.placeholder || ''}
                  aria-label={f.label}
                  aria-required={f.required}
                  aria-invalid={!!fieldErrors[f.name]}
                  aria-describedby={fieldErrors[f.name] ? `error-${f.name}` : undefined}
                  title={f.placeholder || f.label}
                />
              ) : (
                <input
                  id={`field-${f.name}`}
                  className={`input ${fieldErrors[f.name] ? 'border-red-500 dark:border-red-400' : ''}`}
                  type={f.type || 'text'}
                  value={inputs[f.name]}
                  onChange={(e) => onChange(f.name, e.target.value)}
                  onPaste={(e) => onPaste(e, f.name)}
                  placeholder={f.placeholder || ''}
                  aria-label={f.label}
                  aria-required={f.required}
                  aria-invalid={!!fieldErrors[f.name]}
                  aria-describedby={fieldErrors[f.name] ? `error-${f.name}` : undefined}
                  title={f.placeholder || f.label}
                  min={f.min}
                  max={f.max}
                />
              )}

              {/* Validation Error */}
              {fieldErrors[f.name] && (
                <p id={`error-${f.name}`} className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors[f.name]}
                </p>
              )}

              {/* Helper Text & Counters */}
              <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 italic flex-1 truncate mr-4">
                  {f.hint || ''}
                </p>
                {(f.type === 'text' || f.type === 'textarea' || !f.type) && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50/50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-sm whitespace-nowrap">
                    {inputs[f.name]?.length || 0} chars
                    {f.type === 'textarea' && ` | ${inputs[f.name]?.trim().split(/\s+/).filter(Boolean).length || 0} words`}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="live-preview-toggle"
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              checked={isLivePreview}
              onChange={(e) => setIsLivePreview(e.target.checked)}
            />
            <label htmlFor="live-preview-toggle" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
              Enable Live Preview (Auto-analyze as you type)
            </label>
          </div>
          <div className="flex gap-2">
            <button
              className="btn flex-1"
              onClick={analyze}
              disabled={isProcessing}
              aria-label={def.actionLabel || 'Analyze'}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                def.actionLabel || 'Analyze'
              )}
            </button>
            <button
              className="btn-secondary"
              onClick={loadExample}
              title="Load sample data"
              aria-label="Load sample data"
            >
              💡 Example
            </button>
            <button
              className="btn-secondary"
              onClick={resetForm}
              title="Clear all inputs"
              aria-label="Clear all inputs"
            >
              🔄 Reset
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <label className="block text-sm mb-1 font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Analysis Output</label>
          <OutputPresentation 
            output={output}
            toolSlug={tool.slug}
            isProcessing={isProcessing}
            onCopy={() => copyToClipboardWithHistory(output, tool.slug)}
            onDownload={() => downloadAllFormats(tool.slug, output, inputs, { metrics: { length: (output || '').length } })}
            emptyMessage={`No analysis generated yet. Enter required fields and click "${def.actionLabel || 'Analyze'}" to see results.`}
          />
        </div>
      </div>

      {proof && (
        <ProofTrace 
          trace={proof.trace} 
          timestamp={proof.timestamp} 
          verified={proof.verified} 
        />
      )}
    </div>
  );
}
