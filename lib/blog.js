const siteName = '100 SEO Tools';

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const baseTopics = [
  { title: 'SEO Basics', category: 'Foundations' },
  { title: 'Keyword Research', category: 'Keyword Research' },
  { title: 'On-Page SEO', category: 'On-Page Optimization' },
  { title: 'Technical SEO', category: 'Technical SEO' },
  { title: 'Link Building', category: 'Backlink & Link-Building' },
  { title: 'Content SEO', category: 'Content SEO' },
  { title: 'Local SEO', category: 'Local SEO' },
  { title: 'AI for SEO', category: 'AI-Powered SEO' },
  { title: 'SERP Features', category: 'SEO Performance' },
  { title: 'Analytics & Tracking', category: 'SEO Performance' }
];

function makePost(base, index) {
  const slug = slugify(`${base.title} ${index}`);
  const title = `${base.title}: Simple Guide ${index}`;
  const description = `A quick, practical walkthrough ${index} to master ${base.title.toLowerCase()} with simple steps, checklists, and tips.`;
  return {
    slug,
    title,
    description,
    category: base.category,
    sections: {
      intro: `Learn ${base.title} with a simple, actionable guide. This installment focuses on pragmatic steps you can apply immediately.`,
      steps: [
        `Define your goal and scope for ${base.title}.`,
        `Gather inputs and constraints (site, audience, resources).`,
        `Apply core best practices step by step.`,
        `Validate outcomes and iterate based on feedback.`
      ],
      tips: [
        'Keep changes atomic and measurable.',
        'Document patterns and templates for reuse.',
        'Automate repeatable tasks when possible.'
      ],
      checklist: [
        'Set a clear objective',
        'Run sanity checks',
        'Record before/after metrics',
        'Plan the next iteration'
      ],
      faq: [
        { q: `How long does ${base.title} take?`, a: 'Most tasks can be started in minutes; mastery comes with repetition.' },
        { q: `Do I need tools for ${base.title}?`, a: 'Use lightweight tools to accelerate, but the process is primary.' }
      ]
    },
    author: siteName
  };
}

// Generate 100 posts deterministically to avoid massive hand-authored content.
const posts = [];
for (let i = 1; i <= 100; i++) {
  const topic = baseTopics[(i - 1) % baseTopics.length];
  posts.push(makePost(topic, i));
}

export function getAllBlogPosts() {
  return posts;
}

export function getBlogPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}