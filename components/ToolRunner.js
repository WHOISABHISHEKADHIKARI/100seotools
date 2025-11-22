"use client";
import { useMemo, useState } from 'react';
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

  const onChange = (name, value) => {
    const field = def.fields.find(f => f.name === name);
    if (!field) return;

    // Clear previous errors
    setError('');
    setFieldErrors(prev => ({ ...prev, [name]: null }));

    // Size check
    const sizeCheck = checkInputSize(value, field.maxBytes || 1000000);
    if (!sizeCheck.valid) {
      setFieldErrors(prev => ({ ...prev, [name]: sizeCheck.error }));
      return;
    }

    // Length check
    const maxLength = field.maxLength || (field.type === 'textarea' ? 50000 : 5000);
    if (value.length > maxLength) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: `Maximum ${maxLength} characters`
      }));
      return;
    }

    // Type-specific validation
    if (field.type === 'number' && value) {
      const num = parseFloat(value);
      if (isNaN(num)) {
        setFieldErrors(prev => ({ ...prev, [name]: 'Must be a number' }));
        return;
      }
      if (field.min !== undefined && num < field.min) {
        setFieldErrors(prev => ({ ...prev, [name]: `Minimum value: ${field.min}` }));
        return;
      }
      if (field.max !== undefined && num > field.max) {
        setFieldErrors(prev => ({ ...prev, [name]: `Maximum value: ${field.max}` }));
        return;
      }
    }

    // URL validation
    if (field.type === 'url' && value && !validateURL(value)) {
      setFieldErrors(prev => ({ ...prev, [name]: 'Must be a valid URL (http:// or https://)' }));
      return;
    }

    // Sanitize and update
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
        setError(validation.errorMessages.join('. '));
        setFieldErrors(validation.errors);
        setIsProcessing(false);
        return;
      }

      // Run template with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Processing timeout - operation took too long')), 10000)
      );

      const resultPromise = Promise.resolve(runTemplate(tool.template, inputs));

      const result = await Promise.race([resultPromise, timeoutPromise]);

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
              className="btn-secondary flex-1"
              onClick={() => copyToClipboardWithHistory(output, tool.slug)}
              disabled={!output || isProcessing}
              aria-label="Copy output to clipboard"
            >
              📋 Copy
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
