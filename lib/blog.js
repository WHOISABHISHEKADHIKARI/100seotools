const siteName = '100 SEO Tools';

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Single topic replicated across 0..100 posts per request
const baseTopic = { title: 'SEO Basics', category: 'Foundations' };

function makePost(base, index) {
  const slug = slugify(`${base.title} ${index}`);
  const title = `${base.title}: Simple Guide ${index}`;
  const description = `Simple guide ${index} to rank better in 2025. Learn core SEO basics covering crawlability, keyword research, on-page optimization, technical fixes, off-page signals, and content improvements — explained in plain language with free tools you can use immediately. This edition emphasizes clarity, structure, and intent so pages are easy for humans and algorithms to understand, index, and recommend.`;
  // Deterministic published date and lightweight read time estimate
  const datePublished = new Date(2024, 0, Math.max(1, index)).toISOString();
  const readTimeMinutes = 3 + (index % 4);

  // Tags derived from base topic and category for interlinking
  const defaultTags = [base.title, base.category, 'Guide', 'SEO'];
  const categoryTags = {
    'Foundations': ['Basics', 'Checklists', 'Best Practices'],
    'Keyword Research': ['Keywords', 'Intent', 'Long Tail'],
    'On-Page Optimization': ['Metadata', 'Headings', 'Readability'],
    'Technical SEO': ['Crawl', 'Indexing', 'Schema'],
    'Backlink & Link-Building': ['Outreach', 'Anchors', 'Authority'],
    'Content SEO': ['Content', 'Freshness', 'Tone'],
    'Local SEO': ['NAP', 'GBP', 'Citations'],
    'AI-Powered SEO': ['AI', 'Automation', 'Prompts'],
    'SEO Performance': ['CTR', 'Traffic', 'Rankings']
  };
  const tags = Array.from(new Set([...(categoryTags[base.category] || []), ...defaultTags]));
  return {
    slug,
    title,
    description,
    category: base.category,
    datePublished,
    readTimeMinutes,
    tags,
    sections: {
      intro: `Learn ${base.title} with a simple, actionable guide. This series (#${index}) helps beginners understand SEO fundamentals and rank better in 2025. In this edition, you’ll get clear definitions, see why SEO matters now, and follow practical steps with free tools to validate improvements. We’ll cover how crawlability, metadata, headings, internal links, and page speed work together, then show you a repeatable workflow to make pages more helpful and discoverable. Whether you’re starting from zero or tuning an existing site, the method is lightweight, outcome‑driven, and designed to deliver quick wins that compound over time. You can apply it to blogs, landing pages, product pages, and local service content without switching platforms or buying new software.`,
      what: 'SEO is the practice of making pages easy for search engines and AI crawlers to discover, understand, and serve to the right audience. It blends content structure, metadata, internal links, and technical signals so algorithms can map relevance and quality. Good SEO turns scattered information into a coherent topic graph: descriptive titles, logical headings, helpful alt text, clean URLs, and consistent linking. It also includes technical hygiene: proper status codes, canonical tags, robots.txt rules that permit crawling, and sitemaps that enumerate important URLs. Accessibility and performance support these signals by ensuring pages are usable, fast, and mobile‑friendly. When your site is organized and accessible, crawlers spend less time guessing and more time indexing the pages that matter, which increases the chance your content appears for queries that match intent.',
      why: 'Ranking better in 2025 depends on clarity, speed, and topical depth. Search systems reward sites that demonstrate intent, answer common questions, and provide fast, inclusive experiences. Strong on‑page signals reduce crawl waste, while sitemaps and schema help machines connect entities and relationships. Consistent internal linking builds pathways for discovery and distributes authority across cornerstone pages. Clear headings improve scannability; rich media with proper alt text helps reach broader audiences; structured data clarifies meaning for algorithms. The result is sustainable traffic, improved engagement, and content that remains useful beyond temporary algorithm shifts. Investing in fundamentals protects against volatility, helps AI summarizers select your pages as sources, and aligns your site with evolving search experiences across devices and assistants.',
      how: [
        { text: 'Run a quick site check', slug: 'on-page-seo-audit-checker', label: 'SEO Audit Tool' },
        { text: 'Keep keywords natural', slug: 'keyword-density-checker', label: 'Keyword Density Checker' },
        { text: 'Create clean titles and descriptions', slug: 'meta-tag-generator', label: 'Meta Tag Generator' }
      ],
      toWhom: 'This guide is for beginners, solo creators, and small teams who need practical steps without jargon. If you publish blogs, landing pages, product pages, or local service content, you’ll learn how to prioritize the few actions that matter most and avoid chasing noise. The methods are platform‑agnostic and work in any CMS. Each recommendation pairs with a free tool so you can validate improvements, log changes, and compare before/after metrics. Over time, these small, consistent actions build stronger topic coverage, better user experience, and more trustworthy pages.',
      steps: [
        `Define your goal and scope for ${base.title}.`,
        `Gather inputs and constraints (site, audience, resources).`,
        `Apply core best practices step by step.`,
        `Validate outcomes and iterate based on feedback.`
      ],
      tips: [
        'Keep changes atomic and measurable.',
        'Document patterns and templates for reuse.',
        'Automate repeatable tasks when possible.'
      ],
      checklist: [
        'Set a clear objective',
        'Run sanity checks',
        'Record before/after metrics',
        'Plan the next iteration'
      ],
      faq: [
        {
          q: 'How often should I audit a page?',
          a: 'Audit core pages monthly or after major changes to titles, headings, templates, or internal links. Use a simple loop: measure, check on‑page and technical issues, fix, update links, and log changes. This keeps metadata accurate, protects crawl budget, and prevents regressions.'
        },
        {
          q: 'What is a good meta description length?',
          a: 'Aim for 150–160 characters. Lead with the primary intent and a clear benefit, avoid truncation, and reflect the page’s actual content. Keep unique descriptions per page to improve CTR and relevance.'
        },
        {
          q: 'How many keywords should a page target?',
          a: 'Focus on one primary keyword and a handful of semantic variants. Cover the topic clearly with headings and body copy. Avoid keyword stuffing—write for intent and natural language.'
        },
        {
          q: 'Do I need a sitemap and robots.txt?',
          a: 'Yes. A clean XML sitemap helps discovery of important URLs; robots.txt should permit crawling of public pages. Pair with canonical tags to prevent duplicates and guide indexing.'
        },
        {
          q: 'How should headings be structured for SEO?',
          a: 'Use one H1 that states the main topic, H2s for sections, and H3s for subsections. Keep headings descriptive, avoid duplication, and align them with the search intent your page serves.'
        },
        {
          q: 'What is the role of internal links?',
          a: 'Internal links create discovery paths and distribute authority. Link from supporting articles to pillar pages with descriptive anchor text. Keep links relevant and avoid over‑linking on a single phrase.'
        },
        {
          q: 'Does content length matter more than quality?',
          a: 'Quality and clarity win. Write enough to satisfy intent and answer common questions; many educational pages land between 600–1200 words. Avoid filler—use examples, FAQs, and links to related resources.'
        }
      ]
    },
    author: siteName
  };
}

// Generate 101 "SEO Basics: Simple Guide" posts (#0..#100)
const posts = [];
for (let i = 0; i <= 100; i++) {
  posts.push(makePost(baseTopic, i));
}

export function getAllBlogPosts() {
  return posts;
}

export function getBlogPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}