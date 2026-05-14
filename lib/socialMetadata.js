import { getBaseUrl, siteName, socialPreviewImage, twitterHandle } from './site';

export function absoluteUrl(pathOrUrl, baseUrl = getBaseUrl()) {
  if (!pathOrUrl) return `${baseUrl}${socialPreviewImage}`;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${baseUrl}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

export function createOpenGraph({ title, description, url, type = 'website', image = socialPreviewImage, imageAlt } = {}) {
  return {
    title,
    description,
    url,
    type,
    siteName,
    locale: 'en_US',
    images: [
      {
        url: absoluteUrl(image),
        secureUrl: absoluteUrl(image),
        width: 1200,
        height: 630,
        alt: imageAlt || `${siteName} - Free SEO Toolkit`,
      },
    ],
  };
}

export function createTwitterCard({ title, description, image = socialPreviewImage, imageAlt } = {}) {
  return {
    card: 'summary_large_image',
    title,
    description,
    site: twitterHandle,
    creator: twitterHandle,
    images: [
      {
        url: absoluteUrl(image),
        alt: imageAlt || `${siteName} - Free SEO Toolkit`,
      },
    ],
  };
}

export function createSocialMetadata(options = {}) {
  return {
    openGraph: createOpenGraph(options),
    twitter: createTwitterCard(options),
  };
}
