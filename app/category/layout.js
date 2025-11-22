import { siteName, getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export async function generateMetadata() {
    const title = `All Categories | ${siteName}`;
    const description = 'Browse all SEO tool categories. Jump into keyword research, on-page optimization, technical SEO, and more.';
    const url = `${baseUrl}/category`;

    return {
        title,
        description,
        robots: { index: true, follow: true },
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            siteName,
            type: 'website',
            images: [{
                url: `${baseUrl}/og-category.jpg`,
                width: 1200,
                height: 630,
                alt: 'SEO Tool Categories'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${baseUrl}/og-category.jpg`]
        }
    };
}

export default function CategoryLayout({ children }) {
    return children;
}
