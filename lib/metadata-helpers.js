import optimizedToolMetadata from './optimized-metadata';
import { socialPreviewImage } from './site';
import { createSocialMetadata } from './socialMetadata';

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
        ...createSocialMetadata({
            title: optimized.title,
            description: optimized.description,
            url: `${baseUrl}/tools/${toolSlug}`,
            image: socialPreviewImage,
            imageAlt: tool?.name || optimized.title
        })
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
