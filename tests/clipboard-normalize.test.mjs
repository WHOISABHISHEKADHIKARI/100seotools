import assert from 'node:assert/strict'
import { normalizePastedContent } from '../lib/utils.js'

const htmlFragment = `<!--StartFragment-->
<table data-col-size="2" data-start="0" data-end="1">
  <tr>
    <td>How to Grow Organic Tomatoes</td>
    <td></td>
  </tr>
</table>
<table data-col-size="2" data-start="2" data-end="3">
  <tr>
    <td>A guide on growing tomatoes at home</td>
    <td></td>
  </tr>
</table>
<!--EndFragment-->`

const out = normalizePastedContent(htmlFragment)
assert.equal(out, htmlFragment)
assert.ok(/<!--StartFragment-->/.test(out))
assert.ok(/<!--EndFragment-->/.test(out))
assert.ok(/<table\b/.test(out))
assert.ok(/data-col-size/.test(out))
assert.ok(/How to Grow Organic Tomatoes/.test(out))
assert.ok(/<td>\s*<\/td>/.test(out))

console.log('Clipboard normalization test passed')

