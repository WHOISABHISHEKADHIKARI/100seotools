"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMemo, memo } from 'react';
import { slugify } from '../../lib/utils';

function UnifiedCard({
  href,
  title,
  description,
  category,
  readTime,
  author,
  image,
  publishedAt,
  icon: Icon,
  iconColor = 'text-brand-500',
  iconLabel,
  meta,
  children,
  className = '',
  priority = false,
  variant = 'default', // 'default', 'article', 'tool', 'minimal'
  interactive = true,
}) {
  const isLink = useMemo(() => typeof href === 'string' && href.trim().length > 0, [href]);
  const cardId = useMemo(() => `unified-card-${slugify(title || 'card')}`, [title]);
  const titleId = useMemo(() => `card-title-${slugify(title || 'card')}`, [title]);
  const descId = useMemo(() => `card-desc-${slugify(title || 'card')}`, [title]);

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
        unified-card
        group
        relative
        flex
        flex-col
        h-full
        min-h-[48px]
        bg-white
        dark:bg-gray-800
        rounded-xl
        border
        border-gray-200
        dark:border-gray-700
        shadow-sm
        ${interactive ? 'hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.99]' : ''}
        transition-transform
        duration-300
        ease-out
        overflow-hidden
        ${interactive ? 'focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-900' : ''}
        ${variant === 'article' ? 'article-card' : ''}
        ${variant === 'tool' ? 'tool-card' : ''}
        ${variant === 'minimal' ? 'minimal-card' : ''}
        ${className}
      `}
      aria-labelledby={titleId}
      aria-describedby={descId}
      role="article"
      tabIndex={isLink && interactive ? -1 : undefined}
    >
      {/* Visual Header - Optional Image */}
      {image && (
        <div className="unified-card-image relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ease-out ${interactive ? 'group-hover:scale-105' : ''}`}
            priority={priority}
          />
        </div>
      )}

      {/* Content Area */}
      <div className={`unified-card-content relative flex flex-col flex-1 p-6`}>
        {/* Header Section */}
        <div className="unified-card-header flex items-center justify-between mb-3">
          {/* Category Meta */}
          {category && (
            <div className="unified-card-category">
              <span className={`
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
              `}>
                {category}
              </span>
            </div>
          )}

          {/* Icon for Tool variant */}
          {Icon && !image && (
            <div
              className="unified-card-icon flex-shrink-0 w-8 h-8 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center will-change-transform transition-transform group-hover:scale-105"
              aria-hidden={!iconLabel}
              aria-label={iconLabel}
              role={iconLabel ? 'img' : undefined}
            >
              <Icon aria-hidden="true" className={`w-4.5 h-4.5 ${iconColor}`} />
            </div>
          )}

          {/* Meta Information */}
          {(readTime || meta) && (
            <div className="unified-card-meta text-sm text-gray-500 dark:text-gray-400">
              {readTime && (
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
              )}
              {meta && !readTime && <span>{meta}</span>}
            </div>
          )}
        </div>

        {/* Title Section */}
        {title && (
          <h3
            id={titleId}
            className={`
              unified-card-title
              text-xl
              font-semibold
              leading-tight
              text-gray-900
              dark:text-gray-50
              mb-2
              ${interactive ? 'group-hover:text-brand-600 dark:group-hover:text-brand-400' : ''}
              transition-colors
              duration-200
              line-clamp-2
            `}
          >
            {title}
          </h3>
        )}

        {/* Description Section */}
        {description && (
          <p
            id={descId}
            className="
              unified-card-description
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
        {(author || formattedDate || children) && (
          <div className={`unified-card-footer relative z-20 flex items-center ${author || formattedDate ? 'justify-between' : 'justify-end'} mt-auto pt-4 border-t border-gray-100 dark:border-gray-700`}>
            {/* Author Info */}
            {author && (
              <div className="unified-card-author flex items-center gap-3">
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

            {/* Action buttons or children */}
            {children && (
              <div className="unified-card-actions relative z-[60] pointer-events-auto flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );

  if (isLink && interactive) {
    const router = useRouter();
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(href); } };
    return (
      <div
        className="relative block group cursor-pointer"
        aria-labelledby={titleId}
        aria-describedby={descId}
        role="link"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={onKey}
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}

export default memo(UnifiedCard);
