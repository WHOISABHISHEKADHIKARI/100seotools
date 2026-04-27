import assert from 'node:assert/strict'
import { normalizeClipboardTextForCopy } from '../lib/utils.js'

const htmlFrag = `<!--StartFragment-->
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

const normalized = normalizeClipboardTextForCopy(htmlFrag)
console.log('Normalized output:\n' + normalized)
assert.ok(!/<!--StartFragment-->/.test(normalized))
assert.ok(!/<!--EndFragment-->/.test(normalized))
assert.ok(!/<table\b/.test(normalized))
assert.ok(!/data-col-size/.test(normalized))
assert.ok(/How to Grow Organic Tomatoes/.test(normalized))
assert.ok(/A guide on growing tomatoes at home/.test(normalized))
assert.ok(/Organic Tomatoes[\s\n]+A guide/.test(normalized))
assert.ok(!/[<>]/.test(normalized))

const entities = normalizeClipboardTextForCopy('A &amp; B &lt; C &gt; D &quot;x&quot; &#39;y&#39;')
assert.equal(entities, 'A & B < C > D "x" \'y\'')

const hidden = normalizeClipboardTextForCopy('zero\u200Bwidth\uFEFF space')
assert.equal(hidden, 'zero width space')

console.log('Clipboard copy normalization test passed')
