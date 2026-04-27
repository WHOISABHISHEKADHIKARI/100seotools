"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

function isValidUrl(url) {
  try {
    if (!url) return false;
    if (url.startsWith("/")) return true;
    const u = new URL(url);
    return Boolean(u.protocol && u.host);
  } catch {
    // Allow relative path segments like "old-path" or "blog/post"
    return /^[A-Za-z0-9._~!$&'()*+,;=:@-]+(?:\/[A-Za-z0-9._~!$&'()*+,;=:@-]+)*$/.test(url);
  }
}

function normalizePath(url) {
  if (!url) return url;
  return url.trim();
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = [];
  for (const line of lines) {
    const tokens = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        tokens.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
    tokens.push(current);
    const [source = "", destination = "", status = "301"] = tokens.map((t) => t.trim());
    rows.push({ source, destination, status });
  }
  return rows;
}

function detectCycles(rules) {
  const graph = new Map();
  for (const { source, destination } of rules) {
    const s = normalizePath(source);
    const d = normalizePath(destination);
    if (!graph.has(s)) graph.set(s, new Set());
    if (d) graph.get(s).add(d);
  }

  const visited = new Set();
  const stack = new Set();
  const cycles = [];

  function dfs(node, path) {
    visited.add(node);
    stack.add(node);
    path.push(node);
    const neighbors = graph.get(node) || new Set();
    for (const next of neighbors) {
      if (!visited.has(next)) {
        dfs(next, path);
      } else if (stack.has(next)) {
        const idx = path.indexOf(next);
        if (idx !== -1) {
          cycles.push(path.slice(idx));
        }
      }
    }
    stack.delete(node);
    path.pop();
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) dfs(node, []);
  }
  return cycles;
}

function computeChains(rules) {
  const forward = new Map();
  const reverse = new Map();
  for (const { source, destination } of rules) {
    const s = normalizePath(source);
    const d = normalizePath(destination);
    if (!s || !d) continue;
    forward.set(s, d);
    reverse.set(d, (reverse.get(d) || new Set()).add(s));
  }

  const chains = [];
  const seen = new Set();
  for (const [s] of forward) {
    if (seen.has(s)) continue;
    let head = s;
    while (reverse.has(head)) {
      const predecessors = Array.from(reverse.get(head));
      if (predecessors.length !== 1) break;
      head = predecessors[0];
      if (head === s) break;
    }
    const chain = [head];
    let cur = head;
    const maxLen = 1000;
    for (let i = 0; i < maxLen && forward.has(cur); i++) {
      const next = forward.get(cur);
      chain.push(next);
      seen.add(cur);
      cur = next;
    }
    chains.push(chain);
  }
  return chains;
}

function generateApache(rules) {
  const lines = ["# Apache 301/302/308 redirects"];
  const rewriteLines = [];
  for (const { source, destination, status } of rules) {
    const rawS = normalizePath(source);
    const d = normalizePath(destination);
    const code = status || "301";
    if (!rawS || !d) continue;
    const s = rawS.startsWith("http") ? (() => { try { return new URL(rawS).pathname; } catch { return rawS; } })() : rawS;
    if (s.startsWith("/")) {
      lines.push(`Redirect ${code} ${s} ${d}`);
    } else {
      rewriteLines.push(`RewriteRule ^${s.replace(/^\//, "")} ${d} [R=${code},L]`);
    }
  }
  if (rewriteLines.length) {
    lines.push("RewriteEngine On");
    lines.push(...rewriteLines);
  }
  return lines.join("\n");
}

function generateNginx(rules) {
  const lines = ["# Nginx 301/302/308 redirects", "server {", "    # ... your server config", "    # redirects:"];
  for (const { source, destination, status } of rules) {
    const rawS = normalizePath(source);
    const d = normalizePath(destination);
    const code = status || "301";
    if (!rawS || !d) continue;
    const sPath = rawS.startsWith("http") ? (() => { try { return new URL(rawS).pathname; } catch { return rawS; } })() : rawS;
    const sNorm = sPath.startsWith("/") ? sPath : `/${sPath}`;
    lines.push(`    location = ${sNorm} { return ${code} ${d}; }`);
  }
  lines.push("}");
  return lines.join("\n");
}

function generatePHP(rules) {
  const lines = ["<?php", "// PHP 301 redirects", "// Place at the top of your entry file before output:"];
  for (const { source, destination, status } of rules) {
    const s = normalizePath(source);
    const d = normalizePath(destination);
    const code = status || "301";
    if (!s || !d) continue;
    lines.push(`if ($_SERVER['REQUEST_URI'] === '${s}') { header('Location: ${d}', true, ${code}); exit; }`);
  }
  lines.push("?>");
  return lines.join("\n");
}

