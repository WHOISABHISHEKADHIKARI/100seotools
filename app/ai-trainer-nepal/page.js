import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateFAQSchema, generateBreadcrumbList } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import { ArrowRight, Award, CheckCircle, BookOpen, Users, Shield, Zap, ExternalLink } from 'lucide-react';
import TrainingEnquiryForm from './TrainingEnquiryForm';

const baseUrl = getBaseUrl();
const pageUrl = `${baseUrl}/ai-trainer-nepal`;

export const metadata = {
    title: 'AI Trainer in Nepal | Corporate Training . Abhishek Adhikari',
    description: "Practical AI training in Nepal with Abhishek Adhikari. Explore corporate workshops, prompt engineering and AI workflows. Discuss your team's training needs.",
    authors: [{ name: 'Abhishek Adhikari', url: `${baseUrl}/author` }],
    creator: 'Abhishek Adhikari',
    publisher: '100SEOTools',
    keywords: [
        'ai trainer in nepal',
        'ai trainer nepal',
        'hire ai trainer nepal',
        'corporate ai training in nepal',
        'corporate ai trainer nepal',
        'ai training for employees',
        'chatgpt training nepal',
        'prompt engineering training nepal',
        'generative ai workshop nepal',
        'ai productivity training nepal',
        'ai training for marketing teams',
        'ai for small businesses nepal',
        'agentic ai workshop nepal',
        'best ai trainer in nepal',
        'top ai trainers nepal',
    ],
    alternates: { canonical: pageUrl },
    ...createSocialMetadata({
        title: 'Practical AI Training with Abhishek Adhikari',
        description: 'Help your team use AI for writing, research, marketing and everyday workflows through practical, guided training.',
        url: pageUrl,
        imageAlt: 'Abhishek Adhikari - AI trainer in Nepal for corporate teams',
    }),
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

const faqs = [
    {
        question: 'Who is Abhishek Adhikari?',
        answer: 'Abhishek Adhikari is an AI trainer, prompt engineering practitioner and open-source contributor based in Hetauda, Nepal. His public work includes an official WordCamp Kathmandu 2026 speaker profile and contributions acknowledged by Agentic Awesome Skills.'
    },
    {
        question: 'What does corporate AI training cover?',
        answer: "It can cover AI fundamentals, prompting, business writing, research, content planning and practical workflows. The agenda should be based on participants' roles and include output verification and responsible use."
    },
    {
        question: 'Do participants need coding skills?',
        answer: 'Foundational AI literacy and everyday productivity sessions can be designed for people without programming experience. Technical automation or agent development needs a separate discussion of prerequisites.'
    },
    {
        question: 'Can the training use our own work examples?',
        answer: 'Discuss relevant examples during scoping. Use public, synthetic, anonymised or explicitly approved information, and confirm the tools and permissions before preparing exercises.'
    },
    {
        question: 'Is training available outside Hetauda?',
        answer: 'Share your location and preferred delivery format when enquiring. Availability, travel arrangements and online delivery should be confirmed for the requested dates.'
    },
    {
        question: 'How much does AI training cost in Nepal?',
        answer: 'There is no single fee for every programme. A proposal depends on group size, duration, preparation, delivery mode, travel and support. Request a quote for the actual scope your organisation needs.'
    },
    {
        question: 'How should we choose an AI trainer in Nepal?',
        answer: 'Look for clear learning goals, relevant examples, public evidence of work and an agenda suited to your participants. Ask how the trainer handles mistakes, confidentiality and practical assessment. Compare what each proposal includes.'
    },
    {
        question: 'Does AI training guarantee better results or higher search rankings?',
        answer: 'No. Outcomes depend on the task, source material, tools, participants and review process. Training can help your team develop more effective working habits; it cannot guarantee business performance, Google rankings or inclusion in AI answers.'
    },
];

const personSchema = {
    '@type': 'Person',
    '@id': 'https://abhishekadhikari.com/#person',
    name: 'Abhishek Adhikari',
    url: 'https://abhishekadhikari.com/',
    jobTitle: 'AI Trainer and Open-Source Contributor',
    sameAs: [
        'https://github.com/WHOISABHISHEKADHIKARI',
        'https://www.linkedin.com/in/whoisabhishekadhikari/',
        'https://abhishekadhikari.com/',
        'https://kathmandu.wordcamp.org/2026/speaker/abhishek-adhikari/',
    ],
};

const serviceSchema = {
    '@type': 'Service',
    '@id': `${pageUrl}#service`,
    name: 'Practical AI and Corporate Team Training',
    serviceType: 'AI training',
    provider: { '@id': 'https://abhishekadhikari.com/#person' },
    areaServed: { '@type': 'Country', name: 'Nepal' },
    url: pageUrl,
    description: 'Practical AI training covering prompt engineering, workplace tasks and responsible use, with scope confirmed for each organisation.',
};

const webPageSchema = {
    '@type': 'WebPage',
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: 'AI Trainer in Nepal | Corporate Training . Abhishek Adhikari',
    mainEntity: { '@id': `${pageUrl}#service` },
    about: { '@id': 'https://abhishekadhikari.com/#person' },
    inLanguage: 'en',
    speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['.article-summary', '.article-content p:first-of-type', '.faq-section'],
    },
};

