import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, normalizeUrl } from '../../../lib/realData.js';

function analyzePerformance(html, meta, elapsedMs, bytes) {
  const issues = [];
  const passes = [];
  const kb = bytes / 1024;

  // Image optimization
  const images = html.match(/<img[^>]*>/gi) || [];
  const unoptimized = images.filter(i => !i.includes('loading=') && !i.includes('decoding='));
  if (unoptimized.length > 0) {
    issues.push(`${unoptimized.length} image(s) missing lazy loading or decoding attribute`);
  } else if (images.length > 0) {
    passes.push('All images use lazy loading or decoding attributes');
  }

  // Render-blocking resources
  const stylesheets = (html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []).length;
  if (stylesheets > 5) {
    issues.push(`${stylesheets} stylesheets loaded (potential render-blocking)`);
  } else if (stylesheets > 0) {
    passes.push('Reasonable number of stylesheets');
  }

  // Inline scripts
  const inlineScripts = (html.match(/<script[^>]*>[^<]/gi) || []).length;
  if (inlineScripts > 10) {
    issues.push(`${inlineScripts} inline scripts (potential render-blocking)`);
  } else {
    passes.push('Manageable number of inline scripts');
  }

  // Async/defer scripts
  const asyncScripts = (html.match(/<script[^>]*(async|defer)[^>]*>/gi) || []).length;
  const totalScripts = (html.match(/<script[^>]*>/gi) || []).length - (html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi) || []).length;
  if (asyncScripts >= totalScripts * 0.8 && totalScripts > 0) {
    passes.push('Most scripts use async/defer');
  } else if (totalScripts > 3) {
    issues.push(`${totalScripts - asyncScripts} script(s) may block rendering`);
  }

  // Image formats
  const modernFormats = images.filter(i => /\.(avif|webp)/i.test(i)).length;
  const legacyFormats = images.filter(i => /\.(jpg|jpeg|png|gif)(?!\.webp)/i.test(i) && !i.includes('data:')).length;
  if (legacyFormats > 3 && modernFormats === 0) {
    issues.push(`${legacyFormats} images in legacy formats (consider AVIF/WebP)`);
  } else if (legacyFormats > 3) {
    passes.push('Some images already using modern formats');
  } else {
    passes.push('Image formats look good');
  }

  // Inline CSS
  const inlineStyles = (html.match(/<style[^>]*>/gi) || []).length;
  if (inlineStyles > 5) {
    issues.push(`${inlineStyles} inline <style> blocks (potential bloat)`);
  } else {
    passes.push('Reasonable inline style usage');
  }

  // Preconnect/preload hints
  if (html.includes('preconnect') || html.includes('preload')) {
    passes.push('Resource hints (preconnect/preload) detected');
  } else if (stylesheets > 3 || inlineScripts > 5) {
    issues.push('No resource hints (preconnect/preload) for external resources');
  }

  // Font loading
  if (html.includes('font-display')) {
    passes.push('Font-display swap detected');
  } else if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) {
    issues.push('Google Fonts loaded without font-display: swap');
  }

  // TTFB scoring
  let ttfbMs = elapsedMs;
  let ttfbScore = 100;
  if (ttfbMs > 3000) ttfbScore = 30;
  else if (ttfbMs > 1800) ttfbScore = 50;
  else if (ttfbMs > 1000) ttfbScore = 70;
  else if (ttfbMs > 500) ttfbScore = 85;

  // Page weight scoring
  let weightScore = 100;
  if (kb > 5000) weightScore = 20;
  else if (kb > 3000) weightScore = 40;
  else if (kb > 1500) weightScore = 60;
  else if (kb > 800) weightScore = 80;

  // Content quality scoring
  let contentScore = 100;
  if (meta.wordCount < 100) contentScore = 20;
  else if (meta.wordCount < 300) contentScore = 50;
  else if (meta.wordCount < 600) contentScore = 75;

  // Heading structure
  let headingScore = 100;
  if (meta.headings.h1.length === 0) headingScore = 20;
  else if (meta.headings.h1.length > 1) headingScore = 50;
  if (meta.headings.h2.length === 0) headingScore = Math.min(headingScore, 60);

  // Overall
  const avgScore = Math.round((ttfbScore + weightScore + contentScore + headingScore) / 4);

  return {
    ttfbMs,
    ttfbScore,
    weightKb: Math.round(kb),
    weightScore,
    wordCount: meta.wordCount,
    contentScore,
    headingScore,
    avgScore,
    imageCount: images.length,
    scriptCount: totalScripts,
    stylesheetCount: stylesheets,
    issues,
    passes,
    totalChecks: issues.length + passes.length
  };
}

export async function POST(request) {
  try {
    const { url } = await request.json().catch(() => ({}));
    const target = normalizeUrl(url);
    if (!target) return NextResponse.json({ success: false, error: 'Valid URL required' }, { status: 400 });

    const page = await fetchPage(target);
    if (!page.ok) return NextResponse.json({ success: false, error: page.error }, { status: 502 });

    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
    const result = analyzePerformance(page.data.html, meta, page.data.elapsedMs, page.data.bytes);

    const lines = [];
    lines.push(`Page Speed Analysis for ${page.data.finalUrl}`);
    lines.push('Source: Direct HTML analysis (no API needed)');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Overall Score: ${result.avgScore}/100`);
    lines.push('');
    lines.push('COMPONENT SCORES');
    lines.push(`  TTFB (${result.ttfbMs}ms):        ${result.ttfbScore}/100`);
    lines.push(`  Page weight (${result.weightKb}KB):  ${result.weightScore}/100`);
    lines.push(`  Content depth (${result.wordCount}w):  ${result.contentScore}/100`);
    lines.push(`  Heading structure:       ${result.headingScore}/100`);
    lines.push('');
    lines.push(`IMAGES: ${result.imageCount}  |  SCRIPTS: ${result.scriptCount}  |  STYLESHEETS: ${result.stylesheetCount}`);
    lines.push('');

    if (result.issues.length) {
      lines.push('ISSUES TO FIX');
      result.issues.forEach((i, n) => lines.push(`  ${n + 1}. ${i}`));
      lines.push('');
    }

    if (result.passes.length) {
      lines.push('PASSES');
      result.passes.forEach((p) => lines.push(`  + ${p}`));
    }

    return NextResponse.json({
      success: true,
      result: lines.join('\n'),
      scores: {
        overall: result.avgScore,
        ttfb: result.ttfbScore,
        weight: result.weightScore,
        content: result.contentScore,
        headings: result.headingScore
      }
    });
  } catch (err) {
    console.error('page-speed-score-simulator error:', err);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
