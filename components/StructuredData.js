"use client";

export default function StructuredData({ data }) {
  const normalize = (input) => {
    if (!input) return null;
    const ctx = 'https://schema.org';
    if (Array.isArray(input)) {
      const cleaned = input.filter((n) => n && typeof n === 'object' && (n['@type'] || n['@id']));
      if (!cleaned.length) return null;
      return { '@context': ctx, '@graph': cleaned };
    }
    if (typeof input === 'object') {
      const hasGraph = Array.isArray(input['@graph']);
      if (hasGraph) {
        const cleaned = input['@graph'].filter((n) => n && typeof n === 'object' && (n['@type'] || n['@id']));
        if (!cleaned.length) return null;
        return { '@context': input['@context'] || ctx, '@graph': cleaned };
      }
      const typeOk = !!input['@type'];
      if (!typeOk) return null;
      return { '@context': input['@context'] || ctx, ...input };
    }
    return null;
  };

  const payload = normalize(data);
  if (!payload) return null;
  if (typeof window !== 'undefined') {
    const key = JSON.stringify(payload);
    const store = (window.__schemaInjectedSet = window.__schemaInjectedSet || new Set());
    if (store.has(key)) return null;
    store.add(key);
  }
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />
  );
}

// Enhanced schema generators for better SEO
export function generateWebsiteSchema(baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
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
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "description": tool.description,
    "url": `${baseUrl}/tools/${tool.slug}`,
    "applicationCategory": "SEO Tool",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": tool.features || [
      "Free to use",
      "No registration required",
      "Instant results",
      "Privacy-friendly"
    ],
    "screenshot": `${baseUrl}/screenshots/${tool.slug}.png`,
    "downloadUrl": `${baseUrl}/tools/${tool.slug}`,
    "installUrl": `${baseUrl}/tools/${tool.slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "100 SEO Tools",
      "url": baseUrl
    }
  };
}

export function generateArticleSchema(post, baseUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified || post.datePublished,
    "author": {
      "@type": "Organization",
      "name": "100 SEO Tools",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "100 SEO Tools",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    "url": `${baseUrl}/blog/${post.slug}`,
    "image": `${baseUrl}/blog-images/${post.slug}.png`,
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
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