export default function AiTrainerNepalPage() {
    const faqSchema = generateFAQSchema(faqs);
    const breadcrumbSchema = generateBreadcrumbList([
        { name: 'Home', item: baseUrl },
        { name: 'AI Trainer in Nepal', item: pageUrl },
    ]);

    return (
        <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
            <StructuredData data={[personSchema, serviceSchema, webPageSchema, faqSchema, breadcrumbSchema]} />

            <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-sm text-slate-600 dark:text-slate-300">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li><Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400">Home</Link></li>
                    <li aria-hidden="true">/</li>
                    <li className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">AI Trainer in Nepal</li>
                </ol>
            </nav>

            {/* ── ARTICLE HEADER ── */}
            <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <header className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
                        <Award className="h-3.5 w-3.5" aria-hidden />
                        Field notes . AI education in Nepal
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight mb-4">
                        How I Teach Practical AI in Nepal: A Field Guide for Better Everyday Work
                    </h1>

                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        नेपालमा व्यावहारिक AI प्रशिक्षण, prompt engineering र AI workshop सम्बन्धी जानकारी।
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1.5">
                            <Image src="/author.png" alt="Abhishek Adhikari" width={24} height={24} className="rounded-full" />
                            <Link href="/author" className="font-semibold text-brand-600 hover:text-brand-800 dark:text-brand-400">Abhishek Adhikari</Link>
                        </span>
                        <span>25 September 2026</span>
                        <span>9 min read</span>
                    </div>
                </header>

                {/* ── STATS ── */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        ['125', 'AI skills added'],
                        ['36', 'Merged PRs'],
                        ['100+', 'Community events'],
                    ].map(([value, label]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-gray-900">
                            <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{value}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{label}</p>
                        </div>
                    ))}
                </div>

                {/* ── HERO IMAGE ── */}
                <figure className="mb-8">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                        <img
                            src="https://abhishekadhikari.com/abhishek-adhikari-ai-trainer-nepal-hero-tiny.jpg"
                            alt="Abhishek Adhikari, AI trainer in Nepal. Portrait of the prompt engineering educator from Hetauda."
                            width={800}
                            height={450}
                            className="w-full h-auto"
                            loading="lazy"
                        />
                    </div>
                    <figcaption className="mt-2 text-xs text-slate-600 dark:text-slate-300 text-center">
                        Abhishek Adhikari, AI trainer in Nepal.
                    </figcaption>
                </figure>

                {/* ── THE SHORT VERSION ── */}
                <div className="article-summary rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 mb-8 dark:border-blue-500/20 dark:from-blue-500/10 dark:to-white/[0.03]">
                    <h2 className="mb-2 text-lg font-extrabold text-blue-800 dark:text-blue-200">The short version</h2>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        Useful AI training is less about discovering tools and more about learning sound habits: give context, state the goal, check the result, and protect sensitive information.
                    </p>
                </div>

                {/* ── TABLE OF CONTENTS ── */}
                <nav className="rounded-2xl border border-slate-200 bg-slate-50 p-5 mb-8 dark:border-white/10 dark:bg-white/5" aria-label="Table of contents">
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300 mb-3">In this guide</h2>
                    <ol className="space-y-1 text-sm">
                        {[
                            ['Why most AI training misses the point', '#why'],
                            ['The four habits I teach first', '#framework'],
                            ['A prompt template that works', '#prompt'],
                            ['Turning prompts into workflows', '#workflows'],
                            ['Responsible AI is practical AI', '#responsible'],
                            ['Workshop and speaking notes', '#proof'],
                            ['What I hope people take away', '#takeaway'],
                        ].map(([label, href]) => (
                            <li key={href}>
                                <a href={href} className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">{label}</a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="article-content space-y-8">
                    {/* ── WHY ── */}
                    <section id="why" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Why most AI training misses the point</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            The first question people ask is usually, "Which AI tool should I use?" Tools change quickly. The ability to describe a problem, judge an answer, and make a responsible decision travels with you from one tool to the next.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            AI responds best when a person does the thinking that comes before the prompt: audience, context, constraints, source material, and a definition of success.
                        </p>
                    </section>

                    {/* ── FRAMEWORK ── */}
                    <section id="framework" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">The four habits I teach first</h2>
                        <ol className="space-y-4">
                            <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                                <strong className="text-slate-950 dark:text-white">Start with the task, not the tool.</strong>
                                <span className="text-slate-700 dark:text-slate-300"> Name the audience, intended outcome, constraints, and source material.</span>
                            </li>
                            <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                                <strong className="text-slate-950 dark:text-white">Give the model usable context.</strong>
                                <span className="text-slate-700 dark:text-slate-300"> A clear brief, example, or draft produces better results than a vague one-line prompt.</span>
                            </li>
                            <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                                <strong className="text-slate-950 dark:text-white">Verify important outputs.</strong>
                                <span className="text-slate-700 dark:text-slate-300"> Facts, calculations, citations, and recommendations require human checking.</span>
                            </li>
                            <li className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
                                <strong className="text-slate-950 dark:text-white">Keep private data private.</strong>
                                <span className="text-slate-700 dark:text-slate-300"> Decide whether a document contains personal, client, internal, or otherwise sensitive information before sharing.</span>
                            </li>
                        </ol>
                    </section>

                    {/* ── PROMPT ── */}
                    <section id="prompt" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">A prompt template that works</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Use this brief: task, audience, context, format, and check. For example, a teacher can request a lesson outline for a specific age group, provide the curriculum topic, ask for an activity and assessment, then review every fact before use.
                        </p>
                        <blockquote className="rounded-2xl border-l-4 border-brand-500 bg-brand-50/50 p-5 dark:bg-brand-500/5">
                            <p className="text-slate-800 dark:text-slate-200 font-medium italic">
                                "The best AI workflow is one you can explain, check, and repeat."
                            </p>
                        </blockquote>
                    </section>

                    {/* ── WORKFLOWS ── */}
                    <section id="workflows" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Turning prompts into workflows</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Map recurring work into inputs, a brief, a draft, a human check, revision, and an approved final version. This works for content planning, customer support, SEO briefs, meeting summaries, research preparation, and proposal drafts.
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Beginners can start with no-code tools. Technical teams can build from the same fundamentals into APIs, retrieval-augmented generation, evaluation, and agentic workflows.
                        </p>
                    </section>

                    {/* ── RESPONSIBLE ── */}
                    <section id="responsible" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Responsible AI is practical AI</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Responsible use appears in every task: checking whether a claim is supported, recognising biased language, protecting sensitive information, and telling readers when AI helped create a draft. High-consequence decisions require a high standard of verification.
                        </p>
                    </section>

                    {/* ── OPEN SOURCE ── */}
                    <section id="opensource" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Open source: 125 AI agent skills, 36 merged PRs</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            Reusable agent skills contributed to Agentic Awesome Skills. The README lists the account number 1 under "Most Commits" and number 2 under "Most Skills Added". This public contribution record demonstrates sustained, verifiable open-source AI work.
                        </p>
                        <a href="https://github.com/sickn33/agentic-awesome-skills" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline font-bold">
                            View the repository <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                    </section>

                    {/* ── PROOF / WORKSHOP ── */}
                    <section id="proof" className="space-y-4">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Workshop and speaking notes</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            These references help readers verify my professional identity and work.
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <a href="https://abhishekadhikari.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">
                                    Abhishek Adhikari portfolio <ExternalLink className="h-3 w-3" aria-hidden />
                                </a>
                                <span className="text-slate-600 dark:text-slate-300"> . professional background and selected work.</span>
                            </li>
                            <li>
                                <a href="https://kathmandu.wordcamp.org/2026/speaker/abhishek-adhikari/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">
                                    WordCamp Kathmandu 2026 speaker profile <ExternalLink className="h-3 w-3" aria-hidden />
                                </a>
                                <span className="text-slate-600 dark:text-slate-300"> . public speaking reference.</span>
                            </li>
                            <li>
                                <a href="https://github.com/WHOISABHISHEKADHIKARI" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">
                                    GitHub profile <ExternalLink className="h-3 w-3" aria-hidden />
                                </a>
                                <span className="text-slate-600 dark:text-slate-300"> . open-source activity and technical work.</span>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/whoisabhishekadhikari/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 hover:underline">
                                    LinkedIn profile <ExternalLink className="h-3 w-3" aria-hidden />
                                </a>
                                <span className="text-slate-600 dark:text-slate-300"> . professional identity reference.</span>
                            </li>
                        </ul>

                        <figure className="mt-6">
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                                <img
                                    src="https://abhishekadhikari.com/sections/volunteering/images/abhishek-adhikari--prompt-engineering-jb-coffee.jpg"
                                    alt="Prompt engineering workshop at J&B Coffee Hetauda"
                                    width={800}
                                    height={450}
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            </div>
                            <figcaption className="mt-2 text-xs text-slate-600 dark:text-slate-300 text-center">
                                Prompt engineering workshop at J&B Coffee, Hetauda.
                            </figcaption>
                        </figure>

                        <figure className="mt-6">
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                                <img
                                    src="https://abhishekadhikari.com/sections/volunteering/images/abhishek-adhikari--ai-digital-literacy-workshop.jpeg"
                                    alt="AI and digital literacy workshop session"
                                    width={800}
                                    height={450}
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            </div>
                            <figcaption className="mt-2 text-xs text-slate-600 dark:text-slate-300 text-center">
                                AI and digital literacy workshop session.
                            </figcaption>
                        </figure>

                        <figure className="mt-6">
                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10">
                                <img
                                    src="https://abhishekadhikari.com/sections/media/images/abhishek-adhikari--wordcamp-kathmandu-2026-speaker.jpg"
                                    alt="WordCamp Kathmandu 2026 speaker"
                                    width={800}
                                    height={450}
                                    className="w-full h-auto"
                                    loading="lazy"
                                />
                            </div>
                            <figcaption className="mt-2 text-xs text-slate-600 dark:text-slate-300 text-center">
                                Speaking at WordCamp Kathmandu 2026.
                            </figcaption>
                        </figure>
                    </section>

                    {/* ── TAKEAWAY ── */}
                    <section id="takeaway" className="space-y-3">
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">What I hope people take away</h2>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            The goal is not simply to be faster. It is to do better work with more clarity: to know what to ask, what to question, and when a human decision matters most.
                        </p>
                    </section>

                    {/* ── AUTHOR BIO ── */}
                    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                        <h2 className="text-lg font-extrabold text-slate-950 dark:text-white mb-2">About the author</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Abhishek Adhikari writes and speaks about practical AI workflows, open source, SEO, and digital learning in Nepal. He is the creator of 100 SEO Tools and a contributor to Agentic Awesome Skills.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3">
                            <Link href="/author" className="text-xs font-bold text-brand-600 hover:text-brand-800 dark:text-brand-400">View full profile</Link>
                            <a href="https://abhishekadhikari.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-600 hover:text-brand-800 dark:text-brand-400">Portfolio</a>
                        </div>
                    </section>

                    {/* ── CTA ── */}
                    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 dark:border-brand-500/30 dark:bg-brand-500/5">
                        <h2 className="text-xl font-extrabold text-slate-950 dark:text-white mb-2">Looking for corporate AI training in Nepal?</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                            Share your team's needs and preferred delivery format. I'll confirm availability and propose a scope tailored to your organisation.
                        </p>
                        <a href="#training-enquiry" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-500">
                            Request a Training Proposal <ArrowRight className="h-4 w-4" aria-hidden />
                        </a>
                    </div>
                </div>

                {/* ── FAQ ── */}
                <section id="faq" className="faq-section mt-10 space-y-4">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Frequently asked questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <details key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                                <summary className="cursor-pointer font-bold text-slate-950 dark:text-white">{faq.question}</summary>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ── ENQUIRY FORM ── */}
                <section id="training-enquiry" className="mt-10">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-4">Request a training proposal</h2>
                    <TrainingEnquiryForm />
                </section>
            </article>
        </div>
    );
}