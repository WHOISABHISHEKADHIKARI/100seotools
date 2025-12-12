// Server-safe schema generators for JSON-LD

export function generateWebsiteSchema(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "name": "100 SEO Tools",
    "description": "Free SEO tools collection for keyword research, on-page optimization, technical SEO, and performance tracking",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
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
    }
  };
}

export function generateSoftwareApplicationSchema(tool, baseUrl) {
  const url = `${baseUrl}/tools/${tool.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${url}#software`,
    "name": tool.name,
    "description": tool.description,
    "url": url,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Web Browser",
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
    "screenshot": `${baseUrl}/screenshots/${tool.slug}.png`,
    "downloadUrl": url,
    "installUrl": url,
    "publisher": {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "100 SEO Tools",
      "url": baseUrl
    }
  };
}

export function generateArticleSchema(post, baseUrl) {
  const url = `${baseUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    "headline": post.title,
    "description": post.description,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified || post.datePublished,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
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
    "image": post.image || `${baseUrl}/blog-images/${post.slug}.png` || `${baseUrl}/og-image.jpg`,
    "wordCount": post.wordCount || 1500,
    "timeRequired": `PT${post.readTime || 5}M`,
    "keywords": post.tags?.join(", ") || "SEO, tools, optimization",
    "articleSection": "SEO Guides",
    "inLanguage": "en-US"
  };
}

export function generateHowToSchema(tool, baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Use ${tool.name}`,
    "description": `Step-by-step guide on using ${tool.name} for SEO optimization`,
    "image": `${baseUrl}/screenshots/${tool.slug}.png`,
    "totalTime": "PT5M",
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
        "name": tool.name,
        "url": `${baseUrl}/tools/${tool.slug}`
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "name": "Access the Tool",
        "text": `Navigate to ${tool.name} on 100 SEO Tools`,
        "url": `${baseUrl}/tools/${tool.slug}`,
        "image": `${baseUrl}/screenshots/${tool.slug}-step1.png`
      },
      {
        "@type": "HowToStep",
        "name": "Enter Your Data",
        "text": "Input your website URL, keywords, or content as required",
        "image": `${baseUrl}/screenshots/${tool.slug}-step2.png`
      },
      {
        "@type": "HowToStep",
        "name": "Analyze Results",
        "text": "Review the generated analysis and recommendations",
        "image": `${baseUrl}/screenshots/${tool.slug}-step3.png`
      },
      {
        "@type": "HowToStep",
        "name": "Implement Changes",
        "text": "Apply the suggested optimizations to improve your SEO",
        "image": `${baseUrl}/screenshots/${tool.slug}-step4.png`
      }
    ]
  };
}

export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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