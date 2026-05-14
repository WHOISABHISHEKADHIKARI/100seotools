"use client";
import { useMemo } from 'react';

export default function TrafficEstimatorCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const toNum = (value) => {
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : 0;
  };

  const results = useMemo(() => {
    const searchVolume = Math.max(0, toNum(inputs.traffic.searchVolume));
    const ctr = Math.max(0, toNum(inputs.traffic.ctr));
    const clicks = searchVolume * (ctr / 100);
    return { clicks };
  }, [inputs.traffic.searchVolume, inputs.traffic.ctr]);

  return (
    <div className="seo-calc-layout" role="tabpanel" id="panel-traffic" aria-labelledby="traffic-tab">
      <div className="seo-calc-display" aria-live="polite">
        <span className="seo-calc-display-label">Estimated Clicks</span>
        <output className="seo-calc-display-value">{Math.round(results.clicks).toLocaleString()}</output>
        <p>Pro Tip: {proTip}</p>
      </div>
      <div className="seo-calc-body">
        <div>
          <h3>Traffic Estimator</h3>
          <p className="seo-calc-description">Forecast monthly clicks from search demand and expected click-through rate.</p>
        </div>
        <div className="seo-calc-field-grid">
          <label className="seo-calc-field">
            <span>Monthly Search Volume</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.traffic.searchVolume} onChange={(event) => updateInput('traffic', 'searchVolume', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>CTR (%)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.traffic.ctr} onChange={(event) => updateInput('traffic', 'ctr', event.target.value)} min="0" step="0.1" />
          </label>
        </div>
        <div className="seo-calc-actions">
          <button type="button" className="seo-calc-button seo-calc-button-clear" onClick={() => resetActive('traffic')}>Reset</button>
          <button type="button" className="seo-calc-button seo-calc-button-equals" onClick={() => copyResult(`Traffic Estimator: ${Math.round(results.clicks)} clicks/month`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
