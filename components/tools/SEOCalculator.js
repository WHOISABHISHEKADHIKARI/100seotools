import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import StructuredData from '../ui/StructuredData';
import { getAllBlogPosts } from '../../lib/blog';

// Skeleton loader for calculators to prevent layout shifts
const CalculatorSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
    <div className="rounded border border-slate-200 dark:border-white/10 p-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    </div>
  </div>
);

const DynamicKeywordDensityCalculator = dynamic(() => import('./SEOCalculators/KeywordDensityCalculator'), {
  loading: () => <CalculatorSkeleton />
});
const DynamicSeoRoiCalculator = dynamic(() => import('./SEOCalculators/SeoRoiCalculator'), {
  loading: () => <CalculatorSkeleton />
});
const DynamicDomainAuthorityCalculator = dynamic(() => import('./SEOCalculators/DomainAuthorityCalculator'), {
  loading: () => <CalculatorSkeleton />
});
const DynamicTrafficEstimatorCalculator = dynamic(() => import('./SEOCalculators/TrafficEstimatorCalculator'), {
  loading: () => <CalculatorSkeleton />
});
const DynamicKeywordValueCpcCalculator = dynamic(() => import('./SEOCalculators/KeywordValueCpcCalculator'), {
  loading: () => <CalculatorSkeleton />
});

const tabs = [
  { key: 'density', label: 'Keyword Density' },
  { key: 'roi', label: 'SEO ROI' },
  { key: 'authority', label: 'Domain Authority' },
  { key: 'traffic', label: 'Traffic Estimator' },
  { key: 'cpc', label: 'Keyword Value (CPC)' },
];

export default function SEOCalculator() {
  const [active, setActive] = useState('density');
  const [fade, setFade] = useState(true);

  // Defaults aligned with each calculator's local defaults
  const defaults = {
    density: { totalWords: '', occurrences: '' },
    roi: { visitors: '', convRate: '2', aov: '50', cost: '' },
    authority: { backlinks: '', domains: '', ageYears: '', contentQuality: '5' },
    traffic: { searchVolume: '', ctr: '3' },
    cpc: { cpc: '', searchVolume: '', ctr: '3' },
  };

  // Centralized inputs state for all calculators
  const [inputs, setInputs] = useState(defaults);

  // Shared handlers passed to calculators
  const updateInput = (section, field, value) => {
    setInputs(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const resetActive = (section) => {
    setInputs(prev => ({
      ...prev,
      [section]: { ...defaults[section] }
    }));
  };

  const copyResult = (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => { });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch { }
  };

  const proTips = {
    density: 'Aim for natural usage; 0.5%–2% is usually safe.',
    roi: 'Focus on conversion rate and AOV; they move ROI fastest.',
    authority: 'Quality content and earned links grow authority sustainably.',
    traffic: 'Optimize titles and meta to lift CTR quickly.',
    cpc: 'Higher CTR keywords often have stronger commercial intent.',
  };

  const relatedPosts = useMemo(() => {
    try {
      const all = getAllBlogPosts();
      return all.filter(p => p.slug.startsWith('seo-basics-simple-guide-') || p.slug.startsWith('seo-basics-'))
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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SEO Calculator Suite',
    description: 'Browser-based SEO calculators for density, ROI, authority, traffic, and CPC.',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  return (
    <section aria-labelledby="seo-calculator-heading" className="space-y-6">
      <StructuredData data={webAppLd} />
      <StructuredData data={softwareLd} />

      {/* Calculator Header removed for SEO-Calculator page consistency */}


      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 justify-center" role="tablist" aria-label="SEO calculators">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`px-3 py-2 rounded border border-slate-200 dark:border-white/10 text-sm transition ${active === t.key ? 'bg-slate-100 dark:bg-white/10 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
            onClick={() => setActive(t.key)}
            onKeyDown={(e) => {
              const idx = tabs.findIndex(x => x.key === active);
              if (e.key === 'ArrowRight') {
                const next = tabs[(idx + 1) % tabs.length];
                setActive(next.key);
              } else if (e.key === 'ArrowLeft') {
                const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
                setActive(prev.key);
              }
            }}
            role="tab"
            id={`${t.key}-tab`}
            aria-selected={active === t.key}
            aria-controls={`panel-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel with fixed height to prevent layout shifts */}
      <div className="card p-4 max-w-3xl mx-auto min-h-[500px] calculator-container content-transition">
        {active === 'density' && (
          <DynamicKeywordDensityCalculator
            inputs={inputs}
            updateInput={updateInput}
            resetActive={resetActive}
            copyResult={copyResult}
            proTip={proTips.density}
          />
        )}

        {active === 'roi' && (
          <DynamicSeoRoiCalculator
            inputs={inputs}
            updateInput={updateInput}
            resetActive={resetActive}
            copyResult={copyResult}
            proTip={proTips.roi}
          />
        )}

        {active === 'authority' && (
          <DynamicDomainAuthorityCalculator
            inputs={inputs}
            updateInput={updateInput}
            resetActive={resetActive}
            copyResult={copyResult}
            proTip={proTips.authority}
          />
        )}

        {active === 'traffic' && (
          <DynamicTrafficEstimatorCalculator
            inputs={inputs}
            updateInput={updateInput}
            resetActive={resetActive}
            copyResult={copyResult}
            proTip={proTips.traffic}
          />
        )}

        {active === 'cpc' && (
          <DynamicKeywordValueCpcCalculator
            inputs={inputs}
            updateInput={updateInput}
            resetActive={resetActive}
            copyResult={copyResult}
            proTip={proTips.cpc}
          />
        )}
      </div>

      {/* Related Guides */}
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-semibold">Learn More: SEO Guides & Tutorials</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedPosts.map((p) => (
            <div key={p.slug} className="card p-4 relative hover:shadow-md transition">
              <div
                role="link"
                tabIndex={0}
                aria-label={`Read guide: ${p.title}`}
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={() => { window.location.href = `/blog/${p.slug}`; }}
                onKeyDown={(e) => { const k = e.key; if (k === 'Enter' || k === ' ') { e.preventDefault(); window.location.href = `/blog/${p.slug}`; } }}
              >
                <span className="sr-only">Read guide: {p.title}</span>
              </div>
              <h4 className="font-medium relative z-20">{p.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 relative z-20">{p.description?.slice(0, 120)}...</p>
              <div className="mt-2 relative z-20">
                {/* Inner call-to-action as a non-anchor to avoid nested <a> */}
                <span
                  role="link"
                  tabIndex={0}
                  onClick={() => { window.location.href = `/blog/${p.slug}`; }}
                  onKeyDown={(e) => { if (e.key === 'Enter') window.location.href = `/blog/${p.slug}`; }}
                  aria-label={`Read guide: ${p.title}`}
                  className="tap-target cursor-pointer text-sm text-brand-600 transition-gpu will-change-transform-opacity hover:opacity-85"
                >
                  Read Guide: {p.title}
                </span>
              </div>
            </div>
          ))}
          {relatedPosts.length === 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-300">No related guides found right now.</p>
          )}
        </div>
      </div>
    </section>
  );
}
