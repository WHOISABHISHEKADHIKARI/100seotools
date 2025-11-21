import { getToolGuide } from '../lib/guides';
import UnifiedCard from './UnifiedCard';
import StructuredData from './StructuredData';
import fs from 'node:fs';
import path from 'node:path';

function getInstructionEntry(slug) {
  try {
    const primary = path.resolve(process.cwd(), 'instruction', 'json-instruction.json');
    const fallback = path.resolve(process.cwd(), 'tools', 'json instruction');
    const file = fs.existsSync(primary) ? primary : fallback;
    const text = fs.readFileSync(file, 'utf8');
    const obj = JSON.parse(text);
    const entries = Array.isArray(obj.entries) ? obj.entries : [];
    const match = entries.find((e) => {
      try {
        const g = e.schema_json_ld && e.schema_json_ld['@graph'];
        if (!Array.isArray(g)) return false;
        const wp = g.find((n) => n && n['@type'] === 'WebPage');
        const u = wp && (wp.url || wp['@id']);
        return typeof u === 'string' && /\/tools\//.test(u) && u.endsWith(`/tools/${slug}`);
      } catch {
        return false;
      }
    });
    return match || null;
  } catch {
    return null;
  }
}

export default function ToolLayout({ tool, children, formFirst = false, relatedTools = [] }) {
  // Generate guidance content for any tool via generic generator
  const guide = getToolGuide(tool);
  const override = getInstructionEntry(tool.slug);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{`${tool.name} | Free AI SEO Tool by 100SEOTools`}</h1>
            <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{tool.category}</span>
            <a
              href={`/blog/${tool.slug}`}
              aria-label={`Read guide: ${tool.name}`}
              className="tap-target text-sm text-brand-600 hover:opacity-85 transition-gpu will-change-transform-opacity"
            >
              Read Guide
            </a>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">Generate and optimize with fast, helpful outputs</p>
          <a href="#tool-form" className="btn" aria-label="Jump to the form to generate your output">Start Generating</a>
        </div>
        {tool.slug === 'content-freshness-checker' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category" className="hover:underline">SEO Tools Categories</a>,{' '}
            <a href="/blog/content-freshness-checker" className="hover:underline">Content Freshness Checker guide</a>
          </div>
        )}
        {tool.slug === 'ai-schema-generator' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category" className="hover:underline">SEO Tools Categories</a>,{' '}
            <a href="/tools/schema-markup-generator" className="hover:underline">Schema Markup Generator</a>,{' '}
            <a href="/tools/structured-data-validator" className="hover:underline">Structured Data Validator</a>,{' '}
            <a href="/tools/xml-sitemap-visualizer" className="hover:underline">XML Sitemap Visualizer</a>,{' '}
            <a href="/blog/free-seo-tools-list-2024" className="hover:underline">Free SEO Tools list</a>,{' '}
            <a href="/blog/100-free-seo-tools-ultimate-list" className="hover:underline">100 SEO Tools ultimate guide</a>
          </div>
        )}
        {tool.slug === 'seo-content-checker' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/content-seo" className="hover:underline">Content SEO tools</a>,{' '}
            <a href="/tools/keyword-density-checker" className="hover:underline">Keyword Density Checker</a>,{' '}
            <a href="/tools/readability-score-calculator" className="hover:underline">Readability Score Calculator</a>,{' '}
            <a href="/tools/heading-analyzer" className="hover:underline">Heading Analyzer</a>,{' '}
            <a href="/tools/meta-tag-generator" className="hover:underline">Meta Tag Generator</a>,{' '}
            <a href="/blog/seo-content-checker-how-to-use" className="hover:underline">SEO Content Checker: How to Use</a>
          </div>
        )}
        {tool.slug === 'meta-tag-generator' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/on-page-optimization" className="hover:underline">On‑Page Optimization tools</a>,{' '}
            <a href="/tools/meta-description-optimizer" className="hover:underline">Meta Description Generator</a>,{' '}
            <a href="/tools/heading-analyzer" className="hover:underline">Heading Analyzer</a>,{' '}
            <a href="/tools/structured-data-validator" className="hover:underline">Structured Data Validator</a>,{' '}
            <a href="/blog/meta-tag-generator" className="hover:underline">Meta Tag Generator guide</a>
          </div>
        )}
        {tool.slug === 'competitor-gap-analyzer' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/competitor-analysis" className="hover:underline">Competitor Analysis tools</a>,{' '}
            <a href="/tools/keyword-gap-finder" className="hover:underline">Keyword Gap Finder</a>,{' '}
            <a href="/tools/competitor-keyword-overlap-checker" className="hover:underline">Competitor Keyword Overlap Checker</a>,{' '}
            <a href="/tools/keyword-clustering-tool" className="hover:underline">Keyword Clustering Tool</a>,{' '}
            <a href="/tools/internal-linking-planner" className="hover:underline">Internal Linking Planner</a>
          </div>
        )}
        {tool.slug === 'on-page-seo-audit-checker' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/on-page-optimization" className="hover:underline">On‑Page Optimization tools</a>,{' '}
            <a href="/tools/meta-tag-generator" className="hover:underline">Meta Tag Generator</a>,{' '}
            <a href="/tools/heading-analyzer" className="hover:underline">Heading Analyzer</a>,{' '}
            <a href="/tools/structured-data-validator" className="hover:underline">Structured Data Validator</a>,{' '}
            <a href="/tools/internal-linking-planner" className="hover:underline">Internal Linking Planner</a>,{' '}
            <a href="/tools/seo-content-checker" className="hover:underline">SEO Content Checker</a>
          </div>
        )}
        {tool.slug === 'local-seo-audit-checklist' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/local-seo" className="hover:underline">Local SEO tools</a>,{' '}
            <a href="/tools/local-citation-finder" className="hover:underline">Local Citation Finder</a>,{' '}
            <a href="/tools/nap-consistency-checker" className="hover:underline">NAP Consistency Checker</a>,{' '}
            <a href="/tools/local-schema-builder" className="hover:underline">Local Schema Builder</a>,{' '}
            <a href="/tools/structured-data-validator" className="hover:underline">Structured Data Validator</a>,{' '}
            <a href="/tools/on-page-seo-audit-checker" className="hover:underline">On‑Page SEO Audit Checker</a>
          </div>
        )}
        {tool.slug === 'text-to-html-converter' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/seo-utility" className="hover:underline">SEO Utility tools</a>,{' '}
            <a href="/tools/structured-data-validator" className="hover:underline">Structured Data Validator</a>,{' '}
            <a href="/tools/schema-markup-generator" className="hover:underline">Schema Markup Generator</a>,{' '}
            <a href="/tools/heading-analyzer" className="hover:underline">Heading Analyzer</a>,{' '}
            <a href="/tools/meta-tag-generator" className="hover:underline">Meta Tag Generator</a>,{' '}
            <a href="/tools/url-slug-generator" className="hover:underline">URL Slug Generator</a>,{' '}
            <a href="/tools/og-tag-generator" className="hover:underline">OG Tag Generator</a>
          </div>
        )}
        {tool.slug === 'keyword-suggestion-tool' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/keyword-research" className="hover:underline">Keyword Research tools</a>,{' '}
            <a href="/tools/long-tail-keyword-generator" className="hover:underline">Long‑Tail Keyword Generator</a>,{' '}
            <a href="/tools/keyword-clustering-tool" className="hover:underline">Keyword Clustering Tool</a>,{' '}
            <a href="/tools/keyword-intent-identifier" className="hover:underline">Keyword Intent Identifier</a>,{' '}
            <a href="/tools/competitor-keyword-overlap-checker" className="hover:underline">Competitor Keyword Overlap Checker</a>,{' '}
            <a href="/tools/keyword-gap-finder" className="hover:underline">Keyword Gap Finder</a>,{' '}
            <a href="/blog/keyword-suggestion-tool" className="hover:underline">Keyword suggest tool guide</a>,{' '}
            <a href="/blog/keyword-suggestion-tool-popular-search-terms" className="hover:underline">Popular search terms</a>,{' '}
            <a href="/blog/keyword-suggestion-tool-how-to-use" className="hover:underline">Keyword ideas generator: how to use</a>
          </div>
        )}
        {tool.slug === 'keyword-clustering-tool' && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            <a href="/" className="hover:underline">Homepage</a>,{' '}
            <a href="/category/keyword-research" className="hover:underline">Keyword Research tools</a>,{' '}
            <a href="/tools/keyword-clustering-tool" className="hover:underline">Best free keyword clustering tool</a>,{' '}
            <a href="/blog/keyword-clustering-tool" className="hover:underline">Keyword clustering tool guide</a>,{' '}
            <a href="/tools/keyword-intent-identifier" className="hover:underline">Semantic keyword grouping tool</a>,{' '}
            <a href="/tools/competitor-keyword-overlap-checker" className="hover:underline">AI keyword clustering benchmarks</a>,{' '}
            <a href="/tools/keyword-gap-finder" className="hover:underline">Competitor keyword gaps</a>,{' '}
            <a href="/tools/internal-linking-planner" className="hover:underline">Internal linking planner</a>
          </div>
        )}
      </div>

      {/* Form first layout */}
      {formFirst && (
        <>
          <div className="card p-6">
            {children}
          </div>

          {guide && (
            <div className="card p-6 space-y-6">
              <section aria-labelledby="intro-heading" className="space-y-2">
                <h2 id="intro-heading" className="text-xl font-semibold">Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.introduction}</p>
              </section>

              <section aria-labelledby="what-heading" className="space-y-2">
                <h2 id="what-heading" className="text-xl font-semibold">What It Does</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.whatItDoes}</p>
              </section>

              <section aria-labelledby="seo-heading" className="space-y-2">
                <h2 id="seo-heading" className="text-xl font-semibold">Why It Matters for SEO</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.whyItMattersSEO}</p>
              </section>
              <h2 className="text-xl font-semibold mb-2">Tool Information</h2>

              <div>
                <h3 className="text-lg font-medium mb-2">What is this tool for?</h3>
                <p className="text-gray-700 dark:text-gray-300">{guide.purpose}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">How to use</h3>
                <p className="text-gray-700 dark:text-gray-300">{guide.howToUse}</p>
                {Array.isArray(guide.howToSteps) && guide.howToSteps.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.howToSteps.map((s, idx) => (
                      <li key={idx}><span className="font-medium">{s.step}:</span> {s.tip}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Understanding the output</h3>
                <p className="text-gray-700 dark:text-gray-300">{guide.outputExplanation}</p>
              </div>

              {guide.benefits && guide.benefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {guide.useCases && guide.useCases.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Common Use Cases</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(guide.features) && guide.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.features.map((feat, index) => (
                      <li key={index}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              {guide.exampleResults && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Example Results</h3>
                  <p className="text-gray-700 dark:text-gray-300">{guide.exampleResults}</p>
                </div>
              )}

              {Array.isArray(guide.bestPractices) && guide.bestPractices.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.bestPractices.map((bp, index) => (
                      <li key={index}>{bp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Installation & Setup */}
              {guide.installationSetup && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Installation and Setup</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li><span className="font-medium">Access:</span> {guide.installationSetup.access}</li>
                    <li><span className="font-medium">Supported devices:</span> {guide.installationSetup.devices}</li>
                    <li><span className="font-medium">Requirements:</span> {guide.installationSetup.requirements}</li>
                    <li><span className="font-medium">Optional:</span> {guide.installationSetup.optional}</li>
                  </ul>
                </div>
              )}

              {/* Core Functionality */}
              {guide.coreFunctionality && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Core Functionality</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium">Inputs</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        {Array.isArray(guide.coreFunctionality.inputs) && guide.coreFunctionality.inputs.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Outputs</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        {Array.isArray(guide.coreFunctionality.outputs) && guide.coreFunctionality.outputs.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300"><span className="font-medium">Processing:</span> {guide.coreFunctionality.processing}</p>
                  {Array.isArray(guide.coreFunctionality.actions) && guide.coreFunctionality.actions.length > 0 && (
                    <p className="mt-1 text-gray-700 dark:text-gray-300"><span className="font-medium">Actions:</span> {guide.coreFunctionality.actions.join(', ')}</p>
                  )}
                </div>
              )}

              {/* Advanced Features & Configuration */}
              {guide.advancedFeatures && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Advanced Features & Configuration</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium">Settings</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        {Array.isArray(guide.advancedFeatures.settings) && guide.advancedFeatures.settings.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Integrations</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                        {Array.isArray(guide.advancedFeatures.integrations) && guide.advancedFeatures.integrations.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300"><span className="font-medium">Performance:</span> {guide.advancedFeatures.performance}</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300"><span className="font-medium">Accessibility:</span> {guide.advancedFeatures.accessibility}</p>
                </div>
              )}

              {/* Troubleshooting */}
              {Array.isArray(guide.troubleshooting) && guide.troubleshooting.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Troubleshooting</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.troubleshooting.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact & Support */}
              {guide.contactSupport && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact and Support</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li><span className="font-medium">Email:</span> {guide.contactSupport.email}</li>
                    <li><span className="font-medium">Feedback:</span> {guide.contactSupport.feedback}</li>
                    <li><span className="font-medium">Updates:</span> {guide.contactSupport.updates}</li>
                  </ul>
                </div>
              )}

              {/* SEO Requirements */}
              {guide.seoRequirements && (
                <div>
                  <h3 className="text-lg font-medium mb-2">SEO Requirements</h3>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Primary keyword:</span> {guide.seoRequirements.primaryKeyword}</p>
                  {Array.isArray(guide.seoRequirements.keywordVariations) && guide.seoRequirements.keywordVariations.length > 0 && (
                    <div className="mt-1">
                      <p className="font-medium">Keyword variations</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {guide.seoRequirements.keywordVariations.map((kw, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="mt-2 text-gray-700 dark:text-gray-300"><span className="font-medium">Meta Description (≤155 chars):</span> {guide.seoRequirements.metaDescription}</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300"><span className="font-medium">Internal links:</span> {guide.seoRequirements.internalLinksHint}</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300"><span className="font-medium">Tone:</span> {guide.seoRequirements.tone}</p>
                </div>
              )}

              {/* Schema Markup types used */}
              {Array.isArray(guide.schemaSections) && guide.schemaSections.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Schema Markup (JSON‑LD)</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.schemaSections.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quality & Accessibility */}
              {Array.isArray(guide.qualityAccessibility) && guide.qualityAccessibility.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Quality & Accessibility</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    {guide.qualityAccessibility.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tool.slug === 'content-freshness-checker' && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">Competitor Benchmarking</h3>
                  <p className="text-gray-700 dark:text-gray-300">Compare headings, internal links, and recency against top results. Use Keyword Clustering and Competitor Overlap to identify semantic gaps. Refresh with current sources and clear metadata.</p>
                </div>
              )}
              {tool.slug === 'ai-schema-generator' && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">Competitor Benchmarking</h3>
                  <p className="text-gray-700 dark:text-gray-300">Analyze top‑ranking pages for “100 SEO tools” and schema‑driven guides. Match entity coverage, required properties, and JSON‑LD cleanliness. Validate in Rich Results Test and ensure canonical, breadcrumbs, and FAQs reflect visible content.</p>
                </div>
              )}

              {/* Related tools section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Related Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* First show hardcoded related tools if available */}
                  {guide.relatedTools && guide.relatedTools.length > 0 &&
                    guide.relatedTools.map(slug => {
                      const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                      return (
                        <UnifiedCard
                          key={slug}
                          title={name}
                          href={`/tools/${slug}`}
                          meta="Related Tool"
                          variant="minimal"
                        />
                      );
                    })
                  }

                  {/* Then show dynamically found related tools */}
                  {relatedTools && relatedTools.length > 0 &&
                    relatedTools
                      .filter(t => !guide?.relatedTools?.includes?.(t.slug))
                      .map(t => (
                        <UnifiedCard
                          key={t.slug}
                          title={t.name}
                          href={`/tools/${t.slug}`}
                          meta="Related Tool"
                          variant="minimal"
                        />
                      ))
                  }
                </div>
              </div>

              {/* Reference cards */}
              {Array.isArray(guide.referenceCards) && guide.referenceCards.length > 0 && (
                <div className="space-y-4">
                  {guide.referenceCards.map((card, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-lg font-medium">{card.title}</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {card.items.map((it, i) => (
                          <UnifiedCard
                            key={i}
                            title={`${it.code} – ${it.label}`}
                            description={it.note}
                            interactive={false}
                            variant="minimal"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {guide.cta && (
                <div className="pt-2">
                  <a href="#tool-form" className="btn" aria-label="Jump to the form">Start Now</a>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">{guide.cta}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Default layout (guidance first) */}
      {!formFirst && (
        <>
          {guide && (
            <div className="card p-6 space-y-4">
              <div>
                <h2 className="text-lg font-medium mb-2">What is this tool for?</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.purpose}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-2">How to use</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.howToUse}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-2">Understanding the output</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.outputExplanation}</p>
              </div>

              {guide.relatedTools && guide.relatedTools.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium mb-2">Related tools</h2>
                  <div className="flex flex-wrap gap-2">
                    {guide.relatedTools.map(slug => {
                      const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                      return (
                        <a
                          key={slug}
                          href={`/tools/${slug}`}
                          className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 transition-transform will-change-transform hover:scale-[1.01]"
                        >
                          {name}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reference cards */}
              {Array.isArray(guide.referenceCards) && guide.referenceCards.length > 0 && (
                <div className="space-y-4">
                  {guide.referenceCards.map((card, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-lg font-medium">{card.title}</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {card.items.map((it, i) => (
                          <UnifiedCard
                            key={i}
                            title={`${it.code} – ${it.label}`}
                            description={it.note}
                            interactive={false}
                            variant="minimal"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick SEO requirements */}
              {guide.seoRequirements && (
                <div>
                  <h2 className="text-lg font-medium mb-2">SEO Requirements</h2>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Primary keyword:</span> {guide.seoRequirements.primaryKeyword}</p>
                  <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Meta Description:</span> {guide.seoRequirements.metaDescription}</p>
                </div>
              )}
            </div>
          )}

            <div className="card p-6">
              {children}
            </div>
            {tool.slug === 'content-freshness-checker' && (
              <div className="card p-6">
                <h2 className="text-lg font-medium mb-2">Further Reading</h2>
                <div className="flex flex-wrap gap-2">
                  <a href="/" className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Homepage</a>
                  <a href="/category" className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">SEO Tools Categories</a>
                  <a href="/blog/content-freshness-checker" className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Content Freshness Checker guide</a>
                </div>
              </div>
            )}
            {tool.slug === 'ai-schema-generator' && (
              <div className="card p-6">
                <h2 className="text-lg font-medium mb-2">Further Reading</h2>
                <div className="flex flex-wrap gap-2">
                  <a href="/blog/free-seo-tools-list-2024" className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Free SEO Tools list</a>
                  <a href="/blog/100-free-seo-tools-ultimate-list" className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">100 SEO Tools ultimate guide</a>
                  <a href="/" className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800">Homepage</a>
                </div>
              </div>
            )}
        </>
      )}

      {/* Professional footer with additional information */}
      <div className="text-sm text-gray-500 dark:text-gray-400 px-2">
        <p>This tool is provided free of charge and requires no login. All processing happens in your browser - no data is sent to our servers.</p>
        <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      {override && override.schema_json_ld && (
        <StructuredData data={override.schema_json_ld} />
      )}
    </div>
  );
}
