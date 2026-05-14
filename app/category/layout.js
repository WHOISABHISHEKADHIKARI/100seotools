import { siteName, getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';

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
        ...createSocialMetadata({
            title,
            description,
            url,
            imageAlt: 'SEO Tool Categories'
        })
    };
}

export default function CategoryLayout({ children }) {
    return children;
}
