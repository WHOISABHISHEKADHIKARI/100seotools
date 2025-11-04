import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import StructuredData from './StructuredData';
import { getAllBlogPosts } from '../lib/blog';

const DynamicKeywordDensityCalculator = dynamic(() => import('./SEOCalculators/KeywordDensityCalculator'));
const DynamicSeoRoiCalculator = dynamic(() => import('./SEOCalculators/SeoRoiCalculator'));
const DynamicDomainAuthorityCalculator = dynamic(() => import('./SEOCalculators/DomainAuthorityCalculator'));
const DynamicTrafficEstimatorCalculator = dynamic(() => import('./SEOCalculators/TrafficEstimatorCalculator'));
const DynamicKeywordValueCpcCalculator = dynamic(() => import('./SEOCalculators/KeywordValueCpcCalculator'));

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
    url: '/',
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

      <div className="text-center space-y-2">
        <h2 id="seo-calculator-heading" className="text-2xl md:text-3xl font-bold">SEO Calculator</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Switch tabs to run quick, client-side calculations. Learn more in our <a href="/blog" className="text-brand-600 hover:underline">Blog</a> or explore all <a href="/tools" className="text-brand-600 hover:underline">Tools</a>.
        </p>
      </div>

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

      {/* Panel */}
      <div className={`card p-4 max-w-3xl mx-auto transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {active === 'density' && (
          <DynamicKeywordDensityCalculator />
        )}

        {active === 'roi' && (
          <DynamicSeoRoiCalculator />
        )}

        {active === 'authority' && (
          <DynamicDomainAuthorityCalculator />
        )}

        {active === 'traffic' && (
          <DynamicTrafficEstimatorCalculator />
        )}

        {active === 'cpc' && (
          <DynamicKeywordValueCpcCalculator />
        )}
      </div>

      {/* Related Guides */}
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-semibold">Learn More: SEO Guides & Tutorials</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedPosts.map((p) => (
            <div key={p.slug} className="card p-4 relative hover:shadow-md transition">
              <a href={`/blog/${p.slug}`} aria-label={`Read guide: ${p.title}`} className="absolute inset-0 z-10">
                <span className="sr-only">Read guide: {p.title}</span>
              </a>
              <h4 className="font-medium relative z-20">{p.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 relative z-20">{p.description?.slice(0, 120)}...</p>
              <div className="mt-2 relative z-20">
                <a href={`/blog/${p.slug}`} className="text-brand-600 hover:underline text-sm">Read Guide</a>
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