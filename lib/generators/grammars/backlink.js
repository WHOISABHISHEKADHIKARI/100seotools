/**
 * Grammar for Backlink Ideas
 */

export const backlinkGrammar = {
    origin: ["#logic_router#"],

    // Route based on keyword/niche
    // For simplicity, we create varied outreach/content strategies

    strategy: ["#intro#\n\n#ideas#\n\n#pro_tip#"],

    intro: [
        "To build links for **${keyword}**, you need a mix of authority and relevance.",
        "The competition for **${keyword}** is high, so unique angles are key.",
        "Link building for **${keyword}** requires a dual-track approach: great content and proactive outreach.",
        "Finding link opportunities for **${keyword}** starts with identifying where your audience hangs out."
    ],

    ideas: [
        "### 1. #content_asset#\n- Create #asset_type# about ${keyword} #asset_detail#.",
        "### 2. #outreach_tactic#\n- #outreach_action# to #outreach_target# discussing ${keyword}.",
        "### 3. #niche_specific#\n- Join #communities# centered around ${keyword}."
    ],

    content_asset: ["The Skyscraper Guide", "Statistical Research", "Expert Roundup", "Educational Infographic"],
    asset_type: ["a deep-dive article", "an original data report", "a collection of insights", "a visual guide"],
    asset_detail: [
        "that addresses common misconceptions",
        "focusing on the future of the industry",
        "providing a unique perspective that competitors lack",
        "designed to be a go-to resource for beginners"
    ],

    outreach_tactic: ["Broken Link Building", "Resource Page Outreach", "Guest Post Contributor", "Unlinked Brand Mentions"],
    outreach_action: ["Identify relevant sites", "Contact editors", "Reach out to site owners", "Engage with industry leaders"],
    outreach_target: ["educational blogs", "industry news sites", "community forums", "top-tier publications"],

    niche_specific: ["Local Citations", "HARO (Help A Reporter Out)", "Niche Directories", "Collaborative Case Studies"],
    communities: ["Slack groups", "LinkedIn professional circles", "Subreddits", "Expert networks"],

    pro_tip: [
        "**Pro Tip:** Don't just ask for a link; offer value first by pointing out a site error or providing an update.",
        "**Pro Tip:** Personalize every outreach email. Templates are fine, but generic ones get ignored.",
        "**Pro Tip:** Focus on domains with high DR (70+) but don't ignore relevant smaller blogs in the ${keyword} niche."
    ]
};
