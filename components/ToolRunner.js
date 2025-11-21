"use client";
import { useMemo, useState } from 'react';
import { getTemplateDefinition, runTemplate } from '../lib/templates';
import { copyToClipboardWithHistory, normalizePastedContent, downloadAllFormats } from '../lib/utils';

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
  const [pasteFeedback, setPasteFeedback] = useState({ field: null, ts: 0 });

  const onChange = (name, value) => setInputs((prev) => ({ ...prev, [name]: value }));
  const onPaste = (e, name) => {
    try {
      const plain = e.clipboardData?.getData('text/plain') || '';
      const html = e.clipboardData?.getData('text/html') || '';
      const src = plain || html || '';
      if (src) {
        e.preventDefault();
        const normalized = normalizePastedContent(src);
        onChange(name, normalized);
        setPasteFeedback({ field: name, ts: Date.now() });
        setTimeout(() => setPasteFeedback((p) => (p.field === name ? { field: null, ts: 0 } : p)), 2000);
      }
    } catch {}
  };
  const analyze = () => setOutput(runTemplate(tool.template, inputs));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {def.fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm mb-1" htmlFor={`field-${f.name}`}>
                {f.label}
                {pasteFeedback.field === f.name ? (
                  <span role="status" aria-live="polite" className="ml-2 text-xs text-slate-500">Pasted as plain text</span>
                ) : null}
              </label>
              {f.type === 'textarea' ? (
                <textarea id={`field-${f.name}`} className="input h-36" value={inputs[f.name]} onChange={(e) => onChange(f.name, e.target.value)} onPaste={(e) => onPaste(e, f.name)} placeholder={f.placeholder || ''} aria-label={f.label} title={f.placeholder || f.label} />
              ) : (
                <input id={`field-${f.name}`} className="input" type={f.type || 'text'} value={inputs[f.name]} onChange={(e) => onChange(f.name, e.target.value)} onPaste={(e) => onPaste(e, f.name)} placeholder={f.placeholder || ''} aria-label={f.label} title={f.placeholder || f.label} />
              )}
            </div>
          ))}
          <button className="btn" onClick={analyze} aria-label={def.actionLabel || 'Analyze'}>{def.actionLabel || 'Analyze'}</button>
        </div>
        <div className="space-y-3">
          <label className="block text-sm mb-1">Output</label>
          <pre className="input h-64 whitespace-pre-wrap overflow-auto" aria-live="polite">{output || 'No output yet. Enter inputs and click the button.'}</pre>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => copyToClipboardWithHistory(output, tool.slug)} aria-label="Copy output">Copy</button>
            <button className="btn-secondary" onClick={() => downloadAllFormats(tool.slug, output, inputs, { metrics: { length: (output || '').length } })} aria-label="Download output">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}
