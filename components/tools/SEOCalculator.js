import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Calculator, CalendarDays, Clock, Sparkles } from 'lucide-react';
import StructuredData from '../ui/StructuredData';
import { getAllBlogPosts } from '../../lib/blog';

const CalculatorSkeleton = () => (
  <div className="seo-calc-layout animate-pulse">
    <div className="seo-calc-display">
      <div className="h-4 w-32 rounded bg-white/20" />
      <div className="h-14 w-44 rounded bg-white/20" />
      <div className="h-4 w-full rounded bg-white/20" />
    </div>
    <div className="seo-calc-body">
      <div className="h-7 w-48 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="seo-calc-field-grid">
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
        <div className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  </div>
);

const DynamicKeywordDensityCalculator = dynamic(() => import('./SEOCalculators/KeywordDensityCalculator'), {
  loading: () => <CalculatorSkeleton />,
});
const DynamicSeoRoiCalculator = dynamic(() => import('./SEOCalculators/SeoRoiCalculator'), {
  loading: () => <CalculatorSkeleton />,
});
const DynamicDomainAuthorityCalculator = dynamic(() => import('./SEOCalculators/DomainAuthorityCalculator'), {
  loading: () => <CalculatorSkeleton />,
});
const DynamicTrafficEstimatorCalculator = dynamic(() => import('./SEOCalculators/TrafficEstimatorCalculator'), {
  loading: () => <CalculatorSkeleton />,
});
const DynamicKeywordValueCpcCalculator = dynamic(() => import('./SEOCalculators/KeywordValueCpcCalculator'), {
  loading: () => <CalculatorSkeleton />,
});

function formatGuideDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Updated guide';
  }
}

const tabs = [
  { key: 'density', label: 'Density' },
  { key: 'roi', label: 'ROI' },
  { key: 'authority', label: 'Authority' },
  { key: 'traffic', label: 'Traffic' },
  { key: 'cpc', label: 'CPC Value' },
];

const defaults = {
  density: { totalWords: '', occurrences: '' },
  roi: { visitors: '', convRate: '2', aov: '50', cost: '' },
  authority: { backlinks: '', domains: '', ageYears: '', contentQuality: '5' },
  traffic: { searchVolume: '', ctr: '3' },
  cpc: { cpc: '', searchVolume: '', ctr: '3' },
};

export default function SEOCalculator() {
  const [active, setActive] = useState('density');
  const [inputs, setInputs] = useState(defaults);

  const updateInput = (section, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const resetActive = (section) => {
    setInputs((prev) => ({
      ...prev,
      [section]: { ...defaults[section] },
    }));
  };

  const copyResult = (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {}
  };

  const setActiveByIndex = (index) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    setActive(next.key);
    requestAnimationFrame(() => document.getElementById(`${next.key}-tab`)?.focus());
  };

  const proTips = {
    density: 'Aim for natural usage; 0.5%-2% is usually safe.',
    roi: 'Focus on conversion rate and AOV; they move ROI fastest.',
    authority: 'Quality content and earned links grow authority sustainably.',
    traffic: 'Optimize titles and meta to lift CTR quickly.',
    cpc: 'Higher CTR keywords often have stronger commercial intent.',
  };

  const relatedPosts = useMemo(() => {
    try {
      const all = getAllBlogPosts();
      return all
        .filter((post) => post.slug.startsWith('seo-basics-simple-guide-') || post.slug.startsWith('seo-basics-'))
        .slice(0, 3);
    } catch {
      return [];
    }
  }, []);

  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SEO Calculator Suite',
    description: 'Instant keyword density, SEO ROI, domain authority, traffic, and CPC calculations. Client-side and free.',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Any',
    url: '/seo-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SEO Calculator Suite',
    description: 'Browser-based SEO calculators for density, ROI, authority, traffic, and CPC.',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };

  return (
    <section aria-labelledby="seo-calculator-heading" className="seo-calculator-shell">
      <StructuredData data={webAppLd} />
      <StructuredData data={softwareLd} />

      <div className="seo-calculator-card">
        <div className="seo-calculator-hero">
          <div className="seo-calculator-hero-copy">
            <span className="seo-calculator-kicker">
              <Sparkles className="h-4 w-4" aria-hidden />
              Live SEO math
            </span>
            <h2 id="seo-calculator-heading">SEO Calculator Suite</h2>
            <p>Estimate density, ROI, authority, traffic, and keyword value with fast client-side calculations.</p>
          </div>
          <div className="seo-calculator-hero-icon" aria-hidden>
            <Calculator className="h-7 w-7" />
          </div>
        </div>

        <div className="seo-calculator-tabs" role="tablist" aria-label="SEO calculators">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`${tab.key}-tab`}
              type="button"
              className="seo-calculator-tab"
              data-active={active === tab.key}
              role="tab"
              aria-selected={active === tab.key}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => {
                const index = tabs.findIndex((item) => item.key === active);
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  setActiveByIndex(index + 1);
                } else if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  setActiveByIndex(index - 1);
                } else if (event.key === 'Home') {
                  event.preventDefault();
                  setActiveByIndex(0);
                } else if (event.key === 'End') {
                  event.preventDefault();
                  setActiveByIndex(tabs.length - 1);
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="seo-calculator-panel calculator-container content-transition">
          {active === 'density' && (
            <DynamicKeywordDensityCalculator inputs={inputs} updateInput={updateInput} resetActive={resetActive} copyResult={copyResult} proTip={proTips.density} />
          )}
          {active === 'roi' && (
            <DynamicSeoRoiCalculator inputs={inputs} updateInput={updateInput} resetActive={resetActive} copyResult={copyResult} proTip={proTips.roi} />
          )}
          {active === 'authority' && (
            <DynamicDomainAuthorityCalculator inputs={inputs} updateInput={updateInput} resetActive={resetActive} copyResult={copyResult} proTip={proTips.authority} />
          )}
          {active === 'traffic' && (
            <DynamicTrafficEstimatorCalculator inputs={inputs} updateInput={updateInput} resetActive={resetActive} copyResult={copyResult} proTip={proTips.traffic} />
          )}
          {active === 'cpc' && (
            <DynamicKeywordValueCpcCalculator inputs={inputs} updateInput={updateInput} resetActive={resetActive} copyResult={copyResult} proTip={proTips.cpc} />
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Learn More
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-2xl">
              SEO guides and tutorials
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Turn calculator insights into practical optimization steps with concise guides linked to the same SEO workflow.
            </p>
          </div>
          <a
            href="/blog"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-white hover:text-indigo-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            View all guides
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              aria-label={`Read guide: ${post.title}`}
              className="group flex min-h-[230px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 dark:border-white/10 dark:bg-slate-950/40 dark:hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200">
                  {post.category || 'SEO Guide'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {post.readTimeMinutes || 6} min
                </span>
              </div>
              <h4 className="line-clamp-3 text-base font-semibold leading-6 tracking-tight text-slate-950 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200">
                {post.title}
              </h4>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {post.description}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  {formatGuideDate(post.datePublished)}
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition group-hover:text-indigo-700 dark:text-slate-200 dark:group-hover:text-indigo-200">
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </a>
          ))}
          {relatedPosts.length === 0 && (
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              No related guides found right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
