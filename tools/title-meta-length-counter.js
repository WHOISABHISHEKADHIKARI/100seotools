const titleMetaLengthCounter = {
  "slug": "title-meta-length-counter",
  "name": "Title & Meta Length Counter | Optimize Search Snippets",
  "category": "On-Page Optimization",
  "description": "Count the characters and pixels of your title tags and meta descriptions to ensure they fit Google's SERP limits. Avoid truncation and optimize your search snippets for maximum visibility.",
  "metaTitle": "Title & Meta Length Counter | Free SEO Character & Pixel Tool",
  "metaDescription": "Check your title and meta description lengths. Use our counter to ensure your snippets aren't cut off in search results and improve your organic click-through rates for free.",
  "keywords": ["title length counter", "meta description checker", "serp pixel counter", "seo character count", "snippet optimizer"],
  "template": "titleMetaLengthCounter",
  "api": true,
  "content": {
    "introduction": "Google truncates your title tag and meta description in search results based on pixel width, not character count — a distinction that trips up even experienced SEOs. A 60-character title might display fully if composed of narrow letters like 'i' and 'l', but get cut short if packed with wide characters like 'W' and 'M'. Google's SERP display limits vary between desktop (roughly 600px for titles, 920px for descriptions) and mobile (even narrower), and they change periodically as Google adjusts its interface. A title that displays perfectly on desktop might lose its last words on mobile, where over 60% of searches now occur. This tool goes beyond simple character counting to calculate actual pixel rendering widths, simulates how your titles and descriptions appear on both desktop and mobile SERPs, and identifies the exact point where truncation occurs so you can optimize with precision rather than guesswork.",
    "whatItDoes": "Calculates both character count and pixel width for title tags and meta descriptions, simulates desktop and mobile SERP display with visual truncation indicators, identifies the exact character position where Google will cut your text based on pixel measurements, provides optimization recommendations for titles and descriptions that exceed display limits, compares your lengths against current best-practice ranges, and tracks display changes across different device types and SERP layouts.",
    "whyItMatters": "Truncated titles and descriptions waste your most valuable real estate in search results. When Google cuts off your title, users see an incomplete message that may miss your key value proposition or call-to-action. This directly reduces click-through rates — a study by Sistrix found that titles displaying fully receive 6-8% higher CTR than truncated equivalents. For meta descriptions, truncation means your carefully crafted pitch gets replaced with Google's auto-generated snippet, which often pulls irrelevant text from the page body. Mobile truncation is particularly damaging because the display window is narrower, yet most SEOs only check their titles on desktop. Pixel-level precision also matters for SERP layout changes — when Google added site links and rich results, the available title width shrank, catching many optimized titles off-guard.",
    "benefits": [
      "Calculate precise pixel width rendering to predict exact SERP display behavior",
      "Preview title and description truncation on both desktop and mobile before publishing",
      "Identify the exact character position where Google cuts your text based on current pixel limits",
      "Optimize titles and descriptions to the optimal display length without wasting characters",
      "Track SERP display limit changes and receive alerts when your titles need re-optimization"
    ],
    "useCases": [
      "Title tag optimization before launching new landing pages to ensure full SERP display",
      "Meta description auditing across large sites to identify pages with truncated snippets",
      "A/B testing different title lengths to determine optimal display length for your audience",
      "Mobile-first optimization ensuring titles and descriptions display correctly on smaller screens",
      "International SEO where character widths vary significantly between Latin, Cyrillic, and CJK scripts"
    ],
    "bestPractices": [
      "Keep titles under 55 characters or 580 pixels to ensure full display on most devices",
      "Place your primary keyword in the first 40 characters of the title to survive any truncation",
      "Write meta descriptions between 120-155 characters, prioritizing the first 100 characters for key messaging",
      "Test titles at multiple pixel widths — narrow characters allow more content, wide characters require shorter text",
      "Front-load both titles and descriptions with the most important information rather than building to a conclusion",
      "Check mobile display specifically since Google often shows shorter snippets on mobile than desktop"
    ],
    "exampleResults": "Sample Output:\n\nTitle Analysis:\nInput: \"The Complete Guide to Search Engine Optimization Strategies for 2024\"\n- Character Count: 67\n- Pixel Width: 724px\n- Desktop Limit: ~580px → Truncated after \"Optimization\"\n- Mobile Limit: ~480px → Truncated after \"Search Engine\"\n\nTruncation Preview:\nDesktop: \"The Complete Guide to Search Engine Optimization Strat...\"\nMobile: \"The Complete Guide to Search Engine...\"\n\nOptimization:\nSuggested: \"SEO Guide 2024: Complete Optimization Strategies That Work\"\n- Character Count: 54\n- Pixel Width: 562px\n- Desktop Display: Full (under 580px limit)\n- Mobile Display: Full (under 480px limit)\n- Keyword Position: \"SEO\" at position 1\n\nMeta Description Analysis:\nInput: \"Learn everything you need to know about search engine optimization including advanced strategies, technical SEO, link building, content optimization, and more.\"\n- Character Count: 157\n- Pixel Width: 1,048px\n- Desktop Limit: ~920px → Truncated after \"more.\"\n- Mobile Limit: ~780px → Truncated after \"link building, content optimization\"\n\nSuggested: \"Master SEO with our comprehensive 2024 guide. Learn technical optimization, link building, and content strategies that drive organic traffic growth.\"\n- Character Count: 139\n- Pixel Width: 892px\n- Full Display: Yes on both desktop and mobile",
    "relatedTools": ["meta-description-optimizer", "on-page-seo-audit-checker", "seo-content-checker"],
    "faqs": [
      {"q": "Why does my title show fully on desktop but get cut off on mobile?", "a": "Mobile SERPs have narrower display limits because the screen width is smaller. Google typically allocates about 480 pixels for titles on mobile versus 580 pixels on desktop. This means titles that display fully on desktop may lose 15-20% of their characters on mobile. With mobile searches comprising over 60% of total search volume, optimizing primarily for mobile display limits is the more conservative and impactful approach."},
      {"q": "How often does Google change its SERP display limits?", "a": "Google adjusts SERP layout periodically, but major changes to display limits happen 1-2 times per year. Minor adjustments occur more frequently as Google tests different SERP features. Monitor your top pages quarterly using this tool to detect when truncation patterns change. When Google launches new SERP features like AI overviews or expanded site links, the available title width often shrinks temporarily."},
      {"q": "Should I count characters or pixels for my titles?", "a": "Both, but prioritize pixels. Character count gives you a quick estimate, but pixel width tells you exactly how your title will render. Two titles with 55 characters can have pixel widths differing by 100+ pixels depending on which letters they contain. Use pixel measurement as your primary optimization target and character count as a secondary reference. This tool calculates both simultaneously so you can optimize with precision."},
      {"q": "What about titles in languages other than English?", "a": "Pixel widths vary significantly between scripts. CJK characters (Chinese, Japanese, Korean) are typically wider than Latin characters, so titles in these languages should be even shorter in character count to avoid truncation. Cyrillic and accented Latin characters also tend to be wider. Always test titles in your target language using pixel measurement rather than assuming English character limits apply universally."}
    ]
  }
};
export default titleMetaLengthCounter;