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
