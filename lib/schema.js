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

export function generateHowToSchema(tool, baseUrl) {
  const cleanName = (tool.name || '').split('|')[0].trim();
  const url = `${baseUrl}/tools/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "inLanguage": "en-US",
    "name": `How to Use ${cleanName}`,
    "description": `Step-by-step guide on using ${cleanName} for SEO optimization`,
    "image": `${baseUrl}/og-image.jpg`,
    "totalTime": "PT2M",
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
    "step": [
      {
        "@type": "HowToStep",
        "name": "Open the Tool",
        "text": `Navigate to ${cleanName} on 100 SEO Tools and open the tool in your browser`,
        "url": url
      },
      {
        "@type": "HowToStep",
        "name": "Enter Your Data",
        "text": "Input your website URL, keywords, or content as required by the tool",
        "url": url
      },
      {
        "@type": "HowToStep",
        "name": "Get Results",
        "text": "Click the analyze button and review the generated SEO analysis and recommendations",
        "url": url
      }
    ]
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