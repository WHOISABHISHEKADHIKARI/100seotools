"use client";
import { useMemo, useState } from 'react';
import { getTemplateDefinition, runTemplate } from '../lib/templates';
import { copyToClipboard, downloadText } from '../lib/utils';

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

  const onChange = (name, value) => setInputs((prev) => ({ ...prev, [name]: value }));
  const analyze = () => setOutput(runTemplate(tool.template, inputs));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {def.fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm mb-1" htmlFor={`field-${f.name}`}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea id={`field-${f.name}`} className="input h-36" value={inputs[f.name]} onChange={(e) => onChange(f.name, e.target.value)} placeholder={f.placeholder || ''} aria-label={f.label} />
              ) : (
                <input id={`field-${f.name}`} className="input" type={f.type || 'text'} value={inputs[f.name]} onChange={(e) => onChange(f.name, e.target.value)} placeholder={f.placeholder || ''} aria-label={f.label} />
              )}
            </div>
          ))}
          <button className="btn" onClick={analyze} aria-label={def.actionLabel || 'Analyze'}>{def.actionLabel || 'Analyze'}</button>
        </div>
        <div className="space-y-3">
          <label className="block text-sm mb-1">Output</label>
          <pre className="input h-64 whitespace-pre-wrap overflow-auto" aria-live="polite">{output || 'No output yet. Enter inputs and click the button.'}</pre>
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => copyToClipboard(output)} aria-label="Copy output">Copy</button>
            <button className="btn-secondary" onClick={() => downloadText(`${tool.slug}.txt`, output)} aria-label="Download output">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}