"use client";
import { useMemo, useState, useEffect, useRef } from 'react';
import { getTemplateDefinition, runTemplate } from '../../lib/templates';
import { copyToClipboardWithHistory, normalizePastedContent, downloadAllFormats } from '../../lib/utils';
import { sanitizeInput } from '../../lib/security';
import { checkRateLimit } from '../../lib/rateLimit';
import { validateAllFields } from '../../lib/validation';
import { formatToolOutput } from '../../lib/outputHelper';
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
  const outputRef = useRef(null);

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

        result = formatToolOutput(data.result, { toolName: tool.name, toolSlug: tool.slug });

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
        result = formatToolOutput(await Promise.race([resultPromise, timeoutPromise]), {
          toolName: tool.name,
          toolSlug: tool.slug,
        });
      }

      setOutput(result || 'No output generated');
    } catch (error) {
      console.error('Tool execution error:', error);
      const errorMessage = error.message || 'Failed to process input. Please check your data and try again.';
      setError(errorMessage);
      setOutput('');
    } finally {
      setIsProcessing(false);
      // Smooth scroll to output after generation
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/80 p-4 shadow-sm dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm font-semibold text-rose-800 dark:text-rose-200">
            {error}
          </p>
          <button
            onClick={analyze}
            className="mt-3 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-rose-700 shadow-sm transition-colors hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        <div className="space-y-4">
          {def.fields.map((f) => (
            <div key={f.name}>
              <label className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-100" htmlFor={`field-${f.name}`}>
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
                  className={`input min-h-36 ${fieldErrors[f.name] ? 'border-red-500 dark:border-red-400' : ''}`}
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
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
                <p className="min-w-0 flex-1 text-[11px] text-gray-500 dark:text-gray-400">
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/5">
            <label htmlFor="live-preview-toggle" className="flex cursor-pointer items-center justify-between gap-4">
              <div>
                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Smart preview
                </span>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-300">
                  Updates results after you enter the required details.
                </p>
              </div>
              <span className="relative inline-flex h-6 w-11 flex-shrink-0 items-center">
                <input
                  type="checkbox"
                  id="live-preview-toggle"
                  className="peer sr-only"
                  checked={isLivePreview}
                  onChange={(e) => setIsLivePreview(e.target.checked)}
                  aria-label="Toggle smart preview"
                />
                <span className="absolute inset-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-violet-600 peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500 peer-focus-visible:ring-offset-2 dark:bg-slate-700" />
                <span className="relative ml-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <button
              className="btn w-full"
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
              className="btn-secondary w-full sm:w-auto"
              onClick={loadExample}
              title="Load sample data"
              aria-label="Load sample data"
            >
              Example
            </button>
            <button
              className="btn-secondary w-full sm:w-auto"
              onClick={resetForm}
              title="Clear all inputs"
              aria-label="Clear all inputs"
            >
              Reset
            </button>
          </div>
        </div>
        <div className="min-w-0 space-y-3" ref={outputRef}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">Output</label>
            <span className="text-xs text-slate-500 dark:text-slate-400">Readable summary and export tools</span>
          </div>
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
