import { getToolGuide } from '../lib/guides';
import UnifiedCard from './UnifiedCard';

export default function ToolLayout({ tool, children, formFirst = false, relatedTools = [] }) {
  // Generate guidance content for any tool via generic generator
  const guide = getToolGuide(tool);

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{tool.name}</h1>
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
      </div>

      {/* Form first layout */}
      {formFirst && (
        <>
          <div className="card p-6">
            {children}
          </div>

          {guide && (
            <div className="card p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-2">Tool Information</h2>

              <div>
                <h3 className="text-lg font-medium mb-2">What is this tool for?</h3>
                <p className="text-gray-700 dark:text-gray-300">{guide.purpose}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">How to use</h3>
                <p className="text-gray-700 dark:text-gray-300">{guide.howToUse}</p>
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
            </div>
          )}

          <div className="card p-6">
            {children}
          </div>
        </>
      )}

      {/* Professional footer with additional information */}
      <div className="text-sm text-gray-500 dark:text-gray-400 px-2">
        <p>This tool is provided free of charge and requires no login. All processing happens in your browser - no data is sent to our servers.</p>
        <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
