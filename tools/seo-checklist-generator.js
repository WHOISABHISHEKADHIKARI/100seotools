const seoChecklistGenerator = {
  "slug": "seo-checklist-generator",
  "name": "SEO Checklist Generator | Create Custom SEO Plans",
  "category": "SEO Utility",
  "description": "Generate a customized SEO checklist for your website or project. Whether you're launching a new site or auditing an existing one, get a step-by-step plan for search success.",
  "metaTitle": "SEO Checklist Generator | Free Step-by-Step SEO Roadmap",
  "metaDescription": "Create a custom SEO checklist tailored to your needs. Get a comprehensive roadmap for on-page, technical, and off-page optimization to improve your search rankings for free.",
  "keywords": ["seo checklist generator", "seo roadmap tool", "search optimization plan", "website launch checklist", "seo audit guide"],
  "template": "seoChecklistGenerator",
  "api": true,
  "content": {
    "introduction": "SEO has dozens of moving parts — technical fixes, content optimization, link building, local signals — and missing even one area can hold back your rankings. The SEO Checklist Generator creates a customized, prioritized action plan based on your site type, goals, and current stage. Whether you're launching a new website, migrating to a new platform, or running a quarterly audit, this tool gives you a structured roadmap so nothing falls through the cracks.",
    "whatItDoes": "Answer a few questions about your site (type, platform, current SEO status, primary goals), and the tool generates a categorized checklist covering technical SEO, on-page optimization, content strategy, off-page factors, and local SEO. Each item includes a priority level (critical, high, medium, low), estimated effort, and a brief explanation of why it matters. The checklist is downloadable as a formatted document you can share with your team or use as a project tracker.",
    "whyItMatters": "Most SEO failures aren't from doing one thing wrong — they're from forgetting to do something important. A comprehensive checklist ensures you address every ranking factor systematically. Without one, teams tend to repeat the same optimizations while neglecting critical technical issues, missing content opportunities, or overlooking local signals. A structured checklist transforms SEO from ad-hoc tinkering into a disciplined, repeatable process.",
    "benefits": [
      "Customized checklist based on your specific site type and goals",
      "Covers all SEO areas: technical, on-page, content, off-page, and local",
      "Priority-ranked items so you focus on highest-impact fixes first",
      "Estimated effort for each item helps with project planning",
      "Downloadable format for team sharing and progress tracking",
      "Updated recommendations based on current SEO best practices"
    ],
    "useCases": [
      "New site launch: ensure SEO fundamentals are in place from day one",
      "Site migration: create a migration-specific checklist to prevent ranking drops",
      "Quarterly audits: generate a fresh checklist to catch new issues",
      "Client onboarding: deliver a structured SEO plan to new clients",
      "Team delegation: assign checklist items to different team members",
      "Stakeholder reporting: show leadership a clear SEO action plan"
    ],
    "bestPractices": [
      "Run the generator quarterly to account for algorithm changes and new best practices",
      "Assign each checklist item to a specific owner with a deadline",
      "Start with critical-priority items before moving to high-priority ones",
      "Track completion in a project management tool, not just the downloaded list",
      "Re-run after completing the checklist to identify remaining or newly surfaced items",
      "Use different configurations (new site vs audit) for different project phases"
    ],
    "exampleResults": "Sample Output:\n\nSEO Checklist — E-commerce Site Launch\n\nCRITICAL (Complete Before Launch):\n☐ Set up 301 redirects from staging to production\n☐ Configure canonical tags on all product pages\n☐ Submit XML sitemap to Google Search Console\n☐ Implement robots.txt (allow crawling, block /cart, /checkout)\n☐ Add title tags and meta descriptions to all pages\n\nHIGH (Complete Within First Month):\n☐ Create unique product descriptions (min 300 words)\n☐ Add structured data (Product, BreadcrumbList)\n☐ Set up Google Analytics 4 and Search Console\n☐ Optimize images (WebP format, descriptive alt text)\n☐ Internal linking between related products\n\nMEDIUM (Complete Within First Quarter):\n☐ Build initial backlink profile (20+ referring domains)\n☐ Create blog content targeting transactional keywords\n☐ Set up local business schema (if applicable)\n☐ Optimize Core Web Vitals (LCP < 2.5s, CLS < 0.1)",
    "relatedTools": ["on-page-seo-audit-checker", "seo-health-score-calculator", "robots-txt-creator", "schema-markup-generator", "xml-sitemap-visualizer"],
    "faqs": [
      { "q": "How is this different from a generic SEO checklist online?", "a": "Generic checklists apply the same items to every site. This generator customizes recommendations based on your site type (e-commerce, blog, local business, SaaS), platform, and current SEO maturity — so you only see relevant, actionable items." },
      { "q": "How often should I regenerate my checklist?", "a": "Run it quarterly at minimum. Also regenerate after major site changes (redesign, migration, new platform) or when you notice ranking drops. Google's algorithm updates may also warrant a fresh checklist." },
      { "q": "Can I share the checklist with my team?", "a": "Yes. The checklist downloads as a formatted document you can share via email, Slack, or project management tools. Each item includes enough context for team members to understand what needs to be done and why." },
      { "q": "Does this work for international or multi-language sites?", "a": "The checklist covers standard SEO fundamentals that apply globally. For international-specific items (hreflang, geo-targeting, multi-language content strategy), those items are included when you indicate your site targets multiple regions or languages." }
    ]
  }
};
export default seoChecklistGenerator;