import Link from 'next/link';
import Image from 'next/image';
import { getToolGuide, getInstructionEntry } from '../../lib/guides';
import UnifiedCard from '../ui/UnifiedCard';
import StructuredData from '../ui/StructuredData';
import { toolContent } from '../../lib/toolContent';
// fs and path imports removed as they were part of the deleted function


export default function ToolLayout({ tool, children, formFirst = false, relatedTools = [], extraSchema = [] }) {
  // Generate guidance content for any tool via generic generator
  const guide = getToolGuide(tool);
  const override = getInstructionEntry(tool.slug);
  const content = toolContent[tool.slug];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{`${tool.name} | 100 SEO Tools`}</h1>
            <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{tool.category}</span>
            <Link
              href={`/blog/${tool.slug}`}
              aria-label={`Read guide: ${tool.name}`}
              className="tap-target text-sm text-brand-600 hover:opacity-85 transition-gpu will-change-transform-opacity"
            >
              Read Guide
            </Link>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">Generate and optimize with fast, helpful outputs</p>
          <a href="#tool-form" className="btn" aria-label="Jump to the form to generate your output">Start Generating</a>
        </div>
        {content?.furtherReading && (
          <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Further reading:</span>{' '}
            {content.furtherReading.map((link, i) => (
              <span key={i}>
                <Link href={link.href} className="hover:underline">{link.text}</Link>
                {i < content.furtherReading.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Form first layout */}
      {formFirst && (
        <>
          <div className="card p-6">
            {children}
          </div>

          {/* Social Proof Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">10k+</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Active Users</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">100%</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Free Forever</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">Privacy</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Focused</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">Fast</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Processing</span>
            </div>
          </div>

          {guide && (
            <div className="card p-6 space-y-6">
              <section aria-labelledby="intro-heading" className="space-y-2">
                <h2 id="intro-heading" className="text-xl font-semibold">Introduction</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.introduction}</p>
              </section>

              <section aria-labelledby="what-heading" className="space-y-2">
                <h2 id="what-heading" className="text-xl font-semibold">Why This Tool Is Needed</h2>
                <p className="text-gray-700 dark:text-gray-300">{guide.whatItDoes}</p>
              </section>

              <section aria-labelledby="seo-heading" className="space-y-2">
                <h2 id="seo-heading" className="text-xl font-semibold">Role of This Tool in SEO</h2>
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
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{guide.exampleResults}</p>
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
              {content?.competitorBenchmarking && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">Competitor Benchmarking</h3>
                  <p className="text-gray-700 dark:text-gray-300">{content.competitorBenchmarking}</p>
                </div>
              )}

              {/* Frequency Asked Questions */}
              {Array.isArray(guide.faqs) && guide.faqs.length > 0 && (
                <section aria-labelledby="faq-heading" className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h2 id="faq-heading" className="text-xl font-semibold">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {guide.faqs.map((faq, idx) => (
                      <div key={idx} className="space-y-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{faq.q}</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related tools section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Related Tools</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Show unique related tools from both hardcoded and dynamic sources */}
                  {(() => {
                    const seenSlugs = new Set();
                    const uniqueTools = [];

                    // Process hardcoded tools
                    if (guide.relatedTools && Array.isArray(guide.relatedTools)) {
                      guide.relatedTools.forEach(slug => {
                        if (!seenSlugs.has(slug)) {
                          seenSlugs.add(slug);
                          const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                          uniqueTools.push({ slug, name, source: 'hardcoded' });
                        }
                      });
                    }

                    // Process dynamic tools
                    if (relatedTools && Array.isArray(relatedTools)) {
                      relatedTools.forEach(t => {
                        if (!seenSlugs.has(t.slug)) {
                          seenSlugs.add(t.slug);
                          uniqueTools.push({ slug: t.slug, name: t.name, source: 'dynamic' });
                        }
                      });
                    }

                    return uniqueTools.map(t => (
                      <UnifiedCard
                        key={t.slug}
                        title={t.name}
                        href={`/tools/${t.slug}`}
                        meta="Related Tool"
                        variant="minimal"
                      />
                    ));
                  })()}
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
          {/* Social Proof Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">10k+</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Active Users</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">100%</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Free Forever</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">Privacy</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Focused</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-2xl font-bold text-brand-600">Fast</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">Processing</span>
            </div>
          </div>
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
          {content?.furtherReading && (
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-2">Further Reading</h2>
              <div className="flex flex-wrap gap-2">
                {content.furtherReading.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    {link.text}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}




      {/* Author Section */}
      <div className="card p-6 flex items-center gap-4 border-l-4 border-brand-500">
        <div className="flex-shrink-0">
          <Image
            src="/author.png"
            alt="Abhishek Adhikari"
            width={64}
            height={64}
            className="rounded-full border border-slate-200 dark:border-white/10"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1">
            Tool Created by <Link href="/author" className="text-brand-600 hover:underline">Abhishek Adhikari</Link>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            SEO Expert, Full-Stack Developer, and Creator of 100 SEO Tools. With 10+ years of experience, I build free, privacy-focused tools to help you rank higher.
          </p>
        </div>
      </div>

      {/* Professional footer with additional information */}
      <div className="text-sm text-gray-500 dark:text-gray-400 px-2">
        <p>This tool is provided free of charge and requires no login. All processing happens in your browser - no data is sent to our servers.</p>
        <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      {override && override.schema_json_ld && (
        <StructuredData data={override.schema_json_ld} />
      )}
      {extraSchema && (Array.isArray(extraSchema) ? extraSchema : [extraSchema]).map((schema, i) => (
        schema ? <StructuredData key={i} data={schema} /> : null
      ))}
    </div>
  );
}
