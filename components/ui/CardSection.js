import UnifiedCard from './UnifiedCard';
import { slugify } from '../../lib/utils';

export default function CardSection({
  title = 'Recommended Reads',
  description = '',
  items = [],
  variant = 'article', // 'article' | 'tool' | 'default' | 'minimal'
  ariaId,
  className = '',
}) {
  const headingId = ariaId || `card-section-${slugify(title)}`;

  // Ensure stable keys and safe defaults
  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];

  return (
    <section aria-labelledby={headingId} className={`content-transition ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h2
            id={headingId}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">{description}</p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeItems.map((item, idx) => {
            const href = item.href || item.slug ? `/blog/${item.slug}` : undefined;
            const key = item.slug || `${idx}-${slugify(item.title || 'item')}`;

            return (
              <div key={key} className="relative group">
                {/* Use UnifiedCard for consistent design and interactions */}
                <UnifiedCard
                  href={href}
                  title={item.title}
                  description={item.description}
                  category={item.category}
                  readTime={item.readTime || (item.readTimeMinutes ? `${item.readTimeMinutes} min read` : undefined)}
                  author={item.author}
                  publishedAt={item.datePublished || item.publishedAt}
                  image={item.image}
                  variant={variant}
                  interactive
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
