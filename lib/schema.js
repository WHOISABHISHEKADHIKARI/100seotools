// Server-safe schema generators for JSON-LD

export function generateWebsiteSchema(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "100 SEO Tools",
    "description": "Free SEO tools collection for keyword research, on-page optimization, technical SEO, and performance tracking",
    "url": baseUrl,
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    }
  };
}

export function generateHomepageGraphSchema(baseUrl, socialLinks) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "100 SEO Tools",
        "alternateName": "100SEOTools",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "description": "100+ free SEO tools for keyword research, on-page optimization, schema generation, technical SEO, backlink analysis, content optimization, performance auditing, local SEO, competitor analysis, and AI-powered SEO — all browser-based with no signup required.",
        "foundingDate": "2024",
        "sameAs": socialLinks,
        "knowsAbout": [
          "Semantic SEO",
          "Entity-Based Search",
          "Structured Data",
          "Technical SEO",
          "Keyword Research",
          "Schema Markup",
          "Content Optimization",
          "AI-Powered SEO"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "100 SEO Tools",
        "description": "Free browser-based SEO toolkit with 100+ tools for keyword research, on-page SEO, schema generation, technical audits, backlinks, content optimization, and AI-powered SEO — no signup, no data collection.",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        // SearchAction removed — no /search route exists; was causing 404s
        "inLanguage": "en-US"
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#toolkit`,
        "name": "100 SEO Tools Toolkit",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "description": "Comprehensive browser-based SEO toolkit with 100+ free tools covering keyword research, on-page optimization, schema markup generation, technical SEO auditing, backlink analysis, content optimization, performance monitoring, local SEO, competitor analysis, and AI-powered SEO workflows. All tools run client-side for privacy-first operation.",
        "featureList": [
          "Keyword Research Tools",
          "On-Page SEO Analyzer",
          "Schema Markup Generator",
          "Technical SEO Auditor",
          "Backlink Checker",
          "Content Optimization Suite",
          "Performance & Core Web Vitals Tools",
          "Local SEO Toolkit",
          "Competitor Analysis Tools",
          "AI-Powered SEO Assistant"
        ],
        "url": baseUrl,
        "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      },
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        "name": "100 SEO Tools Web Application",
        "url": baseUrl,
        "description": "Client-side SEO application running entirely in the browser with zero server-side data processing.",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      }
    ]
  };
}

export function generateSoftwareApplicationSchema(tool, baseUrl) {
  const url = `${baseUrl}/tools/${tool.slug}`;
  const cleanName = (tool.name || '').split('|')[0].trim();
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    "name": cleanName,
    "description": tool.description,
    "url": url,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "applicationCategory": "https://schema.org/WebApplication",
    "operatingSystem": "Web Browser",
    "inLanguage": "en-US",
    "dateModified": new Date().toISOString().split('T')[0],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": tool.features || [
      "Free to use",
      "No registration required",
      "Instant results",
      "Privacy-friendly"
    ],
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl
    }
  };
}

export function generateArticleSchema(post, baseUrl, type = 'BlogPosting') {
  const url = `${baseUrl}/blog/${post.slug}`;
  const fallbackImage = `${baseUrl}/og-image.jpg`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${url}#article`,
    "headline": post.title,
    "description": post.description,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified || post.datePublished,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".article-summary", ".article-content p:first-of-type", ".faq-section"]
    },
    "author": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "url": url,
    "image": post.image || (post.slug ? `${baseUrl}/blog-images/${post.slug}.png` : fallbackImage),
    "wordCount": post.wordCount || 1500,
    "timeRequired": `PT${post.readTime || 5}M`,
    "keywords": post.tags?.join(", ") || "SEO, tools, optimization",
    "articleSection": "SEO Guides",
    "inLanguage": "en-US"
  };
}

export function generateHowToSchema(tool, baseUrl, howToSteps = []) {
  const cleanName = (tool.name || '').split('|')[0].trim();
  const url = `${baseUrl}/tools/${tool.slug}`;
  const steps = Array.isArray(howToSteps) && howToSteps.length > 0
    ? howToSteps.slice(0, 8).map((s, i) => ({
        '@type': 'HowToStep',
        'position': i + 1,
        'name': s.step || `Step ${i + 1}`,
        'text': s.tip || s.step || '',
        'url': url
      }))
    : [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': 'Open the Tool',
          'text': `Navigate to ${cleanName} on 100 SEO Tools and open the tool in your browser`,
          'url': url
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'Enter Your Data',
          'text': 'Input your website URL, keywords, or content as required by the tool',
          'url': url
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Get Results',
          'text': 'Click the analyze button and review the generated SEO analysis and recommendations',
          'url': url
        }
      ];
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "inLanguage": "en-US",
    "name": `How to Use ${cleanName}`,
    "description": `Step-by-step guide on using ${cleanName} for SEO optimization`,
    "image": `${baseUrl}/og-image.jpg`,
    "totalTime": "PT3M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    "supply": [
      {
        "@type": "HowToSupply",
        "name": "Web Browser"
      },
      {
        "@type": "HowToSupply",
        "name": "Internet Connection"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": cleanName,
        "url": url
      }
    ],
    "step": steps
  };
}

export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": "en-US",
    "mainEntity": (faqs || []).map((faq) => ({
      "@type": "Question",
      "name": faq.question || faq.q || '',
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || faq.a || '',
      },
    })),
  };
}

export function generateBreadcrumbList(items) {
  const list = Array.isArray(items) ? items : [];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": list.map((it, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": it.name,
      "item": it.item,
    })),
  };
}

export function generateCollectionPageSchema(category, tools, baseUrl) {
  const url = `${baseUrl}/category/${category.toLowerCase().replace(/\s+/g, '-')}`;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    "name": `${category} - Free SEO Tools`,
    "description": `Collection of free ${category} tools for SEO optimization`,
    "url": url,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "inLanguage": "en-US",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (tools || []).map((tool, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": tool.name,
          "url": `${baseUrl}/tools/${tool.slug}`,
          "description": tool.description,
          "applicationCategory": "SEO Tool"
        }
      }))
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl
    }
  };
}

export function generateProfilePageSchema(author, baseUrl) {
  const url = `${baseUrl}/author`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": `${author.name || "Abhishek Adhikari"} - Author Profile`,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "mainEntity": {
      "@type": "Person",
      "@id": `${url}#person`,
      "name": author.name || "Abhishek Adhikari",
      "url": url,
      "jobTitle": author.jobTitle || "SEO Strategist & Developer",
      "worksFor": {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "100 SEO Tools",
        "url": baseUrl
      },
      "description": author.description || "Lead developer and SEO strategist at 100 SEO Tools"
    }
  };
}

export function generateStaticPageSchema(page, baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${page.path}#webpage`,
    "name": page.title,
    "description": page.description,
    "url": `${baseUrl}${page.path}`,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl
    },
    "inLanguage": "en-US"
  };
}