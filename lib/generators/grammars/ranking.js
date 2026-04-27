/**
 * Grammar for Ranking Opportunity Finder
 */

export const rankingOpportunityGrammar = {
    origin: ["#header#\n\n#strategy#\n\n#footer#"],
    header: ["# Ranking Opportunities for: **${competitor_url}**"],
    footer: ["\n\n**Note:** These strategies are gap-based. For live data, integrate with Search Console APIs."],
    strategy: ["#point1#\n\n#point2#\n\n#point3#"],

    point1: [
        "### 1. Keyword Gap Analysis\nIdentify terms where **${competitor_url}** ranks in positions 1-3, but your domain is outside the top 10. Focus on #niche# keywords with #intent# intent.",
        "### 1. High-Overlap Opportunities\nLook for queries where **${competitor_url}** shares ranking space with #authority_sites#. If they can rank there, so can you with #content_type#."
    ],
    point2: [
        "### 2. Semantic Content Gaps\nAnalyze the subheadings of **${competitor_url}**. They are likely covering #topic# in depth. You can outperform them by adding #bonus_content#.",
        "### 2. Missing Entity Signals\nYour competitor uses #entity_type# signals. To bridge this gap, update your schema and internal links to focus on #entity_focus#."
    ],
    point3: [
        "### 3. Backlink Acquisition Strategy\nTarget the specific domains linking to **${competitor_url}**. Specifically, reach out to #source_type# sites that value #value_prop#.",
        "### 3. Technical Performance Edge\nIf **${competitor_url}** has #tech_flaw#, you can win on experience. Focus on #tech_fix# to gain a ranking advantage."
    ],

    niche: ["long-tail", "high-commercial", "local-intent", "educational"],
    intent: ["informational", "transactional", "comparison-based"],
    authority_sites: ["major industry leaders", "government hubs", "high-DA news sites"],
    content_type: ["original research", "long-form guides", "interactive tools"],
    topic: ["pricing models", "technical tutorials", "industry case studies"],
    bonus_content: ["a video walkthrough", "a downloadable checklist", "real-time data charts"],
    entity_type: ["brand-heavy", "structured-data-rich", "localized"],
    entity_focus: ["topic authority", "semantic relevance", "user trust signals"],
    source_type: ["niche blogs", "institutional sites", "review platforms"],
    value_prop: ["high-quality citations", "expert guest contributions", "broken link replacements"],
    tech_flaw: ["slow mobile load times", "poor CLS scores", "broken images"],
    tech_fix: ["optimizing Core Web Vitals", "implementing lazy loading", "improving server response times"]
};
