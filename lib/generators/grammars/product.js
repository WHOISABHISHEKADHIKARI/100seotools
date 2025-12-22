/**
 * Grammar for Product Description Generation
 */

export const productGrammar = {
    origin: ["#variations#"],
    variations: ["### Procedural Variation A\n#desc#\n\n### Procedural Variation B\n#desc#"],
    desc: ["#intro# #feature_list# #outro#"],
    intro: [
        "Experience the #adj# power of **${name}**.",
        "Introducing **${name}**: the only ${category} you'll ever need.",
        "Upgrade your lifestyle with **${name}**, designed for #audience#.",
        "Looking for the perfect ${category}? **${name}** is here to deliver."
    ],
    feature_list: [
        "\n\n**Key Features:**\n- #feat1#\n- #feat2#\n- #feat3#\n"
    ],
    feat1: ["Premium #adj# finish", "Ergonomic design for comfort", "High-performance materials", "Innovative technology integration"],
    feat2: ["Built to last", "Sustainable and eco-friendly", "Seamless compatibility", "Easy to use and maintain"],
    feat3: ["Unmatched quality", "Versatile for any situation", "Sleek and modern aesthetics", "Expertly crafted"],
    outro: [
        "\nDon't settle for less. Get your **${name}** today and #benefit#.",
        "\nJoin thousands of happy customers who trust **${name}** for their ${category} needs.",
        "\nOrder now and experience the difference that **${name}** makes."
    ],
    adj: ["next-gen", "ultra-sleek", "revolutionary", "premium", "unrivaled"],
    audience: ["professionals", "creative minds", "daily commuters", "tech enthusiasts"],
    benefit: ["stand out from the crowd", "boost your productivity", "achieve better results", "enjoy peace of mind"]
};
