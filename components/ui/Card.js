"use client";
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { slugify } from '../../lib/utils';

export default function Card({
  href,
  title,
  description,
  icon: Icon,
  meta,
  children,
  className = '',
  iconColor = 'text-brand-500',
  iconLabel,
}) {
  const isLink = useMemo(() => typeof href === 'string' && href.trim().length > 0, [href]);
  const titleId = title ? `card-title-${slugify(title)}` : undefined;
  const descId = description ? `card-desc-${slugify(title)}` : undefined;

  const content = (
    <article
      className={`
        unified-card
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
        active:scale-[0.99]
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
      {/* Content Area */}
      <div className={`unified-card-content relative ${isLink ? 'pointer-events-none' : ''} flex flex-col flex-1 p-6`}>
        {/* Header Section */}
        <div className="unified-card-header flex items-center justify-between mb-3">
          {/* Icon */}
          {Icon && (
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
          {meta && (
            <div className="unified-card-meta text-sm text-gray-500 dark:text-gray-400">
              <span>{meta}</span>
            </div>
          )}
        </div>

        {/* Title Section */}
        {title && (
          <h3
            id={titleId}
            className="
              unified-card-title
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

        {/* Action buttons or children */}
        {children && (
          <div className="unified-card-actions relative z-[60] pointer-events-auto flex items-center gap-2 mt-auto">
            {children}
          </div>
        )}
      </div>
    </article>
  );

  if (isLink) {
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
        {content}
      </div>
    );
  }

  return content;
}
