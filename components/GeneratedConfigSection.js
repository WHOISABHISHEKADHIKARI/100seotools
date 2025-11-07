"use client";
import CopyButton from "./CopyButton";

export default function GeneratedConfigSection({ title = "Generated Config", config = "", language = "text" }) {
  const display = typeof config === "string" ? config : JSON.stringify(config, null, 2);
  return (
    <section id="generated-config" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-4 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <CopyButton text={display} className="ml-2" ariaLabel={`Copy ${title}`} />
      </div>
      <pre className="bg-white dark:bg-slate-900/40 p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
        <code className={`language-${language}`}>{display}</code>
      </pre>
    </section>
  );
}