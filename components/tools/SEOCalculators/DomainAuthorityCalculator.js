"use client";
import { useMemo } from 'react';

export default function DomainAuthorityCalculator({ inputs, updateInput, resetActive, copyResult, proTip }) {
  const toNum = (value) => {
    const number = parseFloat(value);
    return Number.isFinite(number) ? number : 0;
  };

  const results = useMemo(() => {
    const backlinks = Math.max(0, toNum(inputs.authority.backlinks));
    const domains = Math.max(0, toNum(inputs.authority.domains));
    const ageYears = Math.max(0, toNum(inputs.authority.ageYears));
    const contentQuality = Math.max(1, Math.min(10, toNum(inputs.authority.contentQuality)));
    const score = Math.min(100, Math.round(
      15 * Math.log(1 + backlinks) +
      6 * Math.sqrt(domains) +
      3 * ageYears +
      4 * contentQuality
    ));
    return { score };
  }, [inputs.authority.backlinks, inputs.authority.domains, inputs.authority.ageYears, inputs.authority.contentQuality]);

  return (
    <div className="seo-calc-layout" role="tabpanel" id="panel-authority" aria-labelledby="authority-tab">
      <div className="seo-calc-display" aria-live="polite">
        <span className="seo-calc-display-label">Authority Score</span>
        <output className="seo-calc-display-value">{results.score}/100</output>
        <p>Pro Tip: {proTip}</p>
      </div>
      <div className="seo-calc-body">
        <div>
          <h3>Domain Authority Estimator</h3>
          <p className="seo-calc-description">Model a lightweight authority score from links, age, and content quality.</p>
        </div>
        <div className="seo-calc-field-grid">
          <label className="seo-calc-field">
            <span>Backlinks</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.authority.backlinks} onChange={(event) => updateInput('authority', 'backlinks', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>Referring Domains</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.authority.domains} onChange={(event) => updateInput('authority', 'domains', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>Domain Age (years)</span>
            <input type="number" inputMode="decimal" className="input" value={inputs.authority.ageYears} onChange={(event) => updateInput('authority', 'ageYears', event.target.value)} min="0" />
          </label>
          <label className="seo-calc-field">
            <span>Content Quality (1-10)</span>
            <input type="number" inputMode="numeric" className="input" value={inputs.authority.contentQuality} onChange={(event) => updateInput('authority', 'contentQuality', event.target.value)} min="1" max="10" />
          </label>
        </div>
        <div className="seo-calc-actions">
          <button type="button" className="seo-calc-button seo-calc-button-clear" onClick={() => resetActive('authority')}>Reset</button>
          <button type="button" className="seo-calc-button seo-calc-button-equals" onClick={() => copyResult(`Estimated Domain Authority: ${results.score}/100`)}>Copy Result</button>
        </div>
      </div>
    </div>
  );
}
