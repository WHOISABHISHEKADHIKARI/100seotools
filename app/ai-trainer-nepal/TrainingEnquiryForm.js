"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Send, ShieldCheck } from 'lucide-react';

const initialStatus = { type: '', message: '' };

export default function TrainingEnquiryForm() {
    const [status, setStatus] = useState(initialStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Honeypot: hidden field that real visitors never fill in.
        if (data.companyWebsite) {
            form.reset();
            setStatus({ type: 'success', message: "Thank you! Your training enquiry has been received. We'll reply to the work email you provided." });
            return;
        }

        setIsSubmitting(true);
        setStatus(initialStatus);

        const subject = `AI Training Enquiry${data.organisation ? ` - ${data.organisation}` : ''}`;
        const message = [
            'AI training enquiry submitted from the /ai-trainer-nepal page:',
            '',
            `Organisation: ${data.organisation || 'Not provided'}`,
            `Team size: ${data.teamSize || 'Not specified'}`,
            `Preferred delivery format: ${data.format || 'Not specified'}`,
            `Preferred dates: ${data.preferredDates || 'Not specified'}`,
            `Phone: ${data.phone || 'Not provided'}`,
            '',
            'Training goals:',
            data.goals || '',
        ].join('\n');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    subject,
                    message
                })
            });

            if (response.ok) {
                form.reset();
                setStatus({
                    type: 'success',
                    message: "Thank you! Your training enquiry has been received. We'll reply to the work email you provided to discuss the agenda, delivery format and fee."
                });
            } else {
                const payload = await response.json().catch(() => ({}));
                setStatus({
                    type: 'error',
                    message: payload.error || 'Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to send your enquiry. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div id="training-enquiry" className="scroll-mt-28 bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-2xl p-8 md:p-12">
            <div className="mb-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                    <Send className="h-3.5 w-3.5" aria-hidden />
                    Training Enquiry
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                    Request a corporate training proposal
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Tell us about your team and goals. Required fields are marked with an asterisk (*).
                </p>
            </div>

            {status.message && (
                <div role="status" aria-live="polite" className={`mb-8 p-6 rounded-2xl flex items-start gap-4 ${status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                    : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-100 dark:border-red-500/20'
                    }`}>
                    {status.type === 'success' ? (
                        <CheckCircle className="w-6 h-6 flex-shrink-0" aria-hidden />
                    ) : (
                        <AlertCircle className="w-6 h-6 flex-shrink-0" aria-hidden />
                    )}
                    <p className="text-sm font-bold leading-relaxed">{status.message}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="hidden" aria-hidden="true">
                    <label htmlFor="companyWebsite">Company website</label>
                    <input
                        id="companyWebsite"
                        name="companyWebsite"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Name *</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                            placeholder="Your full name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Work Email *</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                            placeholder="you@company.com"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="organisation" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Organisation *</label>
                        <input
                            id="organisation"
                            name="organisation"
                            type="text"
                            required
                            autoComplete="organization"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                            placeholder="Company, institution or organisation"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="teamSize" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Approximate Participants</label>
                        <select
                            id="teamSize"
                            name="teamSize"
                            defaultValue=""
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                        >
                            <option value="">Select a range</option>
                            <option value="1-5">1-5 people</option>
                            <option value="6-20">6-20 people</option>
                            <option value="21-50">21-50 people</option>
                            <option value="51-100">51-100 people</option>
                            <option value="100+">More than 100 people</option>
                            <option value="Not sure yet">Not sure yet</option>
                        </select>
                    </div>
                </div>


                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="format" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Format</label>
                        <select
                            id="format"
                            name="format"
                            defaultValue=""
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                        >
                            <option value="">No preference yet</option>
                            <option value="Online">Online</option>
                            <option value="In person">In person</option>
                            <option value="Discuss both">Discuss both options</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="preferredDates" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Dates</label>
                        <input
                            id="preferredDates"
                            name="preferredDates"
                            type="text"
                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                            placeholder="e.g. November 2026, or a specific week"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone (optional)</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium"
                        placeholder="+977 ..."
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="goals" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Training Goals *</label>
                    <textarea
                        id="goals"
                        name="goals"
                        required
                        rows="5"
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-300 outline-none transition-all font-medium resize-none"
                        placeholder="Two or three examples of tasks your team wants to improve - for example: product briefs, support replies, report summaries. Please do not include confidential information."
                    ></textarea>
                </div>



                <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 p-5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        We use your details only to respond to this training enquiry. Please do not include confidential documents or personal data. See our <Link href="/privacy" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">Privacy Policy</Link>.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-16 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 dark:shadow-none flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending your enquiry...
                        </>
                    ) : (
                        <>
                            Request a Training Proposal
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden />
                        </>
                    )}
                </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Prefer to contact Abhishek directly? All enquiries can also be handled through the{' '}
                <a
                    href="https://abhishekadhikari.com/contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-violet-600 dark:text-violet-400 hover:underline"
                >
                    contact page on abhishekadhikari.com
                </a>.
            </p>
        </div>
    );
}
