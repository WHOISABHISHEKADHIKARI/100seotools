import { runTemplate } from '../lib/templates.js';

function assert(name, condition) {
  if (!condition) {
    console.error(`FAIL: ${name}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${name}`);
  }
}

function includes(s, sub) {
  return String(s).includes(sub);
}

// 1) Sanitizes HTML inputs and strips fragment markers
const out1 = runTemplate('metaTagGenerator', {
  title: '<h1><!--StartFragment-->Amazing <em>Tool</em><!--EndFragment--></h1>',
  description: '<p>Make better meta tags<script>alert(1)</script></p>',
  url: 'https://example.com/page'
});
assert('Strips HTML from title', !includes(out1, '<h1>'));
assert('Strips HTML from description', !includes(out1, '<p>'));
assert('No script tag leakage', !includes(out1, '<script>'));
assert('Has canonical', includes(out1, '<link rel="canonical" href="https://example.com/page" />'));

// 2) Attribute escaping
const out2 = runTemplate('metaTagGenerator', {
  title: 'He said "Hello" <test>',
  description: '5 > 3 & 2 < 4',
  url: 'http://example.com'
});
assert('Escapes quotes in title', includes(out2, 'He said &quot;Hello&quot;'));
assert('Escapes angle brackets in title', !includes(out2, '<test>'));
assert('Escapes description special chars', includes(out2, '5 &gt; 3 &amp; 2 &lt; 4'));

// 3) Only absolute canonical allowed
const out3 = runTemplate('metaTagGenerator', {
  title: 'T',
  description: 'D',
  url: '/relative/path'
});
assert('No canonical for relative URL', !includes(out3, 'rel="canonical"'));

// 4) JSON-LD presence and validity basics
const out4 = runTemplate('metaTagGenerator', {
  title: 'Title',
  description: 'Description',
  url: 'https://example.com/x'
});
assert('JSON-LD script tag exists', includes(out4, 'application/ld+json'));
assert('JSON-LD has WebPage type', includes(out4, '"@type":"WebPage"'));
assert('JSON-LD includes sanitized name', includes(out4, '"name":"Title"'));

console.log('Meta Tag Generator tests completed');
