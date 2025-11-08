import { publishDuePosts } from '@/lib/schedule';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

function checkAuth(req) {
  const token = process.env.PUBLISHER_TOKEN;
  if (!token) return true; // no token configured, allow
  const auth = req.headers.get('authorization') || '';
  const expected = `Bearer ${token}`;
  return auth === expected;
}

export async function GET(req) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', { status: 401 });
  }
  const now = Date.now();
  const published = await publishDuePosts(now);
  for (const slug of published) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath('/blog');
  return Response.json({ ok: true, published, count: published.length, at: new Date(now).toISOString() });
}

export async function POST(req) {
  if (!checkAuth(req)) {
    return new Response('Unauthorized', { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const at = typeof body.at === 'number' ? body.at : Date.now();
  const published = await publishDuePosts(at);
  for (const slug of published) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath('/blog');
  return Response.json({ ok: true, published, count: published.length, at: new Date(at).toISOString() });
}

