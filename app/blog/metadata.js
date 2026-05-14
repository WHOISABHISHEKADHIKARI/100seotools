import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';

const baseUrl = getBaseUrl();

export const metadata = {
    title: 'SEO Blog - Free Guides & Tutorials 2026 | 100 SEO Tools',
    description: 'Master SEO with 130+ comprehensive guides on keyword research, on-page optimization, technical SEO, link building, local SEO, and AI-powered strategies. Updated for 2026.',
    keywords: ['seo blog', 'seo guides', 'seo tutorials', 'keyword research guide', 'technical seo', 'on-page seo', 'link building', 'seo 2026', 'free seo guides'],
    alternates: { canonical: `${baseUrl}/blog` },
    ...createSocialMetadata({
        title: 'SEO Blog - 130+ Free Guides & Tutorials 2026',
        description: 'Master SEO with comprehensive guides on keyword research, technical SEO, link building, and more. Free and updated for 2026.',
        url: `${baseUrl}/blog`,
        imageAlt: '100 SEO Tools Blog'
    }),
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};
