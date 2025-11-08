"use client";
import Link from 'next/link';
import { useMemo, memo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function BlogCard({
  href,
  title,
  description,
  category,
  readTime,
  author,
  publishedAt,
  className = '',
  priority = false,
  imageVariant = 'card',
  imageAspectRatio = '16:9',
  imageQuality = 'high',
  showImage = true,
  showCategory = true,
  showReadTime = true,
  showAuthor = true,
  layout = 'vertical', // 'vertical' or 'horizontal'
  imagePosition = 'top', // 'top', 'bottom', 'left', 'right'
  imageSize = 'medium', // 'small', 'medium', 'large'
}) {
  const router = useRouter();
  const isLink = useMemo(() => typeof href === 'string' && href.trim().length > 0, [href]);
  const cardId = useMemo(() => `blog-card-${slugify(title)}`, [title]);
  const titleId = useMemo(() => `blog-title-${slugify(title)}`, [title]);
  const descId = useMemo(() => `blog-desc-${slugify(title)}`, [title]);

  // Determine image dimensions based on layout and size
  function getImageDimensions() {
    if (layout === 'horizontal') {
      return imageSize === 'large' ? '400x300' : imageSize === 'small' ? '200x150' : '300x225';
    }
    return imageSize === 'large' ? '800x450' : imageSize === 'small' ? '400x225' : '600x338';
  }

  // Inline SVG placeholder to avoid external fetches
  const placeholderDataUrl = useMemo(() => {
    const [w, h] = getImageDimensions().split('x').map(Number);
    const label = (title || category || 'Blog').slice(0, 30);
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
        <defs>
          <linearGradient id='g' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stop-color='#e5e7eb'/>
            <stop offset='100%' stop-color='#d1d5db'/>
          </linearGradient>
        </defs>
        <rect width='100%' height='100%' fill='url(#g)'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='system-ui, sans-serif' font-size='${Math.max(14, Math.floor(w/20))}' fill='#6b7280'>${label}</text>
      </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [title, category, imageSize, layout]);

  const formattedDate = useMemo(() => {
    if (!publishedAt) return null;
    return new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [publishedAt]);

  const cardContent = (
    <article
      id={cardId}
      className={`
        blog-card
        group
        relative
        ${layout === 'horizontal' ? 'flex' : 'flex flex-col'}
        ${layout === 'horizontal' && imagePosition === 'left' ? 'flex-row' : ''}
        ${layout === 'horizontal' && imagePosition === 'right' ? 'flex-row-reverse' : ''}
        h-full
        min-h-[48px]
        bg-white
        dark:bg-gray-800
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        shadow-sm
        hover:shadow-md
        hover:border-brand-200
        transition-transform
        duration-300
        ease-out
        overflow-hidden
        focus-within:ring-2
        focus-within:ring-brand-500
        focus-within:ring-offset-2
        focus-within:ring-offset-white
        dark:focus-within:ring-offset-gray-900
        ${className}
      `}
      aria-labelledby={titleId}
      aria-describedby={descId}
      role="article"
      tabIndex={isLink ? 0 : undefined}
      onClick={(e) => {
        if (!isLink) return;
        // Fallback navigation if overlay link fails
        if (!e.defaultPrevented && typeof href === 'string') {
          router.push(href);
        }
      }}
      onKeyDown={(e) => {
        if (!isLink) return;
        const key = e.key;
        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          router.push(href);
        }
      }}
    >
      {/* Image Section (optional) */}
      {showImage && (
        <div className={`
            blog-card-image relative overflow-hidden bg-gray-100 dark:bg-gray-700
            ${layout === 'horizontal' ? 'w-48 flex-shrink-0' : 'h-48'}
          `}>
          <Image
            src={placeholderDataUrl}
            alt={title || 'Blog image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
        </div>
      )}

      {/* Content Section */}
      <div className={`
        blog-card-content relative ${isLink ? 'pointer-events-none' : ''} flex flex-col flex-1 p-5
        ${layout === 'horizontal' ? 'justify-center' : ''}
      `}>
        {/* Header Section */}
        <div className="blog-card-header flex items-center justify-between mb-3">
          {/* Category Meta */}
          {showCategory && category && (
            <div className="blog-card-category">
              <span className="
                inline-flex
                items-center
                px-2.5
                py-1
                rounded-full
                text-xs
                font-medium
                uppercase
                tracking-wide
                bg-brand-50
                text-brand-700
                dark:bg-brand-900/30
                dark:text-brand-300
                transition-colors
                duration-200
              ">
                {category}
              </span>
            </div>
          )}

          {/* Read Time */}
          {showReadTime && readTime && (
            <div className="blog-card-meta text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readTime}
              </span>
            </div>
          )}
        </div>

        {/* Title Section */}
        {title && (
          <h3
            id={titleId}
            className="
              blog-card-title
              text-xl
              font-semibold
              leading-tight
              text-gray-900
              dark:text-gray-50
              mb-1.5
              group-hover:text-brand-600
              dark:group-hover:text-brand-400
              transition-colors
              duration-200
              line-clamp-2
            "
          >
            {title}
          </h3>
        )}

        {/* Description Section */}
        {description && (
          <p
            id={descId}
            className="
              blog-card-description
              text-gray-600
              dark:text-gray-300
              text-sm
              leading-relaxed
              mb-3.5
              line-clamp-2
              flex-1
            "
          >
            {description}
          </p>
        )}

        {/* Footer Section */}
        <div className="blog-card-footer flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Author Info */}
          {showAuthor && author && (
            <div className="blog-card-author flex items-center gap-3">
              <div className="flex flex-col">
                {author && (
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {author}
                  </span>
                )}
                {formattedDate && (
                  <time
                    dateTime={publishedAt}
                    className="text-xs text-gray-500 dark:text-gray-400"
                  >
                    {formattedDate}
                  </time>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );

  if (isLink) {
    // Overlay link pattern to avoid nested anchors
    return (
      <div className="relative group cursor-pointer">
        <Link
          href={href}
          prefetch={false}
          className="absolute inset-0 z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900"
          aria-label={`Read: ${title || 'blog'}`}
        >
          <span className="sr-only">Read: {title}</span>
        </Link>
        <div className="relative z-20">
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
}

// Helper function to create URL-friendly slugs
function slugify(str = '') {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default memo(BlogCard);
