"use client";
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ArticleCard({
  href,
  title,
  description,
  category,
  readTime,
  author,
  authorAvatar,
  image,
  publishedAt,
  className = '',
  priority = false,
  tags = [],
  imageVariant = 'card',
  imageSize = 'medium',
  imageQuery,
  imageClassName = '',
}) {
  const router = useRouter();
  const isLink = useMemo(() => typeof href === 'string' && href.trim().length > 0, [href]);
  const cardId = useMemo(() => `article-card-${slugify(title)}`, [title]);
  const titleId = useMemo(() => `article-title-${slugify(title)}`, [title]);
  const descId = useMemo(() => `article-desc-${slugify(title)}`, [title]);

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
        article-card
        group
        relative
        flex
        flex-col
        h-full
        bg-white
        dark:bg-gray-800
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-0.5
        transition-all
        duration-200
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
    >
      {/* Visual Header - Image */}
      {(image) && (
        <div className="article-card-image relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      )}

      {/* Content Area */}
      <div className="article-card-content flex flex-col flex-1 p-6">
        {/* Header Section */}
        <div className="article-card-header flex items-center justify-between mb-3">
          {/* Category Meta */}
          {category && (
            <div className="article-card-category">
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
          {readTime && (
            <div className="article-card-meta text-sm text-gray-500 dark:text-gray-400">
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
              article-card-title
              text-xl
              font-semibold
              leading-tight
              text-gray-900
              dark:text-gray-50
              mb-2
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
              article-card-description
              text-gray-600
              dark:text-gray-300
              text-sm
              leading-relaxed
              mb-4
              line-clamp-3
              flex-1
            "
          >
            {description}
          </p>
        )}

        {/* Footer Section */}
        <div className="article-card-footer flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* Author Info */}
          {(author || authorAvatar) && (
            <div className="article-card-author flex items-center gap-3">
              {authorAvatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                  <Image
                    src={authorAvatar}
                    alt={author}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              )}
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

          {/* Action Indicator */}
          {isLink && (
            <div className="article-card-action flex items-center text-brand-600 dark:text-brand-400">
              <span className="text-sm font-medium mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Read more
              </span>
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Overlay */}
      {isLink && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-brand-50/50 dark:to-brand-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </article>
  );

  if (isLink) {
    return (
      <div
        className="relative group"
        aria-label={`Read article: ${title}`}
        role="link"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(e) => { const k = e.key; if (k === 'Enter' || k === ' ') { e.preventDefault(); router.push(href); } }}
      >
        <div className="relative z-20">
          {cardContent}
        </div>
      </div>
    );
  }

  return cardContent;
}

// Utility function for creating URL-friendly slugs
function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Prop types for better developer experience
ArticleCard.defaultProps = {
  className: '',
  priority: false,
};