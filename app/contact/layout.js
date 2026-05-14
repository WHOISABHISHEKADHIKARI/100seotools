import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';

const baseUrl = getBaseUrl();

export const metadata = {
    title: 'Contact Us - 100 SEO Tools | Guest Posts & Backlink Opportunities',
    description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. We respond within 24-48 hours.',
    alternates: { canonical: `${baseUrl}/contact` },
    ...createSocialMetadata({
        title: 'Contact Us - 100 SEO Tools',
        description: 'Get in touch for guest posting, backlink opportunities, tool suggestions, or general inquiries.',
        url: `${baseUrl}/contact`,
        imageAlt: 'Contact 100 SEO Tools'
    })
};

export default function ContactLayout({ children }) {
    return children;
}
