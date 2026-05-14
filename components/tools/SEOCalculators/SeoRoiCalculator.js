"use client";
import { useMemo } from 'react';

export default function SeoRoiCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const toNum = (value) => {
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : 0;
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
    <div className="seo-calc-layout" role="tabpanel" id="panel-roi" aria-labelledby="roi-tab">
      <div className="seo-calc-display" aria-live="polite">
        <span className="seo-calc-display-label">SEO ROI</span>
        <output className="seo-calc-display-value">{results.roiPct.toFixed(2)}%</output>
        <dl className="seo-calc-metrics">
          <div><dt>Revenue</dt><dd>${results.revenue.toFixed(2)}</dd></div>
          <div><dt>Profit</dt><dd>${results.profit.toFixed(2)}</dd></div>
          <div><dt>Conversions</dt><dd>{Math.round(results.conversions)}</dd></div>
        </dl>
        <p>Pro Tip: {proTip}</p>
      </div>
      <div className="seo-calc-body">
        <div>
          <h3>SEO ROI</h3>
          <p className="seo-calc-description">Estimate revenue, profit, and campaign return from traffic and conversion inputs.</p>
        </div>
        <div className="seo-calc-field-grid">
          <label className="seo-calc-field">
            <span>Monthly Visitors</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.roi.visitors} onChange={(event) => updateInput('roi', 'visitors', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>Conversion Rate (%)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.roi.convRate} onChange={(event) => updateInput('roi', 'convRate', event.target.value)} min="0" step="0.1" />
          </label>
          <label className="seo-calc-field">
            <span>Average Order Value ($)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.roi.aov} onChange={(event) => updateInput('roi', 'aov', event.target.value)} min="0" step="0.01" />
          </label>
          <label className="seo-calc-field">
            <span>Monthly SEO Cost ($)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.roi.cost} onChange={(event) => updateInput('roi', 'cost', event.target.value)} min="0" step="0.01" />
          </label>
        </div>
        <div className="seo-calc-actions">
          <button type="button" className="seo-calc-button seo-calc-button-clear" onClick={() => resetActive('roi')}>Reset</button>
          <button type="button" className="seo-calc-button seo-calc-button-equals" onClick={() => copyResult(`SEO ROI: ${results.roiPct.toFixed(2)}% | Profit: $${results.profit.toFixed(2)}`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
