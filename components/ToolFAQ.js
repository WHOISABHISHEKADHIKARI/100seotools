"use client";

import { FiHelpCircle } from 'react-icons/fi';

/**
 * ToolFAQ Component
 * Displays FAQ section with structured data for rich snippets
 */
export default function ToolFAQ({ faqs, toolName }) {
    if (!faqs || faqs.length === 0) return null;

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            {/* JSON-LD Schema for rich snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* FAQ Section */}
            <section className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
                <div className="flex items-center gap-2 mb-6">
                    <FiHelpCircle className="w-6 h-6 text-brand-600" aria-hidden="true" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:border-brand-500 transition-colors"
                        >
                            <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between text-gray-900 dark:text-gray-100 select-none">
                                <span>{faq.question}</span>
                                <svg
                                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>

                {/* Additional help section */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Need more help?</strong> Check out our{' '}
                        <a href="/blog" className="text-brand-600 hover:underline">
                            SEO guides and tutorials
                        </a>{' '}
                        or explore our{' '}
                        <a href="/category" className="text-brand-600 hover:underline">
                            other free SEO tools
                        </a>.
                    </p>
                </div>
            </section>
        </>
    );
}
