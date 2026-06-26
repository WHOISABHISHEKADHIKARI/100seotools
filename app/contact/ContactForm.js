"use client";
import { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, Clock, Globe, Zap, ArrowRight, Award } from 'lucide-react';
import { getBaseUrl } from '../../lib/site';
import StructuredData from '../../components/ui/StructuredData';
import Link from 'next/link';

const baseUrl = getBaseUrl();

export default function ContactForm() {
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
            const response = await fetch('/api/contact', {
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
                setStatus({
                    type: 'error',
                    message: data.error || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
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
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
                    { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${baseUrl}/contact` },
                ]
            },
            {
                "@type": "ContactPage",
                "name": "Contact Us - 100 SEO Tools",
                "description": "Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries",
                "url": `${baseUrl}/contact`
            }
        ]
    };

    return (
        <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
            <StructuredData data={jsonLd} />

            {/* ── PREMIUM HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute top-0 right-0 w-[500px] h-full bg-blue-600/10 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-100">
                        <MessageSquare className="h-3.5 w-3.5 text-violet-400" />
                        Support & Partnerships
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Let's Start a <span className="text-violet-400">Conversation</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Have a tool suggestion, guest post inquiry, or partnership idea? We'd love to hear from you.
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm font-bold text-white/50 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> 24-48h Response</span>
                        <span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Guest Post Friendly</span>
                        <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Global Support</span>
                    </div>
                </div>
            </section>

            <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 text-sm text-slate-500 dark:text-slate-400">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li><Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400">Home</Link></li>
                    <li aria-hidden="true">/</li>
                    <li className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">Contact</li>
                </ol>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
                <div className="grid lg:grid-cols-[1fr_400px] gap-8">

                    {/* ── CONTACT FORM ── */}
                    <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-2xl p-8 md:p-12">
                        <div className="mb-10">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Send us a message</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Required fields are marked with an asterisk (*)</p>
                        </div>

                        {status.message && (
                            <div className={`mb-8 p-6 rounded-2xl flex items-start gap-4 ${status.type === 'success'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                                : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20'
                                }`}>
                                {status.type === 'success' ? (
                                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                )}
                                <p className="text-sm font-bold leading-relaxed">{status.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Name *</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                                            placeholder="Abhishek Adhikari"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Email *</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors w-5 h-5" />
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                                            placeholder="abhishek@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject *</label>
                                <div className="relative group">
                                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors w-5 h-5" />
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        className="w-full h-14 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                                        placeholder="Guest Post / Partnership / Tool Feedback"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows="6"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 dark:shadow-none flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* ── SIDEBAR INFO ── */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-10">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Direct Contact</h3>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-violet-50 dark:bg-violet-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Support</div>
                                        <a href="mailto:abhishekadhikari1254@gmail.com" className="text-sm font-bold text-slate-900 dark:text-white hover:text-violet-600 transition-colors break-all">
                                            abhishekadhikari1254@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Business Hours</div>
                                        <div className="text-sm font-bold text-slate-900 dark:text-white">Mon — Fri: 9am - 6pm EST</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-50 dark:border-white/5">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Popular Resources</h4>
                                <div className="space-y-2">
                                    {[
                                        ['Browse 100+ Tools', '/tools'],
                                        ['SEO Learning Blog', '/blog'],
                                        ['Privacy & Data', '/privacy'],
                                    ].map(([label, href]) => (
                                        <Link key={label} href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-violet-600">{label}</span>
                                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600 transition-all group-hover:translate-x-1" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-violet-600 to-indigo-800 rounded-[40px] p-10 text-white shadow-xl shadow-violet-200 dark:shadow-none">
                            <h3 className="text-2xl font-black mb-4">Guest Posting?</h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-8">
                                We love high-quality, original content. If you're an SEO expert with a unique perspective, we want to hear from you.
                            </p>
                            <Link href="/blog" className="inline-flex items-center justify-center w-full py-4 bg-white text-violet-700 text-sm font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
                                View Content Guidelines
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-24 text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Serving 50,000+ Professionals Worldwide</p>
            </div>
        </div>
    );
}
