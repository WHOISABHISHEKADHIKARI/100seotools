import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateFAQSchema } from '../../lib/schema';
import { getAuthor, getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
    title: 'Abhishek Adhikari - Entrepreneur, SEO Expert, Full-Stack Developer & Tech Consultant in Nepal | 100SEOTools Creator',
    description: 'Meet Abhishek Adhikari - Award-winning Entrepreneur, SEO Expert, Full-Stack Developer, and Tech Consultant with 22+ years of expertise. Creator of 100SEOTools, Founder of Himalaya Krishi organic farming, and Delta Engineering Solutions. Specializing in SEO optimization, UI/UX design, agri-tech innovation, and sustainable digital solutions in Nepal.',
    keywords: 'Abhishek Adhikari, Abhishek Adhikari Nepal, Tech Consultant Nepal, SEO Expert Nepal, SEO Intern Hashtag Web Solution, Agri-Tech Developer, UI/UX Designer Nepal, Entrepreneur Nepal, Himalaya Krishi, Organic Farming Nepal, Web Developer Nepal, Software Engineer Nepal, Delta Engineering Solutions, React Developer, PHP Developer, Laravel Expert, Python Automation, Full-Stack Developer Nepal, Sustainable Technology, Search Engine Optimization Nepal, 100SEOTools, Free SEO Tools, Digital Marketing Expert Nepal, Manahari Nepal, Tribhuvan University',
    authors: [{ name: 'Abhishek Adhikari', url: 'https://100seotools.com/author' }],
    creator: 'Abhishek Adhikari',
    publisher: '100SEOTools',
    alternates: {
        canonical: 'https://100seotools.com/author',
    },
    openGraph: {
        title: 'Abhishek Adhikari - Entrepreneur, SEO Expert & Tech Consultant',
        description: 'Entrepreneur | Tech Consultant | Agri-Tech Innovator | SEO Intern @ Hashtag Web Solution | Full-Stack Developer | UI/UX Specialist. Creator of 100+ free SEO tools.',
        url: 'https://100seotools.com/author',
        siteName: '100SEOTools',
        locale: 'en_US',
        type: 'profile',
        images: [
            {
                url: 'https://100seotools.com/author.png',
                width: 1200,
                height: 630,
                alt: 'Abhishek Adhikari - SEO Expert and Entrepreneur',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Abhishek Adhikari - SEO Expert & Entrepreneur',
        description: 'Creator of 100+ free SEO tools. Entrepreneur, Tech Consultant, and Agri-Tech Innovator.',
        images: ['https://100seotools.com/author.png'],
    },
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

const authorData = getAuthor(baseUrl);
// JSON-LD Structured Data for Person
const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Abhishek Adhikari',
    alternateName: 'Abhisek Adhikari',
    jobTitle: ['Entrepreneur', 'SEO Expert', 'Full-Stack Developer', 'Tech Consultant', 'UI/UX Designer'],
    description: 'Entrepreneur, SEO Expert, and Full-Stack Developer with 10+ years of expertise. Creator of 100SEOTools, Founder of Himalaya Krishi, and Delta Engineering Solutions.',
    ...authorData,
    email: 'abhishekadhikari1254@gmail.com',
    telephone: '+977-9865412482',
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Manahari',
        addressCountry: 'Nepal',
    },
    alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Tribhuvan University',
    },
    knowsAbout: [
        'SEO Optimization',
        'UI/UX Design',
        'Full-Stack Development',
        'React',
        'Node.js',
        'Python',
        'PHP',
        'Laravel',
        'Digital Marketing',
        'Agri-Tech Innovation',
        'Organic Farming',
        'Sustainable Technology',
    ],
    worksFor: [
        {
            '@type': 'Organization',
            name: 'Hashtag Web Solutions',
            url: 'https://hashtagweb.com.np',
        },
        {
            '@type': 'Organization',
            name: '100SEOTools',
            url: 'https://100seotools.com',
        },
    ],
    founder: [
        {
            '@type': 'Organization',
            name: 'Himalaya Krishi',
            url: 'https://krishihimalaya.com',
            description: 'Nepal\'s first fully organic farming brand',
        },
        {
            '@type': 'Organization',
            name: 'Delta Engineering Solutions',
            url: 'https://deltaengineeringsolution.com',
        },
    ],
};

