import optimizedToolMetadata from './optimized-metadata';

/**
 * Get optimized metadata for a tool
 * Falls back to default tool metadata if no optimization exists
 */
export function getOptimizedMetadata(toolSlug, defaultTool) {
    const optimized = optimizedToolMetadata[toolSlug];

    if (!optimized) {
        return {
            title: defaultTool?.name || 'SEO Tool',
            description: defaultTool?.description || 'Free SEO tool',
            faqs: []
        };
    }

    return optimized;
}

/**
 * Generate complete metadata object for tool pages
 */
export function generateToolMetadata(toolSlug, tool, baseUrl) {
    const optimized = getOptimizedMetadata(toolSlug, tool);

    return {
        title: optimized.title,
        description: optimized.description,
        keywords: optimized.keywords || [],
        robots: { index: true, follow: true },
        alternates: {
            canonical: `${baseUrl}/tools/${toolSlug}`
        },
        openGraph: {
            title: optimized.title,
            description: optimized.description,
            url: `${baseUrl}/tools/${toolSlug}`,
            type: 'website',
            images: [
                {
                    url: `${baseUrl}/og-tool-${toolSlug}.jpg`,
                    width: 1200,
                    height: 630,
                    alt: tool?.name || optimized.title
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: optimized.title,
            description: optimized.description,
            images: [`${baseUrl}/og-tool-${toolSlug}.jpg`]
        }
    };
}

/**
 * Get FAQ data for a tool
 */
export function getToolFAQs(toolSlug) {
    const optimized = optimizedToolMetadata[toolSlug];
    return optimized?.faqs || [];
}

export default {
    getOptimizedMetadata,
    generateToolMetadata,
    getToolFAQs
};
