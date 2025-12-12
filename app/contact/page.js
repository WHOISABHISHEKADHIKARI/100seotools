"use client";
import React, { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ContactPage() {
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://formspree.io/f/xjkrvjlg', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                setStatus({
                    type: 'success',
                    message: 'Thank you for your message! We\'ll get back to you soon.'
                });
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                console.error('Form submission error:', data);
                setStatus({
                    type: 'error',
                    message: data.error || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            console.error('Submission network error:', error);
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": "https://www.100seotools.com/contact#webpage",
                "name": "Contact Us - 100 SEO Tools",
                "description": "Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries",
                "url": "https://www.100seotools.com/contact",
                "isPartOf": {
                    "@id": "https://www.100seotools.com/#website"
                },
                "mainEntity": {
                    "@id": "https://www.100seotools.com/#organization"
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.100seotools.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Contact",
                        "item": "https://www.100seotools.com/contact"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Do you accept guest posts?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! We welcome high-quality guest posts related to SEO, digital marketing, and web development. Contact us with your topic ideas and writing samples."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What are your guest post guidelines?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We require original, well-researched content (1500+ words), proper citations, and value for our audience. No promotional content or excessive links."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you offer backlink opportunities?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We consider backlink partnerships for relevant, high-quality websites. Reach out with your domain details and we'll review your proposal."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does the review process take?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We typically review guest post submissions within 3-5 business days. If approved, we'll work with you on any edits and schedule publication."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I include links in my guest post?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, you can include 1-2 relevant, contextual links to your website. All links must add value to readers and follow our editorial guidelines."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you charge for guest posts or backlinks?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No, we don't charge for quality guest contributions. We focus on value exchange - great content for our readers in exchange for exposure and backlinks."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="space-y-12 max-w-7xl mx-auto px-4">
                {/* Hero Section - Matching Homepage */}
                <section className="text-center space-y-6 py-12 border-b border-gray-200 dark:border-gray-800 min-h-[300px] flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
                        Contact Us - Get in Touch
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                        Have questions about our SEO tools, backlink opportunities, or guest posting? We'd love to hear from you. Send us a message and we'll respond within 24-48 hours.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            24-48 Hour Response
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Guest Post Inquiries Welcome
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Backlink Opportunities Available
                        </span>
                    </div>
                </section>

                {/* Main Content Grid - Matching Homepage Layout */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
                    {/* Contact Info Card */}
                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">📧 Email Us</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Get in touch for general inquiries, tool suggestions, or partnership opportunities.
                        </p>
                        <a href="mailto:abhishekadhikari1254@gmail.com" className="text-brand-600 hover:underline break-all">
                            abhishekadhikari1254@gmail.com
                        </a>
                    </div>

                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">Response Time</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please mention it in your subject line.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h2 className="text-xl font-semibold mb-3">🌍 Global Reach</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Serving SEO professionals, marketers, and website owners worldwide with free tools and resources.
                        </p>
                    </div>
                </section>

                {/* Contact Form Section */}
                <section className="max-w-3xl mx-auto py-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-center space-y-3 mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold">Send Us a Message</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        {status.message && (
                            <div className={`mb-6 p-4 rounded-md flex items-start gap-3 ${status.type === 'success'
                                ? 'success-container'
                                : 'error-container'
                                }`}>
                                {status.type === 'success' ? (
                                    <FiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                )}
                                <p className="text-sm">{status.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label htmlFor="name">Your Name *</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="input pl-11"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Your Email *</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="input pl-11"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <div className="relative">
                                    <FiMessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        className="input pl-11"
                                        placeholder="Guest Post Inquiry / General Question / Partnership"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="6"
                                    className="input resize-none"
                                    placeholder="Tell us about your inquiry, guest post idea, or backlink opportunity..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FiSend className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </section>

                {/* FAQ Section - Backlinks & Guest Posts */}
                <section className="max-w-4xl mx-auto py-8 border-t border-gray-200 dark:border-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-12">Backlinks & Guest Posting FAQ</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Do you accept guest posts?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Yes! We welcome high-quality guest posts related to SEO, digital marketing, and web development. Contact us with your topic ideas and writing samples.
                            </p>
                        </div>

                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">What are your guest post guidelines?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                We require original, well-researched content (1500+ words), proper citations, and value for our audience. No promotional content or excessive links.
                            </p>
                        </div>

                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Do you offer backlink opportunities?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                We consider backlink partnerships for relevant, high-quality websites. Reach out with your domain details and we'll review your proposal.
                            </p>
                        </div>

                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">How long does the review process take?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                We typically review guest post submissions within 3-5 business days. If approved, we'll work with you on any edits and schedule publication.
                            </p>
                        </div>

                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Can I include links in my guest post?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                Yes, you can include 1-2 relevant, contextual links to your website. All links must add value to readers and follow our editorial guidelines.
                            </p>
                        </div>

                        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-semibold text-lg mb-2">Do you charge for guest posts or backlinks?</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                No, we don't charge for quality guest contributions. We focus on value exchange - great content for our readers in exchange for exposure and backlinks.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA - Matching Homepage */}
                <section className="text-center py-8 border-t border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold mb-4">Ready to Collaborate?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        <div>
                            <p className="text-4xl font-bold text-brand-600 mb-2">100+</p>
                            <p className="text-gray-600 dark:text-gray-400">Free SEO Tools</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand-600 mb-2">50K+</p>
                            <p className="text-gray-600 dark:text-gray-400">Active Users</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand-600 mb-2">DA 40+</p>
                            <p className="text-gray-600 dark:text-gray-400">Domain Authority</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-brand-600 mb-2">24-48h</p>
                            <p className="text-gray-600 dark:text-gray-400">Response Time</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
