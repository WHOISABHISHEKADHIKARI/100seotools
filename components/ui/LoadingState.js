"use client";

/**
 * LoadingState Component
 * Reusable loading skeleton for consistent UX across the application
 */
export function LoadingSpinner({ size = "md", className = "" }) {
    const sizes = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16"
    };

    return (
        <div className={`inline-block ${sizes[size]} ${className}`} role="status" aria-label="Loading">
            <svg
                className="animate-spin text-brand-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export function LoadingCard() {
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
    );
}

export function LoadingGrid({ count = 6 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <LoadingCard key={i} />
            ))}
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8" />
            </div>
            <LoadingGrid count={6} />
        </div>
    );
}

export default LoadingSpinner;
