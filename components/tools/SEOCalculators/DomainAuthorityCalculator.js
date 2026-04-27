"use client";
import { useState, useMemo } from 'react';

export default function DomainAuthorityCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const defaultValues = { backlinks: '', domains: '', ageYears: '', contentQuality: '5' };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = useMemo(() => {
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
  }, [inputs.authority.backlinks, inputs.authority.domains, inputs.authority.ageYears, inputs.authority.contentQuality]);

  return (
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
        <p className="font-medium">Estimated Authority Score: {results.score}/100</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTip}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn" onClick={() => resetActive('authority')}>Reset</button>
          <button className="btn-secondary" onClick={() => copyResult(`Estimated Domain Authority: ${results.score}/100`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
