function buildGuidePageHref(slug, page) {
  const safeSlug = String(slug || '').replace(/^\/+|\/+$/g, '');
  const pageNumber = Number(page) || 1;
  return pageNumber <= 1 ? `/blog/${safeSlug}` : `/blog/${safeSlug}?page=${pageNumber}`;
}

module.exports = { buildGuidePageHref };
