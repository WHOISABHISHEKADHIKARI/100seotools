"use client";
import { useState, useMemo } from 'react';

export default function SeoRoiCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const defaultValues = { visitors: '', convRate: '2', aov: '50', cost: '' };

  const toNum = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const results = useMemo(() => {
    const visitors = toNum(inputs.roi.visitors);
    const convRate = toNum(inputs.roi.convRate);
    const aov = toNum(inputs.roi.aov);
    const cost = toNum(inputs.roi.cost);
    const conversions = visitors * (convRate / 100);
    const revenue = conversions * aov;
    const profit = revenue - cost;
    const roiPct = cost > 0 ? (profit / cost) * 100 : (revenue > 0 ? 100 : 0);
    return { conversions, revenue, profit, roiPct };
  }, [inputs.roi.visitors, inputs.roi.convRate, inputs.roi.aov, inputs.roi.cost]);

  return (
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
        <p>Conversions: <span className="font-medium">{Math.round(results.conversions)}</span></p>
        <p>Revenue: <span className="font-medium">${results.revenue.toFixed(2)}</span></p>
        <p>Profit: <span className="font-medium">${results.profit.toFixed(2)}</span></p>
        <p className="font-medium">ROI: {results.roiPct.toFixed(2)}%</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Pro Tip: {proTip}</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="btn" onClick={() => resetActive('roi')}>Reset</button>
          <button className="btn-secondary" onClick={() => copyResult(`SEO ROI: ${results.roiPct.toFixed(2)}% | Profit: $${results.profit.toFixed(2)}`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
