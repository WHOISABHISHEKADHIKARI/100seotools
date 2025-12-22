
export const backlinkStrategiesGrammar = {
    // Root node
    "origin": ["#strategy#"],

    "strategy": [
        "#strategy_title#\n\n#strategy_intro#\n\n### Action Plan\n#action_steps#\n\n### Email Template\n#email_template#"
    ],

    // Title variations
    "strategy_title": [
        "## Strategy: The #technique_name# Technique",
        "## Approach: #technique_name# for #niche#",
        "## Tactic: #technique_name# Outreach"
    ],

    "technique_name": [
        "Skyscraper",
        "Broken Link Building",
        "Resource Page"
    ],

    // Intros based on technique
    "strategy_intro": [
        "This method involves finding #target_content# that links to content similar to yours, but yours is better.",
        "The goal here is to identify #target_content# in the #niche# space and offer your resource as a valuable addition.",
        "Leverage existing #target_content# by notifying webmasters of outdated links and pitching your #niche# content as a replacement."
    ],

    "target_content": [
        "high-authority articles",
        "resource hubs",
        "industry guides",
        "competitor blog posts"
    ],

    "niche": [
        "SEO",
        "marketing",
        "technology",
        "health",
        "finance"
    ],

    // Action steps
    "action_steps": [
        "1. #step_one#\n2. #step_two#\n3. #step_three#",
        "1. #step_one#\n2. Craft a personalized email.\n3. #step_three#",
        "1. Identify targets using Ahrefs or Semrush.\n2. #step_two#\n3. Follow up after 3 days."
    ],

    "step_one": [
        "Use Google search operators like 'intitle:resources #niche#' to find targets.",
        "Export backlinks of a popular competitor article.",
        "Find pages with 404 links using a broken link checker."
    ],

    "step_two": [
        "Verify the contact info of the site owner.",
        "Draft a value-proposition focused email.",
        "Create a better version of the content they are currently linking to."
    ],

    "step_three": [
        "Send your outreach email and track open rates.",
        "Reach out via LinkedIn if email fails.",
        "Offer to share their content on your social channels in return."
    ],

    // Email Templates
    "email_template": [
        "> **Subject:** Question about #site_section#\n>\n> Hi [Name],\n>\n> I was researching #niche# resources and found your page: [Link].\n>\n> #email_body#\n>\n> Best,\n> [Your Name]",
        "> **Subject:** Quick tip for your #site_section#\n>\n> Hello [Name],\n>\n> I noticed a broken link on your post about #niche#.\n>\n> #email_body#\n>\n> Cheers,\n> [Your Name]"
    ],

    "site_section": [
        "your resources page",
        "your recent article",
        "your blog"
    ],

    "email_body": [
        "I just wrote a massive guide on the topic that might be a great addition for your readers.",
        "It looks like one of the links isn't working anymore. I have a similar resource that is up to date if you'd like to swap it out.",
        "I created a comprehensive infographic that visualizes the data you mentioned. Feel free to use it!"
    ]
};
