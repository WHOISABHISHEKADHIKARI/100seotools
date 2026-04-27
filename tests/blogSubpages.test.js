const assert = require('assert')

const { buildGuidePageHref } = (() => {
  const mod = require('../app/blog/[slug]/page.js')
  return mod
})()

describe('blog subpage link building', () => {
  it('returns canonical for page 1', () => {
    const href = buildGuidePageHref('sample-slug', 1)
    assert.strictEqual(href, '/blog/sample-slug')
  })

  it('returns query param for page > 1', () => {
    const href = buildGuidePageHref('sample-slug', 3)
    assert.strictEqual(href, '/blog/sample-slug?page=3')
  })

  it('never returns legacy /p/<n> path', () => {
    for (let p = 1; p <= 5; p++) {
      const href = buildGuidePageHref('slug', p)
      assert.ok(!href.includes('/p/'))
    }
  })
})
