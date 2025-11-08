// Scheduling library for blog posts using @vercel/kv when available.
// Falls back to in-memory store in development when KV is not configured.

let kvAvailable = false;
let kv = null;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies
  ({ kv } = require('@vercel/kv'));
  kvAvailable = !!kv;
} catch (e) {
  kvAvailable = false;
}

// In-memory fallback for local dev (non-persistent)
const memory = {
  posts: new Map(), // key: slug, value: post object
  scheduled: new Map(), // key: slug, value: publishAt (epoch ms)
};

/**
 * Post shape:
 * {
 *   slug: string,
 *   title: string,
 *   description: string,
 *   content: string,
 *   status: 'draft' | 'scheduled' | 'published',
 *   publishAt: number, // epoch ms
 *   tags?: string[], category?: string, author?: { name: string } | string,
 *   images?: { url: string, alt: string }[], internalLinks?: string[], externalLinks?: string[]
 * }
 */

function normalizePost(input = {}) {
  const now = Date.now();
  const post = {
    slug: String(input.slug || '').trim(),
    title: String(input.title || ''),
    description: String(input.description || ''),
    content: String(input.content || ''),
    status: input.status === 'published' ? 'published' : (input.status === 'scheduled' ? 'scheduled' : 'draft'),
    publishAt: Number(input.publishAt || now),
    tags: Array.isArray(input.tags) ? input.tags : [],
    category: input.category || 'Guides',
    author: input.author || { name: '100 SEO Tools' },
    images: Array.isArray(input.images) ? input.images : [],
    internalLinks: Array.isArray(input.internalLinks) ? input.internalLinks : [],
    externalLinks: Array.isArray(input.externalLinks) ? input.externalLinks : [],
    dateCreated: input.dateCreated || new Date(now).toISOString(),
    dateModified: new Date(now).toISOString(),
  };
  if (!post.slug) {
    post.slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  return post;
}

async function kvSchedulePost(post) {
  const key = `post:${post.slug}`;
  await kv.hset(key, post);
  // Sorted set: score = publishAt
  await kv.zadd('scheduled_posts', { score: post.publishAt, member: post.slug });
}

function memSchedulePost(post) {
  memory.posts.set(post.slug, post);
  memory.scheduled.set(post.slug, post.publishAt);
}

export async function schedulePost(input) {
  const post = normalizePost({ ...input, status: 'scheduled' });
  if (kvAvailable) {
    await kvSchedulePost(post);
  } else {
    memSchedulePost(post);
  }
  return { ok: true, slug: post.slug, publishAt: post.publishAt };
}

async function kvPublishDue(now) {
  // Fetch all slugs with publishAt <= now
  const dueSlugs = await kv.zrange('scheduled_posts', 0, now, { byScore: true });
  const published = [];
  for (const slug of dueSlugs) {
    const key = `post:${slug}`;
    const post = await kv.hgetall(key);
    if (!post) continue;
    post.status = 'published';
    post.datePublished = new Date(Number(post.publishAt)).toISOString();
    post.dateModified = new Date().toISOString();
    await kv.hset(key, post);
    await kv.zrem('scheduled_posts', slug);
    await kv.sadd('published_posts', slug);
    published.push(slug);
  }
  return published;
}

function memPublishDue(now) {
  const published = [];
  for (const [slug, ts] of memory.scheduled.entries()) {
    if (ts <= now) {
      const post = memory.posts.get(slug);
      if (post) {
        post.status = 'published';
        post.datePublished = new Date(ts).toISOString();
        post.dateModified = new Date().toISOString();
      }
      memory.scheduled.delete(slug);
      published.push(slug);
    }
  }
  return published;
}

export async function publishDuePosts(now = Date.now()) {
  return kvAvailable ? kvPublishDue(now) : memPublishDue(now);
}

async function kvGetPublishedBySlug(slug) {
  const key = `post:${slug}`;
  const post = await kv.hgetall(key);
  if (post && post.status === 'published') return post;
  return null;
}

function memGetPublishedBySlug(slug) {
  const post = memory.posts.get(slug);
  if (post && post.status === 'published') return post;
  return null;
}

export async function getPublishedPostBySlug(slug) {
  return kvAvailable ? kvGetPublishedBySlug(slug) : memGetPublishedBySlug(slug);
}

async function kvListPublished() {
  const slugs = await kv.smembers('published_posts');
  const posts = [];
  for (const slug of slugs) {
    const post = await kv.hgetall(`post:${slug}`);
    if (post) posts.push(post);
  }
  // Sort by publishAt desc
  return posts.sort((a, b) => Number(b.publishAt) - Number(a.publishAt));
}

function memListPublished() {
  const posts = [];
  for (const p of memory.posts.values()) {
    if (p.status === 'published') posts.push(p);
  }
  return posts.sort((a, b) => Number(b.publishAt) - Number(a.publishAt));
}

export async function listPublishedPosts() {
  return kvAvailable ? kvListPublished() : memListPublished();
}

