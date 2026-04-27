/**
 * Grammar for Content Outlines
 */

export const outlineGrammar = {
    origin: ["#title#\n\n#intro_sect#\n\n#core_sects#\n\n#conclusion_sect#\n\n#faq_sect#"],

    title: [
        "# Content Outline: ${keyword}",
        "# Strategic Roadmap: ${keyword}",
        "# Deep-Dive Article Structure: ${keyword}"
    ],

    intro_sect: [
        "## 1. Introduction\n- Hook: #intro_hook#\n- Definition: What is ${keyword}?\n- The #intro_relevance# of ${keyword} in 2026."
    ],
    intro_hook: ["Common myths about ${keyword}", "The evolution of ${keyword}", "Why most people fail at ${keyword}", "A shocking statistic about ${keyword}"],
    intro_relevance: ["growing importance", "critical role", "changing landscape", "impact"],

    core_sects: [
        "## 2. #benefit_header#\n- How ${keyword} #benefit_1#\n- #benefit_2# outcomes\n- Case studies and #data#\n\n## 3. #how_to_header#\n- Step 1: #step1#\n- Step 2: #step2#\n- Step 3: #step3#",
        "## 2. The Fundamentals of ${keyword}\n- Core principles used by experts\n- Tools for managing ${keyword} effectively\n\n## 3. Advanced Strategies\n- Leveraging #advanced_tech# for ${keyword}\n- Scaling your ${keyword} efforts"
    ],

    benefit_header: ["The Benefits of ${keyword}", "Why You Need to Master ${keyword}", "The ROI of ${keyword}"],
    benefit_1: ["improves organic traffic", "drives conversions", "builds brand authority", "reduces costs"],
    benefit_2: ["Long-term", "Sustainable", "Quantifiable", "Viral"],
    data: ["real-world data", "industry benchmarks", "expert testimonials"],

    how_to_header: ["Step-by-Step Implementation", "Your ${keyword} Action Plan", "How to Get Started"],
    step1: ["Preparation and Research", "Setup and baseline audit", "Identifying your goals"],
    step2: ["Execution and content creation", "Integration with existing systems", "Optimization for search engines"],
    step3: ["Monitoring and refinement", "Scaling the successful parts", "Building authority through links"],

    advanced_tech: ["AI-driven automation", "predictive analytics", "semantic clustering", "machine learning"],

    conclusion_sect: [
        "## 4. Conclusion\n- Summary of key takeaways.\n- Final thoughts on the future of ${keyword}.\n- Call to action: #cta#."
    ],
    cta: ["Sign up for our newsletter", "Try our free ${keyword} tool", "Read the related guide", "Start your audit today"],

    faq_sect: [
        "## FAQs\n- #faq1#\n- #faq2#\n- #faq3#"
    ],
    faq1: ["How long does it take to see results with ${keyword}?", "What are the common mistakes in ${keyword}?", "Is ${keyword} still relevant in 2026?"],
    faq2: ["Can a beginner handle ${keyword}?", "What tools are best for ${keyword}?", "How to measure ${keyword} success?"],
    faq3: ["Does ${keyword} affect mobile SEO?", "Should I outsource ${keyword}?", "How much should ${keyword} cost?"]
};
