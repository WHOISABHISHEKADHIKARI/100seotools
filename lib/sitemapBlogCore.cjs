function buildBlogIndexEntry(baseUrl, lastModified) {
  return {
    url: `${baseUrl}/blog`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.85,
  };
}

module.exports = { buildBlogIndexEntry };