// Breadcrumb Schema
const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'About Abhishek Adhikari',
            item: `${baseUrl}/author`,
        },
    ],
};

const faqs = [
    {
        q: 'Who is Abhishek Adhikari?',
        a: 'Abhishek Adhikari is an entrepreneur, SEO expert, full-stack developer, and tech consultant with 22+ years of expertise. He is the creator of 100SEOTools, founder of Himalaya Krishi (Nepal\'s first fully organic farming brand), and works as an SEO Specialist at Hashtag Web Solution.'
    },
    {
        q: 'What is 100SEOTools?',
        a: '100SEOTools is a comprehensive suite of 100+ free SEO tools created by Abhishek Adhikari. It provides keyword research, on-page optimization, technical SEO, content analysis, and performance tracking tools - all completely free with no signup required.'
    },
    {
        q: 'What are Abhishek Adhikari\'s main areas of expertise?',
        a: 'Abhishek specializes in SEO optimization, UI/UX design, full-stack development (React, Node.js, Python, PHP, Laravel), digital marketing, agri-tech innovation, and sustainable technology solutions.'
    },
    {
        q: 'Where is Abhishek Adhikari located?',
        a: 'Abhishek Adhikari is based in Manahari, Nepal.'
    },
    {
        q: 'How can I contact Abhishek Adhikari?',
        a: 'You can contact Abhishek via email at abhishekadhikari1254@gmail.com or phone at +977 9865412482. You can also connect through his website 100seotools.com or GitHub profile.'
    },
    {
        q: 'What is Himalaya Krishi?',
        a: 'Himalaya Krishi is Nepal\'s first fully organic farming brand founded by Abhishek Adhikari. It focuses on sustainable agriculture, combining traditional Himalayan wisdom with cutting-edge innovations, and offers organic fertilizer solutions, livestock management consulting, and sustainable farming training programs.'
    },
    {
        q: 'What programming languages does Abhishek Adhikari know?',
        a: 'Abhishek is proficient in JavaScript (React, Node.js, Next.js), Python, PHP, Laravel, and has experience with MySQL, Git, Vite, and modern web development tools.'
    },
    {
        q: 'What is Abhishek Adhikari\'s educational background?',
        a: 'Abhishek studied at Tribhuvan University and has completed certifications in Google UX Design and Fundamentals of Graphic Design.'
    },
    {
        q: 'Does Abhishek Adhikari work at Hashtag Web Solutions?',
        a: 'Yes, Abhishek works as an SEO Specialist at Hashtag Web Solution, focusing on technical optimization, keyword strategy, performance enhancement, and sustainable organic growth.'
    },
    {
        q: 'What is Delta Engineering Solutions?',
        a: 'Delta Engineering Solutions is an engineering and technology solutions company associated with Abhishek Adhikari, focused on innovative digital products, automation systems, and sustainable technology implementations.'
    },
    {
        q: 'How many years of experience does Abhishek Adhikari have?',
        a: 'Abhishek Adhikari has 10+ years of combined experience in agriculture, technology, entrepreneurship, SEO optimization, UI/UX design, and web development.'
    },
    {
        q: 'Is 100SEOTools really free?',
        a: 'Yes, all 100+ SEO tools are completely free forever. There are no hidden fees, no subscriptions, and no signup required. Abhishek created these tools to make professional SEO accessible to everyone.'
    },
    {
        q: 'What inspired Abhishek to create 100SEOTools?',
        a: 'Abhishek believes that SEO tools shouldn\'t be locked behind expensive paywalls. He created 100SEOTools to democratize SEO and help small businesses, marketers, and developers optimize their online presence without breaking the bank.'
    },
    {
        q: 'Can I hire Abhishek Adhikari for SEO consulting?',
        a: 'Yes, you can reach out to Abhishek for SEO consulting, web development, UI/UX design, or agri-tech solutions via email at abhishekadhikari1254@gmail.com or phone at +977 9865412482.'
    },
    {
        q: 'What is Abhishek Adhikari\'s approach to SEO?',
        a: 'Abhishek believes in consistency, clean execution, and understanding how people actually use the internet. He focuses on what actually works, avoiding shortcuts, and building long-term, sustainable SEO strategies.'
    },
    {
        q: 'Does Abhishek Adhikari have a GitHub profile?',
        a: 'Yes, you can find Abhishek\'s open source projects and code on GitHub at github.com/WHOISABHISHEKADHIKARI.'
    },
    {
        q: 'What makes Abhishek Adhikari different from other SEO experts?',
        a: 'Abhishek combines technical expertise with practical, real-world experience. He didn\'t learn SEO from theory - he learned by doing, fixing broken sites, running audits, and testing strategies across different industries. He also provides 100+ free tools to the community.'
    },
    {
        q: 'What is Abhishek Adhikari\'s mission?',
        a: 'Abhishek\'s mission is to turn technical vision into real performance, help brands grow organically, build trust, and achieve sustainable success through accessible, privacy-focused, and efficient SEO tools.'
    },
    {
        q: 'Does Abhishek Adhikari offer UI/UX design services?',
        a: 'Yes, Abhishek is a UI/UX designer with expertise in user research, wireframing, prototyping, and creating intuitive user interfaces. He specializes in human-centered design and digital product improvement.'
    },
    {
        q: 'What is Abhishek Adhikari\'s role in agriculture?',
        a: 'Abhishek is pioneering agri-tech innovation through Himalaya Krishi, integrating technology with agriculture to innovate in agri-business, organic farming, and automation. He\'s expanding into eco-friendly product lines and organic food production.'
    },
    {
        q: 'What technologies does Abhishek use for 100SEOTools?',
        a: 'Abhishek built 100SEOTools using modern web technologies including React, Next.js, Node.js, and implements client-side processing for privacy and speed. The site is optimized for performance and SEO.'
    },
    {
        q: 'Does Abhishek Adhikari write blog posts?',
        a: 'Yes, Abhishek writes comprehensive SEO guides and blog posts on 100SEOTools, covering topics like keyword research, on-page optimization, technical SEO, and best practices.'
    },
    {
        q: 'What is Abhishek Adhikari\'s philosophy on sustainable technology?',
        a: 'Abhishek is a strong believer in organic and sustainable development across all sectors. He advocates for long-term sustainability, honest results over shortcuts, and building systems that perform consistently.'
    },
    {
        q: 'What certifications does Abhishek Adhikari hold?',
        a: 'Abhishek holds certifications in Google UX Design and Fundamentals of Graphic Design, complementing his 22+ years of practical experience in technology and SEO.'
    },
    {
        q: 'What is Abhishek Adhikari\'s work style?',
        a: 'Abhishek\'s work style is straightforward: make things cleaner, faster, more accurate, and more user-focused. He ensures every change has a purpose and focuses on practical, actionable results.'
    },
    {
        q: 'What SEO services does Abhishek Adhikari offer?',
        a: 'Abhishek offers technical SEO audits, keyword research and strategy, on-page and off-page optimization, content strategy, local SEO, schema markup implementation, and Google Analytics setup and analysis.'
    },
    {
        q: 'How does Abhishek Adhikari stay updated with SEO trends?',
        a: 'Abhishek continuously tests strategies, analyzes search engine algorithm updates, studies industry best practices, and applies real-world experimentation to stay ahead of SEO trends.'
    },
    {
        q: 'What industries has Abhishek Adhikari worked with?',
        a: 'Abhishek has worked across multiple industries including agriculture, e-commerce, technology startups, digital marketing agencies, organic farming, engineering solutions, and web development.'
    },
    {
        q: 'Does Abhishek Adhikari offer training or mentorship?',
        a: 'Yes, Abhishek offers training programs through Himalaya Krishi for sustainable farming and is available for SEO and web development mentorship. Contact him directly for consultation opportunities.'
    },
    {
        q: 'What is Abhishek Adhikari\'s approach to web development?',
        a: 'Abhishek focuses on performance optimization, clean code architecture, user-centered design, SEO-friendly development, and scalable solutions using modern frameworks like React and Next.js.'
    },
    {
        q: 'How does 100SEOTools protect user privacy?',
        a: 'Most tools on 100SEOTools run client-side, meaning your data is processed in your browser and never sent to servers. This ensures complete privacy and data security.'
    },
    {
        q: 'What makes Himalaya Krishi unique?',
        a: 'Himalaya Krishi is Nepal\'s first fully organic farming brand that combines traditional Himalayan agricultural wisdom with modern technology and innovation, focusing on sustainable and eco-friendly farming practices.'
    },
    {
        q: 'Can Abhishek Adhikari help with website performance optimization?',
        a: 'Yes, Abhishek specializes in performance optimization including page speed improvements, Core Web Vitals optimization, code splitting, lazy loading, and technical performance enhancements.'
    },
    {
        q: 'What is Abhishek Adhikari\'s experience with React?',
        a: 'Abhishek has extensive experience building production-ready React applications, including 100SEOTools. He specializes in React best practices, state management, component architecture, and performance optimization.'
    },
    {
        q: 'Does Abhishek Adhikari work with startups?',
        a: 'Yes, Abhishek works with startups providing SEO strategy, web development, UI/UX design, and technical consulting to help them establish strong online presence and sustainable growth.'
    },
    {
        q: 'What is Abhishek Adhikari\'s experience with content strategy?',
        a: 'Abhishek has developed content strategies for multiple projects, focusing on SEO-optimized content, user intent matching, keyword targeting, and content that drives organic traffic and conversions.'
    },
    {
        q: 'How does Abhishek Adhikari approach keyword research?',
        a: 'Abhishek uses a data-driven approach combining search volume analysis, competition assessment, user intent understanding, and long-tail keyword opportunities to develop effective keyword strategies.'
    },
    {
        q: 'What is Abhishek Adhikari\'s experience with local SEO?',
        a: 'Abhishek has expertise in local SEO including Google Business Profile optimization, local schema markup, NAP consistency, local citations, and geo-targeted content strategies.'
    },
    {
        q: 'Can Abhishek Adhikari help with technical SEO issues?',
        a: 'Yes, Abhishek specializes in technical SEO including site architecture, crawlability, indexation, structured data, Core Web Vitals, mobile optimization, and fixing technical SEO errors.'
    },
    {
        q: 'What is Abhishek Adhikari\'s approach to link building?',
        a: 'Abhishek focuses on white-hat link building strategies including quality content creation, digital PR, guest posting, broken link building, and building genuine relationships for sustainable backlink growth.'
    },
    {
        q: 'Does Abhishek Adhikari offer website audits?',
        a: 'Yes, Abhishek provides comprehensive website audits covering technical SEO, on-page optimization, content quality, user experience, performance, and actionable recommendations for improvement.'
    },
    {
        q: 'What is Abhishek Adhikari\'s experience with schema markup?',
        a: 'Abhishek has extensive experience implementing various schema types including Article, Organization, Person, Product, FAQ, HowTo, and LocalBusiness schemas to enhance search visibility.'
    },
    {
        q: 'How does Abhishek Adhikari measure SEO success?',
        a: 'Abhishek measures SEO success through organic traffic growth, keyword rankings, conversion rates, user engagement metrics, Core Web Vitals, and overall business impact from organic search.'
    },
    {
        q: 'What is Abhishek Adhikari\'s experience with e-commerce SEO?',
        a: 'Abhishek has worked on e-commerce SEO including product page optimization, category structure, faceted navigation, product schema, and conversion-focused SEO strategies.'
    },
    {
        q: 'Can Abhishek Adhikari help recover from Google penalties?',
        a: 'Yes, Abhishek can help diagnose and recover from Google penalties by identifying issues, creating recovery plans, implementing fixes, and submitting reconsideration requests when needed.'
    },
    {
        q: 'What is Abhishek Adhikari\'s approach to mobile SEO?',
        a: 'Abhishek prioritizes mobile-first indexing, responsive design, mobile page speed, touch-friendly interfaces, and mobile-specific user experience optimization for better mobile search performance.'
    },
    {
        q: 'Does Abhishek Adhikari use AI tools for SEO?',
        a: 'Yes, Abhishek explores and implements AI tools for content optimization, keyword research, automation workflows, and data analysis while maintaining focus on quality and user experience.'
    },
    {
        q: 'What is Abhishek Adhikari\'s pricing for SEO services?',
        a: 'Pricing varies based on project scope, requirements, and duration. Contact Abhishek directly at abhishekadhikari1254@gmail.com for a customized quote based on your specific needs.'
    },
    {
        q: 'How long does it take to see SEO results with Abhishek Adhikari?',
        a: 'SEO is a long-term strategy. Typically, you can expect to see initial improvements in 3-6 months, with significant results in 6-12 months, depending on competition and current site status.'
    },
    {
        q: 'What is Abhishek Adhikari\'s experience with international SEO?',
        a: 'Abhishek has experience with international SEO including hreflang implementation, multi-language content strategy, geo-targeting, and managing SEO for websites targeting multiple countries.'
    }
];

