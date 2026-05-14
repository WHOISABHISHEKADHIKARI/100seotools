import {
  BarChart2,
  BookOpen,
  Cpu,
  FileText,
  Link as LinkIcon,
  MapPin,
  Search,
  Target,
  Wrench,
  TrendingUp,
  Users,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { slugify } from '../../lib/utils';

export const categoryDetails = [
  {
    label: 'Keyword Research',
    icon: Search,
    color: 'violet',
    description: 'Discover, expand, cluster, and prioritize keywords for every campaign.',
  },
  {
    label: 'On-Page Optimization',
    icon: FileText,
    color: 'blue',
    description: 'Improve titles, headings, readability, metadata, and page structure.',
  },
  {
    label: 'Schema & Structured Data',
    icon: BookOpen,
    color: 'emerald',
    description: 'Generate and validate JSON-LD, rich result markup, and social tags.',
  },
  {
    label: 'Technical SEO',
    icon: Wrench,
    color: 'orange',
    description: 'Audit robots, sitemaps, redirects, status codes, and mobile readiness.',
  },
  {
    label: 'Backlink & Link-Building',
    icon: LinkIcon,
    color: 'sky',
    description: 'Find link prospects, analyze anchors, and plan outreach faster.',
  },
  {
    label: 'Content SEO',
    icon: FileText,
    color: 'teal',
    description: 'Plan, optimize, refresh, and improve search-focused content.',
  },
  {
    label: 'SEO Performance',
    icon: BarChart2,
    color: 'rose',
    description: 'Estimate traffic, CTR, ROI, ranking progress, and growth potential.',
  },
  {
    label: 'Local SEO',
    icon: MapPin,
    color: 'amber',
    description: 'Optimize local listings, citations, reviews, local schema, and NAP data.',
  },
  {
    label: 'Competitor Analysis',
    icon: Target,
    color: 'purple',
    description: 'Compare competitors, spot keyword gaps, and find market opportunities.',
  },
  {
    label: 'AI-Powered SEO',
    icon: Sparkles,
    color: 'indigo',
    description: 'Use AI for outlines, intros, metadata, schema, FAQs, and content rewrites.',
  },
  {
    label: 'SEO Utility',
    icon: Wrench,
    color: 'cyan',
    description: 'Everyday helpers for slugs, previews, redirects, HTML, and checklists.',
  },
];

export const visualColors = {
  violet: {
    bar: 'from-violet-500 to-purple-600',
    icon: 'bg-violet-50 text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    border: 'hover:border-violet-200',
  },
  blue: {
    bar: 'from-blue-500 to-cyan-600',
    icon: 'bg-blue-50 text-blue-700',
    badge: 'bg-blue-100 text-blue-700',
    border: 'hover:border-blue-200',
  },
  emerald: {
    bar: 'from-emerald-500 to-teal-600',
    icon: 'bg-emerald-50 text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    border: 'hover:border-emerald-200',
  },
  orange: {
    bar: 'from-orange-500 to-amber-500',
    icon: 'bg-orange-50 text-orange-700',
    badge: 'bg-orange-100 text-orange-700',
    border: 'hover:border-orange-200',
  },
  sky: {
    bar: 'from-sky-500 to-indigo-600',
    icon: 'bg-sky-50 text-sky-700',
    badge: 'bg-sky-100 text-sky-700',
    border: 'hover:border-sky-200',
  },
  teal: {
    bar: 'from-teal-500 to-cyan-600',
    icon: 'bg-teal-50 text-teal-700',
    badge: 'bg-teal-100 text-teal-700',
    border: 'hover:border-teal-200',
  },
  rose: {
    bar: 'from-rose-500 to-pink-600',
    icon: 'bg-rose-50 text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    border: 'hover:border-rose-200',
  },
  amber: {
    bar: 'from-amber-500 to-yellow-500',
    icon: 'bg-amber-50 text-amber-700',
    badge: 'bg-amber-100 text-amber-700',
    border: 'hover:border-amber-200',
  },
  purple: {
    bar: 'from-purple-500 to-fuchsia-600',
    icon: 'bg-purple-50 text-purple-700',
    badge: 'bg-purple-100 text-purple-700',
    border: 'hover:border-purple-200',
  },
  indigo: {
    bar: 'from-indigo-500 to-violet-600',
    icon: 'bg-indigo-50 text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-700',
    border: 'hover:border-indigo-200',
  },
  cyan: {
    bar: 'from-cyan-500 to-sky-600',
    icon: 'bg-cyan-50 text-cyan-700',
    badge: 'bg-cyan-100 text-cyan-700',
    border: 'hover:border-cyan-200',
  },
};

export function getCategoryDetail(category) {
  return categoryDetails.find((item) => item.label === category) || {
    label: category || 'SEO Tools',
    icon: FiTrendingUp,
    color: 'violet',
    description: 'Free SEO utilities for faster optimization work.',
  };
}

export function getCategoryHref(category) {
  return `/category/${slugify(category)}`;
}

export function getToolInitial(name = '') {
  return name.replace(/\|.*/, '').trim().charAt(0).toUpperCase() || 'S';
}

export function shortToolName(name = '') {
  return name.replace(/\s*\|.*/, '').trim();
}

export function getToolBadge(tool, index = 0) {
  if (tool?.api) return 'Live';
  if (index < 6) return 'Popular';
  return 'Free';
}

export function getMonthlyUse(index = 0) {
  const values = ['124K', '98K', '91K', '88K', '82K', '79K', '74K', '68K', '61K', '57K', '52K', '48K'];
  return values[index % values.length];
}
