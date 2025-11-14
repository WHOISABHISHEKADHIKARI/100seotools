const assert = require('assert')

function buildBlogUrl(page, toolsPage) {
  const qp = new URLSearchParams()
  if (page && page > 1) qp.set('page', String(page))
  if (toolsPage && toolsPage > 1) qp.set('toolsPage', String(toolsPage))
  const qs = qp.toString()
  return qs ? `/blog?${qs}` : '/blog'
}

describe('blog listing pager links', () => {
  it('page 1, toolsPage 1 → /blog', () => {
    assert.strictEqual(buildBlogUrl(1, 1), '/blog')
  })

  it('page 3, toolsPage 1 → /blog?page=3', () => {
    assert.strictEqual(buildBlogUrl(3, 1), '/blog?page=3')
  })

  it('page 1, toolsPage 2 → /blog?toolsPage=2', () => {
    assert.strictEqual(buildBlogUrl(1, 2), '/blog?toolsPage=2')
  })

  it('page 4, toolsPage 5 → combined query', () => {
    assert.strictEqual(buildBlogUrl(4, 5), '/blog?page=4&toolsPage=5')
  })

  it('never returns legacy /p/<n> or /tp/<n> paths', () => {
    const samples = [buildBlogUrl(2, 1), buildBlogUrl(1, 3), buildBlogUrl(2, 3)]
    samples.forEach((href) => {
      assert.ok(!href.includes('/p/'))
      assert.ok(!href.includes('/tp/'))
    })
  })
})
