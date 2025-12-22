/**
 * Grammar for SEO Checklists
 */

export const checklistGrammar = {
    origin: ["#header#\n\n#phase_1#\n\n#phase_2#\n\n#phase_3#\n\n#footer#"],

    header: [
        "# Ultimate SEO Checklist for 2026: ${type}",
        "# The Complete ${type} SEO Success Roadmap",
        "# Step-by-Step ${type} Optimization Guide"
    ],

    phase_1: [
        "### Phase 1: #foundations#\n- [ ] #f_item_1#\n- [ ] #f_item_2#\n- [ ] #f_item_3#",
        "### Step 1: #setup#\n- [ ] #s_item_1#\n- [ ] #s_item_2#\n- [ ] #s_item_3#"
    ],

    foundations: ["Foundations & Setup", "Technical Infrastructure", "Core Benchmarking"],
    f_item_1: ["Verify your site in Google Search Console", "Install and configure an SEO plugin", "Ensure HTTPS is active site-wide"],
    f_item_2: ["Submit your XML sitemap for indexing", "Check robots.txt for crawl blocks", "Set up Google Analytics 4 (GA4)"],
    f_item_3: ["Validate mobile responsiveness", "Audit for broken internal links", "Perform a baseline speed test"],

    setup: ["Initialization", "Getting Started", "Base Optimization"],
    s_item_1: ["Define your primary target keywords", "Audit your top 5 competitors", "Map your site architecture"],
    s_item_2: ["Optimize your brand homepage metadata", "Check for duplicate content issues", "Verify canonical tag implementation"],
    s_item_3: ["Clean up your URL structures", "Optimize image file sizes", "Verify your favicon and touch icons"],

    phase_2: [
        "### Phase 2: #content_optim#\n- [ ] #c_item_1#\n- [ ] #c_item_2#\n- [ ] #c_item_3#",
        "### Step 2: #keywords_phase#\n- [ ] #k_item_1#\n- [ ] #k_item_2#\n- [ ] #k_item_3#"
    ],

    content_optim: ["On-Page & Content", "Content Development", "Relevance Tuning"],
    c_item_1: ["Optimize H1 tags with target keywords", "Integrate secondary keywords naturally", "Add descriptive Alt text to all images"],
    c_item_2: ["Improve readability and scannability", "Add internal links to related posts", "Create unique meta descriptions for key pages"],
    c_item_3: ["Include a clear Call to Action (CTA)", "Optimize your slug for readability", "Add schema markup (JSON-LD)"],

    keywords_phase: ["Search Intent & Keywords", "Targeting Expansion", "Content Strategy"],
    k_item_1: ["Analyze search intent for top queries", "Cluster related terms into topic hubs", "Target featured snippet opportunities"],
    k_item_2: ["Identify and target long-tail variants", "Update outdated content with fresh data", "Audit keyword density (avoid stuffing)"],
    k_item_3: ["Add external links to high-authority sites", "Implement breadcrumb navigation", "Optimize for voice search queries"],

    phase_3: [
        "### Phase 3: #authority_grow#\n- [ ] #a_item_1#\n- [ ] #a_item_2#",
        "### Step 3: #performance_tracking#\n- [ ] #p_item_1#\n- [ ] #p_item_2#"
    ],

    authority_grow: ["Off-Page & Authority", "Link Building Strategy", "Growth Phase"],
    a_item_1: ["Execute your first outreach campaign", "Claim local citations and GBP", "Monitor your backlink profile"],
    a_item_2: ["Request reviews from happy customers", "Build internal 'Link Juice' pathways", "Promote content on social platforms"],

    performance_tracking: ["Monitoring & Refinement", "Analytics & Insights", "Closing the Loop"],
    p_item_1: ["Track ranking movements weekly", "Analyze bounce rates in GA4", "Monitor Core Web Vitals strictly"],
    p_item_2: ["Adjust strategy based on traffic data", "Experiment with A/B title testing", "Plan your next content cluster"],

    footer: [
        "\n---\n*Tip: SEO is a marathon, not a sprint. Consistency is key.*",
        "\n---\n*Note: Re-run this checklist as your site evolves.*",
        "\n---\n*Focus on providing value, and search engines will follow.*"
    ]
};
