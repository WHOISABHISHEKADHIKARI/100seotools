const keywordShareEstimator = {
  "slug": "keyword-share-estimator",
  "name": "Keyword Share Estimator | Analyze Search Visibility",
  "category": "Competitor Analysis",
  "description": "Estimate your market share for specific keywords compared to your competitors. Understand your brand's visibility and identify who is dominating the search results in your niche.",
  "metaTitle": "Keyword Share Estimator | Free SEO Market Share Tool",
  "metaDescription": "Analyze your keyword share of voice against competitors. Visualize your search visibility and discover which brands are winning the most traffic for your target terms.",
  "keywords": ["keyword share estimator", "search visibility tool", "market share analysis", "competitor seo audit", "share of voice tool"],
  "template": "keywordShareEstimator",
  "api": true,
  "content": {
    "introduction": "Keyword share of voice measures how visible your brand is in search results compared to competitors for your target terms. The Keyword Share Estimator calculates your percentage of organic visibility across a keyword portfolio, showing exactly who dominates the SERPs in your niche. Enter your domain and competitor domains alongside target keywords to see a clear breakdown of who captures the most search real estate — and where you have room to grow.",
    "whatItDoes": "This tool aggregates ranking positions and estimated click-through rates across your keyword set to compute a share-of-voice score. It compares your visibility percentage against each competitor, identifies keywords where competitors outrank you, and highlights terms where you already lead. The output includes a visibility pie chart, per-keyword breakdowns, and trend indicators showing whether your share is growing or shrinking over time.",
    "whyItMatters": "Share of voice is a leading indicator of market dominance in organic search. A higher share means more eyeballs on your brand, more clicks, and more conversions. Tracking it over time reveals whether your SEO efforts are actually gaining ground against competitors — not just improving individual rankings in isolation. It also helps you prioritize: targeting keywords where competitors have a strong share but you have zero presence can yield the biggest visibility gains.",
    "benefits": [
      "Quantifies your organic search market share in a single score",
      "Breaks down share per keyword to identify strengths and weaknesses",
      "Compares visibility against multiple competitors simultaneously",
      "Shows trending data to track share growth or decline over time",
      "Reals competitive blind spots where competitors dominate unseen",
      "Provides actionable data for prioritizing content and link-building efforts"
    ],
    "useCases": [
      "Quarterly SEO reporting: demonstrate share-of-voice growth to stakeholders",
      "Competitive positioning: identify which competitors dominate your niche keywords",
      "Content strategy: target keywords where competitors have high share but you have none",
      "Client pitches: show prospects their current visibility gap vs top competitors",
      "Brand monitoring: track how branded vs non-branded share evolves after campaigns",
      "Market entry analysis: assess competitive landscape before entering a new keyword niche"
    ],
    "bestPractices": [
      "Track share of voice monthly to spot trends before they become problems",
      "Segment analysis by branded vs non-branded keywords for clearer insights",
      "Compare against 3-5 direct competitors, not just the overall market leader",
      "Focus on growing share in high-intent commercial keywords first",
      "Use share drops as early warnings for algorithm impacts or competitor moves",
      "Combine with traffic data to validate that share gains translate to real visits"
    ],
    "exampleResults": "Sample Output:\n\nKeyword Share of Voice Analysis\n\nDomain: example.com\nCompetitors: competitor-a.com, competitor-b.com, competitor-c.com\n\nOverall Share of Voice:\n  example.com: 28.4%\n  competitor-a.com: 34.2%\n  competitor-b.com: 22.1%\n  competitor-c.com: 15.3%\n\nPer-Keyword Breakdown:\n  \"seo tools\" — leader: competitor-a.com (position 2), you: position 5\n  \"free seo audit\" — leader: example.com (position 1)\n  \"keyword research tool\" — leader: competitor-b.com (position 3), you: not ranking\n\nTrend (last 90 days): example.com share ↑ 3.2%, competitor-a.com share ↓ 1.8%",
    "relatedTools": ["competitor-keyword-overlap-checker", "visibility-index-calculator", "competitor-gap-analyzer", "ranking-progress-tracker", "domain-comparison-report-tool"],
    "faqs": [
      { "q": "What is keyword share of voice?", "a": "Share of voice represents the percentage of total organic search visibility you hold for a set of keywords compared to competitors. It factors in ranking positions and estimated CTR to quantify your overall search market presence." },
      { "q": "How is share of voice calculated?", "a": "It's computed by summing estimated clicks (based on ranking position and search volume) for each keyword you rank for, then dividing by the total estimated clicks across all tracked competitors for those same keywords." },
      { "q": "What's a good share of voice score?", "a": "There's no universal benchmark — it depends on your market. In a niche with 4 competitors, 25% is average. Leaders typically hold 30-40%+. Focus on trending upward rather than hitting a specific number." },
      { "q": "Can I improve share of voice without ranking #1?", "a": "Yes. Ranking positions 2-5 for many keywords can collectively give you a strong share. breadth of rankings often matters more than a few #1 positions for overall visibility." }
    ]
  }
};
export default keywordShareEstimator;