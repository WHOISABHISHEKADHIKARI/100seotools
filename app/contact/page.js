import ContactForm from './ContactForm';
import { getBaseUrl, siteName, logoImage } from '../../lib/site';
import StructuredData from '../../components/ui/StructuredData';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Contact Us | 100 SEO Tools',
  description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. 24-48h response time.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/contact` },
  openGraph: {
    title: 'Contact Us | 100 SEO Tools',
    description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries.',
    url: `${baseUrl}/contact`,
  },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${baseUrl}/contact#webpage`,
  name: 'Contact Us | 100 SEO Tools',
  description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries.',
  url: `${baseUrl}/contact`,
  isPartOf: { '@id': `${baseUrl}/#website` },
  mainEntity: {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}${logoImage}`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hashtagsolutionsocail@gmail.com',
      url: `${baseUrl}/contact`,
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <StructuredData data={contactSchema} />
      <ContactForm />
    </>
  );
}
