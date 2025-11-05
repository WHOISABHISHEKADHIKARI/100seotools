"use client";
import { useEffect, useState } from 'react';

function Stat({ label, value, suffix = 'ms' }) {
  return (
    <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
      <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
      <div className="text-xl font-semibold mt-1">{value != null ? `${value}${suffix}` : '—'}</div>
    </div>
  );
}

export default function PerfDashboardClient() {
  const [samples, setSamples] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [latest, setLatest] = useState(null);
  const SAMPLE_KEY = 'perf_samples';
  const ALERTS_KEY = 'perf_alerts';

  useEffect(() => {
    const pull = () => {
      try {
        const s = JSON.parse(localStorage.getItem(SAMPLE_KEY) || '[]');
        const a = JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]');
        setSamples(s);
        setAlerts(a);
        setLatest(s.length ? s[s.length - 1] : null);
      } catch (_) {
        // ignore
      }
    };
    pull();
    const id = setInterval(pull, 5_000);
    return () => clearInterval(id);
  }, []);

  const formatTs = (ts) => new Date(ts).toLocaleTimeString();

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300">Minute-level sampling of LCP, FCP, TTFB, approximated TTI, and CSS load time. Alerts fire on threshold breaches.</p>
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Stat label="LCP" value={latest?.lcp} />
        <Stat label="FCP" value={latest?.fcp} />
        <Stat label="TTFB" value={latest?.ttfb} />
        <Stat label="FID" value={latest?.fid} />
        <Stat label="TTI≈ (FCP+FID)" value={latest ? (latest.fcp || 0) + (latest.fid || 0) : null} />
        <Stat label="CSS Load" value={latest?.cssLoadTime} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Samples ({samples.length})</h2>
        <div className="rounded-lg border border-slate-200 dark:border-white/10 p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Time</th>
                <th className="p-2">LCP</th>
                <th className="p-2">FCP</th>
                <th className="p-2">TTFB</th>
                <th className="p-2">FID</th>
                <th className="p-2">TTI≈</th>
                <th className="p-2">CSS Load</th>
              </tr>
            </thead>
            <tbody>
              {samples.slice(-30).map((s, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="p-2">{formatTs(s.ts)}</td>
                  <td className="p-2">{s.lcp ?? '—'}</td>
                  <td className="p-2">{s.fcp ?? '—'}</td>
                  <td className="p-2">{s.ttfb ?? '—'}</td>
                  <td className="p-2">{s.fid ?? '—'}</td>
                  <td className="p-2">{((s.fcp || 0) + (s.fid || 0)) || '—'}</td>
                  <td className="p-2">{s.cssLoadTime ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Alerts ({alerts.length})</h2>
        <div className="space-y-2">
          {alerts.slice(-20).reverse().map((a, i) => (
            <div key={i} className="p-3 rounded-md border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20">
              <div className="font-semibold">{a.type}</div>
              <div className="text-sm">value: {a.value} ms {a.baseline ? `baseline: ${a.baseline} ms` : ''} {a.delta ? `(Δ ${(a.delta * 100).toFixed(1)}%)` : ''}</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">{formatTs(a.ts)}</div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-sm text-slate-600 dark:text-slate-300">No alerts yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}