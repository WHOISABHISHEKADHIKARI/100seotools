import Link from 'next/link';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl, siteName } from '../../lib/site';
import StructuredData from '../../components/ui/StructuredData';

const baseUrl = getBaseUrl();

export const metadata = {
    title: 'All SEO Tools - Free Online SEO Toolkit | 100 SEO Tools',
    description: 'Browse all 100+ free SEO tools for keyword research, on-page optimization, technical SEO, content analysis, and performance tracking. No signup required.',
    alternates: { canonical: `${baseUrl}/tools` },
    openGraph: {
        title: 'All SEO Tools - Free Online SEO Toolkit',
        description: 'Browse all 100+ free SEO tools for keyword research, on-page optimization, technical SEO, and more.',
        type: 'website',
        url: `${baseUrl}/tools`,
    },
    twitter: {
        card: 'summary',
        title: 'All SEO Tools - Free Online SEO Toolkit',
        description: 'Browse all 100+ free SEO tools. No signup required, instant results.',
    },
};

export default function ToolsIndexPage() {
    const allTools = getAllToolsMeta();

    // Group items by category
    const categories = {};
    for (const item of allTools) {
        const cat = item.category || 'Other';
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push(item);
    }

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: `${baseUrl}/tools` },
        ],
    };

    const collectionLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'All SEO Tools',
        description: 'Complete collection of 100+ free SEO tools',
        url: `${baseUrl}/tools`,
        numberOfItems: allTools.length,
        provider: {
            '@type': 'Organization',
            name: siteName,
            url: baseUrl,
        },
    };

    return (
        <main id="main" className="container mx-auto px-4 py-8">
            <nav aria-label="Breadcrumb" className="text-sm mb-4">
                <ol className="flex flex-wrap gap-1 text-slate-600 dark:text-slate-300">
                    <li><Link href="/" className="hover:underline">Home</Link> <span aria-hidden>›</span></li>
                    <li aria-current="page" className="font-medium text-slate-900 dark:text-white">Tools</li>
                </ol>
            </nav>

            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">All Free SEO Tools</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
                    Browse our complete collection of {allTools.length} free SEO tools. Everything is 100% free, requires no signup, and provides instant value.
                </p>
            </header>

            {/* Category-based content listing */}
            <div className="space-y-10">
                {Object.entries(categories).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
                    <section key={category} aria-labelledby={`cat-${category.replace(/\s+/g, '-').toLowerCase()}`}>
                        <h2
                            id={`cat-${category.replace(/\s+/g, '-').toLowerCase()}`}
                            className="text-2xl font-semibold mb-4 pb-2 border-b border-slate-200 dark:border-white/10"
                        >
                            {category} <span className="text-base font-normal text-slate-500">({items.length} tools)</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {items.map((item) => (
                                <Link
                                    key={`tool-${item.slug}`}
                                    href={`/tools/${item.slug}`}
                                    prefetch={false}
                                    className="block p-4 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 transition-all hover:shadow-md hover:border-brand-500 dark:hover:border-brand-400"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-medium text-slate-900 dark:text-white mb-1">{item.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{item.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* Back to home */}
            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10">
                <Link href="/" className="text-brand-600 dark:text-brand-400 hover:underline">
                    ← Back to Home
                </Link>
            </div>

            <StructuredData data={breadcrumbLd} />
            <StructuredData data={collectionLd} />
        </main>
    );
}
