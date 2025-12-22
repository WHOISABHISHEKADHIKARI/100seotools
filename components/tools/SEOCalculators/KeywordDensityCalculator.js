"use client";
import { useState, useMemo } from 'react';

export default function KeywordDensityCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const defaultValues = { totalWords: '', occurrences: '' };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = useMemo(() => {
    const validTotal = Math.max(0, toNum(inputs.density.totalWords));
    const validOcc = Math.max(0, toNum(inputs.density.occurrences));
    const pct = validTotal > 0 ? (validOcc / validTotal) * 100 : 0;
    return { pct: Number.isFinite(pct) ? pct : 0 };
  }, [inputs.density.totalWords, inputs.density.occurrences]);

  return (
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
        <p className="font-medium">Density: {results.pct.toFixed(2)}%</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTip}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn" onClick={() => resetActive('density')}>Reset</button>
          <button className="btn-secondary" onClick={() => copyResult(`Keyword Density: ${results.pct.toFixed(2)}%`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}