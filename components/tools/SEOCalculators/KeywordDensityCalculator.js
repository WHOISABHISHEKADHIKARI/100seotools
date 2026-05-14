"use client";
import { useMemo } from 'react';

export default function KeywordDensityCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const toNum = (value) => {
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : 0;
  };

  const results = useMemo(() => {
    const totalWords = Math.max(0, toNum(inputs.density.totalWords));
    const occurrences = Math.max(0, toNum(inputs.density.occurrences));
    const pct = totalWords > 0 ? (occurrences / totalWords) * 100 : 0;
    return { pct: Number.isFinite(pct) ? pct : 0 };
  }, [inputs.density.totalWords, inputs.density.occurrences]);

  return (
    <div className="seo-calc-layout" role="tabpanel" id="panel-density" aria-labelledby="density-tab">
      <div className="seo-calc-display" aria-live="polite">
        <span className="seo-calc-display-label">Keyword Density</span>
        <output className="seo-calc-display-value">{results.pct.toFixed(2)}%</output>
        <p>Pro Tip: {proTip}</p>
      </div>
      <div className="seo-calc-body">
        <div>
          <h3>Keyword Density</h3>
          <p className="seo-calc-description">Measure how often a target keyword appears compared with total page copy.</p>
        </div>
        <div className="seo-calc-field-grid">
          <label className="seo-calc-field">
            <span>Total Words</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.density.totalWords} onChange={(event) => updateInput('density', 'totalWords', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>Keyword Occurrences</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.density.occurrences} onChange={(event) => updateInput('density', 'occurrences', event.target.value)} min="0" />
          </label>
        </div>
        <div className="seo-calc-actions">
          <button type="button" className="seo-calc-button seo-calc-button-clear" onClick={() => resetActive('density')}>Reset</button>
          <button type="button" className="seo-calc-button seo-calc-button-equals" onClick={() => copyResult(`Keyword Density: ${results.pct.toFixed(2)}%`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
