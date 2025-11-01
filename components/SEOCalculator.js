"use client";
import { useState, useMemo, useEffect } from 'react';
import StructuredData from './StructuredData';
import { getAllBlogPosts } from '../lib/blog';

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

  // Inputs per calculator (store raw strings to allow empty values and decimals)
  const defaultValues = {
    density: { totalWords: '', occurrences: '' },
    roi: { visitors: '', convRate: '2', aov: '50', cost: '' },
    authority: { backlinks: '', domains: '', ageYears: '', contentQuality: '5' },
    traffic: { searchVolume: '', ctr: '3' },
    cpc: { cpc: '', searchVolume: '', ctr: '3' },
  };
  const [inputs, setInputs] = useState(defaultValues);

  const relatedPosts = useMemo(() => {
    try {
      const all = getAllBlogPosts();
      return all.filter(p => p.slug.startsWith('seo-basics-simple-guide-') || p.slug.startsWith('seo-basics-'))
                .slice(0, 3);
    } catch {
      return [];
    }
  }, []);

  function updateInput(group, field, value) {
    // Keep raw string to prevent forced 0 on empty or partial decimals
    setInputs(prev => ({
      ...prev,
      [group]: { ...prev[group], [field]: value }
    }));
  }

  function resetActive() {
    setInputs(prev => ({
      ...prev,
      [active]: { ...defaultValues[active] }
    }));
  }

  function copyResult(text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  // Calculations
  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = {
    density: (() => {
      const validTotal = Math.max(0, toNum(inputs.density.totalWords));
      const validOcc = Math.max(0, toNum(inputs.density.occurrences));
      const pct = validTotal > 0 ? (validOcc / validTotal) * 100 : 0;
      return { pct: Number.isFinite(pct) ? pct : 0 };
    })(),
    roi: (() => {
      const visitors = toNum(inputs.roi.visitors);
      const convRate = toNum(inputs.roi.convRate);
      const aov = toNum(inputs.roi.aov);
      const cost = toNum(inputs.roi.cost);
      const conversions = visitors * (convRate / 100);
      const revenue = conversions * aov;
      const profit = revenue - cost;
      const roiPct = cost > 0 ? (profit / cost) * 100 : (revenue > 0 ? 100 : 0);
      return { conversions, revenue, profit, roiPct };
    })(),
    authority: (() => {
      const backlinks = Math.max(0, toNum(inputs.authority.backlinks));
      const domains = Math.max(0, toNum(inputs.authority.domains));
      const ageYears = Math.max(0, toNum(inputs.authority.ageYears));
      const contentQuality = Math.max(1, Math.min(10, toNum(inputs.authority.contentQuality)));
      // Lightweight local estimator (not Moz DA). Scaled to 0–100.
      const score = Math.min(100, Math.round(
        15 * Math.log(1 + backlinks) +
        6 * Math.sqrt(domains) +
        3 * ageYears +
        4 * contentQuality
      ));
      return { score };
    })(),
    traffic: (() => {
      const searchVolume = Math.max(0, toNum(inputs.traffic.searchVolume));
      const ctr = Math.max(0, toNum(inputs.traffic.ctr));
      const clicks = searchVolume * (ctr / 100);
      return { clicks };
    })(),
    cpc: (() => {
      const cpc = Math.max(0, toNum(inputs.cpc.cpc));
      const searchVolume = Math.max(0, toNum(inputs.cpc.searchVolume));
      const ctr = Math.max(0, toNum(inputs.cpc.ctr));
      const clicks = searchVolume * (ctr / 100);
      const value = clicks * cpc; // Estimated ad value equivalence
      return { clicks, value };
    })(),
  };

  const proTips = {
    density: 'Aim for ~1–2% keyword density; write naturally and avoid stuffing.',
    roi: 'Improve ROI by increasing CTR/CR and lowering acquisition cost.',
    authority: 'Build quality backlinks and keep content helpful; authority compounds over time.',
    traffic: 'Boost CTR with better titles/meta and rich results (schema).',
    cpc: 'High CPC keywords can be valuable; weigh intent and conversion rate.',
  };

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
          <div key="density" className="space-y-4" role="tabpanel" id="panel-density" aria-labelledby="density-tab">
            <h3 className="text-xl font-semibold">Keyword Density</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">Total Words</span>
                <input type="number" className="input mt-1 w-full" value={inputs.density.totalWords}
                  onChange={(e) => updateInput('density', 'totalWords', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">Keyword Occurrences</span>
                <input type="number" className="input mt-1 w-full" value={inputs.density.occurrences}
                  onChange={(e) => updateInput('density', 'occurrences', e.target.value)} min="0" />
              </label>
            </div>
            <div className="rounded border border-slate-200 dark:border-white/10 p-3">
              <p className="font-medium">Density: {results.density.pct.toFixed(2)}%</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTips.density}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="btn" onClick={resetActive}>Reset</button>
                <button className="btn-secondary" onClick={() => copyResult(`Keyword Density: ${results.density.pct.toFixed(2)}%`)}>Copy Result</button>
              </div>
            </div>
          </div>
        )}

        {active === 'roi' && (
          <div key="roi" className="space-y-4" role="tabpanel" id="panel-roi" aria-labelledby="roi-tab">
            <h3 className="text-xl font-semibold">SEO ROI</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">Monthly Visitors</span>
                <input type="number" className="input mt-1 w-full" value={inputs.roi.visitors}
                  onChange={(e) => updateInput('roi', 'visitors', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">Conversion Rate (%)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.roi.convRate}
                  onChange={(e) => updateInput('roi', 'convRate', e.target.value)} min="0" step="0.1" />
              </label>
              <label className="block">
                <span className="text-sm">Average Order Value ($)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.roi.aov}
                  onChange={(e) => updateInput('roi', 'aov', e.target.value)} min="0" step="0.01" />
              </label>
              <label className="block">
                <span className="text-sm">Monthly SEO Cost ($)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.roi.cost}
                  onChange={(e) => updateInput('roi', 'cost', e.target.value)} min="0" step="0.01" />
              </label>
            </div>
            <div className="rounded border border-slate-200 dark:border-white/10 p-3">
              <p>Conversions: <span className="font-medium">{Math.round(results.roi.conversions)}</span></p>
              <p>Revenue: <span className="font-medium">${results.roi.revenue.toFixed(2)}</span></p>
              <p>Profit: <span className="font-medium">${results.roi.profit.toFixed(2)}</span></p>
              <p className="font-medium">ROI: {results.roi.roiPct.toFixed(2)}%</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTips.roi}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="btn" onClick={resetActive}>Reset</button>
                <button className="btn-secondary" onClick={() => copyResult(`SEO ROI: ${results.roi.roiPct.toFixed(2)}% | Profit: $${results.roi.profit.toFixed(2)}`)}>Copy Result</button>
              </div>
            </div>
          </div>
        )}

        {active === 'authority' && (
          <div key="authority" className="space-y-4" role="tabpanel" id="panel-authority" aria-labelledby="authority-tab">
            <h3 className="text-xl font-semibold">Domain Authority (Estimator)</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">Backlinks</span>
                <input type="number" className="input mt-1 w-full" value={inputs.authority.backlinks}
                  onChange={(e) => updateInput('authority', 'backlinks', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">Referring Domains</span>
                <input type="number" className="input mt-1 w-full" value={inputs.authority.domains}
                  onChange={(e) => updateInput('authority', 'domains', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">Domain Age (years)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.authority.ageYears}
                  onChange={(e) => updateInput('authority', 'ageYears', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">Content Quality (1–10)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.authority.contentQuality}
                  onChange={(e) => updateInput('authority', 'contentQuality', e.target.value)} min="1" max="10" />
              </label>
            </div>
            <div className="rounded border border-slate-200 dark:border-white/10 p-3">
              <p className="font-medium">Estimated Authority Score: {results.authority.score}/100</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTips.authority}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="btn" onClick={resetActive}>Reset</button>
                <button className="btn-secondary" onClick={() => copyResult(`Estimated Domain Authority: ${results.authority.score}/100`)}>Copy Result</button>
              </div>
            </div>
          </div>
        )}

        {active === 'traffic' && (
          <div key="traffic" className="space-y-4" role="tabpanel" id="panel-traffic" aria-labelledby="traffic-tab">
            <h3 className="text-xl font-semibold">Traffic Estimator</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">Monthly Search Volume</span>
                <input type="number" className="input mt-1 w-full" value={inputs.traffic.searchVolume}
                  onChange={(e) => updateInput('traffic', 'searchVolume', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">CTR (%)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.traffic.ctr}
                  onChange={(e) => updateInput('traffic', 'ctr', e.target.value)} min="0" step="0.1" />
              </label>
            </div>
            <div className="rounded border border-slate-200 dark:border-white/10 p-3">
              <p className="font-medium">Estimated Clicks: {Math.round(results.traffic.clicks)}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTips.traffic}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="btn" onClick={resetActive}>Reset</button>
                <button className="btn-secondary" onClick={() => copyResult(`Traffic Estimator: ${Math.round(results.traffic.clicks)} clicks/month`)}>Copy Result</button>
              </div>
            </div>
          </div>
        )}

        {active === 'cpc' && (
          <div key="cpc" className="space-y-4" role="tabpanel" id="panel-cpc" aria-labelledby="cpc-tab">
            <h3 className="text-xl font-semibold">Keyword Value (CPC)</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm">CPC ($)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.cpc.cpc}
                  onChange={(e) => updateInput('cpc', 'cpc', e.target.value)} min="0" step="0.01" />
              </label>
              <label className="block">
                <span className="text-sm">Monthly Search Volume</span>
                <input type="number" className="input mt-1 w-full" value={inputs.cpc.searchVolume}
                  onChange={(e) => updateInput('cpc', 'searchVolume', e.target.value)} min="0" />
              </label>
              <label className="block">
                <span className="text-sm">CTR (%)</span>
                <input type="number" className="input mt-1 w-full" value={inputs.cpc.ctr}
                  onChange={(e) => updateInput('cpc', 'ctr', e.target.value)} min="0" step="0.1" />
              </label>
            </div>
            <div className="rounded border border-slate-200 dark:border-white/10 p-3">
              <p>Estimated Clicks: <span className="font-medium">{Math.round(results.cpc.clicks)}</span></p>
              <p className="font-medium">Estimated Ad Value: ${results.cpc.value.toFixed(2)}/month</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTips.cpc}</p>
              <div className="mt-3 flex items-center gap-2">
                <button className="btn" onClick={resetActive}>Reset</button>
                <button className="btn-secondary" onClick={() => copyResult(`Keyword Value: ~$${results.cpc.value.toFixed(2)}/month`)}>Copy Result</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Guides */}
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-semibold">Learn More: SEO Guides & Tutorials</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {relatedPosts.map((p) => (
            <div key={p.slug} className="card p-4 relative hover:shadow-md transition">
              <a href={`/blog/${p.slug}`} aria-label={`Read guide: ${p.title}`} className="absolute inset-0 z-10" />
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