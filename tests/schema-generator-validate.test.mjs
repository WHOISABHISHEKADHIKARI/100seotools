import assert from 'node:assert/strict'
import { runTemplate } from '../lib/templates.js'

const validInputs = {
  type: 'Article',
  name: 'How to Grow Organic Tomatoes',
  pageUrl: 'https://example.com/grow-tomatoes',
  url: 'https://example.com',
  desc: 'A guide on growing tomatoes at home',
  image: 'https://example.com/img.jpg',
  datePublished: '2025-05-01',
  dateModified: '2025-05-02',
  authorName: 'Example Co.',
  faqLines: 'Q: Soil type | A: Loamy\nQ: Watering | A: Weekly'
}

const out = runTemplate('schemaMarkupGenerator', validInputs)
assert.ok(out.startsWith('{'))
const json = JSON.parse(out)
assert.equal(json['@context'], 'https://schema.org')
assert.ok(Array.isArray(json['@graph']))
assert.ok(json['@graph'].some(n => n['@type'] === 'WebPage'))
const main = json['@graph'].find(n => n['@type'] === 'Article')
assert.ok(main)
assert.equal(main.isPartOf['@id'], validInputs.pageUrl)
assert.equal(main.headline, validInputs.name)

const badType = { ...validInputs, type: 'How to Grow Organic Tomatoes' }
const errType = runTemplate('schemaMarkupGenerator', badType)
assert.equal(errType, 'Invalid Schema Type. Please choose a valid Schema.org type.')

const badUrl = { ...validInputs, pageUrl: 'http://example.com' }
const errUrl = runTemplate('schemaMarkupGenerator', badUrl)
assert.equal(errUrl, 'Input contains errors. Please fix the highlighted fields.')

console.log('Schema generator validation tests passed')

