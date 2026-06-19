const robotsTxtCreator = {
  "slug": "robots-txt-creator",
  "name": "Robots.txt Creator | Generate Custom Robots.txt Files",
  "category": "SEO Utility",
  "description": "Create custom robots.txt files to control how search engines crawl your site. Optimize your crawl budget and protect sensitive directories.",
  "metaTitle": "Robots.txt Creator | Free Robots.txt Generator Tool",
  "metaDescription": "Easily generate custom robots.txt files. Control search engine access, optimize crawl budget, and block sensitive pages from being indexed.",
  "keywords": ["robots.txt creator", "robots.txt generator", "robots.txt tool", "crawl control", "seo utility"],
  "template": "robotsTxtCreator",
  "api": true,
  "content": {
    "introduction": "A robots.txt file tells search engine crawlers which pages to visit and which to skip. The Robots.txt Creator generates a valid, standards-compliant robots.txt file based on your inputs. Select which directories to block, which crawlers to restrict, and point to your sitemap — then copy the output and add it to your site root.",
    "whatItDoes": "The tool builds a robots.txt file with User-agent directives, Disallow rules, Allow rules, and a Sitemap reference. It uses proper syntax for all major crawlers (Googlebot, Bingbot, etc.) and formats the output with correct line breaks and indentation. The result is a file you can paste directly into your server's root directory.",
    "whyItMatters": "Without a robots.txt file, crawlers index everything — including admin pages, duplicate content, and staging environments. This wastes crawl budget and can dilute your site's authority. A well-configured robots.txt directs crawlers to your most important pages, improves crawl efficiency, and prevents sensitive directories from appearing in search results.",
    "benefits": [
      "Generate valid robots.txt syntax for all major crawlers",
      "Block admin, staging, and duplicate content directories",
      "Include sitemap reference for efficient discovery",
      "Optimize crawl budget by focusing crawlers on key pages",
      "Prevent indexing of private or low-value content"
    ],
    "useCases": [
      "New site launch: create a baseline robots.txt before going live",
      "Site migration: update crawl rules for new URL structure",
      "Staging protection: block crawlers from accessing test environments",
      "Crawl optimization: restrict low-value pages to save budget",
      "Compliance: prevent indexing of sensitive directories"
    ],
    "bestPractices": [
      "Always include a Sitemap: directive pointing to your XML sitemap",
      "Don't block CSS and JavaScript — crawlers need them for rendering",
      "Use specific paths rather than broad wildcards when possible",
      "Test with Google Search Console's robots.txt tester before deploying",
      "Keep the file in your site's root directory (/robots.txt)",
      "Don't use robots.txt to hide content — use noindex meta tags instead"
    ],
    "exampleResults": "Sample robots.txt output:\n\nUser-agent: *\nDisallow: /admin/\nDisallow: /staging/\nDisallow: /tmp/\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\nUser-agent: Googlebot\nAllow: /\n\nSitemap: https://www.example.com/sitemap.xml",
    "relatedTools": ["xml-sitemap-visualizer", "redirect-301-generator", "canonical-url-builder", "http-status-code-tester", "redirect-checker"],
    "faqs": [
      { "q": "Where should I put my robots.txt file?", "a": "Place it in your site's root directory (https://www.example.com/robots.txt). Search engines look for it at this exact path." },
      { "q": "Can robots.txt prevent indexing?", "a": "No. robots.txt controls crawling, not indexing. To prevent indexing, use a noindex meta tag or X-Robots-Tag header. Crawlers that ignore robots.txt can still index blocked pages." },
      { "q": "Should I block my admin pages?", "a": "Yes. Block /admin/, /wp-admin/, and login pages to prevent crawlers from wasting budget on non-public content." },
      { "q": "Do I need separate rules for Google and Bing?", "a": "Usually not. A single User-agent: * rule covers most crawlers. Add specific rules only if you need different behavior for a particular bot." },
      { "q": "How does robots.txt affect crawl budget?", "a": "By blocking low-value pages (admin, duplicate content, filters), you focus crawl budget on your most important content, leading to faster indexing of new pages." }
    ]
  }
};
export default robotsTxtCreator;