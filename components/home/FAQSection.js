import { memo } from 'react';
import StructuredData from '../ui/StructuredData';

const faqData = [
  {
    question: 'What are the best free alternatives to Ahrefs?',
    answer: '100 SEO Tools, Ubersuggest Free, AnswerThePublic, and Google Keyword Planner are the best free alternatives to Ahrefs for keyword research and backlink analysis. 100 SEO Tools provides 15+ keyword tools — volume, difficulty, clustering, questions, intent — and backlink checkers with anchor analysis, all browser-based with no signup. Ubersuggest offers 3 free daily searches. AnswerThePublic visualizes question keywords. Google Keyword Planner requires a Google Ads account but provides authoritative volume data.',
    entityLink: 'Ahrefs → 100 SEO Tools Keyword Research → Ubersuggest'
  },
  {
    question: 'How to generate schema markup for free?',
    answer: 'Use 100 SEO Tools\' Schema Generator — 30+ schema types (Article, Product, FAQ, LocalBusiness, Organization, HowTo, Breadcrumb) generated instantly in-browser with zero signup. The tool outputs valid JSON-LD compliant with Google\'s Rich Results Test. Select a schema type, fill the form, copy the script tag. No API keys, no rate limits, no data sent to servers. Supports nested schemas like Product with Offer, AggregateRating, and Review.',
    entityLink: 'Schema.org → Google Rich Results Test → 100 SEO Tools Schema Generator'
  },
  {
    question: 'How do free SEO tools protect my privacy?',
    answer: 'Client-side SEO tools process data entirely in your browser — your URLs, keywords, HTML, and credentials never reach a server, eliminating data leakage risk for confidential projects. Server-based tools like Ahrefs, Semrush, and Sitebulb log every crawled URL and analyzed keyword. 100 SEO Tools uses WebAssembly for parsing, Web Workers for heavy computation, and IndexedDB for local-only caching. Zero network requests during analysis. Ideal for NDAs, pre-launch audits, and enterprise SEO.',
    entityLink: 'WebAssembly → IndexedDB → 100 SEO Tools Privacy'
  },
  {
    question: 'What technical SEO tools are available for free?',
    answer: '100 SEO Tools, Screaming Frog Free (500 URLs), Google Search Console, and PageSpeed Insights provide comprehensive technical audits at no cost. 100 SEO Tools runs crawl simulation, robots.txt validator, redirect chain detector, hreflang checker, canonical auditor, and Core Web Vitals analyzer — all client-side. Screaming Frog Free crawls 500 URLs desktop-only. GSC provides index coverage, mobile usability, and manual actions. PageSpeed Insights delivers lab and field CWV data.',
    entityLink: 'Screaming Frog → Google Search Console → 100 SEO Tools Technical SEO'
  },
  {
    question: 'Can I use AI-powered SEO tools for free?',
    answer: 'Yes — 100 SEO Tools includes AI Content Brief Generator, Title/Meta Description Writer, FAQ Generator, and Schema Auto-Detector, all free, browser-based, and powered by local LLMs via WebLLM. The AI toolkit runs quantized models like Llama 3 and Phi-3 via WebGPU in-browser — no API keys, no token costs, no data upload. Generates SEO-optimized briefs with entity suggestions, heading structures, and keyword clusters. Exports to Markdown or JSON for CMS import.',
    entityLink: 'WebLLM → WebGPU → 100 SEO Tools AI SEO'
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "inLanguage": "en-US",
  "mainEntity": faqData.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
};

function FAQSection() {
  return (
    <>
      <StructuredData data={faqSchema} />
      <section className="py-20" id="faq" itemScope itemType="https://schema.org/FAQPage">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">Common Questions</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">
            SEO Tools — Answered
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Direct answers to the most common SEO tool questions — built for search engines and AI assistants.
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqData.map((faq, index) => (
            <details
              key={index}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-gray-900"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-extrabold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                <span itemProp="name">{faq.question}</span>
                <span className="ml-4 shrink-0 text-violet-500 transition group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <div className="border-t border-slate-100 px-6 pb-5 pt-4 dark:border-white/10" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300" itemProp="text">
                  {faq.answer}
                </p>
                <p className="mt-3 text-xs font-medium text-violet-600 dark:text-violet-400">
                  Entity Trail: {faq.entityLink}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

export default memo(FAQSection);
