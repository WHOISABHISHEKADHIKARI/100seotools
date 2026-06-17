import { memo } from 'react';

const StructuredData = memo(function StructuredData({ data }) {
  const normalize = (input) => {
    if (!input) return null;
    const ctx = 'https://schema.org';
    if (Array.isArray(input)) {
      const cleaned = input.filter((n) => n && typeof n === 'object' && (n['@type'] || n['@id']));
      if (!cleaned.length) return null;
      return { '@context': ctx, '@graph': cleaned };
    }
    if (typeof input === 'object') {
      const hasGraph = Array.isArray(input['@graph']);
      if (hasGraph) {
        const cleaned = input['@graph'].filter((n) => n && typeof n === 'object' && (n['@type'] || n['@id']));
        if (!cleaned.length) return null;
        return { '@context': input['@context'] || ctx, '@graph': cleaned };
    }
      const typeOk = !!input['@type'];
      if (!typeOk) return null;
      return { '@context': input['@context'] || ctx, ...input };
    }
    return null;
  };

  const payload = normalize(data);
  if (!payload) return null;
  if (typeof window !== 'undefined') {
    const key = JSON.stringify(payload);
    const store = (window.__schemaInjectedSet = window.__schemaInjectedSet || new Set());
    if (store.has(key)) return null;
    store.add(key);
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload).replace(/<\/script>/gi, '<\\/script>') }}
    />
  );
});

export default StructuredData;


