const ogTagGenerator = {
  "slug": "og-tag-generator",
  "name": "OG Tag Generator | Open Graph Meta Tag Creator",
  "category": "SEO Utility",
  "description": "Generate Open Graph (OG) meta tags for Facebook, LinkedIn, and other social platforms. Control how your content appears when shared online.",
  "metaTitle": "OG Tag Generator | Free Open Graph Meta Tag Creator",
  "metaDescription": "Create perfect Open Graph tags for your website. Optimize social media previews, improve click-through rates, and ensure your content looks great everywhere.",
  "keywords": ["og tag generator", "open graph generator", "social media meta tags", "facebook og tags", "seo utility"],
  "template": "ogTagGenerator",
  "api": true,
  "content": {
    "introduction": "When someone shares your page on Facebook, LinkedIn, or Twitter, Open Graph tags control the title, description, and image that appear in the preview. The OG Tag Generator creates a complete set of Open Graph meta tags from your page details. Enter your title, description, image URL, and page URL, then get copy-paste-ready tags that ensure your content looks professional on every social platform.",
    "whatItDoes": "The tool generates og:title, og:description, og:image, og:url, og:type, and og:site_name meta tags from your inputs. It validates URL formats, checks image dimensions, and formats descriptions for optimal social preview display. The output is clean HTML ready to paste into your <head> section.",
    "whyItMatters": "Social media is a major traffic source, and first impressions matter. Without Open Graph tags, platforms pull random content from your page — often truncated titles and mismatched images. Properly configured OG tags ensure your content appears polished and professional in social feeds, increasing click-through rates and referral traffic.",
    "benefits": [
      "Generate complete Open Graph tag sets instantly",
      "Control title, description, and image in social previews",
      "Ensure consistent branding across Facebook, LinkedIn, and more",
      "Validate image URLs and dimensions for optimal display",
      "Get clean HTML ready for your <head> section"
    ],
    "useCases": [
      "New page launch: set OG tags before sharing on social",
      "Social audit: rebuild tags for pages with poor previews",
      "Campaign prep: optimize OG tags for upcoming social campaigns",
      "Brand consistency: ensure all pages display correct branding",
      "Content marketing: maximize social sharing impact"
    ],
    "bestPractices": [
      "Use og:title (60–90 chars) that's different from your page title — optimized for social",
      "Write og:description (100–200 chars) with a compelling hook for social feeds",
      "Use high-quality images: 1200×630px for Facebook, 1200×628px for LinkedIn",
      "Always include og:url with the canonical page URL",
      "Set og:type to 'website' for homepages, 'article' for blog posts",
      "Test with Facebook Sharing Debugger and LinkedIn Post Inspector"
    ],
    "exampleResults": "Sample OG Tags Output:\n\n<meta property=\"og:title\" content=\"Free OG Tag Generator | Optimize Social Previews\" />\n<meta property=\"og:description\" content=\"Generate Open Graph tags for Facebook, LinkedIn, and Twitter. Control how your content appears when shared online.\" />\n<meta property=\"og:image\" content=\"https://www.example.com/images/og-preview.jpg\" />\n<meta property=\"og:url\" content=\"https://www.example.com/tools/og-tag-generator\" />\n<meta property=\"og:type\" content=\"website\" />\n<meta property=\"og:site_name\" content=\"100 SEO Tools\" />",
    "relatedTools": ["meta-tag-generator", "search-preview-simulator", "schema-markup-generator", "url-slug-generator", "heading-analyzer"],
    "faqs": [
      { "q": "What are Open Graph tags?", "a": "Open Graph tags are meta tags that control how your content appears when shared on social platforms like Facebook, LinkedIn, and Twitter. They define the title, description, image, and URL shown in social previews." },
      { "q": "Do OG tags affect SEO?", "a": "Indirectly. OG tags don't directly impact search rankings, but they control social sharing previews. Better previews drive more social traffic, which can indirectly improve rankings through increased engagement signals." },
      { "q": "What image size should I use for OG tags?", "a": "Use 1200×630 pixels for the best display across all platforms. This size works for Facebook, LinkedIn, and most other social networks. Avoid text-heavy images — keep them clean and readable." },
      { "q": "Can I test my OG tags?", "a": "Yes. Use Facebook's Sharing Debugger (developers.facebook.com/tools/debug) and LinkedIn's Post Inspector to preview how your content will appear when shared." },
      { "q": "What's the difference between OG and Twitter tags?", "a": "Open Graph tags are used by most platforms (Facebook, LinkedIn, Pinterest). Twitter uses its own tags (twitter:card, twitter:title, etc.) but falls back to OG tags if Twitter-specific tags are missing." }
    ]
  }
};
export default ogTagGenerator;