export default function AuthorPage() {
    const faqSchema = generateFAQSchema(faqs);

    return (
        <>
            {/* JSON-LD Structured Data */}
            <StructuredData data={[personSchema, breadcrumbSchema, faqSchema]} />

            <article className="min-h-screen py-12">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Hero Section */}
                    <header className="card p-8 md:p-12 mb-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/author.png"
                                    alt="Abhishek Adhikari - Entrepreneur, SEO Expert, and Tech Consultant"
                                    width={180}
                                    height={180}
                                    className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg"
                                    priority
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                                    <span>Abhishek</span> <span>Adhikari</span>
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                    Entrepreneur | Tech Consultant | SEO Specialist | Full-Stack Developer
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                    Passionate entrepreneur and technology consultant focused on creating impactful, sustainable, and scalable solutions. Currently working as an SEO Intern at Hashtag Web Solution, combining creativity, analytics, and technical expertise to improve search visibility and create user-first digital experiences.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="mailto:abhishekadhikari1254@gmail.com"
                                        className="btn"
                                        aria-label="Email Abhishek Adhikari"
                                    >
                                        Contact Me
                                    </a>
                                    <a
                                        href="tel:+9779865412482"
                                        className="btn-secondary"
                                        aria-label="Call Abhishek Adhikari"
                                    >
                                        +977 9865412482
                                    </a>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats Section */}
                    <section className="grid md:grid-cols-4 gap-6 mb-8" aria-label="Key Statistics">
                        {[
                            { number: '100+', label: 'Free SEO Tools' },
                            { number: '22+', label: 'Years Experience' },
                            { number: '100%', label: 'Free Forever' },
                            { number: '0', label: 'Registration Required' }
                        ].map((stat, index) => (
                            <div key={index} className="card p-6 text-center">
                                <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">{stat.number}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </section>

                    {/* About Section */}
                    <section className="card p-8 mb-8" aria-labelledby="about-me">
                        <h2 id="about-me" className="text-2xl font-bold mb-6">About Me</h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                                I am a results-driven <strong>SEO specialist</strong> with a strong foundation in technical optimization, content strategy, and organic growth systems. Over the years, I've worked across SEO, content strategy, UI/UX, branding, and digital optimization — and that experience helped me shape a practical, real-world approach to search performance.
                            </p>
                            <p>
                                I didn't enter SEO from theory; I learned by doing. From fixing broken site structures to improving page experience, analyzing keywords, running audits, and testing strategies across different industries, I've always focused on what actually works. I enjoy digging into data, catching small issues others miss, and turning complex SEO tasks into simple, actionable results.
                            </p>
                            <p>
                                With <strong>22+ years of expertise</strong> in <span>UI/UX design</span>, digital product strategy, and <span>agricultural technology innovation</span>, I specialize in human-centered design, organic farming systems, and sustainable digital solutions. I studied at <strong>Tribhuvan University</strong> and have completed certifications in Google UX Design and Fundamentals of Graphic Design.
                            </p>
                        </div>
                    </section>

                    {/* Professional Experience */}
                    <section className="card p-8 mb-8" aria-labelledby="professional-experience">
                        <h2 id="professional-experience" className="text-2xl font-bold mb-6">Professional Experience</h2>
                        <div className="space-y-6">
                            <article className="border-l-4 border-brand-500 pl-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    <a
                                        href="https://hashtagweb.com.np/team/abhisek-adhikari/"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                    >
                                        <span>SEO Specialist - Hashtag Web Solutions</span>
                                    </a>
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Focused on technical optimization, keyword strategy, performance enhancement, and sustainable organic growth. Helping websites rank higher, load faster, and perform better with clean, data-driven execution.
                                </p>
                                <a href="https://hashtagweb.com.np/team/abhisek-adhikari/" target="_blank" rel="noopener noreferrer nofollow" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                                    View Profile →
                                </a>
                            </article>

                            <article className="border-l-4 border-green-500 pl-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    <a
                                        href="https://krishihimalaya.com/"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        <span>Founder - Himalaya Krishi</span>
                                    </a>
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Leading Nepal's first fully organic farming brand. Pioneering sustainable agriculture, combining traditional Himalayan wisdom with cutting-edge innovations. Empowering farmers through organic fertilizer solutions and sustainable farming training programs.
                                </p>
                                <a href="https://krishihimalaya.com/" target="_blank" rel="noopener noreferrer nofollow" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                                    Visit Himalaya Krishi →
                                </a>
                            </article>

                            <article className="border-l-4 border-blue-500 pl-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    <a
                                        href="https://deltaengineeringsolution.com"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        <span>Delta Engineering Solutions</span>
                                    </a>
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 mb-3">
                                    Engineering and technology solutions company focused on innovative digital products, automation systems, and sustainable technology implementations.
                                </p>
                                <a href="https://deltaengineeringsolution.com" target="_blank" rel="noopener noreferrer nofollow" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    Visit Delta Engineering →
                                </a>
                            </article>
                        </div>
                    </section>

                    {/* Expertise Section */}
                    <section className="card p-8 mb-8" aria-labelledby="expertise">
                        <h2 id="expertise" className="text-2xl font-bold mb-6">Areas of Expertise</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-brand-600 dark:text-brand-400">SEO & Digital Marketing</h3>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300" role="list">
                                    {[
                                        'Technical SEO & Site Audits',
                                        'Keyword Research & Strategy',
                                        'On-Page & Off-Page Optimization',
                                        'Content Strategy & SEO Writing',
                                        'Local SEO & Schema Markup',
                                        'Google Analytics & Data Analysis'
                                    ].map((skill, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-brand-500 mt-1">•</span>
                                            <span>{skill}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-brand-600 dark:text-brand-400">Design & Development</h3>
                                <ul className="space-y-2 text-gray-700 dark:text-gray-300" role="list">
                                    {[
                                        'UI/UX Design & User Research',
                                        'Wireframing & Prototyping',
                                        'Full-Stack Development (React, Next.js, Node.js)',
                                        'Performance Optimization',
                                        'Graphic Design & Branding',
                                        'Agri-Tech & Digital Agriculture Solutions'
                                    ].map((skill, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-brand-500 mt-1">•</span>
                                            <span>{skill}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Tech Stack */}
                    <section className="card p-8 mb-8" aria-labelledby="tech-stack">
                        <h2 id="tech-stack" className="text-2xl font-bold mb-6">Tech Stack & Tools</h2>
                        <div className="flex flex-wrap gap-3" role="list">
                            {['React', 'Node.js', 'Python', 'PHP', 'Laravel', 'Figma', 'MySQL', 'Git', 'Vite', 'SEO', 'Next.js', 'Tailwind CSS'].map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                    role="listitem"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section className="card p-8 mb-8" aria-labelledby="education">
                        <h2 id="education" className="text-2xl font-bold mb-6">Education & Certifications</h2>
                        <div className="space-y-4">
                            {[
                                { title: 'Tribhuvan University', desc: 'Higher Education' },
                                { title: 'Google UX Design Certification', desc: 'User Experience Design' },
                                { title: 'Fundamentals of Graphic Design', desc: 'Visual Design & Branding' }
                            ].map((edu, index) => (
                                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                    <div>
                                        <h4 className="font-semibold text-lg">{edu.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Section */}
                    <section className="card p-8 mb-8" aria-labelledby="contact">
                        <h2 id="contact" className="text-2xl font-bold mb-6">Get In Touch</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            Have questions, suggestions, or feedback? I'd love to hear from you! Whether you need help with SEO, UI/UX design, web development, or agri-tech solutions, feel free to reach out.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-brand-600 dark:text-brand-400 font-semibold">Email:</span>
                                <a href="mailto:abhishekadhikari1254@gmail.com" className="hover:underline">abhishekadhikari1254@gmail.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-brand-600 dark:text-brand-400 font-semibold">Phone:</span>
                                <a href="tel:+9779865412482" className="hover:underline">+977 9865412482</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-brand-600 dark:text-brand-400 font-semibold">Location:</span>
                                <span>Manahari, Nepal</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-brand-600 dark:text-brand-400 font-semibold">Website:</span>
                                <Link href="/" className="hover:underline">100seotools.com</Link>
                            </div>
                        </div>
                    </section>

                    {/* Professional Links */}
                    <section className="card p-8 mb-8" aria-labelledby="professional-links">
                        <h2 id="professional-links" className="text-2xl font-bold mb-6">Professional Links</h2>
                        <nav className="grid md:grid-cols-2 gap-4" aria-label="Professional profiles and websites">
                            {[
                                { url: 'https://hashtagweb.com.np/team/abhisek-adhikari/', title: 'Hashtag Web Solutions', desc: 'SEO Specialist Profile' },
                                { url: 'https://krishihimalaya.com/', title: 'Himalaya Krishi', desc: 'Organic Farming Brand' },
                                { url: 'https://abhishekadhikari.com/', title: 'Portfolio Website', desc: 'UI/UX Design & Development' },
                                { url: 'https://deltaengineeringsolution.com', title: 'Delta Engineering Solutions', desc: 'Engineering & Tech Solutions' },
                                { url: 'https://github.com/WHOISABHISHEKADHIKARI', title: 'GitHub Profile', desc: 'Open Source & Projects' },
                                { url: 'https://www.linkedin.com/in/whoisabhishekadhikari/', title: 'LinkedIn', desc: 'Professional Network' }
                            ].map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-400 transition-colors"
                                >
                                    <div>
                                        <h4 className="font-semibold">{link.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{link.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </nav>
                    </section>

                    {/* FAQ Section */}
                    <section className="card p-8 mb-8" aria-labelledby="faq">
                        <h2 id="faq" className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                        {faq.q}
                                    </h3>
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Ready to Optimize Your SEO?</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                            Explore 100+ free SEO tools designed to help you rank higher and grow your online presence.
                        </p>
                        <Link
                            href="/"
                            className="btn"
                            aria-label="Explore all free SEO tools"
                        >
                            Explore All Tools
                        </Link>
                    </section>
                </div>
            </article>
        </>
    );
}
