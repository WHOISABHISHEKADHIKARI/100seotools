import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateFAQSchema, generateBreadcrumbList } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import { ArrowRight, Award, CheckCircle } from 'lucide-react';
import TrainingEnquiryForm from './TrainingEnquiryForm';

const baseUrl = getBaseUrl();
const pageUrl = `${baseUrl}/ai-trainer-nepal`;

export const metadata = {
    title: 'AI Trainer in Nepal | Corporate Training — Abhishek Adhikari',
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

// JSON-LD: webpage, person and service identity (per the reviewed content plan)
const personSchema = {
    '@type': 'Person',
    '@id': 'https://abhishekadhikari.com/#person',
    name: 'Abhishek Adhikari',
    url: 'https://abhishekadhikari.com/',
    jobTitle: 'AI Trainer and Open-Source Contributor',
    sameAs: ['https://github.com/WHOISABHISHEKADHIKARI'],
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
    name: 'AI Trainer in Nepal | Corporate Training — Abhishek Adhikari',
    mainEntity: { '@id': `${pageUrl}#service` },
    about: { '@id': 'https://abhishekadhikari.com/#person' },
    inLanguage: 'en',
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

            <nav aria-label="Breadcrumb" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 text-sm text-slate-500 dark:text-slate-400">
                <ol className="flex flex-wrap items-center gap-1.5">
                    <li><Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400">Home</Link></li>
                    <li aria-hidden="true">/</li>
                    <li className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">AI Trainer in Nepal</li>
                </ol>
            </nav>

            {/* ── PREMIUM HERO ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-16 pb-24 mt-6">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-100">
                        <Award className="h-3.5 w-3.5 text-yellow-300" aria-hidden />
                        AI Training · Hetauda, Nepal
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                        AI Trainer in Nepal for Corporate Teams and Practical Work
                    </h1>

                    <p className="text-lg md:text-xl text-violet-100/90 font-bold mb-6">
                        Practical AI skills. Clear workflows. Work your team can review and reuse.
                    </p>

                    <p className="text-white/70 leading-relaxed font-medium mb-6 max-w-3xl">
                        Abhishek Adhikari is an AI trainer, prompt engineering practitioner and open-source contributor based in Hetauda, Nepal. His training focuses on helping people understand AI tools, write clearer instructions and apply AI to everyday professional tasks.
                    </p>

                    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 mb-8 max-w-3xl">
                        <p className="text-sm text-white/80 leading-relaxed">
                            <strong className="text-white">Listed among Agentic Awesome Skills&rsquo; Top Contributors: #1 for commits and #2 for skills added</strong> in its README, checked 5 October 2026.{' '}
                            <a
                                href="https://github.com/sickn33/agentic-awesome-skills#top-contributors"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-violet-300 hover:text-violet-200 underline underline-offset-2"
                            >
                                View the contributor listing
                            </a>.
                        </p>
                    </div>

                    <p className="text-white/70 leading-relaxed font-medium mb-8 max-w-3xl">
                        Looking for corporate AI training in Nepal? Start with the work your team already does: preparing reports, researching information, writing customer messages, planning content or documenting repeatable processes. Build a training session around those needs and the level of support your participants require.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <a
                            href="#training-enquiry"
                            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 text-sm font-black text-white hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/30"
                        >
                            Request a Corporate Training Proposal
                            <ArrowRight className="h-4 w-4" aria-hidden />
                        </a>
                        <a
                            href="https://abhishekadhikari.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-black text-white hover:bg-white/10 transition-all"
                        >
                            Explore Abhishek&rsquo;s Public Work
                        </a>
                    </div>

                    <p className="text-sm text-white/50 font-medium">
                        For businesses, marketing teams, educational institutions and community organisations. Discuss your location, preferred delivery format and available dates when enquiring.
                    </p>
                </div>
            </section>


            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                {/* ── WHAT CAN YOUR TEAM LEARN ── */}
                <section aria-labelledby="what-teams-learn" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="what-teams-learn" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        What can your team learn?
                    </h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            AI training is practical education in using artificial intelligence tools effectively and checking their output. A useful workshop connects explanations to guided exercises, giving participants a way to judge when AI helps, where it can make mistakes and when a person must make the final decision.
                        </p>
                        <p>
                            Training topics can include ChatGPT, Claude and Gemini, prompt engineering, research support, business writing, content planning and introductory AI workflows. The tools and exercises should match your organisation&rsquo;s approved accounts, policies and learning goals.
                        </p>
                        <p>
                            For foundational sessions, participants need basic computer skills rather than a programming background. More technical topics can be scoped separately.
                        </p>
                    </div>
                </section>

                {/* ── SHAPED AROUND YOUR TEAM'S WORK ── */}
                <section aria-labelledby="shaped-around-work" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="shaped-around-work" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Corporate AI training shaped around your team&rsquo;s work
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        Your marketing team, operations staff and managers do not all need the same workshop. Begin with the tasks that consume time or create inconsistent results, then choose practical exercises that address them.
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-white/5">
                                <tr>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Team</th>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Example training exercise</th>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Output to practise reviewing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                                {[
                                    ['Marketing and SEO', 'Turn an approved product brief into a content plan', 'Audience-focused outline with factual claims flagged for checking'],
                                    ['Sales and customer support', 'Draft responses from an approved service policy', 'Reply templates with clear escalation points'],
                                    ['HR and administration', 'Organise an onboarding process', 'Checklist with responsibilities, required inputs and approval steps'],
                                    ['Operations', 'Convert a process description into a draft procedure', 'Reusable workflow with exceptions and human review'],
                                    ['Management', 'Summarise a nonconfidential report', 'Decision brief separating evidence, assumptions and unanswered questions'],
                                    ['Education', 'Develop an activity from an approved lesson objective', 'Teaching resource checked for accuracy, level and academic integrity'],
                                ].map(([team, exercise, output]) => (
                                    <tr key={team}>
                                        <th scope="row" className="px-5 py-4 font-bold text-slate-800 dark:text-slate-100 align-top">{team}</th>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">{exercise}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">{output}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-5">
                        These examples illustrate possible workshop exercises. The final agenda is agreed around your team and the information it can safely use.
                    </p>
                </section>



                {/* ── TRAINING TOPICS ── */}
                <section aria-labelledby="training-topics" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="training-topics" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Training topics
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                title: 'AI literacy and everyday productivity',
                                body: 'Understand what generative AI does, why it can produce convincing errors and how to choose suitable tasks. Practise drafting, summarising and organising information while retaining responsibility for the result.'
                            },
                            {
                                title: 'Prompt engineering for repeatable work',
                                body: 'Learn to specify the task, relevant context, source material, constraints and required output. Improve a prompt by examining its results and refining unclear instructions. Build useful templates for work that recurs.'
                            },
                            {
                                title: 'AI for marketing, SEO and content teams',
                                body: 'Use AI to explore search intent, organise topic research, prepare briefs and review content structure. Keep product information, examples and claims grounded in your own knowledge and reliable sources. Discuss how helpful content and technical accessibility support discovery in search and AI-assisted answers.'
                            },
                            {
                                title: 'Research, reporting and document workflows',
                                body: 'Practise extracting information from approved material, comparing sources and producing an initial summary. Learn to distinguish a source-supported statement from an inference, then check references before sharing the output.'
                            },
                            {
                                title: 'Agentic AI and reusable open-source skills',
                                body: 'Explore how a repeatable task can be documented as a workflow with defined inputs, steps, outputs and review points. For suitable groups, discuss how reusable agent instructions differ from a single prompt, and how permissions and validation affect their use.'
                            },
                            {
                                title: 'Responsible AI use',
                                body: 'Work with public, synthetic or approved information. Discuss confidentiality, personal data, tool permissions, misleading output and human approval. Agree which work can be assisted by AI and which decisions need a qualified person.'
                            },

                        ].map((topic) => (
                            <article key={topic.title} className="rounded-3xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">{topic.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{topic.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ── CHOOSE A STARTING POINT ── */}
                <section aria-labelledby="starting-point" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="starting-point" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Choose a starting point
                    </h2>
                    <div className="space-y-5">
                        {[
                            ['AI awareness session:', 'An introduction for a team beginning to explore AI, with demonstrations and discussion around relevant work.'],
                            ['Practical team workshop:', 'Guided exercises around a small number of priority tasks, with time to inspect and improve the outputs.'],
                            ['Department-focused training:', 'A programme built around a defined function, such as marketing, administration or operations.'],
                            ['Multi-session learning:', 'A sequence that allows participants to practise between sessions and bring back examples for review.'],
                        ].map(([label, body]) => (
                            <div key={label} className="flex items-start gap-4">
                                <CheckCircle className="h-5 w-5 text-violet-600 dark:text-violet-400 flex-shrink-0 mt-1" aria-hidden />
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    <strong className="text-slate-900 dark:text-white">{label}</strong> {body}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-6">
                        Ask about online or in-person delivery. Duration, group size, materials, support and any paid-tool requirements are confirmed in the proposal.
                    </p>
                </section>

                {/* ── MID-PAGE CTA ── */}
                <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-violet-600 to-indigo-800 p-8 md:p-10 mb-8 text-white shadow-xl">
                    <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" aria-hidden />
                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black mb-2">Have a session format or department in mind?</h2>
                            <p className="text-white/75 text-sm leading-relaxed max-w-xl">
                                Share two or three tasks your team wants to improve and we can discuss the exercises, format and dates that fit.
                            </p>
                        </div>
                        <a
                            href="#training-enquiry"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-violet-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 whitespace-nowrap"
                        >
                            Discuss Your Training Needs
                            <ArrowRight className="h-4 w-4" aria-hidden />
                        </a>
                    </div>
                </section>

                {/* ── FROM ONE PROMPT TO A WORKFLOW ── */}
                <section aria-labelledby="workflow-example" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="workflow-example" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        From one prompt to a workflow your team can explain
                    </h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            Consider an employee onboarding checklist. A simple request to &ldquo;write an onboarding plan&rdquo; can produce a polished but generic answer. A stronger exercise begins with the approved process, responsible people, required documents and completion criteria.
                        </p>
                        <p>
                            Participants can practise turning that information into a draft checklist, then inspect the result for missing steps, unsupported assumptions and actions requiring approval. The same approach can apply to content briefs, meeting summaries and customer-support drafts.
                        </p>
                        <p>
                            The goal is to make the work understandable and reviewable, so the team knows how to use the output and when to challenge it.
                        </p>
                    </div>
                </section>

                {/* ── MEET ABHISHEK ── */}
                <section aria-labelledby="meet-abhishek" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                        <Image
                            src="/author.png"
                            alt="Abhishek Adhikari - AI trainer and prompt engineering practitioner based in Hetauda, Nepal"
                            width={112}
                            height={112}
                            className="rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg flex-shrink-0"
                        />
                        <div>
                            <h2 id="meet-abhishek" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                                Meet Abhishek Adhikari
                            </h2>
                            <p className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                                AI Trainer · Prompt Engineering Practitioner · Open-Source Contributor
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            Abhishek&rsquo;s work connects AI practice, entrepreneurship, community learning and open-source contribution. His official WordCamp Kathmandu 2026 speaker biography describes his work in prompt engineering, AI workflows and community-led technology initiatives.
                        </p>
                        <p>
                            His public GitHub profile and contributions provide another way to assess his work. Release notes for Agentic Awesome Skills acknowledge his contributions to SME operations skill batches and improvements to repository documentation and catalogue links.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-6 my-6">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                            Recognised in the project&rsquo;s Top Contributors list
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            The Agentic Awesome Skills README lists <strong className="text-slate-900 dark:text-white">@WHOISABHISHEKADHIKARI first in its &ldquo;Most Commits&rdquo; table, with 36 commits, and second in its &ldquo;Most Skills Added&rdquo; table, with 125 skills</strong>. These are the figures displayed by the project&rsquo;s README when checked on 5 October 2026. They describe contribution to this specific open-source project.
                        </p>
                        <a
                            href="https://github.com/sickn33/agentic-awesome-skills#top-contributors"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                        >
                            See the Top Contributors section
                            <ArrowRight className="h-4 w-4" aria-hidden />
                        </a>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        For a training buyer, those records offer something practical to inspect: examples of how work can be described, structured and improved in public.
                    </p>

                    <ul className="grid sm:grid-cols-2 gap-3">
                        {[
                            ['Official profile and portfolio', 'https://abhishekadhikari.com/'],
                            ['WordCamp Kathmandu 2026 speaker biography', 'https://kathmandu.wordcamp.org/2026/speaker/abhishek-adhikari/'],
                            ['GitHub profile', 'https://github.com/WHOISABHISHEKADHIKARI'],
                            ['Agentic Awesome Skills project', 'https://github.com/sickn33/agentic-awesome-skills'],
                            ['Public contribution acknowledgements', 'https://github.com/sickn33/agentic-awesome-skills/releases'],
                            ['Practical AI teaching field guide on Gita Nepal', 'https://www.gitanepal.com.np/ai-trainer-nepal'],
                            ['Contact Abhishek directly', 'https://abhishekadhikari.com/contact'],
                        ].map(([label, href]) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-700 dark:hover:text-violet-300 transition-all"
                                >
                                    {label}
                                    <ArrowRight className="h-4 w-4 flex-shrink-0" aria-hidden />
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── SELECTED SESSIONS ── */}
                <section aria-labelledby="selected-sessions" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="selected-sessions" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Selected AI training and speaking sessions
                    </h2>
                    <div className="space-y-8">
                        <article>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                                Prompt engineering for HR professionals — HCDPN
                            </h3>
                            <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                                <p>
                                    On 7 August 2026, Abhishek facilitated a two-hour online AI prompt-engineering session for 75+ HR professionals in collaboration with Human Capital Development Professionals Nepal. Under the theme &ldquo;Prompt Smarter, Not Harder,&rdquo; the session covered practical prompting for HR workflows, communication, productivity and organisational development.
                                </p>
                                <p>
                                    This professional-audience session is particularly relevant for organisations exploring AI training for HR and administration teams.
                                </p>
                            </div>
                        </article>

                        <article>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                                WordCamp Kathmandu 2026 — speaker
                            </h3>
                            <div className="space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                                <p>
                                    Abhishek presented &ldquo;Prompt Smarter, Not Harder: Curing Pain Points with skill.md,&rdquo; exploring how structured instructions can help AI tools work with context and repeatable processes. The session connected prompt engineering and reusable AI skills to practical coding and productivity tasks.
                                </p>
                                <p>
                                    <a
                                        href="https://kathmandu.wordcamp.org/2026/speaker/abhishek-adhikari/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-2"
                                    >
                                        View the official speaker profile
                                    </a>.
                                </p>
                            </div>
                        </article>

                        <article>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                                Code for Change — AI workflows and open-source contribution
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                At Dreams College in Bharatpur, Abhishek delivered &ldquo;Open to Open Source: Build Your Career with AI Workflows&rdquo; in collaboration with Code for Change. The session introduced AI workflows, agentic AI, large language models and practical ways to begin contributing to open-source projects.
                            </p>
                        </article>

                        <article>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
                                Hacktoberfest 2026 — Graphilla Technology
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                As an Open Source &amp; AI Mentor with Graphilla Technology, Abhishek delivered a two-hour session on AI-assisted open-source contribution. Topics included contribution workflows, collaboration and using practical projects to develop technical skills.
                            </p>
                        </article>

                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/10 pt-6">
                            His earlier teaching and mentoring work includes Figma and UI/UX programmes with Code for Change, Sharing Mentorship and DEV Community Nepal, alongside introductory Arduino and robotics instruction at Navodaya Shishu Sadan. This background adds experience explaining technical concepts through guided practice.
                        </p>
                    </div>
                </section>

                {/* ── PUBLIC EVENT ACTIVITY ── */}
                <section aria-labelledby="public-event-activity" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="public-event-activity" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Public event activity
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        Abhishek&rsquo;s{' '}
                        <a
                            href="https://luma.com/user/whoisabhishek"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-2"
                        >
                            Luma profile
                        </a>{' '}
                        provides a public record of event activity. As checked on 5 October 2026, it displays four hosted events. The following event listings identify him as a host or co-host:
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/10">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-white/5">
                                <tr>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Event</th>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Advertised date and location</th>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Listed role</th>
                                    <th scope="col" className="px-5 py-4 font-black text-slate-900 dark:text-white">Programme focus</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                                <tr>
                                    <th scope="row" className="px-5 py-4 font-bold align-top">
                                        <a
                                            href="https://luma.com/1d6w9vfq"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-2"
                                        >
                                            Secure Developer Conference 2026
                                        </a>
                                    </th>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">31 August&ndash;1 September 2026, Hetauda</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">Host</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">Development, open source, AI, cloud and cybersecurity</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="px-5 py-4 font-bold align-top">
                                        <a
                                            href="https://luma.com/jxeyh7fd"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-2"
                                        >
                                            Building Applications with IBM Bob
                                        </a>
                                    </th>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">1 September 2026, Dragon Banquet, Hetauda</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">Co-host with Upendra Prasad Neupane</td>
                                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 align-top">Hands-on AI-assisted application development</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-5">
                        Abhishek also served as lead organiser of Secure Developer Conference 2026 and delivered an &ldquo;Open to Open Source&rdquo; session on beginning contributions and collaborating with open-source communities.
                    </p>
                </section>

                {/* ── WHY ON 100SEOTOOLS ── */}
                <section aria-labelledby="why-100seotools" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="why-100seotools" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Why this training appears on 100SEOTools
                    </h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            Abhishek is the creator of 100SEOTools. Visitors to the platform already work on content, websites and search visibility. Practical AI training extends that work by helping teams improve how they research, brief, draft and review their material.
                        </p>
                        <p>
                            The connection is straightforward: useful tools support individual tasks, while training helps people choose the right task, explain their requirements and assess the result.
                        </p>
                    </div>
                </section>

                {/* ── TRAINING ENQUIRY ── */}
                <section aria-labelledby="enquiry-details" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="enquiry-details" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        What to include in your training enquiry
                    </h2>
                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            Tell us about your organisation, the participants and the work you want to improve. Include two or three examples of relevant tasks without sharing confidential documents or personal information.
                        </p>
                        <p>
                            The discussion can then establish the proposed agenda, delivery format, participant requirements, expected exercises and fee. Any follow-up support or additional deliverables should be stated in the proposal so your team knows what is included.
                        </p>
                    </div>
                    <div className="my-8 flex flex-wrap items-center gap-5">
                        <a
                            href="#training-enquiry"
                            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 text-sm font-black text-white hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 dark:shadow-none"
                        >
                            Request a Training Proposal
                            <ArrowRight className="h-4 w-4" aria-hidden />
                        </a>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm">
                            Suggested enquiry details: your name, organisation, work email, approximate participant count, training goals, preferred dates and online or in-person preference. Phone number is optional.
                        </p>
                    </div>

                    <TrainingEnquiryForm />
                </section>

                {/* ── FAQ ── */}
                <section aria-labelledby="faq" className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
                    <h2 id="faq" className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-6">
                        Frequently asked questions
                    </h2>
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={faq.question} className="border-b border-slate-100 dark:border-white/10 pb-6 last:border-0 last:pb-0">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── CLOSING CTA ── */}
                <section aria-labelledby="plan-workshop" className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white p-8 md:p-12 shadow-xl">
                    <div className="absolute -top-20 -right-20 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" aria-hidden />
                    <div className="relative max-w-2xl">
                        <h2 id="plan-workshop" className="text-2xl md:text-3xl font-black mb-4">
                            Plan a useful AI workshop for your team
                        </h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            Start with one question: which recurring task would your team benefit from doing more clearly and consistently?
                        </p>
                        <p className="text-white/70 leading-relaxed mb-8">
                            Share that task, your audience and your preferred dates to discuss practical AI training with Abhishek Adhikari.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="#training-enquiry"
                                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 text-sm font-black text-white hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/30"
                            >
                                Request a Corporate Training Proposal
                                <ArrowRight className="h-4 w-4" aria-hidden />
                            </a>
                            <a
                                href="https://abhishekadhikari.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-black text-white hover:bg-white/10 transition-all"
                            >
                                Review Abhishek&rsquo;s Profile
                            </a>
                        </div>
                        <p className="text-sm text-white/60 mt-6">
                            Prefer to write directly? All enquiries can also be handled through{' '}
                            <a
                                href="https://abhishekadhikari.com/contact"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-violet-300 hover:text-violet-200 underline underline-offset-2"
                            >
                                abhishekadhikari.com/contact
                            </a>.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
