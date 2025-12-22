/**
 * Grammar for Blog Post Introductions
 */

export const blogIntroGrammar = {
    origin: ["#variation1#", "#variation2#", "#variation3#"],

    variation1: ["#hook# #problem# #bridge# #solution#"],
    variation2: ["#question_opener# #agitation# #hope# #cta#"],
    variation3: ["#direct_opener# #value# #roadmap#"],

    // Atomic Parts
    hook: [
        "Let's face it: #seo_topic# is #difficult#.",
        "The world of digital marketing is changing, especially when it comes to #seo_topic#.",
        "Have you ever wondered why some sites dominate #seo_topic# while others struggle?",
        "If you are serious about #seo_topic#, you need to understand one critical thing."
    ],

    seo_topic: ["${keyword}", "SEO", "content strategy", "online visibility", "search rankings"],
    difficult: ["tough", "overwhelming", "constantly evolving", "a major challenge"],

    problem: [
        "Most professionals spend hours on #seo_topic# without seeing results.",
        "It's frustrating to watch your competitors climb the SERPs while you stay stuck.",
        "The old methods for #seo_topic# simply don't work in 2026."
    ],

    bridge: [
        "But what if there was a better way?",
        "Fortunately, there is a proven path to success.",
        "The good news is that mastering this doesn't have to be impossible."
    ],

    solution: [
        "In this guide, \"${title}\", we break down the exact steps to win.",
        "That's why we created \"${title}\"—your complete roadmap to success.",
        "Today, we're diving deep into \"${title}\" to give you an edge."
    ],

    question_opener: [
        "Struggling with ${keyword}?",
        "Want to rank higher for ${keyword}?",
        "Is your ${keyword} strategy falling flat?",
        "Ready to take your ${keyword} to the next level?"
    ],

    agitation: [
        "It's easy to get lost in the sea of technical jargon.",
        "Without a clear plan, you're just throwing darts in the dark.",
        "Most people give up right before they see a breakthrough."
    ],

    hope: [
        "But we've simplified the process for you.",
        "Our latest guide, \"${title}\", is designed to clear the confusion.",
        "There's a specific logic to ${keyword}, and we've found it."
    ],

    cta: [
        "Let's get started.",
        "Read on to learn more.",
        "Here is everything you need to know about \"${title}\"."
    ],

    direct_opener: [
        "Welcome to the ultimate guide on \"${title}\".",
        "If you're looking for #expertise# in ${keyword}, you're in the right place.",
        "Mastering #seo_topic# starts with understanding the fundamentals."
    ],

    expertise: ["real insights", "actionable advice", "proven strategies", "expert tips"],

    value: [
        "We've analyzed thousands of data points to bring you this advice.",
        "Success in #seo_topic# isn't about luck; it's about strategy.",
        "This post, \"${title}\", covers the essential techniques you need today."
    ],

    roadmap: [
        "We'll cover everything from setup to advanced optimization.",
        "By the end of this read, you'll have a clear action plan.",
        "Let's dive into the core principles of ${keyword}."
    ]
};
