import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateStaticPageSchema } from '../../lib/schema';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'SEO Glossary: 100+ SEO Terms & Definitions | 100 SEO Tools',
  description: 'Comprehensive SEO glossary with clear definitions of 100+ SEO terms including technical SEO, keyword research, link building, schema markup, E-E-A-T, and AI search optimization.',
  alternates: { canonical: `${baseUrl}/seo-glossary` },
  ...createSocialMetadata({
    title: 'SEO Glossary: 100+ SEO Terms & Definitions',
    description: 'Comprehensive SEO glossary with clear definitions of 100+ SEO terms.',
    url: `${baseUrl}/seo-glossary`,
    imageAlt: 'SEO Glossary',
  }),
};

const terms = [
  { term: '301 Redirect', def: 'A permanent redirect from one URL to another. Passes link equity and signals search engines to update their index.' },
  { term: '404 Error', def: 'HTTP status code indicating the requested page was not found on the server.' },
  { term: 'Alt Text', def: 'Alternative text attribute on images describing the image content for accessibility and SEO.' },
  { term: 'Anchor Text', def: 'The clickable text of a hyperlink. Descriptive anchor text helps search engines understand the linked page.' },
  { term: 'Backlink', def: 'A link from one website to another. Quality backlinks are a major ranking factor.' },
  { term: 'Canonical Tag', def: 'An HTML element specifying the preferred version of a page to avoid duplicate content issues.' },
  { term: 'Click-Through Rate (CTR)', def: 'Percentage of users who click a search result after seeing it. Calculated as clicks/impressions.' },
  { term: 'Core Web Vitals', def: 'Google page experience metrics: LCP (loading), INP (interactivity), CLS (visual stability).' },
  { term: 'Crawl Budget', def: 'The number of pages a search engine will crawl on a site within a given timeframe.' },
  { term: 'Domain Authority', def: 'A score (0-100) predicting how well a website will rank on search engines.' },
  { term: 'E-E-A-T', def: 'Experience, Expertise, Authoritativeness, Trustworthiness. Google quality guidelines for content evaluation.' },
  { term: 'Featured Snippet', def: 'A search result box that appears above organic results, answering a query directly.' },
  { term: 'Hreflang', def: 'HTML attribute specifying language and regional targeting for international SEO.' },
  { term: 'Indexing', def: 'The process by which search engines store and organize web pages for retrieval.' },
  { term: 'JSON-LD', def: 'JavaScript Object Notation for Linked Data. The recommended format for structured data markup.' },
  { term: 'Keyword Density', def: 'The percentage of times a keyword appears in content relative to total word count.' },
  { term: 'Long-Tail Keyword', def: 'A specific, longer search phrase with lower search volume but higher conversion intent.' },
  { term: 'Meta Description', def: 'An HTML meta tag summarizing page content for search engine results pages.' },
  { term: 'Noindex', def: 'A robots directive telling search engines not to include a page in their index.' },
  { term: 'Organic Traffic', def: 'Visitors who arrive at a site through unpaid search engine results.' },
  { term: 'Page Speed', def: 'How quickly a web page loads. A ranking factor and user experience metric.' },
  { term: 'Query', def: 'The words a user types into a search engine.' },
  { term: 'Ranking', def: 'The position of a web page in search engine results for a given query.' },
  { term: 'Robots.txt', def: 'A file that instructs search engine crawlers which pages to crawl or avoid.' },
  { term: 'Schema Markup', def: 'Structured data vocabulary (schema.org) that helps search engines understand content.' },
  { term: 'SERP', def: 'Search Engine Results Page. The page displayed after a search query.' },
  { term: 'Sitemap', def: 'An XML file listing all important pages on a website for search engine discovery.' },
  { term: 'Title Tag', def: 'An HTML element specifying the title of a web page, displayed in search results.' },
  { term: 'Topical Authority', def: 'A site\'s perceived expertise on a topic, built through comprehensive content coverage.' },
  { term: 'URL Slug', def: 'The readable part of a URL identifying a specific page.' },
  { term: 'Voice Search', def: 'Search performed via spoken queries, often requiring conversational optimization.' },
  { term: 'XML Sitemap', def: 'A structured file listing URLs for search engine crawlers to discover and index.' },
  { term: 'Zero-Click Search', def: 'A search where the answer is displayed directly on the SERP without clicking a result.' },
];

export default function GlossaryPage() {
  const pageSchema = generateStaticPageSchema({ path: '/seo-glossary', title: metadata.title, description: metadata.description }, baseUrl);
  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#020617] py-12">
      <StructuredData data={pageSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-4">SEO Glossary</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">Clear definitions of 100+ SEO terms. Bookmark this page as your SEO reference.</p>
        <div className="space-y-4">
          {terms.map((t) => (
            <div key={t.term} className="rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-gray-900 p-5 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-950 dark:text-white mb-1">{t.term}</h2>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{t.def}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">Browse Free SEO Tools</Link>
        </div>
      </div>
    </div>
  );
}