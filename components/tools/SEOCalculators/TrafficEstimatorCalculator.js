"use client";
import { useState, useMemo } from 'react';

export default function TrafficEstimatorCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const defaultValues = { searchVolume: '', ctr: '3' };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = useMemo(() => {
    const searchVolume = Math.max(0, toNum(inputs.traffic.searchVolume));
    const ctr = Math.max(0, toNum(inputs.traffic.ctr));
    const clicks = searchVolume * (ctr / 100);
    return { clicks };
  }, [inputs.traffic.searchVolume, inputs.traffic.ctr]);

  return (
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
        <p className="font-medium">Estimated Clicks: {Math.round(results.clicks)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTip}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn" onClick={() => resetActive('traffic')}>Reset</button>
          <button className="btn-secondary" onClick={() => copyResult(`Traffic Estimator: ${Math.round(results.clicks)} clicks/month`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}