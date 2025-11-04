"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from './Card';
import { FiClock, FiTag, FiBookOpen, FiArrowRight } from 'react-icons/fi';

export default function BlogSection({ limit = 3, showHeader = true }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock blog posts data - in a real app, this would come from your CMS or API
  const blogPosts = [
    {
      slug: 'ai-detector-comprehensive-guide',
      title: 'AI Detector: Complete Guide to Detecting AI-Generated Content in 2024',
      description: 'Learn how to identify AI-generated content with the best detection tools, techniques, and best practices for content authenticity.',
      publishDate: '2024-01-15',
      readTime: '12 min read',
      category: 'AI Tools',
      tags: ['AI Detection', 'Content Quality', 'SEO Tools'],
      featured: true
    },
    {
      slug: 'reverse-image-search-complete-guide',
      title: 'Reverse Image Search: Ultimate Guide to Finding Image Sources',
      description: 'Master reverse image search techniques with the best tools and methods to find image sources, verify authenticity, and protect your content.',
      publishDate: '2024-01-14',
      readTime: '10 min read',
      category: 'SEO Tools',
      tags: ['Image Search', 'Content Verification', 'Digital Marketing'],
      featured: true
    },
    {
      slug: '100-free-seo-tools-ultimate-list',
      title: '100+ Free SEO Tools: The Ultimate List for Digital Marketers',
      description: 'Discover the most comprehensive collection of free SEO tools for keyword research, technical SEO, content optimization, and more.',
      publishDate: '2024-01-13',
      readTime: '15 min read',
      category: 'SEO Strategy',
      tags: ['SEO Tools', 'Free Resources', 'Digital Marketing'],
      featured: true
    },
    {
      slug: 'ai-checker-complete-guide',
      title: 'AI Checker: Complete Guide to AI Content Detection and Verification',
      description: 'Everything you need to know about AI content checkers, from how they work to the best tools and practices for content verification.',
      publishDate: '2024-01-12',
      readTime: '8 min read',
      category: 'AI Tools',
      tags: ['AI Detection', 'Content Analysis', 'Quality Assurance'],
      featured: false
    },
    {
      slug: 'translate-to-english-complete-guide',
      title: 'Translate to English: Complete Guide to Language Translation Tools',
      description: 'Comprehensive guide to translation tools and services, from machine translation to professional services and best practices.',
      publishDate: '2024-01-11',
      readTime: '11 min read',
      category: 'Language Tools',
      tags: ['Translation', 'Language Tools', 'International SEO'],
      featured: false
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const limitedPosts = limit ? blogPosts.slice(0, limit) : blogPosts;
      setPosts(limitedPosts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [limit]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'AI Tools': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'SEO Tools': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'SEO Strategy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Language Tools': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Digital Marketing': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <section className="py-12">
        {showHeader && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Latest SEO Guides
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In-depth guides and tutorials to help you master SEO tools and techniques
            </p>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit || 3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex items-center gap-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" aria-labelledby="blog-section-title">
      {showHeader && (
        <div className="text-center mb-8">
          <h2 id="blog-section-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Latest SEO Guides
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            In-depth guides and tutorials to help you master SEO tools and techniques
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {posts.map((post) => (
          <div key={post.slug} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              {post.featured && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Featured
                </span>
              )}
            </div>
            <Card
              href={`/blog/${post.slug}`}
              title={post.title}
              description={post.description}
              meta={post.readTime}
              className="p-6"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3 px-1">
              <span className="inline-flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5" />
                <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
              </span>
              <span className="inline-flex items-center gap-1">
                <FiTag className="w-3.5 h-3.5" />
                {post.tags.slice(0, 2).join(' • ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showHeader && (
        <div className="text-center">
          <Link
            href="/blog"
            className="btn btn-outline inline-flex items-center gap-2"
          >
            <FiBookOpen className="w-5 h-5" />
            View All Guides
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}