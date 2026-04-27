/**
 * Grammar for Review Responses
 */

export const reviewResponseGrammar = {
    origin: ["#logic_router#"],

    // Route based on rating (External logic will pass 'rating_category' as state)
    // But since engine is stateless, we define separate starting points or use data flags

    positive: ["#p_opener# #p_gratitude# #p_value# #p_closing#"],
    neutral: ["#n_opener# #n_acknowledgment# #n_improvement# #n_closing#"],
    negative: ["#e_opener# #e_apology# #e_action# #e_closing#"],

    // Positive Parts
    p_opener: [
        "Dear ${customer_name},",
        "Hi ${customer_name},",
        "Greetings ${customer_name},",
        "Hello ${customer_name}!"
    ],
    p_gratitude: [
        "Thank you so much for the fantastic ${rating}-star review!",
        "We are thrilled to receive your ${rating}-star feedback.",
        "Wow, thank you for such a kind rating!",
        "We really appreciate you taking the time to share your experience."
    ],
    p_value: [
        "It's wonderful to know you enjoyed our service.",
        "Reviews like yours keep us motivated to provide the best experience possible.",
        "We're so glad we could meet your expectations.",
        "Your support means the world to our team."
    ],
    p_closing: [
        "We hope to see you again soon!",
        "Looking forward to your next visit.",
        "Best regards,\nThe Team",
        "Cheers,\nYour Friends at [Brand Name]"
    ],

    // Neutral Parts
    n_opener: ["#p_opener#"],
    n_acknowledgment: [
        "Thank you for sharing your thoughts with us.",
        "We appreciate your honest feedback regarding your recent visit.",
        "Thank you for the ${rating}-star rating."
    ],
    n_improvement: [
        "We're always looking for ways to improve.",
        "If there's anything specific we can do better next time, please let us know.",
        "We strive for 5 stars and would love to hear how we can earn those from you.",
        "Your suggestions help us grow."
    ],
    n_closing: [
        "We hope to serve you better in the future.",
        "Thank you for being our customer.",
        "Regards,\nManagement"
    ],

    // Negative (Empathetic) Parts
    e_opener: ["#p_opener#"],
    e_apology: [
        "We are truly sorry that your experience did not meet our standards.",
        "Please accept our sincerest apologies for the issues you encountered.",
        "It's disappointing to hear that we let you down during your visit.",
        "We regret that we didn't provide the level of service you deserve."
    ],
    e_action: [
        "We take your feedback seriously and are looking into this immediately.",
        "We would love the chance to make this right. Please contact us at [Phone/Email].",
        "Your experience is not typical, and we want to ensure it doesn't happen again.",
        "Please give us another chance to show you the real [Brand Name] experience."
    ],
    e_closing: [
        "Sincerely,\nCustomer Support",
        "Best,\n[Owner Name]",
        "We hope to hear from you soon."
    ]
};
