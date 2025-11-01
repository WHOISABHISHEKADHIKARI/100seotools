"use client";
import { useState, useMemo } from 'react';
import StructuredData from './StructuredData';

export default function SEOCostCalculator() {
  // Store raw strings to avoid input glitches while typing decimals
  const [inputs, setInputs] = useState({
    setupFee: '0',
    hourlyRate: '50',
    hoursPerMonth: '0',
    monthlyRetainer: '0',
    contentPiecesPerMonth: '0',
    contentCostPerPiece: '0',
    linksPerMonth: '0',
    costPerLink: '0',
    toolsMonthly: '0',
    contingencyPct: '10',
  });

  const update = (field, value) => {
    // Allow empty string and intermediate decimals like "." without forcing NaN
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setInputs({
      setupFee: '0',
      hourlyRate: '50',
      hoursPerMonth: '0',
      monthlyRetainer: '0',
      contentPiecesPerMonth: '0',
      contentCostPerPiece: '0',
      linksPerMonth: '0',
      costPerLink: '0',
      toolsMonthly: '0',
      contingencyPct: '10',
    });
  };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = useMemo(() => {
    const setupFee = toNum(inputs.setupFee);
    const hourlyRate = toNum(inputs.hourlyRate);
    const hoursPerMonth = toNum(inputs.hoursPerMonth);
    const monthlyRetainer = toNum(inputs.monthlyRetainer);
    const contentPiecesPerMonth = toNum(inputs.contentPiecesPerMonth);
    const contentCostPerPiece = toNum(inputs.contentCostPerPiece);
    const linksPerMonth = toNum(inputs.linksPerMonth);
    const costPerLink = toNum(inputs.costPerLink);
    const toolsMonthly = toNum(inputs.toolsMonthly);
    const contingencyPct = toNum(inputs.contingencyPct);

    const laborMonthly = hourlyRate * hoursPerMonth;
    const contentMonthly = contentPiecesPerMonth * contentCostPerPiece;
    const linkMonthly = linksPerMonth * costPerLink;
    const baseMonthly = monthlyRetainer + laborMonthly + contentMonthly + linkMonthly + toolsMonthly;
    const contingencyMonthly = baseMonthly * (contingencyPct / 100);
    const totalMonthly = baseMonthly + contingencyMonthly;
    const oneTimeTotal = setupFee;
    const threeMonthTotal = oneTimeTotal + totalMonthly * 3;
    const sixMonthTotal = oneTimeTotal + totalMonthly * 6;
    const yearlyTotal = oneTimeTotal + totalMonthly * 12;
    return {
      laborMonthly,
      contentMonthly,
      linkMonthly,
      baseMonthly,
      contingencyMonthly,
      totalMonthly,
      oneTimeTotal,
      threeMonthTotal,
      sixMonthTotal,
      yearlyTotal,
    };
  }, [inputs]);

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'SEO Cost Calculator',
    description: 'Estimate monthly and project SEO costs, including labor, content, links, tools, and contingency.',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  const webAppLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SEO Cost Calculator',
    description: 'Client-side calculator to estimate SEO budgets and costs.',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Any',
    url: '/seo-cost-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };

  function copySummary() {
    const text = `SEO Cost Summary:\nMonthly: $${results.totalMonthly.toFixed(2)}\nOne-time: $${results.oneTimeTotal.toFixed(2)}\n3 months: $${results.threeMonthTotal.toFixed(2)}\n6 months: $${results.sixMonthTotal.toFixed(2)}\n12 months: $${results.yearlyTotal.toFixed(2)}`;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  return (
    <section aria-labelledby="seo-cost-calculator-heading" className="space-y-6">
      <StructuredData data={webAppLd} />
      <StructuredData data={softwareLd} />

      <div className="text-center space-y-2">
        <h2 id="seo-cost-calculator-heading" className="text-2xl md:text-3xl font-bold">SEO Cost Calculator</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Estimate monthly and project costs for SEO work: labor, content, links, tools, and contingency.
        </p>
      </div>

      <div className="card p-4 max-w-3xl mx-auto space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">One-time Setup Fee ($)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.setupFee}
              onChange={(e) => update('setupFee', e.target.value)} min="0" step="0.01" />
          </label>
          <label className="block">
            <span className="text-sm">Monthly Retainer ($)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.monthlyRetainer}
              onChange={(e) => update('monthlyRetainer', e.target.value)} min="0" step="0.01" />
          </label>
          <label className="block">
            <span className="text-sm">Hourly Rate ($/hr)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.hourlyRate}
              onChange={(e) => update('hourlyRate', e.target.value)} min="0" step="0.01" />
          </label>
          <label className="block">
            <span className="text-sm">Hours per Month</span>
            <input type="number" className="input mt-1 w-full" value={inputs.hoursPerMonth}
              onChange={(e) => update('hoursPerMonth', e.target.value)} min="0" step="1" />
          </label>
          <label className="block">
            <span className="text-sm">Content Pieces / Month</span>
            <input type="number" className="input mt-1 w-full" value={inputs.contentPiecesPerMonth}
              onChange={(e) => update('contentPiecesPerMonth', e.target.value)} min="0" step="1" />
          </label>
          <label className="block">
            <span className="text-sm">Cost per Content Piece ($)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.contentCostPerPiece}
              onChange={(e) => update('contentCostPerPiece', e.target.value)} min="0" step="0.01" />
          </label>
          <label className="block">
            <span className="text-sm">Links / Month</span>
            <input type="number" className="input mt-1 w-full" value={inputs.linksPerMonth}
              onChange={(e) => update('linksPerMonth', e.target.value)} min="0" step="1" />
          </label>
          <label className="block">
            <span className="text-sm">Cost per Link ($)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.costPerLink}
              onChange={(e) => update('costPerLink', e.target.value)} min="0" step="0.01" />
          </label>
          <label className="block">
            <span className="text-sm">Tools Subscriptions / Month ($)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.toolsMonthly}
              onChange={(e) => update('toolsMonthly', e.target.value)} min="0" step="0.01" />
          </label>
          <label className="block">
            <span className="text-sm">Contingency (%)</span>
            <input type="number" className="input mt-1 w-full" value={inputs.contingencyPct}
              onChange={(e) => update('contingencyPct', e.target.value)} min="0" step="0.1" />
          </label>
        </div>

        <div className="rounded border border-slate-200 dark:border-white/10 p-3 space-y-2">
          <p>Labor (Monthly): <span className="font-medium">${results.laborMonthly.toFixed(2)}</span></p>
          <p>Content (Monthly): <span className="font-medium">${results.contentMonthly.toFixed(2)}</span></p>
          <p>Links (Monthly): <span className="font-medium">${results.linkMonthly.toFixed(2)}</span></p>
          <p>Base Monthly: <span className="font-medium">${results.baseMonthly.toFixed(2)}</span></p>
          <p>Contingency: <span className="font-medium">${results.contingencyMonthly.toFixed(2)}</span></p>
          <p className="font-semibold">Total Monthly: ${results.totalMonthly.toFixed(2)}</p>
          <div className="h-px bg-slate-200 dark:bg-white/10 my-2" />
          <p>One-time Setup: <span className="font-medium">${results.oneTimeTotal.toFixed(2)}</span></p>
          <p>3 Months Total: <span className="font-medium">${results.threeMonthTotal.toFixed(2)}</span></p>
          <p>6 Months Total: <span className="font-medium">${results.sixMonthTotal.toFixed(2)}</span></p>
          <p>12 Months Total: <span className="font-medium">${results.yearlyTotal.toFixed(2)}</span></p>
          <div className="mt-3 flex items-center gap-2">
            <button className="btn" onClick={reset}>Reset</button>
            <button className="btn-secondary" onClick={copySummary}>Copy Summary</button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <a href="/seo-calculator" className="text-brand-600 hover:underline">Go to SEO Calculator</a>
      </div>
    </section>
  );
}