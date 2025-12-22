"use client";
import { useState, useMemo } from 'react';

export default function KeywordValueCpcCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const defaultValues = { cpc: '', searchVolume: '', ctr: '3' };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = useMemo(() => {
    const cpc = Math.max(0, toNum(inputs.cpc.cpc));
    const searchVolume = Math.max(0, toNum(inputs.cpc.searchVolume));
    const ctr = Math.max(0, toNum(inputs.cpc.ctr));
    const clicks = searchVolume * (ctr / 100);
    const value = clicks * cpc; // Estimated ad value equivalence
    return { clicks, value };
  }, [inputs.cpc.cpc, inputs.cpc.searchVolume, inputs.cpc.ctr]);

  return (
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
        <p>Estimated Clicks: <span className="font-medium">{Math.round(results.clicks)}</span></p>
        <p className="font-medium">Estimated Ad Value: ${results.value.toFixed(2)}/month</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTip}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn" onClick={() => resetActive('cpc')}>Reset</button>
          <button className="btn-secondary" onClick={() => copyResult(`Keyword Value: ~$${results.value.toFixed(2)}/month`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}