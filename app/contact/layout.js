import { getBaseUrl } from '../../lib/site';
const baseUrl = getBaseUrl();

export const metadata = {
    title: 'Contact Us – 100 SEO Tools | Guest Posts & Backlink Opportunities',
    description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. We respond within 24-48 hours.',
    alternates: { canonical: `${baseUrl}/contact` },
    openGraph: {
        title: 'Contact Us – 100 SEO Tools | Guest Posts & Backlinks',
        description: 'Get in touch for guest posting, backlink opportunities, tool suggestions, or general inquiries. 24-48 hour response time.',
        url: `${baseUrl}/contact`,
        type: 'website'
    },
    twitter: {
        card: 'summary',
        title: 'Contact Us – 100 SEO Tools',
        description: 'Get in touch for guest posting, backlink opportunities, tool suggestions, or general inquiries.'
    }
};

export default function ContactLayout({ children }) {
    return children;
}
