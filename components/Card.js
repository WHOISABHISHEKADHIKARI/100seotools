"use client";
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
  const interactive = Boolean(href);
  const titleId = title ? `card-title-${slugify(title)}` : undefined;
  const descId = description ? `card-desc-${slugify(title)}` : undefined;

  return (
    <article
      className={`card ${interactive ? 'card-interactive relative' : ''} p-4 flex flex-col ${className}`}
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={interactive ? '0' : undefined}
      role={interactive ? 'button' : undefined}
      onClick={interactive ? (e) => {
        // Ignore clicks originating from interactive child elements
        const target = e.target;
        // If default was prevented or click is on a focusable control, do nothing
        if (e.defaultPrevented) return;
        const isInteractiveChild = target && typeof target.closest === 'function' && target.closest('a, button, input, textarea, select');
        if (isInteractiveChild) return;
        window.location.href = href;
      } : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = href;
        }
      } : undefined}
    >
      {/* Interactive overlay */}
      {interactive && (
        <a 
          href={href} 
          aria-label={title ? `Open: ${title}` : 'Open'} 
          className="absolute inset-0 z-10"
          tabIndex="-1" // Focus will be on the article element
        >
          <span className="sr-only">{title ? `Open: ${title}` : 'Open'}</span>
        </a>
      )}

      {/* Card header with icon and meta */}
      <div className="flex items-start justify-between mb-2 relative z-20">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div 
              className="card-icon-container flex-shrink-0 w-8 h-8 rounded-md bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
              aria-hidden={!iconLabel}
              aria-label={iconLabel}
              role={iconLabel ? "img" : undefined}
            >
              <Icon aria-hidden="true" className={`w-4.5 h-4.5 ${iconColor}`} />
            </div>
          )}
          {title && (
            <h3 id={titleId} className="card-title leading-tight">
              {title}
            </h3>
          )}
        </div>
        {meta && (
          <span className="card-meta flex-shrink-0">{meta}</span>
        )}
      </div>

      {/* Description with proper spacing */}
      {description && (
        <p id={descId} className="card-desc relative z-20 mb-3 line-clamp-2">{description}</p>
      )}

      {/* Action buttons with proper spacing */}
      {children && (
        <div className="relative z-20 flex items-center gap-2 mt-auto">
          {children}
        </div>
      )}
    </article>
  );
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}