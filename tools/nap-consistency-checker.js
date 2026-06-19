const napConsistencyChecker = {
  "slug": "nap-consistency-checker",
  "name": "NAP Consistency Checker | Audit Local Business Info",
  "category": "Local SEO",
  "description": "Check the consistency of your Name, Address, and Phone number (NAP) across various directories and listing sites. Essential for maintaining local SEO trust and ranking in the local map pack.",
  "metaTitle": "NAP Consistency Checker | Free Local SEO Audit Tool",
  "metaDescription": "Is your business information consistent across the web? Use our NAP checker to identify discrepancies in your name, address, and phone listings that could hurt your local search rankings.",
  "keywords": ["nap consistency checker", "local seo audit", "business information consistency", "local citation audit", "name address phone checker"],
  "template": "napConsistencyChecker",
  "api": true,
  "content": {
    "introduction": "Name, Address, and Phone number consistency across the internet is a critical local SEO ranking factor. Search engines cross-reference your NAP data across hundreds of directories to verify business legitimacy. This tool audits your NAP information across major directories and detects inconsistencies that could undermine your local search rankings.",
    "whatItDoes": "Scans your business information across top directories including Google Business Profile, Yelp, Yellow Pages, Bing Places, and industry-specific listings. It compares each listing against your canonical NAP data, identifies variations in formatting, misspellings, outdated addresses, and phone number discrepancies, then generates a prioritized remediation report.",
    "whyItMatters": "Inconsistent NAP data confuses search engines about your business's legitimacy and location, directly impacting your Local Pack rankings. Even minor differences like 'St' versus 'Street' or '(512)' versus '512-' can dilute your citation authority. NAP poisoning from outdated or incorrect listings can permanently damage local visibility if not corrected promptly.",
    "benefits": [
      "Identify harmful NAP inconsistencies across 50+ directories",
      "Detect duplicate listings that split your ranking authority",
      "Find phone format variations causing verification issues",
      "Uncover outdated address information from previous locations",
      "Receive actionable remediation steps with direct listing links"
    ],
    "useCases": [
      "New business auditing citations after opening or relocation",
      "Multi-location franchise verifying consistency across all branches",
      "Agency conducting local SEO audits for new clients",
      "Business recovering from a Google Business Profile suspension",
      "Company merging or rebranding needing citation cleanup"
    ],
    "bestPractices": [
      "Audit NAP consistency quarterly and after any business information change",
      "Standardize phone format using E.164 international standard across all listings",
      "Create a canonical NAP document and share with all team members",
      "Prioritize Google Business Profile accuracy above all other directories",
      "Document every directory login and listing URL for ongoing maintenance"
    ],
    "exampleResults": "NAP Audit Report for 'Austin Plumbing Solutions':\n\nCanonical: Austin Plumbing Solutions | 123 Main St, Austin, TX 78701 | (512) 555-0123\n\nInconsistencies Found:\n- Yelp: 'Austin Plumbing Co' (Name variation) — CRITICAL\n- Yellow Pages: '123 Main Street' (Address format) — MEDIUM\n- Bing Places: '5125550123' (Phone format) — LOW\n- HealthGrades: Old address '456 Oak Ave' — CRITICAL\n- 2 duplicate listings on Superpages — HIGH\n\nScore: 72/100 | 8 inconsistencies requiring correction",
    "relatedTools": ["local-citation-finder", "local-seo-audit-checklist", "gmb-optimization-helper"],
    "faqs": [
      {"q": "How often should I check my NAP consistency?", "a": "Perform a full audit quarterly, and run spot checks monthly. Always re-audit after changing your address, phone number, business name, or hours of operation. One-time audits are insufficient—directories often auto-update listings with incorrect data."},
      {"q": "What is NAP poisoning and how does it happen?", "a": "NAP poisoning occurs when incorrect business information appears on authoritative directories, either from data aggregator errors, competitor sabotage, or old cached data. Search engines may adopt the incorrect information as canonical, pushing your correct data down in rankings."},
      {"q": "Should I use a suite number in my address across all listings?", "a": "Yes, consistency is key. If you include a suite number in your Google Business Profile, include it identically everywhere. If you omit it from GBP, omit it from all directories. Mixing formats creates confusion for both search engines and customers."}
    ]
  }
};
export default napConsistencyChecker;