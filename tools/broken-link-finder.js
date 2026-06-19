const brokenLinkFinder = {
  "slug": "broken-link-finder",
  "name": "Broken Link Finder | Scan for 404 Errors & Dead Links",
  "category": "Technical SEO",
  "description": "Find and fix broken links on your website. Improve user experience and prevent crawl errors that can hurt your search rankings.",
  "metaTitle": "Broken Link Finder | Free 404 Error Scanner (SEO Tool)",
  "metaDescription": "Scan your website for dead links and 404 errors. Improve your site's health and SEO by fixing broken links that frustrate users and bots.",
  "keywords": ["broken link finder", "404 error scanner", "dead link checker", "technical seo tool", "link health checker"],
  "template": "brokenLinkFinder",
  "api": true,
  "content": {
    "introduction": "Broken links send users to 404 error pages and waste search engine crawl budget. The Broken Link Finder scans your website's HTML to detect dead internal and external links, missing images, and broken anchors. Paste your URL or HTML, click Scan, and get a complete report of every broken link with its location and suggested fix.",
    "whatItDoes": "The tool parses your input HTML or fetches your page and checks every link (href), image source (src), and anchor reference. It identifies 404 errors, 500 server errors, timeout responses, and malformed URLs. Results show the exact location of each broken link (line number, surrounding text) so you can find and fix it quickly.",
    "whyItMatters": "Every broken link on your site creates a dead end for both users and crawlers. Users who hit 404 pages leave immediately, increasing bounce rates. Crawlers waste budget trying to access non-existent pages, which delays indexing of your real content. Google has confirmed that excessive 404 errors can negatively impact crawl efficiency and site quality signals.",
    "benefits": [
      "Detect broken internal and external links in seconds",
      "Find missing images and broken anchor references",
      "Get exact locations for quick fixes",
      "Identify redirect chains and soft 404s",
      "Improve crawl efficiency by removing dead links"
    ],
    "useCases": [
      "Pre-launch check: scan your site before going live",
      "Monthly maintenance: catch new broken links regularly",
      "Site migration: verify all redirects work correctly",
      "Content pruning: find links to deleted pages",
      "Link building: verify outbound links in new content"
    ],
    "bestPractices": [
      "Run a broken link check monthly as part of routine maintenance",
      "Fix internal broken links immediately — they're under your control",
      "For broken external links, update the URL or remove the link",
      "Set up custom 404 pages with helpful navigation and search",
      "Use 301 redirects for moved pages rather than leaving dead links",
      "Monitor Google Search Console for crawl errors"
    ],
    "exampleResults": "Broken Link Report:\n\nPage: /blog/seo-guide\n\nInternal Broken Links:\n1. /tools/meta-tag-generator → 404 (line 45)\n   Fix: Update to /tools/meta-tag-generator/\n\n2. /category/keyword-research → 301 → /category/keyword-research (chain)\n   Fix: Update to final URL directly\n\nExternal Broken Links:\n3. https://example.com/resource → Connection timeout (line 102)\n   Fix: Remove or replace with working URL\n\nImages:\n4. /images/chart.png → 404 (line 78)\n   Fix: Update src to /images/seo-chart.png\n\nSummary:\n- 2 internal broken links\n- 1 redirect chain\n- 1 external broken link\n- 1 missing image",
    "relatedTools": ["http-status-code-tester", "redirect-checker", "redirect-301-generator", "xml-sitemap-visualizer", "robots-txt-creator"],
    "faqs": [
      { "q": "How do broken links affect SEO?", "a": "Broken links create 404 errors that waste crawl budget, increase bounce rates, and signal poor site quality to search engines. Excessive broken links can negatively impact your rankings." },
      { "q": "What is a soft 404?", "a": "A soft 404 occurs when a page returns a 200 OK status but shows a 'not found' message. Search engines treat these as errors. Our tool can detect soft 404 patterns." },
      { "q": "How often should I check for broken links?", "a": "Monthly for most sites. Check more frequently if you publish new content regularly, have many external links, or recently migrated your site." },
      { "q": "Should I redirect all 404 pages?", "a": "No. Redirect only when a relevant alternative exists. For pages with no equivalent, let them 404 so Google can crawl and remove them from the index." },
      { "q": "Can broken links on other sites hurt me?", "a": "No. Broken inbound links from other sites don't harm your SEO, but they mean you're missing out on potential link equity. You can't control external sites, but you can fix your own." }
    ]
  }
};
export default brokenLinkFinder;