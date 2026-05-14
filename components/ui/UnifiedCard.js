"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMemo, memo } from 'react';
import { slugify } from '../../lib/utils';
import Skeleton from './Skeleton';

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
  iconColor = 'text-violet-600',
  iconLabel,
  meta,
  children,
  className = '',
  priority = false,
  variant = 'default', // 'default', 'article', 'tool', 'minimal'
  interactive = true,
  loading = false,
}) {
  const router = useRouter();
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

  if (loading) {
    return (
      <div className={`unified-card bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 p-6 space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton width="80px" height="24px" className="rounded-full" />
          <Skeleton width="32px" height="32px" className="rounded-xl" />
        </div>
        <Skeleton width="100%" height="28px" />
        <div className="space-y-2">
          <Skeleton width="100%" height="16px" />
          <Skeleton width="90%" height="16px" />
          <Skeleton width="40%" height="16px" />
        </div>
        <div className="pt-4 border-t border-slate-50 dark:border-white/5 flex justify-between items-center">
          <Skeleton width="100px" height="16px" />
          <Skeleton width="60px" height="32px" className="rounded-lg" />
        </div>
      </div>
    );
  }

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
        bg-white
        dark:bg-gray-900
        rounded-3xl
        border
        border-slate-100
        dark:border-white/10
        shadow-sm
        ${interactive ? 'hover:shadow-xl hover:-translate-y-1.5 tap-active' : ''}
        transition-all
        duration-300
        ease-out
        overflow-hidden
        ${interactive ? 'focus-within:ring-4 focus-within:ring-violet-100 dark:focus-within:ring-violet-500/20' : ''}
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
        <div className="unified-card-image relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ease-out ${interactive ? 'group-hover:scale-110' : ''}`}
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Area */}
      <div className={`unified-card-content relative flex flex-col flex-1 p-6`}>
        {/* Header Section */}
        <div className="unified-card-header flex items-center justify-between mb-4">
          {/* Category Meta */}
          {category && (
            <div className="unified-card-category">
              <span className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-[10px]
                font-extrabold
                uppercase
                tracking-widest
                bg-violet-50
                text-violet-700
                dark:bg-violet-500/10
                dark:text-violet-300
                border border-violet-100 dark:border-violet-500/20
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
              className={`unified-card-icon flex-shrink-0 w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center will-change-transform transition-all duration-300 ${interactive ? 'group-hover:bg-violet-600 group-hover:text-white group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-violet-200 dark:group-hover:shadow-none' : ''}`}
              aria-hidden={!iconLabel}
              aria-label={iconLabel}
              role={iconLabel ? 'img' : undefined}
            >
              <Icon aria-hidden="true" className={`w-5 h-5 ${iconColor} transition-colors duration-300 ${interactive ? 'group-hover:text-white' : ''}`} />
            </div>
          )}
        </div>

        {/* Title Section */}
        {title && (
          <h3
            id={titleId}
            className={`
              unified-card-title
              text-lg
              font-extrabold
              leading-snug
              text-slate-900
              dark:text-white
              mb-2
              ${interactive ? 'group-hover:text-violet-600 dark:group-hover:text-violet-400' : ''}
              transition-colors
              duration-300
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
              text-slate-500
              dark:text-slate-400
              text-sm
              leading-relaxed
              mb-6
              line-clamp-3
              flex-1
            "
          >
            {description}
          </p>
        )}

        {/* Footer Section */}
        {(author || formattedDate || readTime || meta || children) && (
          <div className={`unified-card-footer relative z-20 flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-white/5`}>
            {/* Meta Info */}
            <div className="flex flex-col">
              {author && (
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {author}
                </span>
              )}
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {formattedDate && <time dateTime={publishedAt}>{formattedDate}</time>}
                {readTime && (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {readTime}
                  </span>
                )}
                {meta && !readTime && (
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    {meta}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons or children */}
            {children && (
              <div className="unified-card-actions relative z-[60] pointer-events-auto flex items-center gap-2">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );

  if (isLink && interactive) {
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
