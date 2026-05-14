"use client";
import { useMemo } from 'react';

export default function KeywordValueCpcCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const toNum = (value) => {
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : 0;
  };

  const results = useMemo(() => {
    const cpc = Math.max(0, toNum(inputs.cpc.cpc));
    const searchVolume = Math.max(0, toNum(inputs.cpc.searchVolume));
    const ctr = Math.max(0, toNum(inputs.cpc.ctr));
    const clicks = searchVolume * (ctr / 100);
    const value = clicks * cpc;
    return { clicks, value };
  }, [inputs.cpc.cpc, inputs.cpc.searchVolume, inputs.cpc.ctr]);

  return (
    <div className="seo-calc-layout" role="tabpanel" id="panel-cpc" aria-labelledby="cpc-tab">
      <div className="seo-calc-display" aria-live="polite">
        <span className="seo-calc-display-label">Estimated Ad Value</span>
        <output className="seo-calc-display-value">${results.value.toFixed(2)}</output>
        <dl className="seo-calc-metrics">
          <div><dt>Clicks</dt><dd>{Math.round(results.clicks).toLocaleString()}</dd></div>
        </dl>
        <p>Pro Tip: {proTip}</p>
      </div>
      <div className="seo-calc-body">
        <div>
          <h3>Keyword Value (CPC)</h3>
          <p className="seo-calc-description">Estimate paid-search equivalent value from CPC, demand, and CTR.</p>
        </div>
        <div className="seo-calc-field-grid">
          <label className="seo-calc-field">
            <span>CPC ($)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.cpc.cpc} onChange={(event) => updateInput('cpc', 'cpc', event.target.value)} min="0" step="0.01" />
          </label>
          <label className="seo-calc-field">
            <span>Monthly Search Volume</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.cpc.searchVolume} onChange={(event) => updateInput('cpc', 'searchVolume', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>CTR (%)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.cpc.ctr} onChange={(event) => updateInput('cpc', 'ctr', event.target.value)} min="0" step="0.1" />
          </label>
        </div>
        <div className="seo-calc-actions">
          <button type="button" className="seo-calc-button seo-calc-button-clear" onClick={() => resetActive('cpc')}>Reset</button>
          <button type="button" className="seo-calc-button seo-calc-button-equals" onClick={() => copyResult(`Keyword Value: ~$${results.value.toFixed(2)}/month`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
