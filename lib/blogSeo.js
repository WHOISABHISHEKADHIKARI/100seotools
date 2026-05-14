const GUIDE_SUFFIX_LABELS = [
  ['-how-to-use', 'How to Use'],
  ['-features-benefits-keywords', 'Features and Benefits'],
  ['-best-practices-integrations-costs', 'Best Practices'],
  ['-checklist-workflow', 'Checklist Workflow'],
  ['-popular-search-terms', 'Search Terms'],
];

export function normalizeBlogSlug(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getGuideVariant(slug = '') {
  const normalized = normalizeBlogSlug(slug);
  const entry = GUIDE_SUFFIX_LABELS.find(([suffix]) => normalized.endsWith(suffix));
  if (!entry) return null;

  const [suffix, label] = entry;
  return {
    suffix,
    label,
    baseSlug: normalized.slice(0, -suffix.length),
  };
}

export function titleFromSlug(slug = '') {
  return normalizeBlogSlug(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === 'seo') return 'SEO';
      if (lower === 'ai') return 'AI';
      if (lower === 'url') return 'URL';
      if (lower === 'xml') return 'XML';
      if (lower === 'html') return 'HTML';
      if (lower === 'faq') return 'FAQ';
      if (lower === 'ctr') return 'CTR';
      if (lower === 'roi') return 'ROI';
      if (lower === 'gmb') return 'GMB';
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function getSeriesPart(slug = '') {
  const match = normalizeBlogSlug(slug).match(/(?:^|-)basics-(\d+)$/);
  if (!match) return null;
  return Number(match[1]) + 1;
}

function getContentTypeSuffix(slug = '') {
  const normalized = normalizeBlogSlug(slug);
  if (normalized.endsWith('-overview')) return 'Overview';
  if (normalized.endsWith('-guide')) return 'Guide';
  return null;
}

function compactTitle(value = '') {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s+[-:|]\s+100 SEO Tools$/i, '')
    .replace(/\s+[-:|]\s+SEO Guide$/i, '')
    .trim();
}

function fitTitleWithSuffix(title, suffix) {
  const normalizedSuffix = ` ${suffix}`.replace(/\s+/g, ' ');
  const maxBaseLength = 60 - normalizedSuffix.length;
  if (maxBaseLength < 20) return `${title.slice(0, 57).replace(/\s+\S*$/, '')}...`;
  const base = title.length > maxBaseLength
    ? `${title.slice(0, maxBaseLength - 3).replace(/\s+\S*$/, '')}...`
    : title;
  return `${base}${normalizedSuffix}`.trim();
}

export function makeStandardTitle(post = {}) {
  const slug = normalizeBlogSlug(post.slug);
  const variant = getGuideVariant(slug);
  const seriesPart = getSeriesPart(slug);
  const contentTypeSuffix = getContentTypeSuffix(slug);

  let title;
  if (variant) {
    title = `${titleFromSlug(variant.baseSlug)}: ${variant.label}`;
  } else {
    title = compactTitle(post.title || titleFromSlug(slug));
  }

  if (!/\bSEO\b/i.test(title) && post.category && /seo/i.test(post.category)) {
    title = `${title} SEO`;
  }

  title = compactTitle(title);
  if (seriesPart) {
    return fitTitleWithSuffix(title, `Part ${seriesPart}`);
  }
  if (contentTypeSuffix && !new RegExp(`\\b${contentTypeSuffix}\\b`, 'i').test(title)) {
    return fitTitleWithSuffix(title, contentTypeSuffix);
  }
  if (title.length <= 60) return title;

  const shortened = title
    .replace(/\bOptimization\b/g, 'Optimization')
    .replace(/\bGenerator\b/g, 'Tool')
    .replace(/\bAnalyzer\b/g, 'Tool')
    .replace(/\bChecker\b/g, 'Tool')
    .replace(/\bComprehensive\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (shortened.length <= 60) return shortened;
  return shortened.slice(0, 57).replace(/\s+\S*$/, '') + '...';
}

function squeezeToMetaLength(value) {
  let text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length > 160) {
    text = text.slice(0, 157).replace(/\s+\S*$/, '') + '...';
  }
  while (text.length < 150) {
    const addition = text.includes('Free SEO tools')
      ? ' Improve rankings with practical, repeatable steps.'
      : ' Free SEO tools included for faster implementation.';
    if (text.length + addition.length > 160) break;
    text += addition;
  }
  if (text.length < 150) {
    text = `${text} Learn practical SEO workflows, examples, and next steps.`;
  }
  if (text.length > 160) {
    text = text.slice(0, 157).replace(/\s+\S*$/, '') + '...';
  }
  return text;
}

export function makeStandardDescription(post = {}) {
  const slug = normalizeBlogSlug(post.slug);
  const variant = getGuideVariant(slug);
  const seriesPart = getSeriesPart(slug);
  const topic = variant ? titleFromSlug(variant.baseSlug) : compactTitle(post.title || titleFromSlug(slug));
  const category = post.category || 'SEO';

  if (variant) {
    return squeezeToMetaLength(
      `${variant.label} guide for ${topic}. Learn ${category} workflows, examples, checks, and optimization steps using free SEO tools.`
    );
  }

  if (seriesPart) {
    return squeezeToMetaLength(
      `Part ${seriesPart} guide for ${topic}. Learn practical ${category} workflows, examples, checklists, and free SEO tools for better rankings.`
    );
  }

  return squeezeToMetaLength(
    post.description || `Learn ${topic} with practical ${category} guidance, examples, checklists, and free SEO tools for better search performance.`
  );
}

export function standardizeBlogPost(post = {}) {
  const slug = normalizeBlogSlug(post.slug);
  return {
    ...post,
    slug,
    title: makeStandardTitle({ ...post, slug }),
    description: makeStandardDescription({ ...post, slug }),
  };
}

export function getBlogCanonicalPath(slug = '') {
  return `/blog/${normalizeBlogSlug(slug)}`;
}
