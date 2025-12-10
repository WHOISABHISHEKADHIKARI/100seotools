"use client";
import { useMemo, useState, useEffect } from 'react';
import { getTemplateDefinition, runTemplate } from '../lib/templates';
import { copyToClipboardWithHistory, normalizePastedContent, downloadAllFormats } from '../lib/utils';
import { sanitizeInput, validateURL, checkInputSize } from '../lib/security';
import { checkRateLimit } from '../lib/rateLimit';
import { validateField, validateAllFields } from '../lib/validation';

export default function ToolRunner({ tool }) {
  const def = useMemo(() => getTemplateDefinition(tool.template), [tool.template]);
  const [inputs, setInputs] = useState(() => {
    const init = {};
    def.fields.forEach((f) => {
      init[f.name] = f.default ?? '';
    });
    return init;
  });
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [pasteFeedback, setPasteFeedback] = useState({ field: null, ts: 0 });
  const [isCopied, setIsCopied] = useState(false);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      // Validate all fields based on current inputs
      const newErrors = {};
      def.fields.forEach(field => {
        const value = inputs[field.name];

        // If empty, do not show validation errors during passive typing/debounce.
        // Errors will still be caught when clicking the action button.
        if (!value) return;

        // Use the existing validateField logic, but we need to re-implement it or import it?
        // Actually, we can just use the logic that was in onChange, adapted for bulk check.
        // Better: use validateField from lib/validation if possible, but the inline logic had some specific tweaks?
        // The inline logic in previous onChange was specific. Let's replicate the important parts here.

        let error = null;

        // Size check
        const sizeCheck = checkInputSize(value, field.maxBytes || 1000000);
        if (!sizeCheck.valid) {
          error = sizeCheck.error;
        }

        // Length check
        if (!error) {
          const maxLength = field.maxLength || (field.type === 'textarea' ? 50000 : 5000);
          if (value && value.length > maxLength) {
            error = `Maximum ${maxLength} characters`;
          }
        }

        // Type validations
        if (!error && value && field.type === 'number') {
          const num = parseFloat(value);
          if (isNaN(num)) error = 'Must be a number';
          else if (field.min !== undefined && num < field.min) error = `Minimum value: ${field.min}`;
          else if (field.max !== undefined && num > field.max) error = `Maximum value: ${field.max}`;
        }

        if (!error && value && field.type === 'url') {
          if (!validateURL(value)) error = 'Must be a valid URL (http:// or https://)';
        }

        if (error) {
          newErrors[field.name] = error;
        }
      });

      // Update errors state. We merge with existing or replace?
      // Existing behavior cleared errors on change.
      // Here we replace the relevant field errors.
      setFieldErrors(prev => {
        // Create a new object to avoid stale closures issues if we used a loop?
        // Actually, we calculated errors for ALL fields above.
        // So we can technically replace the whole object if we assume we validate everything.
        // But maybe we only want to validate dirty fields?
        // The prompt implies "while the user is typing... only after stops... run validation".
        // Validating everything that has content is safest.
        return newErrors;
      });

    }, 5000);

    return () => clearTimeout(timer);
  }, [inputs, def.fields]);

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
        const response = await fetch(`/api/${tool.slug}`, {
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
              {fieldErrors[f.name] && (
                <p id={`error-${f.name}`} className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors[f.name]}
                </p>
              )}
              {f.hint && !fieldErrors[f.name] && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {f.hint}
                </p>
              )}
            </div>
          ))}
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
        </div>
        <div className="space-y-3">
          <label className="block text-sm mb-1 font-medium">Output</label>
          <pre className="input h-64 whitespace-pre-wrap overflow-auto text-sm" aria-live="polite">
            {output || 'No output yet. Enter inputs and click the button.'}
          </pre>
          <div className="flex gap-3">
            <button
              className="btn-secondary flex-1 transition-all duration-200"
              onClick={() => {
                copyToClipboardWithHistory(output, tool.slug);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
              disabled={!output || isProcessing}
              aria-label={isCopied ? "Copied to clipboard" : "Copy output to clipboard"}
            >
              {isCopied ? "✅ Copied!" : "📋 Copy"}
            </button>
            <button
              className="btn-secondary flex-1"
              onClick={() => downloadAllFormats(tool.slug, output, inputs, { metrics: { length: (output || '').length } })}
              disabled={!output || isProcessing}
              aria-label="Download output"
            >
              💾 Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