function generateHTML(rules) {
  const lines = ["<!-- HTML client-side redirects (fallback) -->"];
  for (const { source, destination } of rules) {
    const s = normalizePath(source);
    const d = normalizePath(destination);
    if (!s || !d) continue;
    lines.push(`<!-- From ${s} to ${d} -->`);
    lines.push(`<meta http-equiv=\"refresh\" content=\"0;url=${d}\">`);
  }
  return lines.join("\n");
}

function generateJavaScript(rules) {
  const lines = ["// JavaScript client-side redirects (fallback)"];
  lines.push("(function(){");
  lines.push("  var map = {}");
  for (const { source, destination } of rules) {
    const rawS = normalizePath(source);
    const d = normalizePath(destination);
    if (!rawS || !d) continue;
    let key = rawS;
    try { if (rawS.startsWith("http")) { key = new URL(rawS).pathname; } } catch { }
    lines.push(`  map['${key}'] = '${d}';`);
  }
  lines.push("  var cur = window.location.pathname;");
  lines.push("  if (map[cur]) { window.location.replace(map[cur]); }\n})();");
  return lines.join("\n");
}

export default function Redirect301GeneratorClient({ baseUrl }) {
  const [rules, setRules] = useState([
    { source: "/old-path", destination: "/new-path", status: "301" },
  ]);
  const [activeFormat, setActiveFormat] = useState("apache");
  const [messages, setMessages] = useState([]);
  const [csvError, setCsvError] = useState("");
  const [chains, setChains] = useState([]);
  const [cycles, setCycles] = useState([]);
  const liveRef = useRef(null);

  useEffect(() => {
    const msgs = [];
    const seenSources = new Set();
    const seenPairs = new Set();

    for (const r of rules) {
      const s = normalizePath(r.source);
      const d = normalizePath(r.destination);
      if (!isValidUrl(s) && !s.startsWith("/")) {
        msgs.push({ type: "error", text: `Invalid source: ${s}` });
      }
      if (!isValidUrl(d) && !d.startsWith("/")) {
        msgs.push({ type: "error", text: `Invalid destination: ${d}` });
      }
      if (s === d) {
        msgs.push({ type: "warning", text: `Self-redirect detected for: ${s}` });
      }
      if (seenSources.has(s)) {
        msgs.push({ type: "warning", text: `Duplicate source detected: ${s}` });
      }
      const key = `${s}>>${d}`;
      if (seenPairs.has(key)) {
        msgs.push({ type: "warning", text: `Duplicate rule detected: ${s} → ${d}` });
      }
      seenSources.add(s);
      seenPairs.add(key);
    }

    setMessages(msgs);
    setCycles(detectCycles(rules));
    setChains(computeChains(rules));
    if (liveRef.current) {
      liveRef.current.textContent = msgs.length ? `${msgs.length} validation message(s)` : "All good";
    }
  }, [rules]);

  const code = useMemo(() => {
    switch (activeFormat) {
      case "apache":
        return generateApache(rules);
      case "nginx":
        return generateNginx(rules);
      case "php":
        return generatePHP(rules);
      case "html":
        return generateHTML(rules);
      case "js":
        return generateJavaScript(rules);
      default:
        return generateApache(rules);
    }
  }, [rules, activeFormat]);

  const onRuleChange = (idx, field, value) => {
    setRules((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addRow = () => setRules((prev) => [...prev, { source: "", destination: "", status: "301" }]);
  const removeRow = (idx) => setRules((prev) => prev.filter((_, i) => i !== idx));
  const clearAll = () => setRules([{ source: "/old-path", destination: "/new-path", status: "301" }]);

  const onCSVUpload = async (file) => {
    setCsvError("");
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const validRows = rows.filter((r) => r.source && r.destination);
      if (!validRows.length) {
        setCsvError("No valid rows found in CSV.");
        return;
      }
      setRules(validRows);
    } catch (e) {
      setCsvError("Failed to parse CSV.");
    }
  };

  const schemaLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '301 Redirect Generator',
    url: `${baseUrl}/tools/redirect-301-generator`,
    applicationCategory: 'SEO Tool',
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: '100 SEO Tools'
    },
    operatingSystem: 'Web',
    description: 'Generate production-ready 301 redirects across multiple formats with validation and visualization.',
  };

  return (
    <main className="px-4 md:px-8 lg:px-12 py-8 max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-brand-700 dark:text-brand-300">301 Redirect Generator</h1>
      <p className="mt-2 text-accessibleGray-600 dark:text-slate-300">
        Generate production-ready 301 redirects across Apache, Nginx, PHP, HTML, and JavaScript. Real-time validation,
        circular redirect detection, and visual flow mapping included.
      </p>

      <div aria-live="polite" aria-atomic="true" className="sr-only" ref={liveRef} />

      <section className="mt-6" aria-labelledby="input-section">
        <h2 id="input-section" className="text-xl font-semibold">Redirect Rules</h2>
        <p className="text-sm text-accessibleGray-600 dark:text-slate-300">Add source and destination pairs. Status defaults to 301.</p>

        {/* Desktop table view */}
        <div className="mt-4 hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-accessibleGray-200 dark:border-white/10">
                <th className="py-2 pr-4">Source URL or Path</th>
                <th className="py-2 pr-4">Destination URL or Path</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, idx) => (
                <tr key={idx} className="border-b border-accessibleGray-200 dark:border-white/10">
                  <td className="py-2 pr-4">
                    <label className="sr-only" htmlFor={`src-desktop-${idx}`}>Source</label>
                    <input
                      id={`src-desktop-${idx}`}
                      className="w-full border border-accessibleGray-300 dark:border-white/10 rounded px-2 py-1 bg-white/80 dark:bg-slate-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      placeholder="/old-path or https://example.com/old"
                      value={rule.source}
                      onChange={(e) => onRuleChange(idx, "source", e.target.value)}
                      inputMode="url"
                      aria-invalid={!rule.source || (!isValidUrl(rule.source) && !rule.source.startsWith("/"))}
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <label className="sr-only" htmlFor={`dst-desktop-${idx}`}>Destination</label>
                    <input
                      id={`dst-desktop-${idx}`}
                      className="w-full border border-accessibleGray-300 dark:border-white/10 rounded px-2 py-1 bg-white/80 dark:bg-slate-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      placeholder="/new-path or https://example.com/new"
                      value={rule.destination}
                      onChange={(e) => onRuleChange(idx, "destination", e.target.value)}
                      inputMode="url"
                      aria-invalid={!rule.destination || (!isValidUrl(rule.destination) && !rule.destination.startsWith("/"))}
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <label className="sr-only" htmlFor={`status-desktop-${idx}`}>Status</label>
                    <select
                      id={`status-desktop-${idx}`}
                      className="border border-accessibleGray-300 dark:border-white/10 rounded px-2 py-1 bg-white/80 dark:bg-slate-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                      value={rule.status}
                      onChange={(e) => onRuleChange(idx, "status", e.target.value)}
                    >
                      <option value="301">301 (Permanent)</option>
                      <option value="308">308 (Permanent)</option>
                      <option value="302">302 (Temporary)</option>
                    </select>
                  </td>
                  <td className="py-2">
                    <button
                      className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-gpu will-change-transform-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => removeRow(idx)}
                      aria-label={`Remove rule ${idx + 1}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="mt-4 md:hidden space-y-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="p-4 border border-accessibleGray-200 dark:border-white/10 rounded-lg bg-white/80 dark:bg-slate-900/40">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Rule {idx + 1}</span>
                <button
                  className="text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  onClick={() => removeRow(idx)}
                  aria-label={`Remove rule ${idx + 1}`}
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor={`src-mobile-${idx}`} className="block text-sm font-medium mb-1">Source URL or Path</label>
                  <input
                    id={`src-mobile-${idx}`}
                    className="w-full border border-accessibleGray-300 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    placeholder="/old-path"
                    value={rule.source}
                    onChange={(e) => onRuleChange(idx, "source", e.target.value)}
                    inputMode="url"
                    aria-invalid={!rule.source || (!isValidUrl(rule.source) && !rule.source.startsWith("/"))}
                  />
                </div>
                <div>
                  <label htmlFor={`dst-mobile-${idx}`} className="block text-sm font-medium mb-1">Destination URL or Path</label>
                  <input
                    id={`dst-mobile-${idx}`}
                    className="w-full border border-accessibleGray-300 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    placeholder="/new-path"
                    value={rule.destination}
                    onChange={(e) => onRuleChange(idx, "destination", e.target.value)}
                    inputMode="url"
                    aria-invalid={!rule.destination || (!isValidUrl(rule.destination) && !rule.destination.startsWith("/"))}
                  />
                </div>
                <div>
                  <label htmlFor={`status-mobile-${idx}`} className="block text-sm font-medium mb-1">Status Code</label>
                  <select
                    id={`status-mobile-${idx}`}
                    className="w-full border border-accessibleGray-300 dark:border-white/10 rounded px-3 py-2 bg-white dark:bg-slate-900/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                    value={rule.status}
                    onChange={(e) => onRuleChange(idx, "status", e.target.value)}
                  >
                    <option value="301">301 (Permanent)</option>
                    <option value="308">308 (Permanent)</option>
                    <option value="302">302 (Temporary)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button className="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700 transition-gpu will-change-transform-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2" onClick={addRow}>Add Row</button>
          <button className="px-4 py-2 rounded border border-accessibleGray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/10 transition-gpu will-change-transform-opacity" onClick={clearAll}>Reset</button>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className="px-4 py-2 rounded border border-accessibleGray-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-white/10 transition-gpu will-change-transform-opacity">Upload CSV</span>
            <input
              type="file"
              accept="text/csv,.csv"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && onCSVUpload(e.target.files[0])}
            />
          </label>
        </div>
        {csvError && <p role="alert" className="mt-2 text-red-600 dark:text-red-400">{csvError}</p>}
      </section>

      <section className="mt-8" aria-labelledby="validation-section">
        <h2 id="validation-section" className="text-xl font-semibold">Validation & Warnings</h2>
        {messages.length === 0 ? (
          <p className="text-green-700 dark:text-green-400 mt-2">No issues detected. Redirects look good.</p>
        ) : (
          <ul className="mt-2 list-disc pl-6">
            {messages.map((m, i) => (
              <li key={i} className={m.type === "error" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}>{m.text}</li>
            ))}
          </ul>
        )}
        {cycles.length > 0 && (
          <div className="mt-3 p-3 border border-red-300 dark:border-red-800 rounded bg-red-50 dark:bg-red-950/20">
            <p className="font-semibold text-red-700 dark:text-red-400">Circular redirects detected:</p>
            <ul className="list-disc pl-6 mt-1 text-red-800 dark:text-red-300">
              {cycles.map((c, i) => (
                <li key={i}>{c.join(" → ")} → {c[0]}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mt-8" aria-labelledby="visual-section">
        <h2 id="visual-section" className="text-xl font-semibold">Redirect Flow Diagram</h2>
        <p id="visual-desc" className="text-sm text-accessibleGray-600 dark:text-slate-300">Visualize chains and potential loops. Red highlights indicate cycles.</p>
        <div className="mt-3 border border-accessibleGray-200 dark:border-white/10 rounded p-3 overflow-auto" style={{ maxHeight: 360 }}>
          <svg width="100%" height={chains.length * 80 + 40} role="img" aria-labelledby="visual-section" aria-describedby="visual-desc">
            {chains.map((chain, row) => {
              const yBase = 40 + row * 80;
              return (
                <g key={row} transform={`translate(20, ${yBase})`}>
                  {chain.map((node, i) => {
                    const x = i * 220;
                    const isLast = i === chain.length - 1;
                    const isCycleStart = cycles.some((c) => c[0] === node);
                    return (
                      <g key={i}>
                        <rect x={x} y={-20} width={180} height={40} rx={6} className={isCycleStart ? "fill-red-200 dark:fill-red-800/40 stroke-red-500 dark:stroke-red-400" : "fill-brand-50 stroke-accessibleGray-300 dark:fill-slate-800 dark:stroke-white/20"} strokeWidth={1} />
                        <text x={x + 8} y={6} className="fill-slate-900 dark:fill-white text-sm">{node}</text>
                        {!isLast && (
                          <g>
                            <line x1={x + 180} y1={0} x2={x + 220} y2={0} className="stroke-accessibleGray-600 dark:stroke-white/40" strokeWidth={2} />
                            <polygon points={`${x + 220},0 ${x + 210},-6 ${x + 210},6`} className="fill-accessibleGray-600 dark:fill-white/40" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="output-section">
        <h2 id="output-section" className="text-xl font-semibold">Generated Config</h2>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Output Formats">
          {[
            { key: "apache", label: "Apache" },
            { key: "nginx", label: "Nginx" },
            { key: "php", label: "PHP" },
            { key: "html", label: "HTML" },
            { key: "js", label: "JavaScript" },
          ].map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeFormat === t.key}
              className={`px-3 py-1 rounded border border-accessibleGray-200 dark:border-white/10 transition-gpu will-change-transform-opacity ${activeFormat === t.key ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-white/80 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/10"}`}
              onClick={() => setActiveFormat(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          <label className="sr-only" htmlFor="code-output">Generated code</label>
          <textarea id="code-output" className="w-full h-48 border border-accessibleGray-300 dark:border-white/10 rounded p-2 font-mono text-xs bg-white/80 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100" value={code} readOnly />
        </div>
      </section>

      <section className="mt-10" aria-labelledby="best-practices">
        <h2 id="best-practices" className="text-xl font-semibold">Best Practices</h2>
        <ul className="list-disc pl-6 text-sm text-accessibleGray-600 dark:text-slate-300 mt-2">
          <li>Use server-level 301 redirects (Apache/Nginx) for SEO-critical routes.</li>
          <li>Avoid long redirect chains; collapse multiple hops into direct source → destination.</li>
          <li>Ensure canonical URLs point to the final destination to prevent duplication.</li>
          <li>Update internal links to point directly to new locations, reducing reliance on redirects.</li>
        </ul>
      </section>

      <Script id="schema-redirect-generator" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(schemaLd)}
      </Script>
    </main>
  );
}
