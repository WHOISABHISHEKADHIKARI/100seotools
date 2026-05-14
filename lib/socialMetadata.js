import { getBaseUrl, siteName, socialPreviewImage, twitterHandle } from './site';

export const socialImageWidth = 1200;
export const socialImageHeight = 630;
export const socialImageType = 'image/jpeg';

function getSocialImageType(image) {
  const path = String(image || socialPreviewImage).split('?')[0].toLowerCase();
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  return socialImageType;
}

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
        width: socialImageWidth,
        height: socialImageHeight,
        type: getSocialImageType(image),
        alt: imageAlt || `${siteName} - Free SEO Toolkit`,
      },
    ],
  };
}

export function createTwitterCard({ title, description, url, image = socialPreviewImage, imageAlt } = {}) {
  return {
    card: 'summary_large_image',
    title,
    description,
    url,
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
    ...(options.url ? { alternates: { canonical: options.url } } : {}),
    openGraph: createOpenGraph(options),
    twitter: createTwitterCard(options),
  };
}
