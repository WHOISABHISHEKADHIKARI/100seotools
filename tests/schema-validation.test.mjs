import assert from 'node:assert/strict'
import { generateWebsiteSchema, generateSoftwareApplicationSchema, generateArticleSchema, generateHowToSchema, generateFAQSchema, generateBreadcrumbList } from '../lib/schema.js'

function hasProps(obj, props) {
  return props.every((p) => obj && Object.prototype.hasOwnProperty.call(obj, p))
}

function validateArticle(ld) {
  assert.equal(ld['@type'], 'Article')
  assert.ok(hasProps(ld, ['headline', 'description']))
  assert.ok(ld.url)
}

function validateSoftware(ld) {
  assert.equal(ld['@type'], 'SoftwareApplication')
  assert.ok(hasProps(ld, ['name', 'description', 'offers']))
  assert.equal(ld.offers['@type'], 'Offer')
}

function validateFAQ(ld) {
  assert.equal(ld['@type'], 'FAQPage')
  assert.ok(Array.isArray(ld.mainEntity))
  assert.ok(ld.mainEntity.length > 0)
}

function validateBreadcrumb(ld) {
  assert.equal(ld['@type'], 'BreadcrumbList')
  assert.ok(Array.isArray(ld.itemListElement))
}

const base = 'https://www.100seotools.com'

const website = generateWebsiteSchema(base)
assert.equal(website['@type'], 'WebSite')

const tool = { slug: 'schema-markup-generator', name: 'Free Schema Markup Generator', description: 'Generate JSON-LD' }
const software = generateSoftwareApplicationSchema(tool, base)
validateSoftware(software)

const post = { slug: 'free-seo-tools-list-2024', title: 'Free SEO Tools List', description: 'Guide', datePublished: '2024-01-01', readTime: 5 }
const article = generateArticleSchema(post, base)
validateArticle(article)

const howTo = generateHowToSchema(tool, base)
assert.equal(howTo['@type'], 'HowTo')

const faq = generateFAQSchema([{ question: 'What is JSON-LD?', answer: 'A linked data format.' }])
validateFAQ(faq)

const crumb = generateBreadcrumbList([{ name: 'Home', item: `${base}/` }, { name: 'Tools', item: `${base}/tools` }])
validateBreadcrumb(crumb)

console.log('Schema validation tests passed')