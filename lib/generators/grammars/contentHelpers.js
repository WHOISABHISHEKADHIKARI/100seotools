/**
 * Grammar for various content helpers
 */

export const explainerGrammar = {
    origin: ["#intro#\n\n#explanation#\n\n#action#"],
    intro: [
        "To understand **${keyword}**, we first need to look at its role in search engines.",
        "**${keyword}** is a term that often confuses beginners, but it's simpler than you think.",
        "If you want to rank for **${keyword}**, you must understand its core intent.",
        "What exactly is **${keyword}**? Let's break it down into actionable parts."
    ],
    explanation: [
        "At its heart, ${keyword} #means#. This #impacts# your SEO because search engines #value# #signal#.",
        "Think of ${keyword} as #analogy#. Without it, your site #fails# to #succeed#."
    ],
    means: ["refers to the relevance of content to a query", "describes how users interact with your site", "is a technical signal used by crawlers", "measures the authority of your domain"],
    impacts: ["directly affects", "influences", "determines", "shapes"],
    value: ["prioritize", "look for", "reward", "track"],
    signal: ["user satisfaction", "structural clarity", "trustworthy signals", "high-quality mentions"],
    analogy: ["a map for a traveler", "the foundation of a house", "the engine of a car", "a lighthouse for ships"],
    fails: ["struggles", "finds it hard", "will fail", "is unlikely"],
    succeed: ["reach the top spots", "gain organic trust", "convert visitors", "stay indexed"],
    action: [
        "**Action:** Audit your site for ${keyword} today.",
        "**Next Step:** Ensure your content matches the intent of ${keyword}.",
        "**Tip:** Don't ignore ${keyword} in 2026; it's a major ranking factor."
    ]
};

export const titleRewriterGrammar = {
    origin: ["#title_list#"],
    title_list: [
        "1. #style_1#\n2. #style_2#\n3. #style_3#\n4. #style_4#\n5. #style_5#"
    ],
    style_1: ["${keyword}: #hook#", "#hook# | ${keyword}", "The Ultimate Guide to ${keyword}"],
    style_2: ["How to #action# ${keyword} in 2026", "Mastering ${keyword}: #step#", "Why ${keyword} is #adj#"],
    style_3: ["#number# #adj# Tips for ${keyword}", "Stop #mistake# with ${keyword}", "${keyword} #secret# Revealed"],
    style_4: ["#action# ${keyword} Like a Pro", "The #adj# Strategy for ${keyword}", "${keyword}: #result# in #time#"],
    style_5: ["Is ${keyword} #adj#?", "How I #result# with ${keyword}", "Everything You Need to Know: ${keyword}"],

    hook: ["Complete Guide", "Proven Results", "Free Tool", "Expert Strategy", "2026 Update"],
    action: ["Optimize", "Scale", "Fix", "Grow", "Understand"],
    step: ["A Step-by-Step Tutorial", "The Fast Way", "For Beginners"],
    adj: ["Deadly", "Secret", "Essential", "Game-Changing", "Crucial"],
    number: ["7", "10", "5", "3", "12"],
    mistake: ["Failing", "Struggling", "Wasting Time", "Losing Traffic"],
    secret: ["Breakthrough", "Hack", "Blueprint", "Model"],
    result: ["Boosted Sales", "Ranked #1", "Triple Traffic"],
    time: ["30 Days", "One Week", "24 Hours"]
};

export const contentImproverGrammar = {
    origin: ["#header#\n\n#improved_text#\n\n#changes#"],
    header: ["### Better, More SEO-Friendly Version:"],
    improved_text: ["#sentence1# #sentence2# #sentence3#"],
    sentence1: [
        "Looking to #action# your ${keyword} efforts?",
        "Many people struggle with ${keyword}, but the solution is simple.",
        "Mastering ${keyword} is essential for any modern SEO strategy."
    ],
    sentence2: [
        "By focusing on #focus#, you can #result#.",
        "Our #adj# approach helps you #result# quickly.",
        "Don't let #problem# hold back your ${keyword} rankings."
    ],
    sentence3: [
        "Start implementing these #adj# tips today to see a difference.",
        "The future of ${keyword} is all about #focus#.",
        "Click here to learn more about our ${keyword} services."
    ],
    action: ["enhance", "revitalize", "optimize", "scale"],
    focus: ["user intent", "technical excellence", "content depth", "authority building"],
    result: ["reach new heights", "dominate the SERPs", "drive qualified leads"],
    adj: ["strategic", "advanced", "proven", "powerful"],
    problem: ["outdated tactics", "slow loading times", "thin content"],
    changes: [
        "\n**What was improved:**\n- Added active voice\n- Integrated target keyword: **${keyword}**\n- Improved readability and structure\n- Focused on user intent"
    ]
};
