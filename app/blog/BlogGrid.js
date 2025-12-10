"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogGrid({ initialPosts, initialCategories }) {
    const [filteredPosts, setFilteredPosts] = useState(initialPosts);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'category'

    useEffect(() => {
        let filtered = initialPosts;

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        setFilteredPosts(filtered);
    }, [selectedCategory, searchQuery, initialPosts]);

    // Group posts by category for category view
    const postsByCategory = {};
    filteredPosts.forEach(post => {
        const cat = post.category || 'Uncategorized';
        if (!postsByCategory[cat]) {
            postsByCategory[cat] = [];
        }
        postsByCategory[cat].push(post);
    });

    const BlogCard = ({ post }) => (
        <article
            className="group card overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 flex flex-col"
            itemScope
            itemType="https://schema.org/BlogPosting"
        >
            <Link href={`/blog/${post.slug}`} className="block flex-1 flex flex-col">
                {/* Category Badge */}
                <div className="p-4 pb-0">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {post.category || 'SEO'}
                    </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition line-clamp-2" itemProp="headline">
                        {post.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 flex-1" itemProp="description">
                        {post.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <time dateTime={post.datePublished} itemProp="datePublished">
                            {new Date(post.datePublished).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </time>
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.readTimeMinutes || 8} min
                        </span>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {post.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Read More Link */}
                    <div className="pt-2">
                        <span className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium text-sm group-hover:gap-3 transition-all">
                            Read Guide
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );

    return (
        <>
            {/* Search and Filter Section */}
            <section className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="search"
                                placeholder="Search guides..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                                aria-label="Search blog posts"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg transition ${viewMode === 'grid'
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                aria-label="Grid view"
                                title="Grid view"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('category')}
                                className={`px-4 py-2 rounded-lg transition ${viewMode === 'category'
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                aria-label="Category view"
                                title="Category view"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide">
                        {initialCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${selectedCategory === cat
                                        ? 'bg-brand-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                aria-label={`Filter by ${cat}`}
                                aria-pressed={selectedCategory === cat}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredPosts.length} of {initialPosts.length} guides
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                    </div>
                </div>
            </section>

            {/* Blog Grid or Category Sections */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No guides found</h2>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                ) : (
                    // Category Sections View
                    <div className="space-y-12">
                        {Object.entries(postsByCategory).map(([category, posts]) => (
                            <div key={category} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {category}
                                    </h2>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                                        {posts.length} {posts.length === 1 ? 'guide' : 'guides'}
                                    </span>
                                </div>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.map((post) => (
                                        <BlogCard key={post.slug} post={post} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
