"use client";

import Link from 'next/link';
import { FiSearch, FiInbox, FiAlertCircle, FiHome } from 'react-icons/fi';

/**
 * EmptyState Component
 * Reusable empty state for consistent UX when no data is available
 */
export function EmptyState({
    icon: Icon = FiInbox,
    title = "No items found",
    description = "There are no items to display at the moment.",
    action = null,
    className = ""
}) {
    return (
        <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
            <Icon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" aria-hidden="true" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                {description}
            </p>
            {action && (
                <div className="flex gap-3">
                    {action}
                </div>
            )}
        </div>
    );
}

export function EmptySearchResults({ query, onClear }) {
    return (
        <EmptyState
            icon={FiSearch}
            title="No results found"
            description={`We couldn't find any tools matching "${query}". Try adjusting your search or browse all categories.`}
            action={
                <>
                    <button onClick={onClear} className="btn">
                        Clear Search
                    </button>
                    <Link href="/category" className="btn btn-secondary">
                        Browse Categories
                    </Link>
                </>
            }
        />
    );
}

export function EmptyCategory({ categoryName }) {
    return (
        <EmptyState
            icon={FiInbox}
            title="No tools in this category"
            description={`The "${categoryName}" category doesn't have any tools yet. Check back soon or explore other categories.`}
            action={
                <Link href="/category" className="btn">
                    View All Categories
                </Link>
            }
        />
    );
}

export function EmptyBlogPosts() {
    return (
        <EmptyState
            icon={FiInbox}
            title="No blog posts yet"
            description="We're working on creating helpful content. Check back soon for SEO tips, guides, and best practices."
            action={
                <Link href="/" className="btn">
                    Explore Tools
                </Link>
            }
        />
    );
}

export function ErrorState({ message, onRetry }) {
    return (
        <EmptyState
            icon={FiAlertCircle}
            title="Something went wrong"
            description={message || "An error occurred while loading this content. Please try again."}
            action={
                <>
                    {onRetry && (
                        <button onClick={onRetry} className="btn">
                            Try Again
                        </button>
                    )}
                    <Link href="/" className="btn btn-secondary">
                        <FiHome className="w-4 h-4" />
                        Go Home
                    </Link>
                </>
            }
            className="min-h-[400px]"
        />
    );
}

export default EmptyState;
