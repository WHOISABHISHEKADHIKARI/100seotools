import { schedulePost } from '@/lib/schedule';

export const runtime = 'nodejs';

function checkAuth(req) {
  const token = process.env.PUBLISHER_TOKEN;
  if (!token) return true; // allow if not configured
  const auth = req.headers.get('authorization') || '';
  const expected = `Bearer ${token}`;
  return auth === expected;
}

function validate(body) {
  const errors = [];
  if (!body.title || String(body.title).trim().length < 4) errors.push('title is required (min 4 chars)');
  if (!body.content || String(body.content).trim().length < 50) errors.push('content is required (min 50 chars)');
  if (!body.description || String(body.description).trim().length < 20) errors.push('description is required (min 20 chars)');
  const publishAt = Number(body.publishAt);
  if (!Number.isFinite(publishAt) || publishAt <= Date.now()) errors.push('publishAt must be a future epoch ms timestamp');
  return { ok: errors.length === 0, errors, publishAt };
}

export async function POST(req) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { ok, errors, publishAt } = validate(body);
  if (!ok) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }
  const payload = {
    slug: body.slug,
    title: body.title,
    description: body.description,
    content: body.content,
    status: 'scheduled',
    publishAt,
    tags: body.tags || [],
    category: body.category || 'Guides',
    author: body.author || { name: '100 SEO Tools' },
    images: body.images || [],
    internalLinks: body.internalLinks || [],
    externalLinks: body.externalLinks || [],
  };
  const result = await schedulePost(payload);
  return Response.json({ ok: true, scheduled: result });
}

