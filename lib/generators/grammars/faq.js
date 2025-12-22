/**
 * Grammar for FAQ Generation
 */

export const faqGrammar = {
    origin: ["#faq_list#"],
    faq_list: [
        "### #q1#\n#a1#\n\n### #q2#\n#a2#\n\n### #q3#\n#a3#"
    ],

    q1: ["What is ${topic}?", "How does ${topic} work?", "Why is ${topic} important for SEO?"],
    a1: [
        "${topic} is #def#. It works by #process#, which helps search engines #benefit#.",
        "Essentially, ${topic} #def#. This is a #adj# signal that #impacts# your rankings."
    ],

    q2: ["Is ${topic} hard to implement?", "Can beginners use ${topic}?", "How long does it take to see results with ${topic}?"],
    a2: [
        "#difficulty#. While it might seem #adj#, most #users# can master it with the right tools.",
        "#timeframe#. You should start seeing #outcome# within #period#."
    ],

    q3: ["What are common mistakes with ${topic}?", "Does ${topic} affect mobile rankings?", "Should I outsource ${topic}?"],
    a3: [
        "One major error is #mistake#. To avoid this, #fix#.",
        "Yes, it's #adj# for mobile. Ensure your #mobile_fix# is correctly configured."
    ],

    def: ["a critical component of digital strategy", "a technical optimization technique", "a way to improve user engagement"],
    process: ["organizing site data", "building authority over time", "clarifying the intent of your pages"],
    benefit: ["understand your site better", "trust your content more", "rank you higher for relevant terms"],
    impacts: ["directly affects", "boosts", "secures"],
    difficulty: ["It depends on your setup", "Not at all", "It requires some technical knowledge"],
    adj: ["daunting", "complex", "straightforward", "essential", "crucial"],
    users: ["webmasters", "bloggers", "SEO experts"],
    timeframe: ["It's an ongoing process", "Results are usually visible in weeks", "It takes 3-6 months for full impact"],
    outcome: ["positive movement", "increased traffic", "better indexing"],
    period: ["a few weeks", "a few months", "the first quarter"],
    mistake: ["ignoring the user intent", "over-optimizing with keywords", "failing to track results"],
    fix: ["focus on value first", "use natural language", "monitor your analytics regularly"],
    mobile_fix: ["responsive design", "server speed", "touch-friendly interface"]
};
