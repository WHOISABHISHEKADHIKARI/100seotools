"use client";
import { useState, useRef, useEffect } from 'react';

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
  const cardRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Focus management for keyboard navigation
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !interactive) return;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    card.addEventListener('focus', handleFocus, true);
    card.addEventListener('blur', handleBlur, true);

    return () => {
      card.removeEventListener('focus', handleFocus, true);
      card.removeEventListener('blur', handleBlur, true);
    };
  }, [interactive]);

  const handleKeyDown = (e) => {
    if (!interactive) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (href) {
        window.location.href = href;
      }
    }
  };

  return (
    <article
      ref={cardRef}
      className={`card ${interactive ? 'card-interactive relative' : ''} ${isFocused ? 'ring-2 ring-brand-500 ring-offset-2' : ''} ${className}`}
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      onKeyDown={handleKeyDown}
      onClick={interactive ? () => href && (window.location.href = href) : undefined}
      // Remove incompatible ARIA role and keyboard handlers from non-interactive article
    >
      {/* Interactive overlay */}
      {interactive && (
        <a 
          href={href} 
          aria-label={title ? `Open: ${title}` : 'Open'} 
          className="absolute inset-0 z-10"
          tabIndex="-1"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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