import { normalizePastedContent, stripHtmlToText } from '../lib/utils.js';

function assert(name, condition) {
  if (!condition) {
    console.error(`FAIL: ${name}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${name}`);
  }
}

function containsHtml(s) {
  return /<[^>]+>/.test(s);
}

const cases = [
  {
    name: 'Basic HTML paragraph and break',
    input: '<p>Hello<br>World</p>',
    expect: 'Hello\nWorld'
  },
  {
    name: 'StartFragment markers',
    input: '<!--StartFragment-->Hello <strong>World</strong><!--EndFragment-->',
    expect: 'Hello World'
  },
  {
    name: 'Script tag stripped (XSS)',
    input: '<p>Hello</p><script>alert(1)</script>World',
    expect: 'Hello\nWorld'
  },
  {
    name: 'Table stripped to text',
    input: '<table><tr><td>A</td><td>B</td></tr></table>',
    expect: 'A\nB'
  },
  {
    name: 'Plain text unchanged',
    input: 'Just text',
    expect: 'Just text'
  },
  {
    name: 'Markdown preserved',
    input: '# Title\n- item',
    expect: '# Title\n- item'
  }
];

for (const c of cases) {
  const normalized = normalizePastedContent(c.input);
  assert(`${c.name} no HTML tags`, !containsHtml(normalized));
  assert(`${c.name} expected text`, normalized === c.expect);
}

// Direct strip function parity
const html = '<div><h1>Heading</h1><p>Body</p></div>';
const stripped = stripHtmlToText(html);
assert('stripHtmlToText removes HTML', !containsHtml(stripped));
assert('stripHtmlToText preserves lines', stripped === 'Heading\nBody');

console.log('Paste normalization tests completed');
