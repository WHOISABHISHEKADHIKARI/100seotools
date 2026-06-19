import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, normalizeUrl } from '../../../lib/realData.js';

function analyzeMobile(html, meta) {
  const issues = [];
  const passes = [];
  const warnings = [];

  // 1. Viewport check
  if (meta?.viewport) {
    const vp = meta.viewport.toLowerCase();
    if (vp.includes('width=device-width')) passes.push('Viewport sets width=device-width');
    else issues.push('Viewport missing width=device-width — page may not scale correctly on mobile');

    if (vp.includes('initial-scale=1') || vp.includes('initial-scale=1.0')) passes.push('Viewport sets initial-scale=1');
    else warnings.push('Viewport missing initial-scale=1 — may cause unexpected zoom behavior');

    if (vp.includes('maximum-scale=1') || vp.includes('user-scalable=no')) {
      issues.push('Viewport disables user zoom (maximum-scale or user-scalable=no) — hurts accessibility');
    }
  } else {
    issues.push('No viewport meta tag — page will NOT be mobile-friendly');
  }

  // 2. HTML lang
  if (meta?.lang) passes.push(`HTML lang attribute set to "${meta.lang}"`);
  else warnings.push('Missing HTML lang attribute — affects accessibility');

  // 3. Image responsiveness
  const images = meta?.images || [];
  const imgsNoMaxWidth = [];
  const imgsWithAlt = [];
  const imgsWithoutAlt = [];
  for (const img of images) {
    if (img.hasAlt && img.alt) imgsWithAlt.push(img.src);
    else imgsWithoutAlt.push(img.src);
  }
  // Check for responsive image patterns in HTML
  const hasResponsiveImages = /<img[^>]+(?:srcset|sizes|max-width\s*:\s*100%|object-fit)/i.test(html);
  const hasResponsiveCss = /<img[^>]+class=["'][^"']*(?:responsive|fluid|img-fluid|wp-post-image)[^"']*/i.test(html);

  if (hasResponsiveImages || hasResponsiveCss) {
    passes.push('Images use responsive attributes (srcset, max-width, or responsive classes)');
  } else if (images.length > 0) {
    warnings.push(`${images.length} images found — none use srcset or responsive classes. Add max-width:100% for mobile safety.`);
  }

  if (imgsWithoutAlt.length > 0) {
    warnings.push(`${imgsWithoutAlt.length} images missing alt text — affects accessibility and image SEO`);
  } else if (images.length > 0) {
    passes.push('All images have alt text');
  }

  // 4. Responsive CSS patterns
  const mediaQueries = (html.match(/@media[^{]*\{/gi) || []).length;
  if (mediaQueries >= 3) {
    passes.push(`Found ${mediaQueries} media queries — responsive design detected`);
  } else if (mediaQueries > 0) {
    warnings.push(`Only ${mediaQueries} media query found — may need more responsive breakpoints`);
  } else {
    warnings.push('No @media queries found — page may not be responsive');
  }

  // 5. Font size analysis
  const smallFontMatches = html.match(/font-size\s*:\s*(\d+)px/gi) || [];
  const smallFonts = smallFontMatches.filter(m => {
    const size = parseInt(m.match(/(\d+)/)?.[1] || '0', 10);
    return size > 0 && size < 14;
  });
  if (smallFonts.length > 0) {
    issues.push(`${smallFonts.length} elements with font-size < 14px — too small for mobile reading`);
  } else {
    passes.push('No dangerously small font sizes detected');
  }

  // 6. Fixed width elements
  const fixedWidthElements = html.match(/(?:width|min-width)\s*:\s*\d{3,}px/gi) || [];
  const largeFixedWidths = fixedWidthElements.filter(m => {
    const w = parseInt(m.match(/(\d+)/)?.[1] || '0', 10);
    return w >= 768;
  });
  if (largeFixedWidths.length > 0) {
    issues.push(`${largeFixedWidths.length} elements with fixed width ≥ 768px — may cause horizontal scrolling on mobile`);
  } else {
    passes.push('No large fixed-width elements detected');
  }

  // 7. Horizontal overflow risk
  const hasOverflowHidden = /overflow\s*:\s*hidden/i.test(html);
  const hasBoxSizing = /box-sizing\s*:\s*border-box/i.test(html);
  if (hasBoxSizing) passes.push('Uses box-sizing: border-box — prevents width overflow');
  if (hasOverflowHidden) passes.push('Uses overflow: hidden on some elements');

  // 8. Tap target analysis (from inline styles)
  const smallPadding = html.match(/(?:padding|margin)\s*:\s*[1-4]px/gi) || [];
  if (smallPadding.length > 5) {
    warnings.push(`${smallPadding.length} elements with very small padding/margin — may cause tap target issues`);
  }

  // 9. Mobile-unfriendly patterns
  const hasFrames = /<iframe[^>]/i.test(html);
  if (hasFrames) warnings.push('Page contains iframes — may not render correctly on mobile');

  const hasFlash = /<object|<embed|flash/i.test(html);
  if (hasFlash) issues.push('Page uses Flash — not supported on mobile devices');

  // 10. Structured data in mobile
  const hasJsonLd = /application\/ld\+json/i.test(html);
  if (hasJsonLd) passes.push('Structured data (JSON-LD) present');
  else warnings.push('No structured data found — may miss rich result opportunities');

  // 11. Meta tags
  if (meta?.title) passes.push('Title tag present');
  else issues.push('Missing title tag');

  if (meta?.metaDescription) passes.push('Meta description present');
  else warnings.push('Missing meta description');

  // 12. Lazy loading
  const hasLazyLoading = /loading\s*=\s*["']lazy["']/i.test(html);
  if (hasLazyLoading) passes.push('Uses native lazy loading on images');
  else if (images.length > 3) warnings.push('No lazy loading detected on images — add loading="lazy" for below-fold images');

  // 13. Touch events
  const hasTouchEvents = /ontouchstart|ontouchmove|touch-action/i.test(html);
  if (hasTouchEvents) passes.push('Handles touch events for mobile interaction');

  return { issues, passes, warnings };
}

export async function POST(request) {
  try {
    const { url } = await request.json().catch(() => ({}));
    const target = normalizeUrl(url);
    if (!target) return NextResponse.json({ success: false, error: 'Valid URL required' }, { status: 400 });

    const page = await fetchPage(target);
    const meta = page.ok ? parseHtmlMeta(page.data.html, page.data.finalUrl) : null;
    const analysis = meta ? analyzeMobile(page.data.html, meta) : null;

    const lines = [];
    lines.push(`Mobile-Friendly Audit: ${target}`);
    lines.push('Source: Direct HTML analysis (free, no API key required)');
    lines.push('='.repeat(60));
    lines.push('');

    if (page.ok) {
      lines.push('PAGE BASICS');
      lines.push(`  HTTP status:  ${page.data.status}`);
      lines.push(`  Page weight:  ${(page.data.bytes / 1024).toFixed(1)} KB`);
      lines.push(`  Response time: ${page.data.elapsedMs} ms`);
      lines.push(`  Viewport:     ${meta?.viewport ? 'YES — ' + meta.viewport : 'MISSING (critical)'}`);
      lines.push(`  HTML lang:    ${meta?.lang || 'missing'}`);
      lines.push(`  Title:        ${meta?.title ? meta.title.substring(0, 80) : 'MISSING'}`);
      lines.push(`  Images:       ${meta?.images?.length || 0} found`);
      lines.push('');
    } else {
      lines.push(`Could not fetch page: ${page.error}`);
      lines.push('');
      return NextResponse.json({ success: true, result: lines.join('\n') });
    }

    if (!analysis) {
      lines.push('Could not analyze page content.');
      return NextResponse.json({ success: true, result: lines.join('\n') });
    }

    // Summary
    const totalIssues = analysis.issues.length;
    const totalWarnings = analysis.warnings.length;
    const totalPasses = analysis.passes.length;
    const score = Math.max(0, Math.min(100, Math.round((totalPasses / (totalPasses + totalIssues + totalWarnings)) * 100)));

    lines.push('MOBILE-FRIENDLY SCORE');
    lines.push(`  Score: ${score}/100 (${totalPasses} passes, ${totalIssues} issues, ${totalWarnings} warnings)`);
    lines.push('');

    if (totalIssues === 0 && score >= 80) {
      lines.push('VERDICT: PASS — Page is mobile-friendly.');
    } else if (totalIssues <= 2 && score >= 60) {
      lines.push('VERDICT: MOSTLY PASS — Minor issues to fix.');
    } else {
      lines.push('VERDICT: NEEDS WORK — See issues below.');
    }
    lines.push('');

    if (analysis.issues.length > 0) {
      lines.push('ISSUES (fix these)');
      analysis.issues.forEach((issue, i) => lines.push(`  ${i + 1}. ${issue}`));
      lines.push('');
    }

    if (analysis.warnings.length > 0) {
      lines.push('WARNINGS (recommended to fix)');
      analysis.warnings.forEach((warn, i) => lines.push(`  ${i + 1}. ${warn}`));
      lines.push('');
    }

    lines.push('PASSES');
    analysis.passes.forEach((pass, i) => lines.push(`  ${i + 1}. ${pass}`));

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    console.error('mobile-friendly-test error:', err);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
