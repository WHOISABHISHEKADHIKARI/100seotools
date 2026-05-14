const SKILL_ORDER = [
  'summary',
  'keyFindings',
  'recommendations',
  'nextSteps',
  'rawDetails',
];

function labelFromKey(key = '') {
  if (key === 'summary') return 'Executive Summary';
  if (key === 'rawDetails') return 'Source Details';
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
}

function cleanValue(value) {
  if (value === null || value === undefined || value === '') return 'Not available';
  if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(2);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value).replace(/\s+/g, ' ').trim();
}

function bulletList(values) {
  return values
    .filter((value) => value !== null && value !== undefined && value !== '')
    .map((value) => `- ${cleanValue(value)}`)
    .join('\n');
}

function objectTable(object) {
  const rows = Object.entries(object || {})
    .filter(([, value]) => typeof value !== 'object' || value === null)
    .map(([key, value]) => `| ${labelFromKey(key)} | ${cleanValue(value)} |`);

  if (!rows.length) return '';
  return ['| Metric | Value |', '|---|---|', ...rows].join('\n');
}

function normalizeSections(result) {
  if (Array.isArray(result)) {
    return {
      summary: `Found ${result.length} item${result.length === 1 ? '' : 's'}.`,
      keyFindings: result.slice(0, 12).map((item) => cleanValue(typeof item === 'object' ? JSON.stringify(item) : item)),
      rawDetails: result,
    };
  }

  if (!result || typeof result !== 'object') {
    return { summary: cleanValue(result) };
  }

  const lowerKeys = Object.keys(result).reduce((acc, key) => {
    acc[key.toLowerCase()] = key;
    return acc;
  }, {});

  return {
    summary: result.summary || result.overview || result.message || result.answer || result.result,
    keyFindings: result.keyFindings || result.findings || result.issues || result.items || result.suggestions,
    recommendations: result.recommendations || result.actions || result.improvements || result.tips,
    nextSteps: result.nextSteps || result.steps || result.checklist,
    rawDetails: Object.keys(result).length ? result : lowerKeys,
  };
}

export function formatToolOutput(result, context = {}) {
  if (typeof result === 'string') return result;

  const sections = normalizeSections(result);
  const title = context.toolName ? `# ${context.toolName} Report` : '# Analysis Report';
  const lines = [title, ''];

  SKILL_ORDER.forEach((sectionKey) => {
    const value = sections[sectionKey];
    if (!value) return;

    if (sectionKey === 'rawDetails') {
      const table = objectTable(value);
      if (!table) return;
      lines.push('## Source Details', table, '');
      return;
    }

    lines.push(`## ${labelFromKey(sectionKey)}`);
    if (Array.isArray(value)) {
      lines.push(bulletList(value), '');
    } else if (typeof value === 'object') {
      lines.push(objectTable(value), '');
    } else {
      lines.push(cleanValue(value), '');
    }
  });

  return lines.join('\n').trim();
}
