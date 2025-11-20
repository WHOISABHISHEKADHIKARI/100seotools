export function copyToClipboard(text) {
  if (!text) return;
  navigator.clipboard?.writeText(text).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

// Clipboard history helpers
const _clipboardNormalizeCache = new Map();
const _clipboardNormalizeKeys = [];

function decodeEntities(s = '') {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function normalizeClipboardTextForCopy(text) {
  const src = text || '';
  const cacheHit = _clipboardNormalizeCache.get(src);
  if (cacheHit) return cacheHit;

  const hasHTML = /<[^>]+>/.test(src) || /<!--\s*(StartFragment|EndFragment)\s*-->/i.test(src);
  let out = src;
  if (hasHTML) {
    const strippedMarkers = out.replace(/<!--\s*StartFragment\s*-->/ig, '').replace(/<!--\s*EndFragment\s*-->/ig, '');
    if (typeof document !== 'undefined' && document.createElement) {
      const div = document.createElement('div');
      div.innerHTML = strippedMarkers;
      out = div.innerText || div.textContent || '';
    } else {
      const prepped = strippedMarkers
        .replace(/<\s*br\s*\/?>/ig, '\n')
        .replace(/<\/(p|div|li|h[1-6]|tr|td|thead|tbody|tfoot|section|article|table)>/ig, '\n');
      out = decodeEntities(prepped
        .replace(/<style[\s\S]*?<\/style>/ig, '')
        .replace(/<script[\s\S]*?<\/script>/ig, '')
        .replace(/<[^>]+>/g, '')
      );
    }
  }
  out = out.replace(/([A-Za-z0-9])[\u200B\uFEFF]+([A-Za-z0-9])/g, '$1 $2');
  out = out.replace(/[\u200B\uFEFF]/g, '').replace(/\r\n/g, '\n');
  out = out.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  out = decodeEntities(out);

  _clipboardNormalizeCache.set(src, out);
  _clipboardNormalizeKeys.push(src);
  if (_clipboardNormalizeKeys.length > 100) {
    const oldest = _clipboardNormalizeKeys.shift();
    _clipboardNormalizeCache.delete(oldest);
  }
  return out;
}

export function copyToClipboardWithHistory(text, key = 'global') {
  if (!text) return;
  const normalized = normalizeClipboardTextForCopy(text);
  copyToClipboard(normalized);
  try {
    const entry = { key, text: normalized, ts: Date.now(), length: (normalized || '').length };
    const raw = localStorage.getItem('clipboardHistory') || '[]';
    const arr = JSON.parse(raw);
    arr.unshift(entry);
    const max = 50;
    localStorage.setItem('clipboardHistory', JSON.stringify(arr.slice(0, max)));
  } catch {}
}

export function getClipboardHistory() {
  try {
    return JSON.parse(localStorage.getItem('clipboardHistory') || '[]');
  } catch {
    return [];
  }
}

export function clearClipboardHistory() {
  try {
    localStorage.removeItem('clipboardHistory');
  } catch {}
}

export function downloadText(filename, text) {
  const blob = new Blob([text || ''], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function countWords(text) {
  return tokenize(text).length;
}

export function estimateReadingTime(text) {
  const words = countWords(text);
  const wpm = 200;
  const mins = Math.ceil(words / wpm);
  return `${mins} min read`;
}

export function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Smart paste detection and normalization
export function detectFormat(text) {
  const maybeHTML = /<[^>]+>/.test(text);
  const hasTags = /<(h\d|p|li|pre|code|strong|em|ul|ol)[^>]*>/i.test(text);
  const isHTML = maybeHTML && hasTags;
  const isMarkdown = /^(#{1,6})\s|\*\*|__|`|\n-\s|\n\d+\.\s/.test(text);
  return isHTML ? 'html' : isMarkdown ? 'markdown' : 'text';
}

export function normalizePastedContent(text) {
  const fmt = detectFormat(text || '');
  if (fmt === 'html') {
    const raw = text || '';
    const hasStartFrag = /<!--\s*StartFragment\s*-->/i.test(raw);
    const hasEndFrag = /<!--\s*EndFragment\s*-->/i.test(raw);
    const hasTable = /<table\b/i.test(raw);
    const hasDataAttr = /\sdata-[\w-]+=/i.test(raw);
    // Preserve exact HTML when fragment markers, tables, or data-attributes are present
    if (hasStartFrag || hasEndFrag || hasTable || hasDataAttr) {
      return raw;
    }
    const div = document.createElement('div');
    div.innerHTML = raw;
    const blocks = div.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,pre,code');
    const out = [];
    blocks.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      let line = (el.textContent || '').trim();
      if (!line) return;
      if (/h[1-6]/.test(tag)) {
        const level = Number(tag[1]);
        line = `${'#'.repeat(level)} ${line}`;
      } else if (tag === 'li') {
        line = `- ${line}`;
      } else if (tag === 'pre' || tag === 'code') {
        line = '`' + line + '`';
      }
      out.push(line);
    });
    return out.join('\n').replace(/\n{3,}/g, '\n\n');
  } else if (fmt === 'markdown') {
    return (text || '').replace(/\r\n/g, '\n').replace(/\t/g, '  ');
  }
  return text || '';
}

// Multi-format download helpers with metadata
export function escapeHtml(s = '') {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function buildMetadata(toolSlug, inputs, extra = {}) {
  const lines = [
    `Tool: ${toolSlug}`,
    `Timestamp: ${new Date().toISOString()}`,
    `Parameters: ${safeJson(inputs)}`,
  ];
  if (extra.metrics) lines.push(`Metrics: ${safeJson(extra.metrics)}`);
  if (extra.notes) lines.push(`Notes: ${extra.notes}`);
  return ['---', ...lines, '---', ''].join('\n');
}

export function safeJson(obj) {
  try { return JSON.stringify(obj); } catch { return String(obj); }
}

export function stripHtmlToText(text) {
  const src = text || '';
  const hasHtml = /<[^>]+>/.test(src) || /<!--\s*(StartFragment|EndFragment)\s*-->/i.test(src);
  if (!hasHtml) return decodeEntities(src.replace(/[\u200B\uFEFF]/g, '').replace(/\r\n/g, '\n'));
  const strippedMarkers = src.replace(/<!--\s*StartFragment\s*-->/ig, '').replace(/<!--\s*EndFragment\s*-->/ig, '');
  if (typeof document !== 'undefined' && document.createElement) {
    const div = document.createElement('div');
    div.innerHTML = strippedMarkers;
    const out = div.innerText || div.textContent || '';
    return decodeEntities(out.replace(/([A-Za-z0-9])[\u200B\uFEFF]+([A-Za-z0-9])/g, '$1 $2').replace(/[\u200B\uFEFF]/g, '').replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim());
  }
  const prepped = strippedMarkers
    .replace(/<\s*br\s*\/?>/ig, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr|td|thead|tbody|tfoot|section|article|table)>/ig, '\n')
    .replace(/<style[\s\S]*?<\/style>/ig, '')
    .replace(/<script[\s\S]*?<\/script>/ig, '')
    .replace(/<[^>]+>/g, '');
  return decodeEntities(prepped.replace(/([A-Za-z0-9])[\u200B\uFEFF]+([A-Za-z0-9])/g, '$1 $2').replace(/[\u200B\uFEFF]/g, '').replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim());
}

export async function downloadHtml(filename, text, toolSlug, inputs, options = {}) {
  const meta = buildMetadata(toolSlug, inputs, options);
  const html = `<html><head><meta charset="utf-8"><title>${toolSlug}</title></head><body><pre>${escapeHtml(meta + text)}</pre></body></html>`;
  downloadBlob(filename, new Blob([html], { type: 'text/html' }));
}

export async function downloadDocx(filename, text) {
  const mod = await import('docx');
  const { Document, Packer, Paragraph } = mod;
  const doc = new Document({
    sections: [{ properties: {}, children: (text || '').split(/\n/).map((t) => new Paragraph(t)) }]
  });
  const blob = await Packer.toBlob(doc);
  downloadBlob(filename, blob);
}

export async function downloadPdf(filename, text) {
  const mod = await import('jspdf');
  const { jsPDF } = mod;
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 36; // half-inch
  const pageWidth = pdf.internal.pageSize.getWidth();
  const maxWidth = pageWidth - margin * 2;
  const lines = pdf.splitTextToSize(text || '', maxWidth);
  let y = margin;
  lines.forEach((line) => {
    if (y > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      y = margin;
    }
    pdf.text(line, margin, y);
    y += 14;
  });
  const blob = pdf.output('blob');
  downloadBlob(filename, blob);
}

export async function downloadAllFormats(toolSlug, output, inputs, options = {}) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = `${toolSlug}-${stamp}`;
  const meta = buildMetadata(toolSlug, inputs, options);
  const text = meta + (output || '');
  // TXT
  downloadText(`${base}.txt`, text);
  // HTML
  await downloadHtml(`${base}.html`, output || '', toolSlug, inputs, options);
  // DOCX
  await downloadDocx(`${base}.docx`, text);
  // PDF
  await downloadPdf(`${base}.pdf`, text);
}
