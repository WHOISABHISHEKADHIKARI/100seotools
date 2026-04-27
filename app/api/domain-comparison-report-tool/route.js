import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, waybackFirstSnapshot, fetchSitemap, fetchRobotsTxt, normalizeUrl, hostnameOf, fetchWithTimeout } from '../../../lib/realData.js';

async function fetchSpecificSitemap(baseUrl, filename) {
  try {
    const u = new URL(baseUrl);
    const sitemapUrl = `${u.protocol}//${u.host}/${filename}`;
    const res = await fetchWithTimeout(sitemapUrl, {}, 5000);
    if (!res.ok) return { ok: false, urls: [] };
    const xml = await res.text();
    const urls = [];
    const re = /<loc>([\s\S]*?)<\/loc>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      urls.push(m[1].trim());
    }
    return { ok: true, url: sitemapUrl, urls };
  } catch {
    return { ok: false, urls: [] };
  }
}

async function profile(input) {
  const target = normalizeUrl(input);
  if (!target) return { input, error: 'Invalid URL' };
  
  // Try to find blog sitemaps in parallel with other probes
  const blogSitemapFiles = ['sitemap-blog.xml', 'blog-sitemap.xml', 'post-sitemap.xml'];
  
  const [page, wb, sitemap, robots, ...blogSitemaps] = await Promise.all([
    fetchPage(target),
    waybackFirstSnapshot(target),
    fetchSitemap(target),
    fetchRobotsTxt(target),
    ...blogSitemapFiles.map(file => fetchSpecificSitemap(target, file))
  ]);

  if (!page.ok) return { input, error: page.error };
  const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
  const host = hostnameOf(page.data.finalUrl);
  
  // Link analysis
  const internalLinks = meta.links.filter(l => l.host === host || !l.host).length;
  const externalLinks = meta.links.filter(l => l.host && l.host !== host).length;

  // Aggregate blog sitemap URLs
  const blogUrls = new Set();
  blogSitemaps.forEach(bs => {
    if (bs.ok) bs.urls.forEach(u => blogUrls.add(u));
  });

  // Blog discovery from HTML links
  const blogLinkKeywords = ['/blog', '/articles', '/news', '/guides', '/post/'];
  const hasBlogInRobots = robots.ok && blogLinkKeywords.some(kw => robots.data.body.toLowerCase().includes(kw));
  const hasBlogInHtml = meta.links.some(l => 
    blogLinkKeywords.some(kw => (l.href || '').toLowerCase().includes(kw))
  );
  const blogDetected = blogUrls.size > 0 || hasBlogInRobots || hasBlogInHtml;

  return {
    host,
    title: meta.title,
    description: meta.metaDescription,
    age: wb.ok ? wb.data.ageYears : null,
    firstSeen: wb.ok ? wb.data.firstSeen : null,
    https: page.data.finalUrl.startsWith('https://'),
    ttfbMs: page.data.elapsedMs,
    pageKb: Math.round(page.data.bytes / 1024),
    indexable: !/noindex/i.test(meta.robots),
    canonical: meta.canonical || null,
    h1Count: meta.headings.h1.length,
    h2Count: meta.headings.h2.length,
    wordCount: meta.wordCount,
    internalLinks,
    externalLinks,
    imagesCount: meta.images.length,
    sitemapUrls: sitemap.ok ? sitemap.data.urls.length : 0,
    blogSitemapUrls: blogUrls.size,
    blogDetected,
    robotsLines: robots.ok ? robots.data.body.split('\n').filter(l => l.trim()).length : 0,
    jsonLd: meta.jsonLd.filter(j => !j._parseError).length
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const a = body.domain1 || body.a;
    const b = body.domain2 || body.b;
    if (!a || !b) return NextResponse.json({ success: false, error: 'Both domains required' }, { status: 400 });

    const [A, B] = await Promise.all([profile(a), profile(b)]);
    if (A.error) return NextResponse.json({ success: false, error: `Domain A: ${A.error}` }, { status: 502 });
    if (B.error) return NextResponse.json({ success: false, error: `Domain B: ${B.error}` }, { status: 502 });

    const lines = [];
    lines.push(`# Domain Comparison Report`);
    lines.push(`### **${A.host}** vs **${B.host}**`);
    lines.push(`*Source: Real-time probes (Wayback Machine, HTML, Robots, Sitemap)*`);
    lines.push(``);
    lines.push(`| Metric | ${A.host} | ${B.host} | Comparison |`);
    lines.push(`| :--- | :---: | :---: | :---: |`);

    const r = (label, av, bv, betterIs = 'higher') => {
      let winner = '—';
      if (av != null && bv != null) {
        if (typeof av === 'number' && typeof bv === 'number') {
          if (av !== bv) {
            winner = (betterIs === 'higher' ? av > bv : av < bv) ? `🏆 **${A.host}**` : `🏆 **${B.host}**`;
          }
        } else if (typeof av === 'boolean' && typeof bv === 'boolean') {
          if (av !== bv) {
            winner = (betterIs === 'higher' ? av : bv) ? `🏆 **${A.host}**` : `🏆 **${B.host}**`;
          }
        }
      }
      
      const formatVal = (v) => {
        if (typeof v === 'boolean') return v ? '✅ Yes' : '❌ No';
        if (v == null) return '–';
        if (label.includes('ms')) return `${v}ms`;
        if (label.includes('KB')) return `${v}KB`;
        return v;
      };

      lines.push(`| **${label}** | ${formatVal(av)} | ${formatVal(bv)} | ${winner} |`);
    };

    r('Domain Age (years)', A.age, B.age, 'higher');
    r('TTFB Latency (ms)', A.ttfbMs, B.ttfbMs, 'lower');
    r('Page Size (KB)', A.pageKb, B.pageKb, 'lower');
    r('Word Count', A.wordCount, B.wordCount, 'higher');
    r('H1 Headers', A.h1Count, B.h1Count, 'higher');
    r('H2 Headers', A.h2Count, B.h2Count, 'higher');
    r('Internal Links', A.internalLinks, B.internalLinks, 'higher');
    r('External Links', A.externalLinks, B.externalLinks, 'higher');
    r('Images Count', A.imagesCount, B.imagesCount, 'higher');
    r('HTTPS Enabled', A.https, B.https, 'higher');
    r('Indexable', A.indexable, B.indexable, 'higher');
    r('Canonical Tag', !!A.canonical, !!B.canonical, 'higher');
    r('Sitemap URL Count', A.sitemapUrls, B.sitemapUrls, 'higher');
    r('Blog Post Count (Sitemap)', A.blogSitemapUrls, B.blogSitemapUrls, 'higher');
    r('Blog Content Detected', A.blogDetected, B.blogDetected, 'higher');
    r('Robots.txt Lines', A.robotsLines, B.robotsLines, 'higher');
    r('Structured Data (JSON-LD)', A.jsonLd, B.jsonLd, 'higher');

    lines.push(``);
    lines.push(`## Content Overview`);
    lines.push(`| Page Element | ${A.host} | ${B.host} |`);
    lines.push(`| :--- | :--- | :--- |`);
    lines.push(`| **Title** | ${A.title || '*Missing*'} | ${B.title || '*Missing*'} |`);
    lines.push(`| **Description** | ${A.description || '*Missing*'} | ${B.description || '*Missing*'} |`);
    
    lines.push(``);
    lines.push(`> **Analysis Summary:** Comparison based on real-time HTML analysis and publicly available crawl data. **TTFB** and **Page Size** are critical for Core Web Vitals.`);

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
